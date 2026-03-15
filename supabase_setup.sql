-- =========================================================================
-- CRM PRO V2 — SUPABASE SETUP SCRIPT (RLS & REALTIME)
-- Run this script in your Supabase SQL Editor to secure your database
-- =========================================================================

-- 1. ENABLE ROW LEVEL SECURITY (RLS) ON CRITICAL TABLES
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 2. CREATE HELPER FUNCTION TO GET CURRENT USER'S ORG ID
-- This checks the custom public.users table (linked via supabase_id)
CREATE OR REPLACE FUNCTION auth.get_user_org_id() 
RETURNS TEXT 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT org_id FROM public.users WHERE supabase_id = auth.uid()::text LIMIT 1;
$$;

-- 3. CREATE RLS POLICIES

-- === LEADS TABLE ===
-- Users can only READ leads that belong to their organization
CREATE POLICY "Users can view leads in their organization" 
ON public.leads FOR SELECT 
USING (org_id = auth.get_user_org_id());

-- Users can only INSERT/UPDATE leads in their organization
CREATE POLICY "Users can modify leads in their organization" 
ON public.leads FOR ALL 
USING (org_id = auth.get_user_org_id());

-- === USERS TABLE ===
-- Users can see profiles of others in the same organization
CREATE POLICY "Users can view colleagues" 
ON public.users FOR SELECT 
USING (org_id = auth.get_user_org_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (supabase_id = auth.uid()::text);

-- === INTERACTIONS TABLE ===
CREATE POLICY "Users can access org interactions" 
ON public.interactions FOR ALL 
USING (
  lead_id IN (SELECT id FROM public.leads WHERE org_id = auth.get_user_org_id())
);

-- === SOS ALERTS TABLE ===
CREATE POLICY "Users can access org SOS alerts" 
ON public.sos_alerts FOR ALL 
USING (
  lead_id IN (SELECT id FROM public.leads WHERE org_id = auth.get_user_org_id())
);

-- === SCHEDULES TABLE ===
CREATE POLICY "Users can access org schedules" 
ON public.schedules FOR ALL 
USING (
  lead_id IN (SELECT id FROM public.leads WHERE org_id = auth.get_user_org_id())
);

-- 4. ENABLE REALTIME FOR DASHBOARD SYNC
-- This allows the Next.js client to receive Postgres changes via WebSockets
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- Add required tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedules;
