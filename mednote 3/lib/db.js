const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || './mednote.db';

let db;

function getDb() {
  if (!db) {
    db = new Database(path.resolve(DB_PATH));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    setupTables(db);
  }
  return db;
}

function setupTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      specialty TEXT DEFAULT 'Primary Care',
      default_note_type TEXT DEFAULT 'SOAP',
      auto_save INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      patient_label TEXT NOT NULL DEFAULT 'Unnamed Patient',
      note_type TEXT NOT NULL DEFAULT 'SOAP',
      specialty TEXT NOT NULL DEFAULT 'Primary Care',
      diagnosis TEXT,
      visit_number TEXT,
      precautions TEXT,
      interventions TEXT,
      deficits TEXT,
      assist_level TEXT,
      response TEXT,
      plan TEXT,
      shorthand_input TEXT NOT NULL,
      generated_note TEXT NOT NULL,
      current_version INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS note_versions (
      id TEXT PRIMARY KEY,
      note_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      generated_note TEXT NOT NULL,
      shorthand_input TEXT NOT NULL,
      diagnosis TEXT,
      visit_number TEXT,
      precautions TEXT,
      interventions TEXT,
      deficits TEXT,
      assist_level TEXT,
      response TEXT,
      plan TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      note_id TEXT,
      metadata TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
    CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON note_versions(note_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
  `);
}

module.exports = { getDb };
