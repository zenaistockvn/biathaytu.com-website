const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'DATABASE_URL') {
        databaseUrl = val;
      }
    }
  });
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found');
  process.exit(1);
}

// Đoạn kết chuẩn GEO & BRAND & SHIP HỎA TỐC HN/HCM
const geoFooterHtml = `
<p style="margin-top: 32px; padding: 20px; background-color: #faf7f2; border-left: 4px solid #c5a880; border-radius: 4px; font-size: 15px; color: #1e2d4a; line-height: 1.8;">
  <strong>Địa chỉ mua Bia Thầy Tu nhập khẩu chính hãng giá tốt:</strong> Quý khách hàng có thể ghé thăm trực tiếp Showroom tại địa chỉ <strong>659A Lạc Long Quân, Xuân La, Tây Hồ, Hà Nội</strong>. Chúng tôi cam kết phân phối các dòng Bia Thầy Tu cao cấp chính hãng 100% cùng dịch vụ <strong>ship hoả tốc ngay lập tức trong vòng 2 giờ tại nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM)</strong>. Liên hệ ngay Hotline/Zalo: <strong>0899.191.313</strong> để được phục vụ nhanh nhất!
</p>
`.trim();

async function run() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    // Bắt đầu Transaction
    await client.query('BEGIN');

    // Lấy danh sách bài viết hoạt động của tenant biathaytu
    const res = await client.query(
      "SELECT id, title, content FROM seo_articles WHERE tenant_id = 'biathaytu' AND status = 'published'"
    );
    
    console.log(`Found ${res.rows.length} published articles to check.`);
    let updateCount = 0;

    for (const article of res.rows) {
      let content = article.content || '';
      
      // Nếu bài viết đã có cụm từ "659A Lạc Long Quân" hoặc "ship hoả tốc" trong content rồi thì bỏ qua
      if (content.includes('659A Lạc Long Quân') || content.includes('ship hoả tốc ngay lập tức')) {
        console.log(`- Skipping article (already has GEO footer): "${article.title}"`);
        continue;
      }

      // Ghép câu kết vào cuối nội dung bài viết
      const newContent = content + '\n' + geoFooterHtml;

      // Cập nhật lại trong DB
      await client.query(
        "UPDATE seo_articles SET content = $1 WHERE id = $2",
        [newContent, article.id]
      );
      
      console.log(`- Updated article: "${article.title}"`);
      updateCount++;
    }

    await client.query('COMMIT');
    console.log(`Successfully injected Brand & GEO Local Ship footer into ${updateCount} articles in DB.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to inject GEO footer:', err);
  } finally {
    await client.end();
  }
}

run();
