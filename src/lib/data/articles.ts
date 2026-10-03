import articlesData from '@/data/articles.json';
import retiredArticlesData from '@/config/retired-articles.json';
import renamedArticleSlugs from '@/config/renamed-article-slugs.json';
import { COMPANY_CONFIG } from '@/config/company';
import { getArticleTopic } from '@/config/articleTopics';
import { getVisibleProducts, RENAMED_PRODUCT_SLUGS } from './products';
import { toSentenceCaseHtml } from './titleCase';

/*
 * Nội dung bài lấy thẳng từ src/data/articles.json: file này là nguồn chính (10/2026), không còn đổ lại từ
 * database khi build. Sửa bài thì sửa thẳng trong JSON (tiêu đề, mô tả, nội dung). Ảnh bìa ở trường
 * thumbnail_url, dòng ghi nguồn ảnh CC BY/CC BY-SA ở image_credit (nguồn và giấy phép:
 * public/images/articles/kien-thuc/SOURCES.md). sanitizeArticleContent chỉ còn các quy tắc chung, chạy lại
 * vô hại trên nội dung đã sạch, để chặn lỗi cũ quay lại khi viết bài mới.
 */

export const DEFAULT_TENANT_ID = 'biathaytu';

const RETIRED_ARTICLE_MAP: Record<string, string> = retiredArticlesData;
const RETIRED_ARTICLE_SLUGS = new Set(Object.keys(RETIRED_ARTICLE_MAP));

/** Slug cũ → slug mới; slug cũ chuyển 301 trong next.config.js, link nội bộ trong bài được viết lại bên dưới. */
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
 * Tài liệu nội bộ (marketing) nằm trong dữ liệu bài với status 'published'.
 * Không hiển thị trên website, sitemap hay llms.txt.
 */
export const INTERNAL_ONLY_ARTICLE_SLUGS = new Set(['giai-ma-thuat-toan-facebook-2025-2026']);

function isBenediktinerArticle(article: Article): boolean {
  return !OUT_OF_SCOPE_ARTICLE_PATTERN.test(`${article.title} ${article.slug ?? ''}`);
}

// Tham số slug giữ cho các nơi gọi cũ; mọi quy tắc dưới đây áp chung cho mọi bài.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function sanitizeArticleContent(content: string | null, _slug?: string | null): string | null {
  if (!content) return content;

  let sanitized = content;

  // Thay mọi chuỗi \ + n (literal) bằng ký tự xuống dòng thật
  sanitized = sanitized.replace(/\\n/g, '\n');

  // Tiêu đề con viết hoa đầu câu (bài cũ từng ghi Viết Hoa Mỗi Chữ).
  sanitized = sanitized
    .replace(/(<h([1-6])\b[^>]*>)([\s\S]*?)(<\/h\2>)/gi, (_, open: string, _level: string, body: string, close: string) =>
      open + toSentenceCaseHtml(body) + close)
    .replace(/^(#{1,6}[ \t]+)(.+)$/gm, (_, hashes: string, body: string) => hashes + toSentenceCaseHtml(body));

  // Xóa nguyên thẻ <p ...>...</p> nào chứa ship hoả tốc / ship hỏa tốc (website không bán online)
  sanitized = sanitized.replace(
    /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?ship\s*(?:hoả|hỏa|hoa)\s*tốc[\s\S]*?<\/p>\s*/gi,
    '',
  );

  // Hãng chỉ công bố "Hefetrübung" (bia đục vì men), không nói men còn sống hay bia không thanh trùng.
  sanitized = sanitized.replace(/\b([Mm])en sống\b/g, '$1en');

  // Xóa các khối rỗng còn lại
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
    // Địa chỉ showroom trước 27/09/2026.
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

  // Viết lại slug sản phẩm cũ sang slug mới
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

  // Viết lại link tới các bài viết đã gỡ/gộp sang đích tương ứng
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
    return {
      ...article,
      image_credit: article.image_credit ?? null,
      content: sanitizedContent,
      word_count: countWords(sanitizedContent),
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
