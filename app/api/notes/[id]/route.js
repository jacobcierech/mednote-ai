const { NextResponse } = require('next/server');
const { v4: uuidv4 } = require('uuid');
const { getUserFromRequest } = require('lib/auth');
const { execute, many, one, transaction } = require('lib/db');
const { generateClinicalNote } = require('lib/openai');
const { writeAuditLog } = require('lib/audit');

// GET /api/notes/[id]
async function GET(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const note = await one(
    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
    [params.id, user.userId]
  );
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

  const versions = await many(
    'SELECT * FROM note_versions WHERE note_id = $1 ORDER BY version_number DESC',
    [params.id]
  );
  return NextResponse.json({ note, versions });
}

// PUT /api/notes/[id] - regenerate (creates new version)
async function PUT(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      shorthandInput = '',
      diagnosis = '',
      visitNumber = '',
      precautions = '',
      interventions = '',
      deficits = '',
      assistLevel = '',
      response: patientResponse = '',
      plan = '',
    } = body;

    const note = await one(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [params.id, user.userId]
    );
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    const generatedNote = await generateClinicalNote({
      noteType: note.note_type,
      specialty: note.specialty,
      fields: { diagnosis, visitNumber, precautions, interventions, deficits, assistLevel, response: patientResponse, plan },
      shorthandInput,
    });

    const newVersion = note.current_version + 1;

    await transaction(async (db) => {
      await db.execute(
        `INSERT INTO note_versions (
          id, note_id, version_number, generated_note, shorthand_input,
          diagnosis, visit_number, precautions, interventions, deficits, assist_level, response, plan
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          uuidv4(),
          params.id,
          newVersion,
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

      await db.execute(
        `UPDATE notes
         SET generated_note = $1, shorthand_input = $2, diagnosis = $3, visit_number = $4,
             precautions = $5, interventions = $6, deficits = $7, assist_level = $8, response = $9, plan = $10,
             current_version = $11, updated_at = NOW()
         WHERE id = $12`,
        [
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
          newVersion,
          params.id,
        ]
      );
    });

    await writeAuditLog({ userId: user.userId, action: 'REGENERATE_NOTE', noteId: params.id, metadata: { version: newVersion } });

    const updated = await one('SELECT * FROM notes WHERE id = $1', [params.id]);
    return NextResponse.json({ note: updated, generatedNote });

  } catch (err) {
    console.error('Regenerate error:', err);
    return NextResponse.json({ error: 'Failed to regenerate note.' }, { status: 500 });
  }
}

// DELETE /api/notes/[id]
async function DELETE(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const note = await one(
    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
    [params.id, user.userId]
  );
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

  await execute('DELETE FROM notes WHERE id = $1', [params.id]);
  await writeAuditLog({ userId: user.userId, action: 'DELETE_NOTE', noteId: params.id, metadata: { noteType: note.note_type } });

  return NextResponse.json({ success: true });
}

module.exports = { GET, PUT, DELETE };
