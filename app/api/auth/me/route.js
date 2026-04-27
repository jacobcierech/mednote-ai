const { NextResponse } = require('next/server');
const { getUserFromRequest } = require('lib/auth');
const { one } = require('lib/db');

async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const row = await one(
    `SELECT id, email, name, specialty, default_note_type, auto_save, created_at
     FROM users
     WHERE id = $1`,
    [user.userId]
  );
  if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ user: row });
}

module.exports = { GET };
