import articlesData from '@/data/articles.json';
import retiredArticlesData from '@/config/retired-articles.json';
import renamedArticleSlugs from '@/config/renamed-article-slugs.json';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';
import { COMPANY_CONFIG } from '@/config/company';
import { getArticleTopic } from '@/config/articleTopics';
import { getVisibleProducts, RENAMED_PRODUCT_SLUGS } from './products';
import { toSentenceCase, toSentenceCaseHtml } from './titleCase';

export const DEFAULT_TENANT_ID = 'biathaytu';

const RETIRED_ARTICLE_MAP: Record<string, string> = retiredArticlesData;
const RETIRED_ARTICLE_SLUGS = new Set(Object.keys(RETIRED_ARTICLE_MAP));

/**
 * Slug database → slug hiển thị; slug cũ chuyển 301 trong next.config.js. Các bảng vá, ảnh bìa, mô tả
 * trong file này vẫn khoá theo slug database.
 */
export const RENAMED_ARTICLE_SLUGS: Readonly<Record<string, string>> = renamedArticleSlugs;

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
      'Bitburger Premium Pils: hơn 200 năm từ xưởng bia nhỏ ở Bitburg, vùng Eifel. Lịch sử, hoa bia Siegelhopfen và tasting notes.',
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
      'Lịch sử gần 700 năm của Tu viện Ettal, nơi có công thức và men của bia Benediktiner Weissbier. Từ sắc lệnh hoàng gia 1330 đến chai bia trên bàn tiệc Việt Nam.',
  },
  'su-tran-trong-nguyen-ban-bia-giao-thoa': {
    meta_description:
      'Vì sao người yêu bia ngày càng tìm về những dòng bia nấu theo công thức truyền thống, chỉ từ nước, mạch nha, hoa bia và men.',
  },
  'phan-biet-weissbier-dunkel-festbier': {
    meta_description:
      'Cẩm nang phân biệt 3 dòng bia nổi tiếng của Đức: Weissbier (lúa mì), Dunkel (bia đen) và Festbier (bia lễ hội Oktoberfest).',
  },
  'top-7-mon-viet-ket-hop-bia-duc-food-pairing': {
    title: 'Top 7 món Việt hợp với bia Đức: hướng dẫn food pairing',
    meta_description:
      '7 món Việt hợp với bia Đức: phở gà với Weissbier, chả giò với Pilsner, bò lúc lắc với Dunkel. Vì sao hợp và cách dùng.',
  },
  'bia-den-tu-vien-benediktiner-dunkel-mach-nha-rang-caramel': {
    meta_description:
      'Benediktiner Dunkel: bia lúa mì sẫm màu, hương mạch nha rang và caramel, độ đắng thấp. Cách thưởng thức và món nướng hợp vị.',
  },
  'su-that-ve-lop-men-van-duc-naturtrub': {
    meta_description:
      'Naturtrüb là gì? Vì sao lớp men làm bia lúa mì Đức đục mờ và đậm hương hơn bia đã lọc.',
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

/**
 * Rà soát tuân thủ 10/2026 (luật 44/2019, NĐ 24/2020, website không bán online, bảng sự thật).
 * Benediktiner ủ tại Lich với men hầm tu viện Ettal, không dùng nước Alps (bitburger-international.com);
 * xuất khẩu hơn 50 nước; Bitburger do gia đình Simon điều hành đời thứ bảy, đối tác DFB 1992-2018 và từ 04/2025
 * (bitburger.de, báo chí ngành); craft beer ở Đức khoảng 1% thị trường; Séc, không phải Đức, uống bia nhiều nhất châu Âu.
 * `find` khớp nội dung sau bước đổi tiêu đề con về dạng câu, trước bước viết lại link.
 */
const COMPLIANCE_PATCHES_2026_10: Record<string, Array<{ find: string; replace: string }>> = {
  'bia-den-tu-vien-benediktiner-dunkel-mach-nha-rang-caramel': [
    { find: 'lại là người bạn đồng hành hoàn hảo cho những buổi tối se lạnh', replace: 'lại hợp với những buổi tối se lạnh' },
    {
      find: '<p>Khác với các dòng bia đen công nghiệp vốn có vị đắng cháy gắt, Dunkel của tu viện Ettal mang lại vị mượt mà đầy miệng (full-bodied) and hậu vị rất êm, sạch sẽ nhờ sự cân bằng xuất sắc giữa mạch nha rang cao cấp và hoa bia đặc hữu của vùng Bavaria.</p>',
      replace:
        '<p>Benediktiner Dunkel có vị mượt, đầy miệng (full-bodied) và hậu vị êm, sạch nhờ cân bằng giữa mạch nha rang và hoa bia. Bia được ủ tại Lich, bang Hessen, theo công thức gốc dòng Biển Đức, với men từ hầm tu viện Ettal.</p>',
    },
    { find: '<h2>Quy trình rang mạch nha thủ công độc bản</h2>', replace: '<h2>Quy trình rang mạch nha</h2>' },
    { find: 'các tu sĩ dòng Benedict đã sử dụng kỹ thuật rang mạch nha', replace: 'nhà bia sử dụng kỹ thuật rang mạch nha' },
    { find: 'bia chỉ sử dụng nước suối Alps, mạch nha, hoa bia và men sống.', replace: 'bia chỉ sử dụng nước, mạch nha, hoa bia và men.' },
    {
      find: 'Sự an tâm và độ sạch của dòng bia này là lý do khiến người sành bia luôn đánh giá cao ',
      replace: 'Đó cũng là điều nhiều người tìm ở ',
    },
    { find: ' hơn các dòng bia đen pha tạp chất khác.', replace: '.' },
    { find: '<h2>Món ăn kết hợp hoàn hảo cùng Benediktiner Dunkel</h2>', replace: '<h2>Món ăn hợp với Benediktiner Dunkel</h2>' },
    {
      find: 'là chương nhạc trầm ấm và có chiều sâu nhất trong bản giao hưởng bia tu viện Đức.',
      replace: 'có vị đậm và sâu nhất trong các dòng Benediktiner.',
    },
    { find: '(IBU 12)', replace: '(IBU 13)' },
    { find: ', đem lại cảm giác ấm áp vừa phải mà không gây mệt mỏi.', replace: '.' },
  ],
  'bitburger-hanh-trinh-200-nam-bia-draft-so-1': [
    { find: 'Câu slogan huyền thoại này ra đời năm 1951', replace: 'Câu khẩu hiệu này ra đời năm 1951' },
    { find: ', nguyên liệu hoàn hảo cho bia.', replace: '.' },
    { find: '<h2>Kỹ thuật Double Hopping: Bí mật độc quyền</h2>', replace: '<h2>Hoa bia thêm hai lần</h2>' },
    {
      find: 'Điều khiến Bitburger khác biệt với hàng nghìn Pilsner khác trên thế giới là kỹ thuật <strong>Double Hopping</strong> hoa bia được thêm vào ở hai thời điểm khác nhau trong quá trình nấu:',
      replace: 'Hoa bia Siegelhopfen của Bitburger, trồng ở vùng Hallertau (Bavaria) và Holsthum (Nam Eifel), được thêm vào ở hai thời điểm trong quá trình nấu:',
    },
    {
      find: 'Mỗi ngụm Bitburger kết thúc bằng cảm giác "muốn uống thêm", điều mà ít Pilsner nào đạt được.',
      replace: 'Hậu vị khô và sạch, vị đắng không đọng lại lâu.',
    },
    {
      find: ' với hơn 1 triệu hectoliter bia keg được phân phối mỗi năm. Ở Đức, không có quán bia nào, sân vận động nào, hay nhà hàng lớn nào không có Bitburger trong menu.',
      replace: ' (trên bitburger.de, hãng gọi là &quot;das meistgezapfte Premium Pils an deutschen Theken&quot;).',
    },
    {
      find: '<p>Thương hiệu cũng là đối tác chính thức của Liên đoàn Bóng đá Đức (DFB), mỗi trận Bundesliga, hàng triệu cổ động viên nâng ly Bitburger.</p>',
      replace:
        '<p>Bitburger là đối tác của Liên đoàn Bóng đá Đức (DFB) từ năm 1992 đến 2018, và trở lại làm đối tác chính thức của các đội tuyển quốc gia Đức từ tháng 4/2025.</p>',
    },
    {
      find: 'Sau hơn 200 năm và 8 thế hệ gia đình, Bitburger vẫn là nhà máy bia <strong>tư nhân gia đình</strong> không niêm yết, không bán cho tập đoàn lớn. Mọi quyết định vẫn đặt chất lượng lên trên sản lượng.',
      replace: 'Sau hơn 200 năm, Bitburger vẫn là nhà bia <strong>của gia đình Simon</strong>, nay do thế hệ thứ bảy điều hành.',
    },
  ],
  'huong-dan-chon-bia-duc-cho-nguoi-moi': [
    { find: 'để lần sau bước vào quán hoặc chọn mua online, bạn biết', replace: 'để lần sau bước vào quán hoặc ghé showroom, bạn biết' },
    { find: ' Nam giới thường thích Pilsner hơn Weissbier.', replace: '' },
    {
      find: 'Đây là dòng bia lager đen truyền thống của Munich, thực ra còn lâu đời hơn cả Pilsner. Màu tối đến từ malt đại mạch rang kỹ',
      replace: 'Benediktiner Dunkel là bia lúa mì sẫm màu (Dunkelweizen), lên men trên giống Weissbier. Màu tối đến từ malt rang kỹ',
    },
    { find: '<tr><td>Nhiệt độ</td><td>6-8°C</td><td>4-7°C</td><td>8-10°C</td></tr>', replace: '<tr><td>Nhiệt độ</td><td>7-9°C</td><td>4-6°C</td><td>8-10°C</td></tr>' },
    {
      find: 'Đừng chỉ uống một loại. Cách tốt nhất để tìm bia yêu thích là thử cả ba.',
      replace: 'Mỗi người một gu, nên có thể nếm từng dòng để tìm loại hợp với mình.',
    },
    {
      find: 'Mỗi dòng sẽ cho bạn một trải nghiệm hoàn toàn khác biệt, và đó mới là vẻ đẹp thực sự của bia Đức.',
      replace: 'Ba dòng khác nhau rõ về màu, hương và độ đắng.',
    },
    { find: 'Dòng 1: Weissbier (Bia Lúa Mì): Êm dịu, dễ uống', replace: 'Dòng 1: Weissbier (bia lúa mì): êm dịu, dễ uống' },
    { find: 'Dòng 2: Pilsner (Bia Vàng Sáng): Sắc nét, sảng khoái', replace: 'Dòng 2: Pilsner (bia vàng sáng): sắc nét, đắng thanh' },
    { find: 'Dòng 3: Dunkel (Bia Đen): Đậm đà, phức hợp', replace: 'Dòng 3: Dunkel (bia sẫm màu): đậm, nhiều tầng hương' },
  ],
  'top-7-mon-viet-ket-hop-bia-duc-food-pairing': [
    { find: 'Food Pairing là gì và tại sao nó quan trọng?', replace: 'Food pairing là gì và tại sao nó quan trọng?' },
    {
      find: 'có khả năng nâng tầm bữa ăn theo những cách mà nhiều người chưa từng nghĩ đến.',
      replace: 'cũng có thể đi cùng món ăn theo những cách nhiều người chưa nghĩ tới.',
    },
    { find: '<h2>7 Cặp đôi hoàn hảo Việt-Đức</h2>', replace: '<h2>7 cặp món Việt và bia Đức</h2>' },
    {
      find: 'Uống một ngụm bia giữa mỗi lần húp nước dùng. Bạn sẽ nhận ra nước phở ngọt hơn hẳn.',
      replace: 'Nếm nước dùng trước rồi mới nhấp bia, vị ngọt của nước phở sẽ rõ hơn.',
    },
    { find: 'Vị chua-ngọt-đắng tạo thành bộ ba hoàn hảo.', replace: 'Vị chua, ngọt và đắng đi cùng nhau khá hợp.' },
    { find: ', kiểu complement hoàn hảo.', replace: ', kiểu kết hợp bổ sung (complement).' },
    { find: '<p><em>Mẹo:</em> Đây là cặp đôi yêu thích nhất của nhiều nhà hàng hải sản Hà Nội khi phục vụ bia Đức.</p>', replace: '' },
    { find: ' Lý tưởng cho ngày hè nóng.', replace: '' },
    { find: 'Nghe lạ nhưng thử sẽ ghiền!', replace: 'Nghe lạ nhưng khá hợp.' },
    { find: 'Đặt bia Đức chính hãng cho bữa tiệc tiếp theo', replace: 'Xem các dòng bia Đức chính hãng' },
  ],
  'cach-bao-quan-bia-nhap-khau-dung-cach': [
    { find: '<td>4-8°C</td><td>6-8°C</td>', replace: '<td>4-8°C</td><td>7-9°C</td>' },
    { find: 'Khám phá bộ sưu tập bia Đức chính hãng tại Bia Thầy Tu', replace: 'Xem các dòng bia Đức chính hãng tại Bia Thầy Tu' },
  ],
  'su-tran-trong-nguyen-ban-bia-giao-thoa': [
    {
      find: '**Bia có phụ gia** giống như nấu ăn với nhiều gia vị, dễ giấu khuyết điểm. Chanh dây, cà phê, vani sẽ lấn át mọi sai sót trong nguyên liệu gốc và quy trình nấu.',
      replace: '**Bia chỉ từ bốn nguyên liệu** thì không có gì để che: vị của nước, mạch nha, hoa bia và men hiện ra rõ.',
    },
    { find: 'đủ để tạo ra thứ tuyệt hảo.', replace: 'đủ để tạo ra một ly bia ngon.' },
    {
      find: 'Điều này lặp lại ở nhiều thị trường. Tại Đức, dù craft beer bùng nổ toàn cầu, bia truyền thống vẫn chiếm **hơn 90% thị phần**. Người Đức, quốc gia uống bia nhiều nhất châu Âu, đã thử hết rồi, và họ quay về với nguyên bản.',
      replace: 'Ở Đức, craft beer theo nghĩa hẹp chỉ chiếm khoảng 1% thị trường, còn Pils vẫn là loại bia bán chạy nhất.',
    },
  ],
  'ly-uong-bia-lua-mi-weizen-glass': [
    { find: '## Chiếc ly Weizenglas huyền thoại', replace: '## Chiếc ly Weizenglas' },
    { find: 'Hai mũi vào ly, rồi hương chuối', replace: 'Đưa mũi vào ly, rồi hương chuối' },
    { find: 'hương thoát tán loạng', replace: 'hương thoát tán loạn' },
    { find: '| **Ly Weizenglas** | Weissbier | Hoàn hảo |', replace: '| **Ly Weizenglas** | Weissbier | Rất tốt |' },
    { find: '| Bia công nghiệp |', replace: '| Bia thông thường |' },
  ],
  'nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu': [
    { find: '| 6-8°C | 3-4 giờ | Đủ mát để sảng khoái, đủ ấm', replace: '| 7-9°C | 3-4 giờ | Đủ mát, đủ ấm' },
    { find: '(khoảng 6-8°C, nhiệt độ vàng)', replace: '(khoảng 7-9°C, nhiệt độ vàng)' },
    { find: 'rồi đạt 6-8°C nhanh hơn tủ lạnh', replace: 'rồi đạt 7-9°C nhanh hơn tủ lạnh' },
    { find: '- Uống trong vòng 15-20 phút sau khi rót, đó là "cửa sổ vàng" của hương vị', replace: '- Hương rõ nhất trong ít phút đầu sau khi rót' },
  ],
  'huong-chuoi-chin-va-dinh-huong-trong-bia-lua-mi': [
    {
      find: 'Chỉ các dòng men Weissbier của Bavaria mới có khả năng này',
      replace: 'Các chủng men bia lúa mì kiểu Đức mới tạo ra hương này rõ',
    },
    { find: 'Ủ lâu hơn giúp các hương vị hòa quyện mượt mà hơn', replace: 'Ủ lâu hơn giúp hương vị tròn hơn' },
    { find: '### Benediktiner: cân bằng hoàn hảo giữa hai hương', replace: '### Benediktiner: cân bằng giữa hai hương' },
    { find: ', rồi sau đó không muốn quay lại uống Lager thông thường nữa.', replace: '.' },
    {
      find: 'sinh ra đủ loại hợp chất phụ tạo nên bản giao hưởng hương vị đặc trưng.',
      replace: 'sinh ra nhiều hợp chất phụ tạo nên hương đặc trưng.',
    },
    { find: '**Để ly bia ấm đến 8-10°C**', replace: '**Để ly bia ở 7-9°C**' },
  ],
  'phan-biet-weissbier-dunkel-festbier': [
    {
      find: 'dưới đây là 3 trường phái kinh điển nhất bạn bắt buộc phải biết:',
      replace: 'có 3 dòng nên biết trước:',
    },
    { find: 'Weissbier là linh hồn của vùng Bavaria.', replace: 'Weissbier là dòng bia lúa mì gắn với vùng Bavaria.' },
    {
      find: 'Naturtrüb, 400 năm từ Tu viện Ettal, Bavaria.',
      replace: 'Naturtrüb, công thức gốc dòng Biển Đức với men hầm Tu viện Ettal, ủ tại Lich.',
    },
    { find: ', đây là dòng bia dành cho những khoảnh khắc chỉn chu.', replace: '.' },
    { find: 'Cân bằng hoàn hảo giữa ngọt malt', replace: 'Cân bằng giữa ngọt malt' },
    { find: 'Và khi sẵn sàng cho một cuộc phiêu lưu, Festbier sẽ chờ bạn.', replace: 'Festbier để dành cho mùa lễ hội.' },
  ],
  'su-that-ve-lop-men-van-duc-naturtrub': [
    {
      find: 'Chúc mừng, bạn đang thưởng thức một ly bia tuyệt hảo.',
      replace: 'Không sao cả, bia lúa mì Naturtrüb vốn đục như vậy.',
    },
    { find: 'Bia công nghiệp thông thường trong vắt vì đã trải qua quá trình lọc kỹ', replace: 'Nhiều loại bia trong vắt vì đã qua quá trình lọc kỹ' },
    {
      find: 'Nói cách khác: lọc bia là bỏ đi linh hồn của nó.',
      replace: 'Lọc hay không lọc là hai cách làm khác nhau: bia đã lọc trong và nhẹ hương hơn, còn bia không lọc đục, bọt dày và hương chuối chín, đinh hương rõ hơn.',
    },
    {
      find: 'từ quá trình lên men tại nhà máy bia tu viện.',
      replace: 'từ quá trình lên men, theo công thức gốc dòng Biển Đức với men hầm tu viện Ettal.',
    },
    { find: 'Đó là Naturtrüb, không cần lọc, vì bản gốc đã hoàn hảo.', replace: 'Đó là Naturtrüb: không lọc, giữ nguyên men.' },
  ],
  'dao-luat-tinh-khiet-1516-reinheitsgebot': [
    {
      find: 'là quy định về chất lượng thực phẩm và đồ uống lâu đời nhất thế giới còn hiệu lực. Hơn 500 năm trôi qua, luật này vẫn là xương sống của ngành bia Đức, và là lý do vì sao mỗi ly bia Đức bạn uống đều khác biệt so với phần còn lại của thế giới.',
      replace: 'là một trong những quy định về thực phẩm lâu đời nhất còn được nhắc tới. Hơn 500 năm sau, tinh thần của luật vẫn là nền tảng của ngành bia Đức.',
    },
    {
      find: 'Men được bổ sung chính thức vào luật sau khi Louis Pasteur phát hiện vai trò của vi sinh vật năm 1857.',
      replace: 'Men được đưa vào quy định về sau, khi vai trò của men trong quá trình lên men đã được hiểu rõ.',
    },
    {
      find: 'Sau này, các tu viện được đặc cách nấu bia lúa mì (Weissbier), và dòng bia này trở thành đặc sản.',
      replace: 'Sau này, bia lúa mì (Weissbier) được nấu theo đặc quyền riêng của nhà cầm quyền Bavaria, và dòng bia này trở thành đặc sản.',
    },
    { find: 'nước tinh khiết từ dãy Alps Bavaria, malt lúa mì + lúa mạch', replace: 'nước, malt lúa mì và lúa mạch' },
  ],
  'nguon-goc-bia-thay-tu-tu-vien-ettal': [
    {
      find: 'Nơi đây là cái nôi của một trong những dòng bia lâu đời nhất nước Đức, ',
      replace: 'Truyền thống nấu bia của tu viện, có từ năm 1609, là gốc của ',
    },
    {
      find: 'Trong khi hàng nghìn nhà máy bia trên thế giới chạy đua công nghệ, tối ưu sản lượng, thêm hương liệu nhân tạo để giảm chi phí, Benediktiner vẫn giữ nguyên phương pháp ủ truyền thống:',
      replace: 'Benediktiner giữ phương pháp ủ truyền thống:',
    },
    {
      find: '<li><strong>Nước suối Alps</strong> nguồn nước ngầm từ dãy Ammergau, đã được lọc tự nhiên qua các tầng đá vôi hàng triệu năm</li>',
      replace: '<li><strong>Men hầm Ettal</strong> chủng men lấy từ hầm tu viện Ettal; bia được ủ tại Lich, bang Hessen</li>',
    },
    { find: '<h2>Từ Bavaria đến Việt Nam</h2>', replace: '<h2>Từ Đức đến Việt Nam</h2>' },
    {
      find: 'được xuất khẩu đến hơn 40 quốc gia. Tại Việt Nam, dòng bia này được nhập khẩu trực tiếp và phân phối độc quyền bởi <strong>German Taste</strong> đơn vị',
      replace: 'được xuất khẩu đến hơn 50 quốc gia. Tại Việt Nam, dòng bia này được nhập khẩu trực tiếp và phân phối bởi <strong>German Taste</strong>, đơn vị',
    },
    {
      find: 'từ nhà máy Đức đến kho hàng tại Hà Nội. Không qua trung gian. Không pha trộn. 100% nguyên chai từ Bavaria.',
      replace: 'từ nhà máy ở Đức đến kho hàng tại Hà Nội. Nhập khẩu nguyên chai từ Đức.',
    },
    {
      find: '<p>Bia Thầy Tu Benediktiner được sản xuất và nhập khẩu nguyên chai 100% từ tu viện Ettal (Bavaria, Đức) hoặc theo công thức nhượng quyền kiểm soát nghiêm ngặt của tu viện Ettal tại xưởng bia chuyên dụng của hãng tại Đức, đảm bảo chất lượng nguyên bản toàn cầu.</p>',
      replace:
        '<p>Bia Thầy Tu Benediktiner được ủ tại Lich (Hessen, Đức) theo công thức gốc dòng Biển Đức, với men từ hầm tu viện Ettal, rồi nhập khẩu nguyên chai về Việt Nam.</p>',
    },
  ],
};

/**
 * Đợt 2 (rà lại 10/2026): lỗi sót, câu vỡ do lần thay "→"/"—" trước đây, số liệu lệch giữa các bài,
 * không có chuỗi lạnh (chủ site xác nhận), không khẳng định men "sống"/lên men tiếp trong chai vì hãng không công bố.
 * Áp sau đợt 1 nên `find` có thể khớp chữ do đợt 1 tạo ra.
 */
const COMPLIANCE_PATCHES_2026_10_ROUND_2: Record<string, Array<{ find: string; replace: string }>> = {
  'bia-den-tu-vien-benediktiner-dunkel-mach-nha-rang-caramel': [
    { find: 'là đối tác tuyệt vời cho các món thịt đỏ nướng', replace: 'hợp với các món thịt đỏ nướng' },
    { find: ', làm bùng nổ hương vị đậm đà trong khoang miệng.', replace: ', làm vị thịt nướng rõ hơn.' },
    { find: 'Bia Dunkel có bán theo thùng hay lon lẻ không?', replace: 'Benediktiner Dunkel có những quy cách nào?' },
  ],
  'bitburger-hanh-trinh-200-nam-bia-draft-so-1': [
    {
      find: 'Kết quả: vị đắng không gắt mà thanh, không khô mà sạch. Hậu vị khô và sạch, vị đắng không đọng lại lâu.',
      replace: 'Kết quả: vị đắng thanh, không gắt; hậu vị khô và sạch.',
    },
    {
      find: 'Bitburger là <strong>bia tươi (draft) được rót nhiều nhất tại Đức</strong> (trên bitburger.de, hãng gọi là &quot;das meistgezapfte Premium Pils an deutschen Theken&quot;).',
      replace:
        'Bitburger là <strong>Premium Pils được rót nhiều nhất tại các quầy bia ở Đức</strong> (trên bitburger.de: &quot;das meistgezapfte Premium Pils an deutschen Theken&quot;).',
    },
    {
      find: ' Mỗi lô hàng được vận chuyển trong container lạnh chuyên dụng, đảm bảo bia đến tay bạn với chất lượng tương đương chai bia bạn gọi tại một quán bia ở Berlin.',
      replace: '',
    },
    {
      find: 'Về mặt kỹ thuật, Bitburger là nhà máy bia lớn. Nhưng với 200+ năm gia đình điều hành, tuân thủ Reinheitsgebot 1516, và quy trình Double Hopping thủ công, nhiều chuyên gia coi đây là "craft beer ở quy mô lớn".',
      replace: 'Không. Bitburger là nhà máy bia lớn của gia đình Simon, nấu theo Luật Tinh khiết 1516, hoa bia thêm hai lần trong quá trình nấu.',
    },
  ],
  'huong-dan-chon-bia-duc-cho-nguoi-moi': [
    { find: 'là dòng bia đặc trưng nhất của vùng Bavaria', replace: 'là dòng bia lúa mì gắn với vùng Bavaria' },
    { find: 'Nồng độ cồn: 5.0-5.5% ABV', replace: 'Nồng độ cồn: 5,4% ABV (Benediktiner)' },
    {
      find: 'Người thích bia "truyền thống", quen uống bia lon/bia hơi nhưng muốn nâng cấp.',
      replace: 'Người thích bia vàng đắng thanh, hậu vị khô.',
    },
    { find: 'Vị đầy đặn, ngọt malt, đắng vừa phải', replace: 'Vị đầy đặn, ngọt malt, độ đắng thấp' },
    { find: '<td>Mug / Stein</td>', replace: '<td>Weizenglas</td>' },
    { find: '<h2>Flowchart: Bạn nên uống bia nào?</h2>', replace: '<h2>Nên chọn bia nào?</h2>' },
    { find: '<h2>Flowchart: bạn nên uống bia nào?</h2>', replace: '<h2>Nên chọn bia nào?</h2>' },
    { find: ' Chắc chắn không thất vọng.', replace: '' },
    { find: 'là lựa chọn lý tưởng nhất cho người mới bắt đầu', replace: 'dễ uống với người mới bắt đầu' },
    { find: ' và hoàn toàn không có vị đắng gắt như bia lager thông thường.', replace: ' và gần như không đắng.' },
    { find: 'có nồng độ cồn trung bình khoảng 5.0% - 5.5% ABV', replace: 'có nồng độ cồn khoảng 5,4% ABV (Benediktiner Dunkel)' },
    { find: ', không hề đắng gắt hay nặng đô như dòng bia đen Stout.', replace: ', ít đắng.' },
  ],
  'top-7-mon-viet-ket-hop-bia-duc-food-pairing': [
    {
      find: 'Luôn uống bia ở nhiệt độ phù hợp (6-10°C)',
      replace: 'Uống đúng nhiệt độ từng dòng (Pils 4-6°C, Weissbier 7-9°C, Dunkel 8-10°C)',
    },
  ],
  'cach-bao-quan-bia-nhap-khau-dung-cach': [
    { find: 'đặc biệt là các dòng bia không qua xử lý nhiệt như ', replace: 'đặc biệt là các dòng bia không lọc như ' },
    {
      find: ' Naturtrüb, là sản phẩm "sống". Bên trong mỗi chai vẫn còn men hoạt động, tiếp tục lên men nhẹ ngay cả sau khi đóng chai. Điều này tạo nên',
      replace: ' Naturtrüb, vẫn còn men trong chai. Điều này tạo nên',
    },
    {
      find: 'Đây là lý do bia Đức chất lượng cao luôn đóng trong <strong>chai thủy tinh nâu</strong> màu nâu chặn được hơn 98% tia UV. Chai xanh lá hoặc trong suốt bảo vệ kém hơn nhiều.',
      replace:
        'Đây là lý do nhiều loại bia Đức đóng trong <strong>chai thủy tinh nâu</strong>: thủy tinh nâu chặn phần lớn tia UV, tốt hơn hẳn chai xanh lá hoặc chai trong.',
    },
    { find: '<td>3-7°C</td><td>4-7°C</td>', replace: '<td>3-7°C</td><td>4-6°C</td>' },
    { find: 'đúng như cách người Bavaria thưởng thức', replace: 'đúng như nhà bia muốn bạn nếm' },
  ],
  'su-tran-trong-nguyen-ban-bia-giao-thoa': [
    { find: '## Cuộc thập tự chinh tìm sự nguyên bản', replace: '## Đi tìm sự nguyên bản' },
    { find: 'người tiêu dùng đang bị bội thực bởi sự "mới lạ"', replace: 'không ít người thấy có quá nhiều lựa chọn' },
    { find: '**Bia chỉ từ bốn nguyên liệu** thì không có gì để che: vị của nước, mạch nha, hoa bia và men hiện ra rõ.', replace: '' },
    {
      find: 'Nước không sạch, rồi vị bia "phẳng". Malt không đều, rồi hương bị lệch. Men kém chất lượng, rồi bia chua, đắng gắt.',
      replace: 'Nước không sạch thì vị bia "phẳng". Malt không đều thì hương bị lệch. Men kém chất lượng thì bia chua, đắng gắt.',
    },
    { find: '### Câu chuyện của những người "quay về"', replace: '### Người Đức vẫn chọn Pils' },
    {
      find: 'còn Pils vẫn là loại bia bán chạy nhất.',
      replace: 'còn Pils vẫn là loại bia bán chạy nhất (theo số liệu thị trường bia Đức năm 2024).',
    },
    { find: '**1. Nhất quán, Mỗi chai đều giống nhau**', replace: '**1. Nhất quán: mỗi chai đều giống nhau**' },
    { find: '**3. An toàn, Biết chính xác mình uống gì**', replace: '**3. Minh bạch: biết rõ thành phần**' },
    { find: '**5. Chọn kỹ = thể hiện gu**', replace: '**5. Hợp với người thích hương vị truyền thống**' },
    {
      find: 'Trong thời đại mọi người chạy theo trend, người chọn nguyên bản đang nói: *"Tôi biết mình muốn gì. Tôi không cần cái mới nhất. Tôi cần cái đúng nhất."*',
      replace: 'Không cần hương liệu lạ, chỉ cần bốn nguyên liệu được nấu kỹ.',
    },
  ],
  'ly-uong-bia-lua-mi-weizen-glass': [
    { find: ', rồi tạo ra lớp bọt dày', replace: ' và tạo ra lớp bọt dày' },
    { find: '- Weissbier chứa nhiều protein từ lúa mì, rồi tạo bọt nhiều hơn Lager', replace: '- Weissbier chứa nhiều protein từ lúa mì nên tạo nhiều bọt' },
    {
      find: '- Men sống còn trong bia tiếp tục sản sinh CO₂, rồi bọt liên tục được "nạp"',
      replace: '- Bia không lọc, men và protein còn trong bia giúp bọt bền hơn',
    },
    {
      find: 'Đưa mũi vào ly, rồi hương chuối rõ ràng, đinh hương ấm, lúa mì ngọt',
      replace: 'Đưa mũi vào ly: hương chuối rõ, đinh hương ấm, lúa mì ngọt',
    },
    { find: 'Đưa mũi vào, rồi hương thoát tán loạn, khó nhận diện rõ từng nốt', replace: 'Đưa mũi vào: hương tản đi, khó nhận rõ từng nốt' },
    {
      find: 'Tại các nhà hàng bia ở Munich, nếu ly bia không đủ 500ml bia lỏng (không tính bọt), khách có quyền yêu cầu rót thêm. Đây là quy định pháp luật, không phải chuyện vui.',
      replace:
        'Ở Đức, ly phục vụ trong nhà hàng phải có vạch đo; nếu bọt tan sau khoảng một phút mà bia thấp hơn vạch, khách có quyền yêu cầu rót thêm. Đây là quy định về đo lường, không phải chuyện vui.',
    },
    { find: '**Rót ⅔ chai**', replace: '**Rót khoảng 3/4 chai**' },
    {
      find: 'Bộ ly này thường được tặng kèm khi mua két bia, không phải phụ kiện bán riêng. Vì người Đức tin rằng: *bán bia mà không cho ly uống đúng chuẩn, là bán thiếu.*',
      replace:
        'Bộ ly Benediktiner có bán lẻ, và tùy thời điểm còn là quà tặng kèm khi mua bia theo chương trình của German Taste; liên hệ hotline hoặc Zalo để biết thể lệ.',
    },
  ],
  'nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu': [
    { find: 'khoảng nhiệt độ mà hương vị bùng nổ đầy đủ nhất', replace: 'khoảng nhiệt độ mà hương vị rõ nhất' },
    { find: '1. Lấy 3 lon ', replace: '1. Chuẩn bị 3 lon ' },
    { find: 'Rót cả 3 ra ly, nếm thử:', replace: 'Rót mỗi lon một ít ra ly nhỏ, nếm so sánh cùng vài người:' },
    { find: ', rồi đạt 7-9°C nhanh hơn tủ lạnh', replace: ': bia mát tới 7-9°C nhanh hơn để tủ lạnh' },
    { find: ', rồi hiệu ứng bay hơi giữ nhiệt ổn định', replace: ': hơi nước bay đi giúp giữ lạnh' },
  ],
  'huong-chuoi-chin-va-dinh-huong-trong-bia-lua-mi': [
    { find: '## Phép màu từ quá trình lên men', replace: '## Hương chuối đến từ quá trình lên men' },
    { find: '(18-24°C), Men "hào hứng" hơn ở nhiệt độ ấm', replace: '(18-24°C): men hoạt động mạnh hơn ở nhiệt độ ấm' },
    { find: '**Chủng men lúa mì truyền thống**, Không phải', replace: '**Chủng men lúa mì truyền thống**: không phải' },
    { find: '**Tỷ lệ lúa mì cao**, Lúa mì', replace: '**Tỷ lệ lúa mì cao**: lúa mì' },
    { find: '**Chủng men cụ thể**, Mỗi', replace: '**Chủng men cụ thể**: mỗi' },
    {
      find: '**Nhiệt độ lên men**, Lên men ấm hơn, rồi nhiều chuối hơn. Lên men mát hơn, rồi nhiều đinh hương hơn',
      replace: '**Nhiệt độ lên men**: lên men ấm hơn thì nhiều chuối hơn, mát hơn thì nhiều đinh hương hơn',
    },
    { find: '| Nhiều, rồi hương trái cây | Rất ít, rồi vị "sạch" |', replace: '| Nhiều, nên hương trái cây | Rất ít, nên vị "sạch" |' },
    { find: '### Tại sao bia Lager thông thường không có hương này?', replace: '### Tại sao bia Lager không có hương này?' },
    { find: '| Yếu tố | Weissbier (Ale) | Lager thông thường |', replace: '| Yếu tố | Weissbier (Ale) | Lager |' },
  ],
  'phan-biet-weissbier-dunkel-festbier': [
    { find: '### Weissbier (bia lúa mì): "nàng thơ" của Bavaria', replace: '### Weissbier (bia lúa mì)' },
    { find: '- **ABV**: 5.0-5.5%', replace: '- **ABV**: 5,4% (Benediktiner)' },
    { find: '### Festbier (bia lễ hội): "linh hồn" của Oktoberfest', replace: '### Festbier (bia lễ hội)' },
    { find: '| ABV | 5.0-5.4% | 5.0-5.4% | 5.8-6.3% |', replace: '| ABV | 5,4% | 5,4% | 5,8% |' },
    { find: 'chỉ 4 nguyên liệu, không phụ gia, không shortcuts.', replace: 'chỉ từ nước, malt, hoa bia và men, không phụ gia.' },
  ],
  'su-that-ve-lop-men-van-duc-naturtrub': [
    { find: 'vì hàng triệu tế bào men sống đang "bay lơ lửng" trong bia', replace: 'vì men còn lơ lửng trong bia' },
    {
      find: 'khiến men phân tán đều, rồi tạo ra lớp bọt kem trắng dày đặc hơn',
      replace: 'khiến men phân tán đều và bọt dày hơn',
    },
    {
      find: '**Bọt bền**, men sống tạo protein bề mặt giúp bọt giữ form lâu hơn so với bia lọc',
      replace: '**Bọt bền**: men và protein lúa mì giúp bọt giữ lâu hơn',
    },
    { find: 'đó là phiên bản lọc sạch men, mất đi phần lớn hương vị.', replace: 'đó là phiên bản đã lọc, trong và nhẹ hương hơn.' },
    { find: 'rót chậm khoảng ⅔ ly', replace: 'rót chậm khoảng 3/4 chai' },
    { find: 'Và hàng triệu tế bào men sống đang "nhảy" trong ly bạn.', replace: 'Và lớp men lơ lửng trong ly.' },
  ],
  'dao-luat-tinh-khiet-1516-reinheitsgebot': [
    { find: 'Nước, Lúa mạch đại mạch, và Hoa bia (Hopfen).', replace: 'Nước, đại mạch và hoa bia (Hopfen).' },
    { find: '### 4 nguyên liệu thiêng: không hơn, không kém', replace: '### Bốn nguyên liệu' },
    {
      find: 'Sấy nhẹ, rồi malt vàng nhạt (Pils). Sấy mạnh hơn, rồi malt hổ phách (Weissbier). Rang đậm, rồi malt đen (Dunkel).',
      replace: 'Sấy nhẹ cho malt vàng nhạt (Pils), sấy mạnh hơn cho malt hổ phách (Weissbier), rang đậm cho malt đen (Dunkel).',
    },
    { find: 'Sinh vật nhỏ bé làm nên phép màu: chuyển đường thành cồn và CO₂.', replace: 'Men chuyển đường thành cồn và CO₂.' },
    { find: '**Loại bỏ bia độc hại**, Người dân', replace: '**Loại bỏ bia độc hại**: người dân' },
    { find: '**Buộc nhà nấu bia sáng tạo trong giới hạn**, Khi', replace: '**Buộc nhà nấu bia sáng tạo trong giới hạn**: khi' },
    { find: '**Bảo vệ lúa mì cho lương thực**, Ban đầu', replace: '**Bảo vệ lúa mì cho lương thực**: ban đầu' },
    {
      find: 'Đây là sự khác biệt cốt lõi giữa bia Đức và craft beer hiện đại: bia Đức chứng minh rằng sự vĩ đại không đến từ nguyên liệu lạ, mà từ việc master nguyên liệu cơ bản.',
      replace: 'Bia Đức theo Reinheitsgebot cho thấy chỉ với nguyên liệu cơ bản vẫn nấu ra được nhiều phong cách bia.',
    },
    {
      find: 'chỉ có nước, lúa mạch, hoa bia, và men. Không hơn. Không kém. Suốt 500 năm.',
      replace: 'chỉ có nước, malt, hoa bia và men. Không hơn, không kém.',
    },
  ],
  'nguon-goc-bia-thay-tu-tu-vien-ettal': [
    { find: 'tu viện Ettal hiện ra như một thánh đường thời gian.', replace: 'tu viện Ettal hiện ra giữa núi.' },
    {
      find: 'tiếng chuông ngân vang mỗi sáng sớm đúng 6 giờ, như đã vang suốt gần 7 thế kỷ qua.',
      replace: 'tiếng chuông vẫn ngân mỗi sáng sớm.',
    },
    {
      find: 'một dòng tu có truyền thống lao động thủ công lâu đời nhất châu Âu',
      replace: 'một trong những dòng tu lâu đời của châu Âu',
    },
    { find: '<strong>"Ora et Labora"</strong> Cầu nguyện và Lao động.', replace: '<strong>"Ora et Labora"</strong>: cầu nguyện và lao động.' },
    {
      find: 'Và một trong những hình thức lao động thiêng liêng nhất của họ chính là nấu bia.',
      replace: 'Nấu bia là một trong những công việc lao động ấy.',
    },
    {
      find: 'Họ nấu bia vì đó là nhu cầu sinh tồn, là một phần của đời sống cộng đồng',
      replace: 'Họ nấu bia như một phần của đời sống cộng đồng',
    },
    {
      find: '<p>Không có máy móc tăng tốc. Không hóa chất điều chỉnh. Tất cả phụ thuộc vào nhịp điệu của thời gian, và đó chính là thứ mà bạn nếm được trong từng ngụm bia.</p>',
      replace: '',
    },
    { find: '<h2>Qua lửa chiến tranh và tái sinh</h2>', replace: '<h2>Hỏa hoạn, thế tục hóa và tái lập</h2>' },
    {
      find: '<p>Mỗi chai bia đến tay bạn đều được vận chuyển trong container lạnh chuyên dụng, đảm bảo nhiệt độ ổn định từ nhà máy ở Đức đến kho hàng tại Hà Nội. Nhập khẩu nguyên chai từ Đức.</p>',
      replace: '<p>Bia được nhập khẩu nguyên chai từ Đức về kho hàng tại Hà Nội.</p>',
    },
    { find: '<h2>Không chỉ là bia: mà là di sản</h2>', replace: '<h2>Không chỉ là bia, mà là di sản</h2>' },
    {
      find: 'bạn đang cầm kết tinh của gần 700 năm kỷ luật tu viện, sự tôn trọng nguyên liệu, và lòng kiên nhẫn không thỏa hiệp với thời gian.',
      replace: 'bạn đang cầm một loại bia theo công thức gắn với gần 700 năm lịch sử của tu viện Ettal.',
    },
    {
      find: 'quy định bia chỉ được phép nấu từ 4 nguyên liệu tự nhiên tinh khiết nhất: Nước suối tự nhiên, lúa mạch/lúa mì (malt), hoa bia (hops) và men bia (yeast), tuyệt đối không chứa hóa chất bảo quản.',
      replace:
        'ban đầu (1516) chỉ cho phép nước, đại mạch và hoa bia; men được đưa vào quy định về sau. Ngày nay bia Đức theo quy định này chỉ dùng nước, malt, hoa bia và men.',
    },
  ],
};

for (const round of [COMPLIANCE_PATCHES_2026_10, COMPLIANCE_PATCHES_2026_10_ROUND_2]) {
  for (const [slug, patches] of Object.entries(round)) {
    ARTICLE_TEXT_PATCHES[slug] = [...(ARTICLE_TEXT_PATCHES[slug] ?? []), ...patches];
  }
}

/**
 * Sửa cần biểu thức chính quy vì câu gốc có tên miền hay link ở giữa (được viết lại sau bước vá).
 * Áp ngay sau ARTICLE_TEXT_PATCHES.
 */
const ARTICLE_REGEX_PATCHES: Record<string, Array<{ pattern: RegExp; replace: string }>> = {
  'bia-den-tu-vien-benediktiner-dunkel-mach-nha-rang-caramel': [
    {
      // Đọc như website có bán hàng; thiếu quy cách thùng 12 lon.
      pattern: /Bia đen Thầy Tu Benediktiner Dunkel hiện được phân phối chính hãng dưới dạng[\s\S]*?quà biếu trang trọng\./,
      replace:
        'Benediktiner Dunkel hiện có thùng 12 chai 500ml, thùng 12 lon 500ml và két 24 lon 500ml. Liên hệ hotline, Zalo hoặc ghé showroom Bia Thầy Tu để được tư vấn.',
    },
  ],
};

/** Lời khách không kiểm chứng được trong bài này (rà soát 10/2026): bỏ cả câu dẫn lẫn trích dẫn. */
const UNVERIFIED_TESTIMONIAL_PATTERN =
  /Rất nhiều người tìm đến Bia Thầy Tu sau một hành trình dài:\s*\*\*"Mình từng uống craft beer[\s\S]*?feedback thực tế từ một khách hàng thường xuyên\.\s*/;

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

  for (const patch of (slug && ARTICLE_REGEX_PATCHES[slug]) || []) {
    sanitized = sanitized.replace(patch.pattern, patch.replace);
  }

  if (slug === 'su-tran-trong-nguyen-ban-bia-giao-thoa') {
    sanitized = sanitized.replace(UNVERIFIED_TESTIMONIAL_PATTERN, '');
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

  // Hãng chỉ công bố "Hefetrübung" (bia đục vì men), không nói men còn sống hay bia không thanh trùng.
  // Chạy sau bước cắt đoạn "Men sống" ở trên vì bước đó tìm theo đúng tiêu đề.
  sanitized = sanitized.replace(/\b([Mm])en sống\b/g, '$1en');

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

  for (const [oldSlug, newSlug] of Object.entries(RENAMED_ARTICLE_SLUGS)) {
    sanitized = sanitized.replace(
      new RegExp(`((?:https?://(?:www\\.)?biathaytu\\.com(?:\\.vn)?)?/(?:kien-thuc|blog)/)${oldSlug}(?=[/#?\\s"')>]|$)`, 'g'),
      `/kien-thuc/${newSlug}`,
    );
  }

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
      slug: RENAMED_ARTICLE_SLUGS[article.slug ?? ''] ?? article.slug,
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
