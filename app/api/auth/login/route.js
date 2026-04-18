const { NextResponse } = require('next/server');
const bcrypt = require('bcryptjs');
const { getDb } = require('../../../../lib/db');
const { createToken, setAuthCookie } = require('../../../../lib/auth');
const { writeAuditLog } = require('../../../../lib/audit');

async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = createToken({ userId: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, specialty: user.specialty }
    });
    setAuthCookie(response, token);
    writeAuditLog({ userId: user.id, action: 'LOGIN', metadata: { email } });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}

module.exports = { POST };
