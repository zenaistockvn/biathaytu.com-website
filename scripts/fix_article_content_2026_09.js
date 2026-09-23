/**
 * scripts/fix_article_content_2026_09.js
 *
 * Script dọn dẹp và chuẩn hóa nội dung bài viết trực tiếp trong database Postgres (Neon).
 *
 * ==============================================================================
 * LÝ DO LẶP CODE TỪ SRC/:
 * Repo biathaytu-web sử dụng Next.js 16 với ESM và TypeScript trong thư mục `src/`,
 * trong khi các tiện ích trong thư mục `scripts/` (như dump_data.js, sync_articles_to_db.js)
 * chạy độc lập trong môi trường Node.js CommonJS (CJS) không qua bundler.
 * Việc triển khai độc lập logic chuẩn hóa tại đây giúp script có thể chạy độc lập
 * ở bất kỳ môi trường CI/CD hoặc máy vận hành nào chỉ với Node.js và package `pg`,
 * mà không phụ thuộc vào TypeScript build/transpile toolchain.
 * ==============================================================================
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * - Chế độ Dry-Run (Mặc định, chỉ in ra thống kê, KHÔNG ghi vào DB):
 *     node scripts/fix_article_content_2026_09.js
 *
 * - Chế độ Ghi thực sự (Cần duyệt và kiểm tra kỹ trước khi chạy):
 *     node scripts/fix_article_content_2026_09.js --apply
 *
 * CHÚ Ý: Tuyệt đối không chạy cờ --apply khi chưa có sự phê duyệt từ chủ dự án.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 1. Đọc DATABASE_URL từ môi trường hoặc .env.local
let databaseUrl = process.env.DATABASE_URL;
const envPath = path.join(__dirname, '..', '.env.local');

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
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

// 2. Tải danh sách bài viết đã nghỉ / gộp để cập nhật link nội bộ
let retiredArticleMap = {};
const retiredConfigPath = path.join(__dirname, '..', 'src', 'config', 'retired-articles.json');
if (fs.existsSync(retiredConfigPath)) {
  try {
    retiredArticleMap = JSON.parse(fs.readFileSync(retiredConfigPath, 'utf8'));
  } catch (err) {
    console.warn('Cảnh báo: Không thể đọc src/config/retired-articles.json:', err.message);
  }
}

// 3. Mapping slug sản phẩm cũ -> mới (Phase A)
const LEGACY_PRODUCT_SLUG_MAP = {
  'benediktiner-weissbier-naturtrub-500ml': 'benediktiner-naturtrub-thung-12-chai-500ml',
  'bitburger-premium-pils-330ml': 'bitburger-premium-pils-thung-12-chai-330ml',
  'benediktiner-dunkel-500ml': 'benediktiner-dunkel-thung-12-chai-500ml',
  'bom-5l-benediktiner-weissbier': 'benediktiner-naturtrub-bom-5l',
};

// SKU tạm ẩn / không visible (không đặt thẻ <a> trỏ tới)
const HIDDEN_PRODUCT_SLUGS = new Set([
  'kostritzer-schwarzbier-bom-5l',
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
]);

// 4. Bảng vá nội dung Phụ lục 1 (Phase C.2)
const ARTICLE_TEXT_PATCHES = {
  'so-sanh-weissbier-vs-pilsner': [
    {
      find: 'lưu giữ toàn bộ vitamin B và những tinh tuý',
      replace: 'lưu giữ những tinh tuý',
    },
  ],
  'kham-pha-bia-thay-tu-benediktiner-weissbier-men-song-ettal': [
    {
      find: 'giúp giữ trọn vitamin B, axit amin và hương vị trái cây nguyên bản',
      replace: 'giúp giữ trọn hương vị trái cây nguyên bản',
    },
    {
      find: 'Bạn có thể đặt mua tại website biathaytu.com',
      replace: 'Bạn có thể xem thông tin sản phẩm tại website biathaytu.com',
    },
  ],
  'so-sanh-bia-lua-mi-benediktiner-va-pilsner-bitburger': [
    {
      find: 'và mang lại cảm giác giải nhiệt tức thì',
      replace: '',
    },
  ],
  'bia-thay-tu-la-gi-giai-dap-thac-mac': [
    {
      find: 'Bia được gọi là "bánh mì lỏng" (<em>flüssiges Brot</em>) — nguồn dinh dưỡng thiết yếu trong những tháng chay tịnh khi tu sĩ không ăn thức ăn rắn.',
      replace: '',
    },
    {
      find: 'Bia được gọi là "bánh mì lỏng" (<em>flüssiges Brot</em>), nguồn dinh dưỡng thiết yếu trong những tháng chay tịnh khi tu sĩ không ăn thức ăn rắn.',
      replace: '',
    },
    {
      find: 'và cung cấp vitamin B tự nhiên',
      replace: '',
    },
    {
      find: 'Bạn có thể đặt mua tại:',
      replace: 'Bạn có thể tìm hiểu và liên hệ tư vấn qua:',
    },
    {
      find: '<p>Giao hàng toàn quốc, ship COD mọi tỉnh thành.</p>',
      replace: '',
    },
  ],
  'huong-dan-chon-bia-duc-cho-nguoi-moi': [
    {
      find: 'Lớp men này cực kỳ giàu dinh dưỡng, vitamin nhóm B và là nguồn gốc tạo nên',
      replace: 'Lớp men này là nguồn gốc tạo nên',
    },
    {
      find: 'Mua một <a href="/san-pham">Combo Mix 2 vị</a>',
      replace: 'Bắt đầu với <a href="/san-pham">Combo Mix 2 vị</a>',
    },
  ],
  'nguon-goc-bia-thay-tu-tu-vien-ettal': [
    {
      find: 'Lý do? Trong suốt thời Trung Cổ, bia lúa mì được coi là "bánh mì lỏng" — <em>flüssiges Brot</em> — nguồn dinh dưỡng quan trọng trong những ngày chay tịnh.',
      replace: '',
    },
    {
      find: 'Lý do? Trong suốt thời Trung Cổ, bia lúa mì được coi là "bánh mì lỏng", <em>flüssiges Brot</em> nguồn dinh dưỡng quan trọng trong những ngày chay tịnh.',
      replace: '',
    },
    {
      find: ', bảo tồn vitamin B và hương vị nguyên bản',
      replace: ', giữ trọn hương vị nguyên bản',
    },
  ],
  'benediktiner-weissbier-400-nam-bia-tu-vien': [
    {
      find: 'Trong truyền thống Công giáo thời Trung Cổ, bia lúa mì được gọi là "bánh mì lỏng" — flüssiges Brot — thức uống bổ dưỡng dùng trong những ngày nhịn ăn chay tịnh.',
      replace: '',
    },
    {
      find: 'Trong truyền thống Công giáo thời Trung Cổ, bia lúa mì được gọi là "bánh mì lỏng", flüssiges Brot, thức uống bổ dưỡng dùng trong những ngày nhịn ăn chay tịnh.',
      replace: '',
    },
    {
      find: 'lớp men sống chứa vitamin B tự nhiên và tạo nên vị béo mượt đặc trưng',
      replace: 'lớp men sống tạo nên vị béo mượt đặc trưng',
    },
  ],
  'top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia': [
    {
      find: 'và dinh dưỡng tự nhiên',
      replace: '',
    },
    {
      find: 'làm suy giảm chất lượng dinh dưỡng',
      replace: '',
    },
  ],
  'su-that-ve-lop-men-van-duc-naturtrub': [
    {
      find: '— mất đi phần lớn hương vị và dinh dưỡng.',
      replace: '— mất đi phần lớn hương vị.',
    },
    {
      find: ', mất đi phần lớn hương vị và dinh dưỡng.',
      replace: ', mất đi phần lớn hương vị.',
    },
    {
      find: '| Dinh dưỡng | Ít hơn (men đã bị loại) | Nhiều vitamin B, axit amin |\n',
      replace: '',
    },
    {
      find: '| Dinh dưỡng | Ít hơn (men đã bị loại) | Nhiều vitamin B, axit amin |\r\n',
      replace: '',
    },
  ],
  'giai-ma-vi-dang-thanh-bitburger-premium-pilsner-duc': [
    {
      find: '<h3>Giá bán một két bia Bitburger Premium Pils chính hãng là bao nhiêu?</h3>\n<p>Tại biathaytu.com, một két 24 lon Bitburger Premium Pils 330ml có giá chính xác là 936.000đ và két 24 lon 500ml có giá là 1.200.000đ. Đơn hàng được miễn phí giao nhanh nội thành Hà Nội.</p>',
      replace: '',
    },
  ],
  'bitburger-premium-pils-bia-draft-so-1-nuoc-duc': [
    {
      find: '**Két 24 lon 330ml: 936.000đ** — trung bình chỉ 39.000đ/lon cho một dòng bia Pils #1 nước Đức.\n\n',
      replace: '',
    },
    {
      find: '**Két 24 lon 330ml: 936.000đ**, trung bình chỉ 39.000đ/lon cho một dòng bia Pils #1 nước Đức.\n\n',
      replace: '',
    },
  ],
  'dao-luat-tinh-khiet-1516-tuyen-ngon-dang-cap-bia-duc': [
    {
      find: 'Đặt mua tại biathaytu.com để luôn an tâm nhận sản phẩm nhập khẩu nguyên đai nguyên kiện chính hãng.',
      replace: '',
    },
  ],
  'bitburger-hanh-trinh-200-nam-bia-draft-so-1': [
    {
      find: '→ Đặt mua Bitburger Premium Pils chính hãng',
      replace: '→ Xem thông tin Bitburger Premium Pils',
    },
    {
      find: 'Đặt mua Bitburger Premium Pils chính hãng',
      replace: 'Xem thông tin Bitburger Premium Pils',
    },
  ],
  'cach-nuong-xuc-xich-thuringer-bratwurst-chuan-vi-duc': [
    {
      find: 'để đặt mua những khay xúc xích',
      replace: 'để được tư vấn về những khay xúc xích',
    },
  ],
  'bi-quyet-chon-do-nham-bia-duc-xuc-xich-wiener': [
    {
      find: 'Chúng tôi cung cấp sỉ lẻ xúc xích fresh chất lượng cao và giao hàng hỏa tốc trong vòng 2 giờ tại nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM).',
      replace: '',
    },
    {
      find: 'để được hỗ trợ ship nhanh chóng nhất và nhận những ưu đãi hấp dẫn!',
      replace: 'để được tư vấn.',
    },
  ],
  'nhiet-do-thuong-thuc-bia-duc-ly-tuong-nhat': [
    {
      find: 'Inbox cho Bia Thầy Tu để nhận thêm nhiều tip hay về nghệ thuật thưởng thức bia nhập khẩu.',
      replace: '',
    },
  ],
  'bia-khong-con-bitburger-0-0-lua-chon-dang-cap': [
    {
      find: 'Inbox ngay cho chúng tôi để bổ sung Bitburger 0.0% vào danh sách đồ uống cho tủ lạnh nhà bạn.',
      replace: '',
    },
  ],
  'kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam': [
    {
      find: 'Inbox "THỬ" — team Bia Thầy Tu sẽ gửi báo giá set trải nghiệm lần đầu.',
      replace: '',
    },
    {
      find: 'Inbox "THỬ", team Bia Thầy Tu sẽ gửi báo giá set trải nghiệm lần đầu.',
      replace: '',
    },
  ],
  'su-khac-biet-giua-bia-den-dunkel-va-bia-vang-naturtrub': [
    {
      find: 'Inbox kèm mô tả gu của bạn — mình sẽ tư vấn cá nhân ngay.',
      replace: '',
    },
    {
      find: 'Inbox kèm mô tả gu của bạn, mình sẽ tư vấn cá nhân ngay.',
      replace: '',
    },
  ],
  'giai-thuong-itqi-3-sao-benediktiner-weissbier': [
    {
      find: 'Inbox ngay để Bia Thầy Tu mang tận tay bạn trải nghiệm hương vị 3 sao quốc tế này.',
      replace: '',
    },
  ],
  'luat-tinh-khiet-1516-reinheitsgebot': [
    {
      find: 'Inbox ngay cho Bia Thầy Tu để nhận gợi ý dòng bia phù hợp nhất với phong cách tiếp khách của bạn.',
      replace: '',
    },
  ],
};

// 5. Danh sách các bài viết Phase B và Phase E cần lưu ý để lưu trữ (archived)
const RETIRED_SLUGS_LIST = [
  // Phase B (3 bài lệch định vị)
  'thu-vien-bia-tu-vien-ettal-cong-thuc-tram-nam',
  'bo-suu-tap-bia-thay-tu-monk-beer-collection',
  'bia-thay-tu-chimay-xanh-red-white',
  // Phase E (16 bài gộp / trùng lặp)
  'top-5-loai-bia-thay-tu-nhap-khau-ngon-nhat',
  'danh-gia-bia-thay-tu-benediktiner-co-ngon-khong',
  'review-bia-benediktiner-weissbier-duc-co-ngon-khong',
  'benediktiner-weissbier-bia-thay-tu-chinh-hang-duc',
  'bia-thay-tu-benediktiner-chinh-hang-mua-o-dau',
  'top-5-loai-bia-duc-nhap-khau-ngon-nhat-the-gioi',
  'kham-pha-cac-dong-bia-duc-nhap-khau-noi-tieng',
  'huong-dan-thuong-thuc-bia-duc-dung-chuan-chuyen-gia',
  'thuong-thuc-bia-duc-ngon-dung-dieu',
  'tai-sao-bia-duc-duoc-menh-danh-la-tinh-hoa-the-gioi',
  'lich-su-bia-duc-hon-500-nam-di-san',
  'cac-loai-bia-thay-tu-duc-bi-ha-lan',
  'nguon-goc-bia-thay-tu-trappist-abbey-beer',
  'trappist-abbey-beer-la-gi',
  'phan-biet-bia-trappist-va-abbey-beer',
  'so-sanh-bia-thay-tu-trappist-va-abbey-beer',
];

/**
 * Hàm chuẩn hóa content của một bài viết theo logic Phase A và Phase C.2.
 */
function cleanArticleContent(content, slug, validProductSlugs) {
  if (!content || typeof content !== 'string') return content;

  let sanitized = content;

  // C.2.1: Thay chuỗi \n literal bằng xuống dòng thật
  sanitized = sanitized.replace(/\\n/g, '\n');

  // C.2.2: Xóa thẻ <p> chứa ship hoả tốc (geo footer)
  sanitized = sanitized.replace(
    /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?ship\s*(?:hoả|hỏa|hoa)\s*tốc[\s\S]*?<\/p>\s*/gi,
    '',
  );

  // C.2.3: Áp dụng bảng vá Phụ lục 1
  if (slug && ARTICLE_TEXT_PATCHES[slug]) {
    for (const patch of ARTICLE_TEXT_PATCHES[slug]) {
      if (sanitized.includes(patch.find)) {
        sanitized = sanitized.split(patch.find).join(patch.replace);
      }
    }
  }

  // C.2.3 (đặc biệt): Cắt đoạn Men Sống
  if (slug === 'su-that-ve-lop-men-van-duc-naturtrub') {
    const startMarker = sanitized.includes('### Men Sống — "Vitamin Bia" Từ Thiên Nhiên')
      ? '### Men Sống — "Vitamin Bia" Từ Thiên Nhiên'
      : '### Men Sống: "Vitamin Bia" Từ Thiên Nhiên';
    const endMarker = '### Bia Lọc vs. Bia Không Lọc';
    const startIdx = sanitized.indexOf(startMarker);
    const endIdx = sanitized.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      sanitized = sanitized.slice(0, startIdx) + sanitized.slice(endIdx);
    }
  }

  // C.2.4: Dọn rác HTML rỗng và khoảng trắng
  sanitized = sanitized
    .replace(/<p\b[^>]*>\s*<\/p>/gi, '')
    .replace(/<p\b[^>]*>\s*<em>\s*<\/em>\s*<\/p>/gi, '')
    .replace(/<li\b[^>]*>\s*<\/li>/gi, '')
    .replace(/\n{3,}/g, '\n\n');

  // Phase A: Viết lại slug sản phẩm cũ sang slug mới
  for (const [legacySlug, newSlug] of Object.entries(LEGACY_PRODUCT_SLUG_MAP)) {
    sanitized = sanitized.replace(
      new RegExp(`((?:https?://(?:www\\.)?biathaytu\\.com)?/san-pham/)${legacySlug}(\\b|(?=[/"'?#]))`, 'g'),
      `$1${newSlug}`,
    );
  }

  // Bỏ thẻ <a> và Markdown link trỏ tới sản phẩm tạm ẩn / không visible
  sanitized = sanitized.replace(
    /<a\b([^>]*\bhref=["'](?:https?:\/\/(?:www\.)?biathaytu\.com)?\/san-pham\/([^"'/ ?#]+)[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi,
    (fullTag, _attrs, prodSlug, text) => {
      if (HIDDEN_PRODUCT_SLUGS.has(prodSlug) || (validProductSlugs && !validProductSlugs.has(prodSlug))) {
        return text;
      }
      return fullTag;
    },
  );

  sanitized = sanitized.replace(
    /\[([^\]]+)\]\((?:https?:\/\/(?:www\.)?biathaytu\.com)?\/san-pham\/([^)\s/?#]+)(?:\s+["'][^"']*["'])?\)/g,
    (fullMatch, text, prodSlug) => {
      if (HIDDEN_PRODUCT_SLUGS.has(prodSlug) || (validProductSlugs && !validProductSlugs.has(prodSlug))) {
        return text;
      }
      return fullMatch;
    },
  );

  // Phase B & E: Viết lại link trỏ tới bài viết đã gỡ/gộp sang đích mới
  for (const [retiredSlug, dest] of Object.entries(retiredArticleMap)) {
    sanitized = sanitized.replace(
      new RegExp(`(?:https?://(?:www\\.)?biathaytu\\.com)?/(?:kien-thuc|blog)/${retiredSlug}(?:/)?(?=[#?\\s"')>]|$)`, 'g'),
      dest,
    );
  }

  return sanitized;
}

async function main() {
  const isApply = process.argv.includes('--apply');

  console.log('='.repeat(70));
  console.log('SCRIPT CHUẨN HÓA DỮ LIỆU BÀI VIẾT TRONG POSTGRES (2026-09)');
  console.log(`Chế độ: ${isApply ? '>>> APPLY (GHI DATABASE) <<<' : 'DRY-RUN (CHỈ KIỂM TRA, KHÔNG GHI)'}`);
  console.log('='.repeat(70));

  if (!databaseUrl) {
    console.error('\n[LỖI] DATABASE_URL không tìm thấy trong biến môi trường hoặc .env.local.');
    console.error('Để chạy script, hãy cung cấp biến môi trường DATABASE_URL hoặc tạo file .env.local.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    query_timeout: 30000,
    statement_timeout: 30000,
  });

  try {
    console.log('\nĐang kết nối tới database...');
    await client.connect();
    console.log('Kết nối database thành công.');

    // Lấy danh sách sản phẩm hợp lệ để xác định link visible
    let validProductSlugs = null;
    try {
      const prodRes = await client.query('SELECT slug FROM products WHERE slug IS NOT NULL');
      validProductSlugs = new Set(prodRes.rows.map((r) => r.slug).filter((s) => !HIDDEN_PRODUCT_SLUGS.has(s)));
      console.log(`Đã tải ${validProductSlugs.size} slug sản phẩm hợp lệ từ database.`);
    } catch {
      console.warn('Không thể đọc bảng products từ DB; sử dụng danh sách mặc định.');
    }

    // Đọc tất cả bài viết từ seo_articles
    console.log('Đang đọc danh sách bài viết từ bảng seo_articles...');
    const articlesRes = await client.query('SELECT id, slug, title, content, status FROM seo_articles ORDER BY id ASC');
    const articles = articlesRes.rows;
    console.log(`Tìm thấy ${articles.length} bài viết trong seo_articles.\n`);

    const toUpdate = [];

    for (const article of articles) {
      const original = article.content || '';
      const cleaned = cleanArticleContent(original, article.slug, validProductSlugs);

      if (cleaned !== original) {
        toUpdate.push({
          id: article.id,
          slug: article.slug,
          title: article.title,
          originalLen: original.length,
          cleanedLen: cleaned.length,
          cleanedContent: cleaned,
        });
      }
    }

    console.log('-'.repeat(70));
    console.log(`KẾT QUẢ KIỂM TRA NỘI DUNG:`);
    console.log(`- Tổng số bài viết: ${articles.length}`);
    console.log(`- Số bài viết cần cập nhật content: ${toUpdate.length}`);
    console.log(`- Số bài viết giữ nguyên: ${articles.length - toUpdate.length}`);
    console.log('-'.repeat(70));

    if (toUpdate.length > 0) {
      console.log('\nChi tiết các bài viết sẽ được làm sạch:');
      for (const item of toUpdate) {
        const delta = item.cleanedLen - item.originalLen;
        const sign = delta > 0 ? `+${delta}` : `${delta}`;
        console.log(` • [${item.slug}] ${item.originalLen} -> ${item.cleanedLen} ký tự (${sign} ký tự)`);
      }
    }

    // Gợi ý lệnh SQL chuyển status cho Phase B & Phase E
    console.log('\n' + '='.repeat(70));
    console.log('[GỢI Ý SQL] Lệnh chuyển trạng thái bài viết đã nghỉ/gộp (Phase B & Phase E):');
    console.log('(Chủ dự án có thể chạy lệnh này khi thống nhất lưu trữ trên database)');
    console.log('-'.repeat(70));
    const slugsFormatted = RETIRED_SLUGS_LIST.map((s) => `  '${s}'`).join(',\n');
    console.log(`UPDATE seo_articles\nSET status = 'archived'\nWHERE slug IN (\n${slugsFormatted}\n);\n` + '='.repeat(70));

    if (!isApply) {
      console.log('\n[DRY RUN HOÀN TẤT] Không có thay đổi nào được ghi vào cơ sở dữ liệu.');
      console.log('Để thực thi các câu lệnh UPDATE, chạy lại script với cờ --apply:');
      console.log('  node scripts/fix_article_content_2026_09.js --apply\n');
      return;
    }

    // Chế độ APPLY: thực hiện transaction
    console.log('\n>>> ĐANG ÁP DỤNG THAY ĐỔI VÀO DATABASE QUA TRANSACTION <<<');
    await client.query('BEGIN');

    for (const item of toUpdate) {
      await client.query(
        'UPDATE seo_articles SET content = $1, updated_at = NOW() WHERE id = $2',
        [item.cleanedContent, item.id],
      );
    }

    await client.query('COMMIT');
    console.log(`\n[THÀNH CÔNG] Đã cập nhật nội dung cho ${toUpdate.length} bài viết trong bảng seo_articles!`);
  } catch (err) {
    if (isApply) {
      try {
        await client.query('ROLLBACK');
        console.error('\n[ROLLBACK] Đã hoàn tác mọi thay đổi do phát sinh lỗi.');
      } catch (rollbackErr) {
        console.error('Lỗi khi thực hiện rollback:', rollbackErr.message);
      }
    }
    console.error('\n[LỖI THỰC THI]', err);
    process.exitCode = 1;
  } finally {
    await client.end();
    console.log('Đã đóng kết nối database.');
  }
}

main();
