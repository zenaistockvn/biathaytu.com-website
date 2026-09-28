import articlesData from '@/data/articles.json';
import retiredArticlesData from '@/config/retired-articles.json';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';
import { COMPANY_CONFIG } from '@/config/company';
import { getArticleTopic } from '@/config/articleTopics';
import { getVisibleProducts, RENAMED_PRODUCT_SLUGS } from './products';
import { toSentenceCase, toSentenceCaseHtml } from './titleCase';

export const DEFAULT_TENANT_ID = 'biathaytu';

const RETIRED_ARTICLE_MAP: Record<string, string> = retiredArticlesData;
const RETIRED_ARTICLE_SLUGS = new Set(Object.keys(RETIRED_ARTICLE_MAP));

export interface Article {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  meta_description: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string | null;
  thumbnail_url: string | null;
  tenant_id: string;
  status: string;
  /** Dòng ghi nguồn ảnh bìa, bắt buộc với ảnh giấy phép CC BY / CC BY-SA. */
  image_credit?: string | null;
}

const COVER_DIR = '/images/articles/kien-thuc';

/**
 * Ảnh bìa riêng từng bài (09/2026). Database không có ảnh nên gán theo slug khi render.
 * Nguồn và giấy phép từng ảnh: public/images/articles/kien-thuc/SOURCES.md.
 */
export const ARTICLE_COVERS: Record<string, { src: string; credit?: string }> = {
  'nguon-goc-bia-thay-tu-tu-vien-ettal': { src: '/images/brand/benediktiner-official/ettal-monastery.jpg' },
  'bia-den-tu-vien-benediktiner-dunkel-mach-nha-rang-caramel': { src: `${COVER_DIR}/bia-den-tu-vien-benediktiner-dunkel-mach-nha-rang-caramel-v2.webp` },
  'bitburger-hanh-trinh-200-nam-bia-draft-so-1': { src: `${COVER_DIR}/bitburger-hanh-trinh-200-nam-bia-draft-so-1.webp` },
  'huong-dan-chon-bia-duc-cho-nguoi-moi': { src: `${COVER_DIR}/huong-dan-chon-bia-duc-cho-nguoi-moi-v2.webp` },
  'top-7-mon-viet-ket-hop-bia-duc-food-pairing': { src: `${COVER_DIR}/top-7-mon-viet-ket-hop-bia-duc-food-pairing.webp` },
  'cach-bao-quan-bia-nhap-khau-dung-cach': { src: `${COVER_DIR}/cach-bao-quan-bia-nhap-khau-dung-cach.webp` },
  'su-tran-trong-nguyen-ban-bia-giao-thoa': { src: `${COVER_DIR}/su-tran-trong-nguyen-ban-bia-giao-thoa.webp` },
  'ly-uong-bia-lua-mi-weizen-glass': { src: `${COVER_DIR}/ly-uong-bia-lua-mi-weizen-glass.webp` },
  'nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu': { src: `${COVER_DIR}/nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu.webp` },
  'huong-chuoi-chin-va-dinh-huong-trong-bia-lua-mi': { src: `${COVER_DIR}/huong-chuoi-chin-va-dinh-huong-trong-bia-lua-mi.webp` },
  'phan-biet-weissbier-dunkel-festbier': { src: `${COVER_DIR}/phan-biet-weissbier-dunkel-festbier-v2.webp` },
  'su-that-ve-lop-men-van-duc-naturtrub': { src: `${COVER_DIR}/su-that-ve-lop-men-van-duc-naturtrub.webp` },
  'dao-luat-tinh-khiet-1516-reinheitsgebot': {
    src: `${COVER_DIR}/dao-luat-tinh-khiet-1516-reinheitsgebot.webp`,
    credit: 'Ảnh: Luidger, Wikimedia Commons, CC BY-SA 3.0',
  },
};

const OUT_OF_SCOPE_ARTICLE_PATTERN =
  /(?:chimay|la[-\s]*trappe|rochefort|bia[-\s]*b[iỉ])/i;
const OUT_OF_SCOPE_BEER_MENTION_PATTERN =
  /(?:chimay|la\s*trappe|rochefort)/i;
const ARTICLE_BLOCK_PATTERN = /<(p|li|h2|h3|h4|figure)\b[^>]*>[\s\S]*?<\/\1>/gi;

/** Trang đã gỡ, link trong bài viết trỏ thẳng tới trang thay thế (khớp redirect 301 trong next.config.js). */
const RETIRED_PAGE_MAP: Record<string, string> = {
  '/bia-duc-nhap-khau': '/san-pham',
  '/nhan-uu-dai': '/san-pham',
};

const LEGACY_PRODUCT_SLUG_MAP: Record<string, string> = {
  'benediktiner-weissbier-naturtrub-500ml': 'benediktiner-naturtrub-thung-12-chai-500ml',
  'bitburger-premium-pils-330ml': 'bitburger-premium-pils-thung-12-chai-330ml',
  'benediktiner-dunkel-500ml': 'benediktiner-dunkel-thung-12-chai-500ml',
  'bom-5l-benediktiner-weissbier': 'benediktiner-naturtrub-bom-5l',
  ...RENAMED_PRODUCT_SLUGS,
};

/**
 * Tài liệu nội bộ (marketing) nằm trong bảng seo_articles với status 'published'.
 * Giữ trong database cho nội bộ đọc, không hiển thị trên website, sitemap hay llms.txt.
 */
export const INTERNAL_ONLY_ARTICLE_SLUGS = new Set(['giai-ma-thuat-toan-facebook-2025-2026']);

function isBenediktinerArticle(article: Article): boolean {
  return !OUT_OF_SCOPE_ARTICLE_PATTERN.test(`${article.title} ${article.slug ?? ''}`);
}

/**
 * Tiêu đề và mô tả sửa theo slug. Áp khi render vì `npm run build` đổ lại articles.json từ database,
 * nên sửa thẳng trong file JSON sẽ mất ở lần deploy sau (audit /kien-thuc 09/2026).
 * Bỏ từ "số 1", "ngon nhất" không có căn cứ; bỏ câu chê bia khác, câu về dưỡng chất; sửa 400/700 năm.
 */
export const ARTICLE_META_OVERRIDES: Record<string, { title?: string; meta_description?: string }> = {
  'bitburger-hanh-trinh-200-nam-bia-draft-so-1': {
    title: 'Bitburger Premium Pils: hơn 200 năm bia Pils vùng Eifel',
    meta_description:
      'Bitburger Premium Pils: hành trình hơn 200 năm từ xưởng bia nhỏ ở Bitburg, vùng Eifel. Tìm hiểu kỹ thuật Double Hopping và tasting notes.',
  },
  'nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu': {
    title: 'Uống bia Đức ở nhiệt độ bao nhiêu là vừa?',
    meta_description:
      'Nên uống bia Đức ở nhiệt độ nào? Bảng nhiệt độ cho từng dòng bia và lý do không nên cho đá vào bia.',
  },
  'dao-luat-tinh-khiet-1516-reinheitsgebot': {
    title: 'Đạo luật Tinh khiết 1516 (Reinheitsgebot): nền tảng của bia Đức',
    meta_description:
      'Tìm hiểu Đạo luật Tinh khiết 1516 (Reinheitsgebot), một trong những quy định về thực phẩm lâu đời nhất, và cách nó định hình bia Đức.',
  },
  'huong-chuoi-chin-va-dinh-huong-trong-bia-lua-mi': {
    title: 'Giải mã hương chuối chín và đinh hương trong bia lúa mì',
  },
  'nguon-goc-bia-thay-tu-tu-vien-ettal': {
    meta_description:
      'Khám phá lịch sử gần 700 năm của Tu viện Ettal, nơi khởi nguồn bia Benediktiner Weissbier. Từ sắc lệnh hoàng gia 1330 đến chai bia trên bàn tiệc Việt Nam.',
  },
  'su-tran-trong-nguyen-ban-bia-giao-thoa': {
    meta_description:
      'Vì sao người yêu bia ngày càng tìm về những dòng bia nấu theo công thức truyền thống, chỉ từ nước, mạch nha, hoa bia và men.',
  },
  'phan-biet-weissbier-dunkel-festbier': {
    meta_description:
      'Cẩm nang phân biệt 3 dòng bia nổi tiếng của Đức: Weissbier (lúa mì), Dunkel (bia đen) và Festbier (bia lễ hội Oktoberfest).',
  },
  'su-that-ve-lop-men-van-duc-naturtrub': {
    meta_description:
      'Naturtrüb là gì? Vì sao lớp men sống làm bia lúa mì Đức đục mờ và đậm hương hơn bia đã lọc.',
  },
};

export const ARTICLE_TEXT_PATCHES: Record<string, Array<{ find: string; replace: string }>> = {
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
    {
      find: 'Người mới bắt đầu uống bia, phụ nữ, người không thích vị đắng.',
      replace: 'Người mới bắt đầu uống bia, người không thích vị đắng.',
    },
  ],
  // Không khẳng định bia giữ nguyên hương vị 400 năm, không viện dẫn "hàng triệu người".
  'su-tran-trong-nguyen-ban-bia-giao-thoa': [
    {
      find: 'Bia mà 400 năm trước cũng đã có đúng hương vị như ngày hôm nay.',
      replace: 'Bia giữ công thức truyền thống qua nhiều thế kỷ.',
    },
    {
      find: ' Hàng triệu người Đức đã xác nhận.',
      replace: '',
    },
    {
      find: 'Đó không phải marketing, đó là sự thật có chứng từ, có di tích, có dòng tu sĩ đã gìn giữ.',
      replace: 'Lịch sử ấy vẫn còn di tích và dòng tu sĩ gìn giữ đến hôm nay.',
    },
  ],
  'nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu': [
    {
      find: 'Đá tan tạo ra nước, pha loãng nồng độ bia. Một ly bia 5.4% ABV có thể giảm xuống 3-4% chỉ sau 10 phút, kèm theo đó là hương vị bị nhạt đi tương ứng.',
      replace: 'Đá tan tạo ra nước, làm bia loãng dần: cả nồng độ lẫn hương vị đều nhạt đi.',
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
    // Không so sánh với bia Việt Nam; "số 1" ghi rõ là theo nhà sản xuất.
    {
      find: '4.8% ABV, nhẹ hơn hầu hết bia Việt Nam',
      replace: '4.8% ABV',
    },
    {
      find: '<h2>Bia Draft số 1 nước Đức</h2>',
      replace: '<h2>Bia tươi quen thuộc ở Đức</h2>',
    },
    {
      find: 'Bitburger giữ vị trí <strong>bia draft (bia tươi) được rót nhiều nhất tại Đức</strong>',
      replace: 'Theo nhà sản xuất, Bitburger là <strong>bia tươi (draft) được rót nhiều nhất tại Đức</strong>',
    },
    {
      find: '<p><strong>Bitburger vs bia Việt Nam?</strong><br/>Bitburger có nồng độ cồn thấp hơn (4.8% vs 5.0-5.3% của bia Việt), vị đắng thanh hơn (không gắt), và hoàn toàn không có phụ gia hay chất bảo quản nhờ tuân thủ Reinheitsgebot.</p>',
      replace: '',
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

export function sanitizeArticleContent(content: string | null, slug?: string | null): string | null {
  if (!content) return content;

  let sanitized = content;

  // C.2.1: Thay mọi chuỗi \ + n (literal) bằng ký tự xuống dòng thật
  sanitized = sanitized.replace(/\\n/g, '\n');

  // Tiêu đề con trong database còn Viết Hoa Mỗi Chữ: đổi về dạng câu trước khi áp bảng vá bên dưới.
  sanitized = sanitized
    .replace(/(<h([1-6])\b[^>]*>)([\s\S]*?)(<\/h\2>)/gi, (_, open: string, _level: string, body: string, close: string) =>
      open + toSentenceCaseHtml(body) + close)
    .replace(/^(#{1,6}[ \t]+)(.+)$/gm, (_, hashes: string, body: string) => hashes + toSentenceCaseHtml(body));

  // C.2.2: Xóa nguyên thẻ <p ...>...</p> nào chứa ship hoả tốc / ship hỏa tốc (đoạn geo footer)
  sanitized = sanitized.replace(
    /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?ship\s*(?:hoả|hỏa|hoa)\s*tốc[\s\S]*?<\/p>\s*/gi,
    '',
  );

  // C.2.3: Áp dụng bảng vá ở Phụ lục 1 (theo từng slug, dùng split(find).join(replace))
  if (slug && ARTICLE_TEXT_PATCHES[slug]) {
    for (const patch of ARTICLE_TEXT_PATCHES[slug]) {
      if (sanitized.includes(patch.find)) {
        sanitized = sanitized.split(patch.find).join(patch.replace);
      }
    }
  }

  // C.2.3 (đặc biệt cho su-that-ve-lop-men-van-duc-naturtrub): cắt đoạn Men Sống.
  // Không phân biệt chữ hoa: database ghi 'Men Sống: "Vitamin Bia"', repo ghi 'Men sống: "vitamin bia"'.
  if (slug === 'su-that-ve-lop-men-van-duc-naturtrub') {
    const start = /^###\s+Men sống\s*[:—,]\s*"vitamin bia" từ thiên nhiên/im.exec(sanitized);
    const end = /^###\s+Bia lọc vs\. bia không lọc/im.exec(sanitized);
    if (start && end && end.index > start.index) {
      sanitized = sanitized.slice(0, start.index) + sanitized.slice(end.index);
    }
  }

  // C.2.4: Sau khi vá, xóa các khối rỗng còn lại
  sanitized = sanitized
    .replace(/<p\b[^>]*>\s*<\/p>/gi, '')
    .replace(/<p\b[^>]*>\s*<em>\s*<\/em>\s*<\/p>/gi, '')
    .replace(/<li\b[^>]*>\s*<\/li>/gi, '')
    .replace(/\n{3,}/g, '\n\n');

  // Khối lọc bia ngoài phạm vi & địa chỉ / hotline
  sanitized = sanitized
    .replace(ARTICLE_BLOCK_PATTERN, (block) =>
      OUT_OF_SCOPE_BEER_MENTION_PATTERN.test(block) ? '' : block,
    )
    .replace(
      /659A\s+Lạc Long Quân(?:,\s*(?:Phường\s+)?Xuân La)?(?:,\s*(?:Quận\s+)?Tây Hồ)?(?:,\s*Hà Nội)?/gi,
      COMPANY_CONFIG.showroomAddress,
    )
    // Website không bán hàng trực tuyến (chưa đăng ký với Bộ Công Thương).
    .replace(/\s+hoặc đặt trực tuyến tại website chính thức (?:www\.)?biathaytu\.com(?:\.vn)?/gi, '')
    // Địa chỉ showroom trước 27/09/2026; bài viết trong database vẫn ghi địa chỉ này.
    .replace(/(?:số\s+)?26 Vạn Phúc,\s*Ba Đình,\s*Hà Nội/gi, COMPANY_CONFIG.showroomAddress)
    .replace(
      /Showroom Bia Thầy Tu Lạc Long Quân/gi,
      `Showroom Bia Thầy Tu tại ${COMPANY_CONFIG.showroomAddress}`,
    )
    .replace(/0899(?:[\s.]*)191(?:[\s.]*)313/g, COMPANY_CONFIG.hotline)
    .replace(/0899(?:[\s.]*)19(?:[\s.]*)13(?:[\s.]*)13/g, COMPANY_CONFIG.hotline);

  // Domain chính là biathaytu.com.vn: link nội bộ tuyệt đối (.com hay .com.vn) đổi thành đường dẫn tương đối
  // để không đi vòng qua redirect; tên miền nhắc trong chữ đổi sang domain chính.
  sanitized = sanitized
    .replace(/((?:href=["']|\]\())https?:\/\/(?:www\.)?biathaytu\.com(?:\.vn)?(?=[/"')])/gi, '$1')
    .replace(/((?:href=["']|\]\())(?=["')])/g, '$1/')
    .replace(/(?<![\w@./-])(?:www\.)?biathaytu\.com(?!\.vn|[\w-])/gi, 'biathaytu.com.vn');

  for (const [retiredPath, destination] of Object.entries(RETIRED_PAGE_MAP)) {
    sanitized = sanitized.replace(
      // Chỉ khớp khi đường dẫn đứng đầu href="..." hoặc (...) của markdown, không khớp giữa slug khác.
      new RegExp(`((?:href=["']|\\]\\()(?:https?://(?:www\\.)?biathaytu\\.com)?)${retiredPath}(?=[/"'?#)])`, 'g'),
      `$1${destination}`,
    );
  }

  // Phase A: Viết lại slug sản phẩm cũ sang slug mới
  for (const [legacySlug, newSlug] of Object.entries(LEGACY_PRODUCT_SLUG_MAP)) {
    sanitized = sanitized.replace(
      new RegExp(`((?:https?://(?:www\\.)?biathaytu\\.com)?/san-pham/)${legacySlug}(\\b|(?=[/"'?#]))`, 'g'),
      `$1${newSlug}`,
    );
  }

  // Bỏ thẻ <a> và Markdown link trỏ tới sản phẩm không visible (ví dụ SKU tạm ẩn)
  const visibleProductSlugs = new Set(getVisibleProducts().map((p) => p.slug));

  sanitized = sanitized.replace(
    /<a\b([^>]*\bhref=["'](?:https?:\/\/(?:www\.)?biathaytu\.com)?\/san-pham\/([^"'/ ?#]+)[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi,
    (fullTag, _attrs, prodSlug, text) => {
      if (!visibleProductSlugs.has(prodSlug)) {
        return text;
      }
      return fullTag;
    },
  );

  sanitized = sanitized.replace(
    /\[([^\]]+)\]\((?:https?:\/\/(?:www\.)?biathaytu\.com)?\/san-pham\/([^)\s/?#]+)(?:\s+["'][^"']*["'])?\)/g,
    (fullMatch, text, prodSlug) => {
      if (!visibleProductSlugs.has(prodSlug)) {
        return text;
      }
      return fullMatch;
    },
  );

  // Phase B: Viết lại link tới các bài viết đã gỡ/gộp sang đích tương ứng
  for (const [retiredSlug, dest] of Object.entries(RETIRED_ARTICLE_MAP)) {
    sanitized = sanitized.replace(
      new RegExp(`(?:https?://(?:www\\.)?biathaytu\\.com)?/(?:kien-thuc|blog)/${retiredSlug}(?:/)?(?=[#?\\s"')>]|$)`, 'g'),
      dest,
    );
  }

  return sanitized;
}

function countWords(content: string | null): number {
  if (!content) return 0;
  const plainText = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>|]/g, ' ')
    .trim();
  if (!plainText) return 0;
  return plainText.split(/\s+/).filter(Boolean).length;
}

const PUBLISHED_ARTICLES: Article[] = (articlesData as unknown as Article[])
  .filter(
    (article) =>
      article.tenant_id === DEFAULT_TENANT_ID &&
      article.status === 'published' &&
      !INTERNAL_ONLY_ARTICLE_SLUGS.has(article.slug ?? '') &&
      !RETIRED_ARTICLE_SLUGS.has(article.slug ?? '') &&
      isBenediktinerArticle(article),
  )
  .map((article) => {
    const sanitizedContent = sanitizeArticleContent(article.content, article.slug);
    const override = ARTICLE_META_OVERRIDES[article.slug ?? ''];
    const cover = ARTICLE_COVERS[article.slug ?? ''];
    return {
      ...article,
      thumbnail_url: cover?.src ?? article.thumbnail_url,
      image_credit: cover?.credit ?? null,
      title: override?.title ?? toSentenceCase(toBrochureMetadataCopy(article.title) || article.title),
      content: sanitizedContent,
      word_count: countWords(sanitizedContent),
      meta_description:
        override?.meta_description ?? (toBrochureMetadataCopy(article.meta_description) || article.meta_description),
    };
  })
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export function getPublishedArticles(): Article[] {
  return PUBLISHED_ARTICLES;
}

export function getArticleBySlugOrId(key: string): Article | null {
  return PUBLISHED_ARTICLES.find((a) => a.slug === key || a.id === key) ?? null;
}

/** Bài cùng chủ đề trước (mới nhất trước), thiếu thì bù bằng bài mới nhất của chủ đề khác. */
export function getRelatedArticles(article: Pick<Article, 'id' | 'title'>, limit = 3): Article[] {
  const topic = getArticleTopic(article.title).id;
  const others = PUBLISHED_ARTICLES.filter((a) => a.id !== article.id);
  const sameTopic = others.filter((a) => getArticleTopic(a.title).id === topic);
  return [...sameTopic, ...others.filter((a) => !sameTopic.includes(a))].slice(0, limit);
}

/** Trường thẻ bài viết cần; không gửi nội dung bài xuống trình duyệt. */
export function toArticleSummary(article: Article) {
  const { id, title, slug, meta_description, word_count, created_at, thumbnail_url } = article;
  return { id, title, slug, meta_description, word_count, created_at, thumbnail_url };
}
