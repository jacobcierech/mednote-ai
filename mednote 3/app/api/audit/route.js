const { NextResponse } = require('next/server');
const { getUserFromRequest } = require('../../../lib/auth');
const { getDb } = require('../../../lib/db');

async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const logs = db.prepare(`
    SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100
  `).all(user.userId);

  return NextResponse.json({ logs });
}

module.exports = { GET };
