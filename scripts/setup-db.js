// Run this to verify your database is set up correctly
// Usage: node scripts/setup-db.js

require('dotenv').config({ path: '.env.local' })
const { getDb } = require('../lib/db')

try {
  const db = getDb()
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log('\n✅ Database ready!')
  console.log('   Tables:', tables.map(t => t.name).join(', '))
  console.log('   Path:', require('path').resolve(process.env.DATABASE_PATH || './mednote.db'))
  console.log()
} catch (err) {
  console.error('❌ Database error:', err.message)
  process.exit(1)
}
