const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');

// File extensions to scan for references
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md', '.sql'];
// Image extensions to audit
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

// Helper to load env variables manually from .env.local
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
      env[key] = value;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getFilesRecursively(dir, extensions = null) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(getFilesRecursively(fullPath, extensions));
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!extensions || extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

async function fetchDatabaseImageReferences() {
  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase credentials not found in .env.local. Skipping database scan.');
    return [];
  }

  console.log('Connecting to Supabase to fetch image references...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  const references = [];

  try {
    // 1. Fetch products
    const { data: products, error: prodErr } = await supabase.from('products').select('images, ai_analysis');
    if (prodErr) throw prodErr;
    if (products) {
      products.forEach(p => {
        if (p.images) {
          references.push(JSON.stringify(p.images));
        }
        if (p.ai_analysis) {
          references.push(JSON.stringify(p.ai_analysis));
        }
      });
    }

    // 2. Fetch seo_articles
    const { data: articles, error: artErr } = await supabase.from('seo_articles').select('thumbnail_url, content');
    if (artErr) throw artErr;
    if (articles) {
      articles.forEach(a => {
        if (a.thumbnail_url) references.push(a.thumbnail_url);
        if (a.content) references.push(a.content);
      });
    }

    // 3. Fetch posts
    const { data: posts, error: postErr } = await supabase.from('posts').select('image_urls');
    if (postErr) throw postErr;
    if (posts) {
      posts.forEach(p => {
        if (p.image_urls) {
          references.push(JSON.stringify(p.image_urls));
        }
      });
    }

    // 4. Fetch generated_contents
    const { data: contents, error: genErr } = await supabase.from('generated_contents').select('image_urls, video_url');
    if (genErr) throw genErr;
    if (contents) {
      contents.forEach(c => {
        if (c.image_urls) {
          references.push(JSON.stringify(c.image_urls));
        }
        if (c.video_url) {
          references.push(c.video_url);
        }
      });
    }

    // 5. Fetch seeding_contents
    const { data: seeding, error: seedErr } = await supabase.from('seeding_contents').select('image_urls');
    if (seedErr) throw seedErr;
    if (seeding) {
      seeding.forEach(s => {
        if (s.image_urls) {
          references.push(JSON.stringify(s.image_urls));
        }
      });
    }

    console.log(`Fetched database references. Total database text blocks: ${references.length}`);
  } catch (error) {
    console.error('Error fetching database image references:', error.message);
  }

  return references;
}

async function scanReferences() {
  console.log('Scanning code files for image references...');
  // Find all code/content files
  const searchDirs = [
    path.join(ROOT_DIR, 'src'),
    path.join(ROOT_DIR, 'public'),
    path.join(ROOT_DIR, 'supabase'),
    path.join(ROOT_DIR, 'scripts')
  ];

  let codeFiles = [];
  searchDirs.forEach(dir => {
    codeFiles = codeFiles.concat(getFilesRecursively(dir, CODE_EXTENSIONS));
  });

  // Filter out reports and the script itself to prevent false positives
  codeFiles = codeFiles.filter(file => {
    const filename = path.basename(file);
    return filename !== 'find-unused-images.js' && 
           filename !== 'unused-images-report.json' &&
           !file.includes('.next') &&
           !file.includes('.git') &&
           !file.includes('node_modules');
  });

  console.log(`Found ${codeFiles.length} files to scan for references.`);

  // Read all files content into memory
  const filesContent = codeFiles.map(file => {
    try {
      return {
        path: file,
        content: fs.readFileSync(file, 'utf8')
      };
    } catch (e) {
      return { path: file, content: '' };
    }
  });

  // Fetch references from database
  const dbContents = await fetchDatabaseImageReferences();

  // Find all image files
  const imageFiles = getFilesRecursively(PUBLIC_IMAGES_DIR, IMAGE_EXTENSIONS);
  
  // Get other images in public directory but NOT in public/images
  const publicFiles = fs.readdirSync(path.join(ROOT_DIR, 'public'));
  publicFiles.forEach(file => {
    const fullPath = path.join(ROOT_DIR, 'public', file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.png', '.jpeg', '.webp', '.svg'].includes(ext)) {
        imageFiles.push(fullPath);
      }
    }
  });

  console.log(`Found ${imageFiles.length} images to audit.`);

  const unusedImages = [];
  const usedImages = [];
  let totalImagesSize = 0;
  let totalUnusedSize = 0;

  imageFiles.forEach(imagePath => {
    const stat = fs.statSync(imagePath);
    totalImagesSize += stat.size;

    const relativePath = path.relative(ROOT_DIR, imagePath).replace(/\\/g, '/');
    const relativeToPublic = path.relative(path.join(ROOT_DIR, 'public'), imagePath).replace(/\\/g, '/');
    const filename = path.basename(imagePath);

    // We check if the filename or relativeToPublic is in any of the code files or database contents
    let isUsed = false;

    // Check references in code
    for (const fileObj of filesContent) {
      if (fileObj.path === imagePath) continue;

      if (
        fileObj.content.includes(filename) ||
        fileObj.content.includes(relativeToPublic) ||
        fileObj.content.includes('/' + relativeToPublic)
      ) {
        isUsed = true;
        break;
      }
    }

    // Check references in DB
    if (!isUsed) {
      for (const dbText of dbContents) {
        if (
          dbText.includes(filename) ||
          dbText.includes(relativeToPublic) ||
          dbText.includes('/' + relativeToPublic)
        ) {
          isUsed = true;
          break;
        }
      }
    }

    if (isUsed) {
      usedImages.push({ path: relativePath, size: stat.size });
    } else {
      unusedImages.push({ path: relativePath, size: stat.size, filename });
    }
  });

  return {
    unused: unusedImages,
    used: usedImages,
    totalImagesSize,
    unusedSize: unusedImages.reduce((sum, img) => sum + img.size, 0)
  };
}

scanReferences().then(result => {
  console.log('\n--- AUDIT RESULT ---');
  console.log(`Total Images Size: ${(result.totalImagesSize / (1024 * 1024)).toFixed(2)} MB (${result.totalImagesSize} bytes)`);
  console.log(`Unused Images Size: ${(result.unusedSize / (1024 * 1024)).toFixed(2)} MB (${result.unusedSize} bytes)`);
  console.log(`Unused Images Count: ${result.unused.length}`);
  console.log(`Used Images Count: ${result.used.length}`);

  console.log('\n--- TOP UNUSED IMAGES ---');
  result.unused
    .sort((a, b) => b.size - a.size)
    .slice(0, 30)
    .forEach(img => {
      console.log(`${(img.size / 1024).toFixed(1)} KB - ${img.path}`);
    });

  // Write JSON output for later use
  fs.writeFileSync(
    path.join(ROOT_DIR, 'scripts', 'unused-images-report.json'),
    JSON.stringify(result, null, 2),
    'utf8'
  );
  console.log('\nFull report written to scripts/unused-images-report.json');
}).catch(err => {
  console.error(err);
});
