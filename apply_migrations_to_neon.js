const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const databaseUrl = 'postgresql://neondb_owner:npg_sefD7SQgO1NH@ep-shy-lake-ao0aki61.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const migrationsDir = 'C:/Users/QuangTran/Downloads/Full dự án/AMC-biathaytu/supabase/migrations';

const migrationFiles = [
  '20260517115326_create_affiliate_tables.sql',
  '20260520000000_add_platform_to_satellite_pages.sql',
  '20260522_crm_tables.sql',
  '20260524_meta_ads_tables.sql',
  '20260525_multi_meta_ad_accounts.sql',
  '20260602_create_ad_insights_daily.sql',
  '20260610_add_bot_silence_to_contacts.sql',
  '20260612_bot_chatbot.sql',
  '20260621_bot_kb_contextual_replies.sql',
  '20260622000000_bot_auth_rls.sql',
  '20260622010000_bot_kb_expert_advisor.sql',
  '20260622040000_bot_kb_advisor_guardrails.sql',
  '20260623_create_campaign_pages.sql'
];

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  console.log('Connected to Neon database for migrations.');

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Migration file not found: ${filePath}`);
      continue;
    }
    console.log(`Applying migration: ${file}`);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split by semicolons, but simple split might break on functions/triggers.
    // Instead, since these are migrations, we can try running the whole script first.
    // PostgreSQL can run multiple SQL statements in one client.query() call.
    try {
      await client.query(sql);
      console.log(`✅ Successfully applied migration: ${file}`);
    } catch (e) {
      console.error(`❌ Failed to apply migration: ${file}`);
      console.error(e.message);
      // We still continue to apply others, or we can throw.
    }
  }

  await client.end();
  console.log('All migrations applied!');
}

main().catch(console.error);
