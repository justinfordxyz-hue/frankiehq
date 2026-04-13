-- Frankie — Initial Schema (Multi-Tenant)
-- Run this in Supabase SQL Editor

-- ============================================
-- BRANDS (tenants)
-- ============================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- e.g. "paco-taco", "baskin-robbins"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Brand-specific config (report types, scoring, templates)
  config JSONB DEFAULT '{}'::jsonb
);

-- Config JSONB structure example:
-- {
--   "scoring": {
--     "categories": [
--       {"name": "Safety", "maxPoints": 30},
--       {"name": "Product Quality", "maxPoints": 25},
--       {"name": "Service", "maxPoints": 25},
--       {"name": "Image", "maxPoints": 20}
--     ],
--     "tiers": [
--       {"name": "CRITICAL", "maxScore": 69},
--       {"name": "DEVELOPING", "maxScore": 84},
--       {"name": "GOOD", "maxScore": 91},
--       {"name": "ELITE", "maxScore": 100}
--     ]
--   },
--   "reportTypes": ["Operations Assessment", "Health & Safety", "Window Readiness", "Deficiency Report"],
--   "feeTypes": ["Royalty", "Marketing/Adv Fund", "Technology Fee"],
--   "letterClosing": "Regards,"
-- }

COMMENT ON TABLE brands IS 'Each brand is a tenant. All brand-specific logic lives in config JSONB — never hardcoded.';

-- ============================================
-- USERS (FBCs, corporate staff, admins)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,  -- maps to Clerk user ID
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'fbc', -- 'admin', 'fbc', 'ar_staff'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_clerk ON users(clerk_id);
CREATE INDEX idx_users_brand ON users(brand_id);

-- ============================================
-- FRANCHISEES
-- ============================================
CREATE TABLE franchisees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  assigned_fbc_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  dba_name TEXT,  -- doing business as
  location_id TEXT, -- brand's internal ID (e.g. PC 360086)
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'probation', 'terminated'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_franchisees_brand ON franchisees(brand_id);
CREATE INDEX idx_franchisees_fbc ON franchisees(assigned_fbc_id);

-- ============================================
-- ASSESSMENTS (visits/reports)
-- ============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  franchisee_id UUID REFERENCES franchisees(id) ON DELETE CASCADE NOT NULL,
  fbc_id UUID REFERENCES users(id),
  report_type TEXT NOT NULL,
  visit_date DATE NOT NULL,

  -- Scores stored as JSONB for brand-agnostic flexibility
  scores JSONB DEFAULT '[]'::jsonb,
  -- e.g. [{"category": "Safety", "score": 25, "max": 30}, ...]

  total_score NUMERIC(5,1),
  total_max NUMERIC(5,1),
  percentage NUMERIC(5,1),
  tier TEXT,

  critical_findings TEXT,
  positive_findings TEXT,
  previous_visit_notes TEXT,
  additional_context TEXT,

  -- Source tracking
  source TEXT DEFAULT 'manual', -- 'manual', 'email', 'pdf_upload'
  source_file_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_assessments_brand ON assessments(brand_id);
CREATE INDEX idx_assessments_franchisee ON assessments(franchisee_id);
CREATE INDEX idx_assessments_date ON assessments(visit_date DESC);

-- ============================================
-- GENERATED LETTERS
-- ============================================
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  franchisee_id UUID REFERENCES franchisees(id) ON DELETE CASCADE NOT NULL,
  fbc_id UUID REFERENCES users(id),

  letter_type TEXT NOT NULL DEFAULT 'fbr_followup', -- 'fbr_followup', 'ar_collection', 'custom'
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'approved', 'sent'

  -- Generation metadata
  model_used TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,

  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_letters_brand ON letters(brand_id);
CREATE INDEX idx_letters_franchisee ON letters(franchisee_id);
CREATE INDEX idx_letters_status ON letters(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchisees ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- For now, service role bypasses RLS (API routes use service client)
-- We'll add granular policies in S2 when we build the dashboard

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER franchisees_updated_at BEFORE UPDATE ON franchisees FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER letters_updated_at BEFORE UPDATE ON letters FOR EACH ROW EXECUTE FUNCTION update_updated_at();
