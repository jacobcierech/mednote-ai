const { NextResponse } = require('next/server');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../../../lib/db');
const { createToken, setAuthCookie } = require('../../../lib/auth');
const { writeAuditLog } = require('../../../lib/audit');

async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)
    `).run(userId, email.toLowerCase(), passwordHash, name);

    const token = createToken({ userId, email: email.toLowerCase(), name });
    const response = NextResponse.json({ success: true, user: { id: userId, email, name } });
    setAuthCookie(response, token);

    writeAuditLog({ userId, action: 'REGISTER', metadata: { email } });

    return response;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

module.exports = { POST };
