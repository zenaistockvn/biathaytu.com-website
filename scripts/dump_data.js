const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Đọc file .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    envVars[key] = val;
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const tenantId = envVars['NEXT_PUBLIC_TENANT_ID'] || 'biathaytu';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function dump() {
  try {
    // 1. Fetch products
    console.log(`Fetching products for tenant: ${tenantId}...`);
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId);
    if (pError) console.error('Products Error:', pError);
    else console.log(`Fetched ${products.length} products`);

    // 2. Fetch seo_articles
    console.log(`Fetching articles for tenant: ${tenantId}...`);
    const { data: articles, error: aError } = await supabase
      .from('seo_articles')
      .select('*')
      .eq('tenant_id', tenantId);
    if (aError) console.error('Articles Error:', aError);
    else console.log(`Fetched ${articles.length} articles`);

    // 3. Fetch promo_codes
    console.log('Fetching promo_codes...');
    const { data: promoCodes, error: prError } = await supabase
      .from('promo_codes')
      .select('*');
    if (prError) console.error('Promo Codes Error:', prError);
    else console.log(`Fetched ${promoCodes.length} promo codes`);

    // Save to files
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2), 'utf8');
    fs.writeFileSync(path.join(dataDir, 'articles.json'), JSON.stringify(articles, null, 2), 'utf8');
    fs.writeFileSync(path.join(dataDir, 'promo_codes.json'), JSON.stringify(promoCodes || [], null, 2), 'utf8');
    console.log('Dump completed successfully!');
  } catch (err) {
    console.error('Failed to dump data:', err);
  }
}

dump();
