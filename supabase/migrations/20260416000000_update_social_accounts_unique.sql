-- Migration to add unique constraint for social_accounts upserts
-- This is an idempotent migration

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'social_accounts_tenant_platform_account_unique'
  ) THEN
    ALTER TABLE social_accounts 
    ADD CONSTRAINT social_accounts_tenant_platform_account_unique 
    UNIQUE (tenant_id, platform, account_id);
  END IF;
END $$;
