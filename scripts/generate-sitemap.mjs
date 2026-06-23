import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://www.biathaytu.com';
const CONTENT_LAST_UPDATED = new Date('2026-06-14').toISOString().split('T')[0];

const staticRoutes = [
  { url: '', changefreq: 'daily', priority: '1.0' },
  { url: '/san-pham', changefreq: 'weekly', priority: '0.8' },
  { url: '/kien-thuc', changefreq: 'daily', priority: '0.8' },
  { url: '/thuong-hieu', changefreq: 'monthly', priority: '0.5' },
  { url: '/lien-he', changefreq: 'monthly', priority: '0.5' },
];

const landingPages = [
  'bia-thay-tu-la-gi',
  'bia-benediktiner-chinh-hang',
  'mua-bia-benediktiner-chinh-hang',
  'bia-duc-nhap-khau',
  'benediktiner-weissbier-naturtrub',
  'benediktiner-dunkel',
  'bom-bia-5l-benediktiner',
  'bitburger-premium-pils',
  'bia-duc-cho-nha-hang-khach-san',
  'qua-tang-bia-duc',
  'food-pairing-bia-duc',
  'huong-dan-rot-bia-lua-mi',
  'bang-gia-si-dai-ly',
  'chung-nhan-nhap-khau-chinh-hang',
  've-chung-toi',
];

async function generate() {
  console.log('⏳ Starting dynamic sitemap generation...');

  try {
    const root = process.cwd();
    const productsPath = path.join(root, 'src', 'data', 'products.json');
    const articlesPath = path.join(root, 'src', 'data', 'articles.json');

    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Static Routes
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${route.url}</loc>\n`;
      xml += `    <lastmod>${CONTENT_LAST_UPDATED}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // 2. Landing Pages
    for (const slug of landingPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/${slug}</loc>\n`;
      xml += `    <lastmod>${CONTENT_LAST_UPDATED}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    // 3. Dynamic Products
    for (const product of products) {
      const slug = product.slug || product.id;
      const lastMod = product.updated_at ? product.updated_at.split('T')[0] : CONTENT_LAST_UPDATED;
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/san-pham/${slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    // 4. Dynamic Articles
    for (const article of articles) {
      const slug = article.slug || article.id;
      const lastMod = article.updated_at ? article.updated_at.split('T')[0] : CONTENT_LAST_UPDATED;
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/kien-thuc/${slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += '</urlset>\n';

    const publicDir = path.join(root, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
    console.log('✅ Sitemap.xml generated successfully in public/sitemap.xml!');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generate();
