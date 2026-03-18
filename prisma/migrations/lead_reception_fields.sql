-- ============================================================
-- Migration: Lead Reception Fields (Bước 1 & 2 CRM Pro V2)
-- Chạy từng STEP riêng lẻ trong Supabase SQL Editor
-- ============================================================

-- STEP 1: Thêm enum values vào LeadStatus
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'UNPROCESSED';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'RETRYING';

-- STEP 2: Tạo enum CardColor mới
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CardColor') THEN
    CREATE TYPE "CardColor" AS ENUM ('GREEN', 'ORANGE', 'RED', 'GRAY');
  END IF;
END; $$;

-- STEP 3: Thêm cột Phase 1 (AI Inputs - 4 Dropbox + Note)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS urgency TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS understanding TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fin_readiness TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_fit TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS note TEXT;

-- STEP 4: Thêm cột Sharpness Score & Color Badge
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sharpness_score INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS color_badge "CardColor";

-- STEP 5: Thêm cột Retry Logic (Phase 2 - Không liên lạc được)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_visible_at TIMESTAMPTZ;

-- STEP 6: Thêm cột Golden 72h Ping cycle
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_golden_ping_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS golden_ping_count INTEGER NOT NULL DEFAULT 0;

-- VERIFY: Xem lại cấu trúc bảng leads
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN (
    'urgency', 'understanding', 'fin_readiness', 'product_fit', 'note',
    'sharpness_score', 'color_badge', 'retry_count', 'next_visible_at',
    'next_golden_ping_at', 'golden_ping_count'
  )
ORDER BY column_name;
