const { NextResponse } = require('next/server');
const bcrypt = require('bcryptjs');
const { getUserFromRequest } = require('lib/auth');
const { execute, one } = require('lib/db');
const { writeAuditLog } = require('lib/audit');

async function PUT(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, specialty, defaultNoteType, autoSave, currentPassword, newPassword } = await request.json();
    const row = await one('SELECT * FROM users WHERE id = $1', [user.userId]);
    if (!row) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: 'Current password required.' }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, row.password_hash);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
      const newHash = await bcrypt.hash(newPassword, 12);
      await execute(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newHash, user.userId]
      );
    }

    await execute(
      `UPDATE users
       SET name = $1, specialty = $2, default_note_type = $3, auto_save = $4, updated_at = NOW()
       WHERE id = $5`,
      [
        name || row.name,
        specialty || row.specialty,
        defaultNoteType || row.default_note_type,
        autoSave !== undefined ? (autoSave ? 1 : 0) : row.auto_save,
        user.userId,
      ]
    );

    await writeAuditLog({ userId: user.userId, action: 'UPDATE_SETTINGS' });

    const updated = await one(
      `SELECT id, email, name, specialty, default_note_type, auto_save
       FROM users
       WHERE id = $1`,
      [user.userId]
    );
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 });
  }
}

module.exports = { PUT };
