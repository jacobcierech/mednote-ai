const { NextResponse } = require('next/server');
const { getUserFromRequest } = require('../../../../lib/auth');
const { getDb } = require('../../../../lib/db');

async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const row = db.prepare('SELECT id, email, name, specialty, default_note_type, auto_save, created_at FROM users WHERE id = ?').get(user.userId);
  if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ user: row });
}

module.exports = { GET };
