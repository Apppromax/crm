import pg from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const client = new pg.Client({ connectionString: process.env.DIRECT_URL })

const columns = [
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS urgency TEXT`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS understanding TEXT`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS fin_readiness TEXT`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_fit TEXT`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS note TEXT`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS sharpness_score INTEGER`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS color_badge "CardColor"`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_visible_at TIMESTAMPTZ`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_golden_ping_at TIMESTAMPTZ`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS golden_ping_count INTEGER NOT NULL DEFAULT 0`,
]

async function run() {
  await client.connect()
  console.log('✅ Connected\n')

  // Kill blocking connections on leads table
  console.log('🔓 Clearing locks on leads table...')
  await client.query(`SET statement_timeout = '120s'`)
  try {
    const locks = await client.query(`
      SELECT pid FROM pg_locks l
      JOIN pg_class c ON l.relation = c.oid
      WHERE c.relname = 'leads' AND l.pid != pg_backend_pid()
    `)
    for (const row of locks.rows) {
      console.log(`  Terminating PID ${row.pid}`)
      await client.query(`SELECT pg_terminate_backend($1)`, [row.pid])
    }
    console.log(`  Cleared ${locks.rows.length} blocking connections\n`)
  } catch (e) {
    console.log(`  ⚠️ Lock clear: ${e.message}\n`)
  }

  // Run all column additions
  for (const sql of columns) {
    const colName = sql.match(/IF NOT EXISTS (\w+)/)?.[1] || sql
    try {
      await client.query(sql)
      console.log(`  ✅ ${colName}`)
    } catch (e) {
      console.log(`  ❌ ${colName}: ${e.message}`)
    }
  }

  // Verify
  const res = await client.query(`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name IN (
      'urgency','understanding','fin_readiness','product_fit','note',
      'sharpness_score','color_badge','retry_count','next_visible_at',
      'next_golden_ping_at','golden_ping_count'
    ) ORDER BY column_name;
  `)
  console.log('\n📋 Verify — columns found:')
  console.table(res.rows)
  await client.end()
  console.log('\n✅ Migration complete!')
}

run().catch(e => { console.error(e); process.exit(1) })
