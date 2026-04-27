const { execute } = require('./db');
const { v4: uuidv4 } = require('uuid');

async function writeAuditLog({ userId, action, noteId = null, metadata = null, ipAddress = null }) {
  try {
    await execute(
      `INSERT INTO audit_logs (id, user_id, action, note_id, metadata, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        uuidv4(),
        userId,
        action,
        noteId,
        metadata ? JSON.stringify(metadata) : null,
        ipAddress,
      ]
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

module.exports = { writeAuditLog };
