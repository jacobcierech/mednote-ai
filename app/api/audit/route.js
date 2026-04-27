const { NextResponse } = require('next/server');
const { getUserFromRequest } = require('lib/auth');
const { many } = require('lib/db');

async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const logs = await many(
    `SELECT *
     FROM audit_logs
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 100`,
    [user.userId]
  );

  return NextResponse.json({ logs });
}

module.exports = { GET };
