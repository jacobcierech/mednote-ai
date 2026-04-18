const { NextResponse } = require('next/server');
const { v4: uuidv4 } = require('uuid');
const { getUserFromRequest } = require('../../../../lib/auth');
const { getDb } = require('../../../../lib/db');
const { generateClinicalNote } = require('../../../../lib/openai');
const { writeAuditLog } = require('../../../../lib/audit');

// GET /api/notes/[id]
async function GET(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(params.id, user.userId);
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

  const versions = db.prepare('SELECT * FROM note_versions WHERE note_id = ? ORDER BY version_number DESC').all(params.id);
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

    const db = getDb();
    const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(params.id, user.userId);
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    const generatedNote = await generateClinicalNote({
      noteType: note.note_type,
      specialty: note.specialty,
      fields: { diagnosis, visitNumber, precautions, interventions, deficits, assistLevel, response: patientResponse, plan },
      shorthandInput,
    });

    const newVersion = note.current_version + 1;

    // Save new version
    db.prepare(`
      INSERT INTO note_versions (id, note_id, version_number, generated_note, shorthand_input,
        diagnosis, visit_number, precautions, interventions, deficits, assist_level, response, plan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), params.id, newVersion, generatedNote, shorthandInput,
      diagnosis, visitNumber, precautions, interventions, deficits, assistLevel, patientResponse, plan);

    // Update note
    db.prepare(`
      UPDATE notes SET generated_note=?, shorthand_input=?, diagnosis=?, visit_number=?,
        precautions=?, interventions=?, deficits=?, assist_level=?, response=?, plan=?,
        current_version=?, updated_at=datetime('now')
      WHERE id=?
    `).run(generatedNote, shorthandInput, diagnosis, visitNumber, precautions, interventions,
      deficits, assistLevel, patientResponse, plan, newVersion, params.id);

    writeAuditLog({ userId: user.userId, action: 'REGENERATE_NOTE', noteId: params.id, metadata: { version: newVersion } });

    const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(params.id);
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

  const db = getDb();
  const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(params.id, user.userId);
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

  db.prepare('DELETE FROM notes WHERE id = ?').run(params.id);
  writeAuditLog({ userId: user.userId, action: 'DELETE_NOTE', noteId: params.id, metadata: { noteType: note.note_type } });

  return NextResponse.json({ success: true });
}

module.exports = { GET, PUT, DELETE };
