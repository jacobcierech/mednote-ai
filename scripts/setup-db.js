// Run this to verify your database is set up correctly
// Usage: node scripts/setup-db.js

require('dotenv').config({ path: '.env.local' })
const { ensureDb, getDbMode, inspectTables } = require('../lib/db')

async function main() {
  try {
    await ensureDb()
    const tables = await inspectTables()
    const mode = getDbMode()

    console.log('\n✅ Database ready!')
    console.log('   Mode:', mode)
    console.log('   Tables:', tables.map(t => t.name).join(', '))

    if (mode === 'postgres') {
      console.log('   Connection: PostgreSQL via DATABASE_URL / PG* env vars')
    } else {
      console.log('   Path:', require('path').resolve(process.env.DATABASE_PATH || './mednote.db'))
    }

    console.log()
  } catch (err) {
    console.error('❌ Database error:', err.message)
    process.exit(1)
  }
}

main()
