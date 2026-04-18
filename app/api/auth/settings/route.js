const { NextResponse } = require('next/server');
const bcrypt = require('bcryptjs');
const { getUserFromRequest } = require('lib/auth');
const { getDb } = require('lib/db');
const { writeAuditLog } = require('lib/audit');

async function PUT(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, specialty, defaultNoteType, autoSave, currentPassword, newPassword } = await request.json();
    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(user.userId);

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: 'Current password required.' }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, row.password_hash);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
      const newHash = await bcrypt.hash(newPassword, 12);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(newHash, user.userId);
    }

    db.prepare(`
      UPDATE users SET name=?, specialty=?, default_note_type=?, auto_save=?, updated_at=datetime('now') WHERE id=?
    `).run(name || row.name, specialty || row.specialty, defaultNoteType || row.default_note_type,
      autoSave !== undefined ? (autoSave ? 1 : 0) : row.auto_save, user.userId);

    writeAuditLog({ userId: user.userId, action: 'UPDATE_SETTINGS' });

    const updated = db.prepare('SELECT id, email, name, specialty, default_note_type, auto_save FROM users WHERE id = ?').get(user.userId);
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 });
  }
}

module.exports = { PUT };
