// Upload helper: node scripts/upload-to-supabase.mjs <filepath> <folder> <filename>
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { basename } from 'path';

const supabaseUrl = 'https://jjshgkoclonvvoiwhbqd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[5] || '';

if (!supabaseKey) {
  // Use anon key from env if service role not available
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc2hna29jbG9udnZvaXdoYnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTE5NzIsImV4cCI6MjA5MDE4Nzk3Mn0.G-fG5OtJH0NUJKJDtQt_rdBmzKn_5Zp0vjWskoW7c-E';
  var supabase = createClient(supabaseUrl, anonKey);
} else {
  var supabase = createClient(supabaseUrl, supabaseKey);
}

const filePath = process.argv[2];
const folder = process.argv[3] || 'uploads';
const fileName = process.argv[4] || basename(filePath);

const fileBuffer = readFileSync(filePath);
const storagePath = `${folder}/${fileName}`;

const { data, error } = await supabase.storage
  .from('marketing-assets')
  .upload(storagePath, fileBuffer, {
    contentType: 'image/png',
    upsert: true,
  });

if (error) {
  console.error('Upload error:', error.message);
  process.exit(1);
}

const { data: pub } = supabase.storage.from('marketing-assets').getPublicUrl(storagePath);
console.log(JSON.stringify({ success: true, url: pub.publicUrl, path: storagePath }));
