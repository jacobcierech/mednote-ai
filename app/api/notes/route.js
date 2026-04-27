const { NextResponse } = require('next/server');
const { v4: uuidv4 } = require('uuid');
const { getUserFromRequest } = require('lib/auth');
const { many, one, transaction } = require('lib/db');
const { generateClinicalNote } = require('lib/openai');
const { writeAuditLog } = require('lib/audit');

// GET /api/notes - list all notes for current user
async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = 'SELECT * FROM notes WHERE user_id = $1';
  const params = [user.userId];

  if (type && type !== 'all') {
    query += ` AND note_type = $${params.length + 1}`;
    params.push(type);
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const notes = await many(query, params);
  return NextResponse.json({ notes });
}

// POST /api/notes - generate and save a new note
async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const nestedFields = body.fields || {};
    const {
      patientLabel = 'Unnamed Patient',
      noteType = 'SOAP',
      specialty = 'Primary Care',
      shorthandInput = '',
      generatedNote: providedGeneratedNote = '',
      diagnosis = nestedFields.diagnosis || '',
      visitNumber = nestedFields.visitNumber || '',
      precautions = nestedFields.precautions || '',
      interventions = nestedFields.interventions || '',
      deficits = nestedFields.deficits || '',
      assistLevel = nestedFields.assistLevel || '',
      response: patientResponse = nestedFields.response || '',
      plan = nestedFields.plan || '',
    } = body;

    if (!providedGeneratedNote.trim() && !shorthandInput.trim() && !diagnosis.trim()) {
      return NextResponse.json({ error: 'Please enter visit notes or at least a diagnosis.' }, { status: 400 });
    }

    const generatedNote = providedGeneratedNote.trim()
      ? providedGeneratedNote
      : await generateClinicalNote({
          noteType,
          specialty,
          fields: { diagnosis, visitNumber, precautions, interventions, deficits, assistLevel, response: patientResponse, plan },
          shorthandInput,
        });

    const noteId = uuidv4();
    const versionId = uuidv4();

    await transaction(async (db) => {
      await db.execute(
        `INSERT INTO notes (
          id, user_id, patient_label, note_type, specialty, diagnosis, visit_number,
          precautions, interventions, deficits, assist_level, response, plan, shorthand_input, generated_note
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          noteId,
          user.userId,
          patientLabel,
          noteType,
          specialty,
          diagnosis,
          visitNumber,
          precautions,
          interventions,
          deficits,
          assistLevel,
          patientResponse,
          plan,
          shorthandInput,
          generatedNote,
        ]
      );

      await db.execute(
        `INSERT INTO note_versions (
          id, note_id, version_number, generated_note, shorthand_input,
          diagnosis, visit_number, precautions, interventions, deficits, assist_level, response, plan
        )
        VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          versionId,
          noteId,
          generatedNote,
          shorthandInput,
          diagnosis,
          visitNumber,
          precautions,
          interventions,
          deficits,
          assistLevel,
          patientResponse,
          plan,
        ]
      );
    });

    await writeAuditLog({ userId: user.userId, action: 'CREATE_NOTE', noteId, metadata: { noteType, specialty, patientLabel } });

    const note = await one('SELECT * FROM notes WHERE id = $1', [noteId]);
    return NextResponse.json({ note, generatedNote });

  } catch (err) {
    console.error('Generate note error:', err);
    if (err.code === 'invalid_api_key') {
      return NextResponse.json({ error: 'Invalid OpenAI API key. Check your .env.local file.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to generate note. Please try again.' }, { status: 500 });
  }
}

module.exports = { GET, POST };
