const { Client } = require('pg');
const fs = require('fs');

const CONNECTION = 'postgresql://postgres.kqwntmhulobobczmwqda:Hellomeo%400988249159@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString: CONNECTION, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('✅ Connected to database\n');

  // SQL statements to run
  const statements = [
    // 1. Enable RLS
    { label: 'RLS: organizations', sql: 'ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: teams', sql: 'ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: users', sql: 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: leads', sql: 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: interactions', sql: 'ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: sos_alerts', sql: 'ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: schedules', sql: 'ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: milestone_history', sql: 'ALTER TABLE public.milestone_history ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: manager_advices', sql: 'ALTER TABLE public.manager_advices ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: daily_metrics', sql: 'ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: audit_logs', sql: 'ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;' },
    { label: 'RLS: notifications', sql: 'ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;' },

    // 2. Helper function (public schema instead of auth)
    {
      label: 'Function: get_user_org_id',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_user_org_id()
        RETURNS TEXT
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT org_id FROM public.users WHERE supabase_id = auth.uid()::text LIMIT 1;
        $$;
      `
    },

    // 3. RLS Policies - Leads
    {
      label: 'Policy: Sale can view own leads',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Sale can view own leads" ON leads
          FOR SELECT USING (
            assigned_to = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Manager can view team leads',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Manager can view team leads" ON leads
          FOR SELECT USING (
            team_id IN (
              SELECT id FROM teams WHERE manager_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
            )
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: CEO can view all org leads',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "CEO can view all org leads" ON leads
          FOR SELECT USING (
            org_id IN (
              SELECT org_id FROM users WHERE supabase_id = auth.uid()::text AND role = 'CEO'
            )
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Sale can update own leads',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Sale can update own leads" ON leads
          FOR UPDATE USING (
            assigned_to = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Users can modify leads in org',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Users can modify leads in org" ON leads
          FOR ALL USING (org_id = public.get_user_org_id());
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },

    // 4. RLS Policies - Users
    {
      label: 'Policy: Users can view colleagues',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Users can view colleagues" ON users
          FOR SELECT USING (org_id = public.get_user_org_id());
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Users can update own profile',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Users can update own profile" ON users
          FOR UPDATE USING (supabase_id = auth.uid()::text);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },

    // 5. RLS Policies - Interactions
    {
      label: 'Policy: User can view own interactions',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "User can view own interactions" ON interactions
          FOR SELECT USING (
            user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
            OR lead_id IN (
              SELECT id FROM leads WHERE team_id IN (
                SELECT id FROM teams WHERE manager_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
              )
            )
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: User can create interactions',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "User can create interactions" ON interactions
          FOR INSERT WITH CHECK (
            user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Org interactions access',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Users can access org interactions" ON interactions
          FOR ALL USING (
            lead_id IN (SELECT id FROM leads WHERE org_id = public.get_user_org_id())
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },

    // 6. RLS Policies - SOS Alerts
    {
      label: 'Policy: Manager/CEO can view SOS',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Manager CEO can view SOS alerts" ON sos_alerts
          FOR SELECT USING (
            lead_id IN (
              SELECT l.id FROM leads l
              JOIN teams t ON l.team_id = t.id
              WHERE t.manager_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
            )
            OR EXISTS (
              SELECT 1 FROM users WHERE supabase_id = auth.uid()::text AND role IN ('CEO', 'ADMIN')
            )
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Org SOS access',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Users can access org SOS alerts" ON sos_alerts
          FOR ALL USING (
            lead_id IN (SELECT id FROM leads WHERE org_id = public.get_user_org_id())
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },

    // 7. RLS Policies - Schedules
    {
      label: 'Policy: User can view own schedules',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "User can view own schedules" ON schedules
          FOR SELECT USING (
            user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: User can manage own schedules',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "User can manage own schedules" ON schedules
          FOR ALL USING (
            user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()::text)
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
    {
      label: 'Policy: Org schedules access',
      sql: `
        DO $$ BEGIN
          CREATE POLICY "Users can access org schedules" ON schedules
          FOR ALL USING (
            lead_id IN (SELECT id FROM leads WHERE org_id = public.get_user_org_id())
          );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    },
  ];

  let success = 0;
  let failed = 0;

  for (const stmt of statements) {
    try {
      await client.query(stmt.sql);
      console.log(`  ✅ ${stmt.label}`);
      success++;
    } catch (e) {
      console.log(`  ❌ ${stmt.label}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n=============================`);
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  console.log(`=============================`);

  await client.end();
}

run().catch(e => console.error('Fatal:', e.message));
