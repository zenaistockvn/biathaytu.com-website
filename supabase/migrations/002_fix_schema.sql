-- Migration 002: Fix schema for complete publishing flow
-- Run in Supabase SQL Editor

-- 1. Add missing columns to generated_contents
ALTER TABLE generated_contents 
  ADD COLUMN IF NOT EXISTS content_format TEXT DEFAULT 'social_post',
  ADD COLUMN IF NOT EXISTS parent_id TEXT,
  ADD COLUMN IF NOT EXISTS source_article_id TEXT,
  ADD COLUMN IF NOT EXISTS image_prompt TEXT,
  ADD COLUMN IF NOT EXISTS video_prompt TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. Add FK: generated_contents.product_id → products.id
-- First make product_id nullable (some content may not belong to a product)
ALTER TABLE generated_contents ALTER COLUMN product_id DROP NOT NULL;

-- Add FK constraint (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'generated_contents_product_id_fkey'
  ) THEN
    ALTER TABLE generated_contents 
      ADD CONSTRAINT generated_contents_product_id_fkey 
      FOREIGN KEY (product_id) REFERENCES products(id);
  END IF;
END $$;

-- 3. Add is_approved to posts (Calendar workflow)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- 4. Create seo_articles table if not exists
CREATE TABLE IF NOT EXISTS seo_articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT REFERENCES products(id),
  title TEXT NOT NULL,
  slug TEXT,
  content TEXT NOT NULL,
  meta_description TEXT,
  keywords JSONB DEFAULT '[]',
  word_count INT DEFAULT 0,
  micro_content_count INT DEFAULT 0,
  status TEXT DEFAULT 'draft',
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Add unique constraint on social_accounts.account_id for upsert
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'social_accounts_account_id_key'
  ) THEN
    ALTER TABLE social_accounts ADD CONSTRAINT social_accounts_account_id_key UNIQUE (account_id);
  END IF;
END $$;

-- 6. Create studio reference tables if not exist
CREATE TABLE IF NOT EXISTS image_prompts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  style_id TEXT NOT NULL,
  style_name TEXT NOT NULL,
  style_icon TEXT DEFAULT '📸',
  style_description TEXT,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  purpose TEXT,
  ratio TEXT,
  sort_order INT DEFAULT 0,
  tenant_id TEXT NOT NULL DEFAULT 'demo-tenant'
);

CREATE TABLE IF NOT EXISTS brand_dna (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  heritage TEXT,
  tagline TEXT,
  colors TEXT,
  mood TEXT,
  visual_code TEXT,
  tenant_id TEXT NOT NULL DEFAULT 'demo-tenant'
);

CREATE TABLE IF NOT EXISTS ad_platform_specs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform_name TEXT NOT NULL,
  platform_icon TEXT,
  platform_color TEXT,
  element_name TEXT NOT NULL,
  char_limit TEXT,
  note TEXT,
  sort_order INT DEFAULT 0,
  tenant_id TEXT NOT NULL DEFAULT 'demo-tenant'
);

CREATE TABLE IF NOT EXISTS ad_angles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🎯',
  template TEXT,
  examples JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  tenant_id TEXT NOT NULL DEFAULT 'demo-tenant'
);

CREATE TABLE IF NOT EXISTS content_tips (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  examples JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  tenant_id TEXT NOT NULL DEFAULT 'demo-tenant'
);

-- 7. Enable RLS on new tables
ALTER TABLE seo_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_platform_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_angles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

-- 8. Allow service_role full access (drop first to avoid duplicate errors)
DROP POLICY IF EXISTS "Service role full access" ON seo_articles;
CREATE POLICY "Service role full access" ON seo_articles FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON image_prompts;
CREATE POLICY "Service role full access" ON image_prompts FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON brand_dna;
CREATE POLICY "Service role full access" ON brand_dna FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON ad_platform_specs;
CREATE POLICY "Service role full access" ON ad_platform_specs FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON ad_angles;
CREATE POLICY "Service role full access" ON ad_angles FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON content_tips;
CREATE POLICY "Service role full access" ON content_tips FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON generated_contents;
CREATE POLICY "Service role full access" ON generated_contents FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access" ON social_accounts;
CREATE POLICY "Service role full access" ON social_accounts FOR ALL USING (true);

-- 9. Indexes
CREATE INDEX IF NOT EXISTS idx_generated_contents_tenant ON generated_contents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_generated_contents_product ON generated_contents(product_id);
CREATE INDEX IF NOT EXISTS idx_generated_contents_status ON generated_contents(status);
CREATE INDEX IF NOT EXISTS idx_seo_articles_tenant ON seo_articles(tenant_id);
