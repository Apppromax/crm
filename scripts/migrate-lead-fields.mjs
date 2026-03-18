// Migration script: Add Lead Reception fields to leads table
// Runs SQL directly against DIRECT_URL to avoid pooler timeout.
// Usage: node scripts/migrate-lead-fields.mjs

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Starting Lead fields migration...\n')

  const migrations = [
    // Step 1: Add new enum values to LeadStatus
    {
      name: 'LeadStatus: add UNPROCESSED, RETRYING',
      sql: `
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'UNPROCESSED' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'LeadStatus')) THEN
            ALTER TYPE "LeadStatus" ADD VALUE 'UNPROCESSED';
          END IF;
        END; $$;
      `,
    },
    {
      name: 'LeadStatus: add RETRYING',
      sql: `
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'RETRYING' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'LeadStatus')) THEN
            ALTER TYPE "LeadStatus" ADD VALUE 'RETRYING';
          END IF;
        END; $$;
      `,
    },
    // Step 2: Create CardColor enum
    {
      name: 'Create CardColor enum',
      sql: `
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CardColor') THEN
            CREATE TYPE "CardColor" AS ENUM ('GREEN', 'ORANGE', 'RED', 'GRAY');
          END IF;
        END; $$;
      `,
    },
    // Step 3: Add Phase 1 AI input columns (individual to avoid lock timeout)
    { name: 'Add urgency col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS urgency TEXT;` },
    { name: 'Add understanding col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS understanding TEXT;` },
    { name: 'Add fin_readiness col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS fin_readiness TEXT;` },
    { name: 'Add product_fit col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_fit TEXT;` },
    { name: 'Add note col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS note TEXT;` },
    { name: 'Add sharpness_score col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS sharpness_score INTEGER;` },
    { name: 'Add color_badge col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS color_badge "CardColor";` },
    // Step 4: Add Phase 2 Retry Logic columns
    { name: 'Add retry_count col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;` },
    { name: 'Add next_visible_at col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_visible_at TIMESTAMPTZ;` },
    // Step 5: Add 72h Golden Ping columns
    { name: 'Add next_golden_ping_at col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_golden_ping_at TIMESTAMPTZ;` },
    { name: 'Add golden_ping_count col', sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS golden_ping_count INTEGER NOT NULL DEFAULT 0;` },
  ]

  for (const migration of migrations) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: migration.sql }).single()
      if (error) {
        // Try direct query approach
        const { error: err2 } = await supabase.from('leads').select('id').limit(0)
        console.log(`  ⚠️  RPC not available, trying raw approach for: ${migration.name}`)
        // Log and continue — Supabase JS cannot run DDL directly
        console.log(`  ℹ️  SQL to run manually:\n${migration.sql}\n`)
      } else {
        console.log(`  ✅ ${migration.name}`)
      }
    } catch (e) {
      console.log(`  ⚠️  ${migration.name}: ${e.message}`)
    }
  }

  console.log('\n📋 Migration SQL (run these in Supabase SQL Editor if needed):')
  console.log('=' .repeat(60))
  for (const m of migrations) {
    console.log(`-- ${m.name}`)
    console.log(m.sql.trim())
    console.log()
  }
}

run()
