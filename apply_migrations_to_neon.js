const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.join(__dirname, '.env.local');

function readEnvValue(key) {
  if (process.env[key]) return process.env[key];
  if (!fs.existsSync(envPath)) return null;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    if (parts[0]?.trim() === key) {
      return parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
}

if (process.env.APPLY_REMOTE_MIGRATIONS !== '1') {
  console.error('Refusing to apply remote migrations without APPLY_REMOTE_MIGRATIONS=1.');
  process.exit(1);
}

const databaseUrl = readEnvValue('DATABASE_URL');
if (!databaseUrl) {
  console.error('DATABASE_URL not found in environment or .env.local.');
  process.exit(1);
}

const migrationsDir = process.env.MIGRATIONS_DIR || path.join(__dirname, 'supabase', 'migrations');
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

async function main() {
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 30000,
    query_timeout: 60000,
    statement_timeout: 60000,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log(`Connected to Neon database. Applying ${migrationFiles.length} migrations.`);

  try {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Applying migration: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      if (/\bdrop\s+table\b/i.test(sql) && process.env.ALLOW_DESTRUCTIVE_MIGRATION !== '1') {
        throw new Error(
          `Refusing to apply destructive migration ${file} without ALLOW_DESTRUCTIVE_MIGRATION=1.`,
        );
      }
      await client.query(sql);
      console.log(`Applied migration: ${file}`);
    }
  } finally {
    await client.end();
  }

  console.log('All migrations applied.');
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
