const { NextResponse } = require('next/server');
const { clearAuthCookie, getUserFromRequest } = require('../../../lib/auth');

async function POST(request) {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}

module.exports = { POST };
