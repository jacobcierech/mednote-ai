const Database = require('better-sqlite3');
const path = require('path');
const { Pool } = require('pg');

const SQLITE_PATH = process.env.DATABASE_PATH || './mednote.db';
const POSTGRES_ENABLED = Boolean(process.env.DATABASE_URL || process.env.PGHOST);

let sqliteDb;
let pgPool;
let initPromise;

function getDbMode() {
  return POSTGRES_ENABLED ? 'postgres' : 'sqlite';
}

async function ensureDb() {
  if (!initPromise) {
    initPromise = POSTGRES_ENABLED ? initializePostgres() : initializeSqlite();
  }

  await initPromise;
  return getDbMode();
}

async function initializePostgres() {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
  });

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      specialty TEXT DEFAULT 'Primary Care',
      default_note_type TEXT DEFAULT 'SOAP',
      auto_save INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS note_versions (
      id TEXT PRIMARY KEY,
      note_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
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
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      note_id TEXT,
      metadata TEXT,
      ip_address TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON note_versions(note_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
  `);
}

function initializeSqlite() {
  sqliteDb = new Database(path.resolve(SQLITE_PATH));
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');

  sqliteDb.exec(`
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

async function many(sql, params = [], client = null) {
  await ensureDb();

  if (POSTGRES_ENABLED) {
    const executor = client || pgPool;
    const result = await executor.query(sql, params);
    return result.rows;
  }

  const stmt = sqliteDb.prepare(convertSqlForSqlite(sql));
  return stmt.all(...params);
}

async function one(sql, params = [], client = null) {
  const rows = await many(sql, params, client);
  return rows[0] || null;
}

async function execute(sql, params = [], client = null) {
  await ensureDb();

  if (POSTGRES_ENABLED) {
    const executor = client || pgPool;
    const result = await executor.query(sql, params);
    return { rowCount: result.rowCount || 0 };
  }

  const stmt = sqliteDb.prepare(convertSqlForSqlite(sql));
  const result = stmt.run(...params);
  return { rowCount: result.changes || 0 };
}

async function transaction(callback) {
  await ensureDb();

  if (POSTGRES_ENABLED) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback({
        many: (sql, params = []) => many(sql, params, client),
        one: (sql, params = []) => one(sql, params, client),
        execute: (sql, params = []) => execute(sql, params, client),
      });
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  sqliteDb.exec('BEGIN');
  try {
    const result = await callback({
      many: (sql, params = []) => many(sql, params),
      one: (sql, params = []) => one(sql, params),
      execute: (sql, params = []) => execute(sql, params),
    });
    sqliteDb.exec('COMMIT');
    return result;
  } catch (error) {
    sqliteDb.exec('ROLLBACK');
    throw error;
  }
}

async function inspectTables() {
  await ensureDb();

  if (POSTGRES_ENABLED) {
    return many(
      `SELECT table_name AS name
       FROM information_schema.tables
       WHERE table_schema = 'public'
       ORDER BY table_name`
    );
  }

  return many(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`);
}

function convertSqlForSqlite(sql) {
  return sql.replace(/\$\d+/g, '?').replace(/NOW\(\)/g, "datetime('now')");
}

function shouldUseSsl() {
  if (process.env.PGSSLMODE === 'disable') return false;
  return process.env.NODE_ENV === 'production' || Boolean(process.env.DATABASE_URL);
}

module.exports = {
  ensureDb,
  many,
  one,
  execute,
  transaction,
  inspectTables,
  getDbMode,
};
