const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DATABASE_URL;
const QUERY_TIMEOUT_MS = 30000;

if (!databaseUrl) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key === 'DATABASE_URL') {
          databaseUrl = val;
        }
      }
    });
  }
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

async function runUpdate() {
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: QUERY_TIMEOUT_MS,
    query_timeout: QUERY_TIMEOUT_MS,
    statement_timeout: QUERY_TIMEOUT_MS,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database successfully.');

    console.log("Running update query...");
    const res = await client.query(
      "UPDATE seo_articles SET tenant_id = 'biathaytu' WHERE tenant_id = 'demo-tenant'"
    );
    console.log(`Successfully updated ${res.rowCount} articles in the database.`);
  } catch (error) {
    console.error('Error updating database:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runUpdate();
