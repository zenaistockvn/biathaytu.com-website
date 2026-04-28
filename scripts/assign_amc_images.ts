import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const assetsDir = path.join(process.cwd(), 'public', 'images', 'products', 'amc_assets');
  const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

  console.log(`Found ${files.length} images to deploy.`);

  // Lấy ra số lượng bài viết tương đương
  const { data: posts, error } = await supabase
    .from('generated_contents')
    .select('id')
    .or('image_urls.is.null,image_urls.eq.[]')
    .order('created_at', { ascending: false })
    .limit(files.length);

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  console.log(`Found ${posts.length} empty posts. Start mapping...`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const fileName = files[i];
    const publicUrl = `/images/products/amc_assets/${fileName}`;

    const { error: updateError } = await supabase
      .from('generated_contents')
      .update({ image_urls: [publicUrl] })
      .eq('id', post.id);

    if (updateError) {
      console.error(`Failed to update post ${post.id}`, updateError);
    } else {
      console.log(`Updated post: ${post.id.slice(0, 8)} -> ${fileName}`);
    }
  }

  console.log("Database Backfill Completed Successfully!");
}

run();
