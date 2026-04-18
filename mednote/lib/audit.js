const { getDb } = require('./db');
const { v4: uuidv4 } = require('uuid');

function writeAuditLog({ userId, action, noteId = null, metadata = null, ipAddress = null }) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, note_id, metadata, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      action,
      noteId,
      metadata ? JSON.stringify(metadata) : null,
      ipAddress
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

module.exports = { writeAuditLog };
