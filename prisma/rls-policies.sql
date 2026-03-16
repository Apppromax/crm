-- ============================================
-- CRM Pro V2 — Row Level Security (RLS) Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_advices ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- LEADS: Sale sees own, Manager sees team, CEO sees all
-- ============================================

CREATE POLICY "Sale can view own leads" ON leads
FOR SELECT USING (
    assigned_to = (SELECT id FROM users WHERE supabase_id = auth.uid())
);

CREATE POLICY "Manager can view team leads" ON leads
FOR SELECT USING (
    team_id IN (
        SELECT id FROM teams WHERE manager_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
    )
);

CREATE POLICY "CEO can view all org leads" ON leads
FOR SELECT USING (
    org_id IN (
        SELECT org_id FROM users WHERE supabase_id = auth.uid() AND role = 'CEO'
    )
);

-- Sale can update own leads
CREATE POLICY "Sale can update own leads" ON leads
FOR UPDATE USING (
    assigned_to = (SELECT id FROM users WHERE supabase_id = auth.uid())
);

-- ============================================
-- INTERACTIONS: Sale sees own, Manager sees team
-- ============================================

CREATE POLICY "User can view own interactions" ON interactions
FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
    OR lead_id IN (
        SELECT id FROM leads WHERE team_id IN (
            SELECT id FROM teams WHERE manager_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
        )
    )
);

CREATE POLICY "User can create interactions" ON interactions
FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
);

-- ============================================
-- SOS ALERTS: Manager/CEO can view
-- ============================================

CREATE POLICY "Manager/CEO can view SOS alerts" ON sos_alerts
FOR SELECT USING (
    lead_id IN (
        SELECT l.id FROM leads l
        JOIN teams t ON l.team_id = t.id
        WHERE t.manager_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM users WHERE supabase_id = auth.uid() AND role IN ('CEO', 'DIRECTOR')
    )
);

-- ============================================
-- SCHEDULES: User sees own
-- ============================================

CREATE POLICY "User can view own schedules" ON schedules
FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
);

CREATE POLICY "User can manage own schedules" ON schedules
FOR ALL USING (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
);

-- ============================================
-- SERVICE ROLE BYPASS
-- Note: Prisma uses service_role key which bypasses RLS
-- These policies protect direct client access only
-- ============================================
