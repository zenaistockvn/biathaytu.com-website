import articlesData from '@/data/articles.json';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';
import { COMPANY_CONFIG } from '@/config/company';
import { getVisibleProducts } from './products';

export const DEFAULT_TENANT_ID = 'biathaytu';

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
}

const OUT_OF_SCOPE_ARTICLE_PATTERN =
  /(?:chimay|la[-\s]*trappe|rochefort|bia[-\s]*b[iỉ])/i;
const OUT_OF_SCOPE_BEER_MENTION_PATTERN =
  /(?:chimay|la\s*trappe|rochefort)/i;
const ARTICLE_BLOCK_PATTERN = /<(p|li|h2|h3|h4|figure)\b[^>]*>[\s\S]*?<\/\1>/gi;

const LEGACY_PRODUCT_SLUG_MAP: Record<string, string> = {
  'benediktiner-weissbier-naturtrub-500ml': 'benediktiner-naturtrub-thung-12-chai-500ml',
  'bitburger-premium-pils-330ml': 'bitburger-premium-pils-thung-12-chai-330ml',
  'benediktiner-dunkel-500ml': 'benediktiner-dunkel-thung-12-chai-500ml',
  'bom-5l-benediktiner-weissbier': 'benediktiner-naturtrub-bom-5l',
};

/**
 * Tài liệu nội bộ (marketing) nằm trong bảng seo_articles với status 'published'.
 * Giữ trong database cho nội bộ đọc, không hiển thị trên website, sitemap hay llms.txt.
 */
export const INTERNAL_ONLY_ARTICLE_SLUGS = new Set(['giai-ma-thuat-toan-facebook-2025-2026']);

function isBenediktinerArticle(article: Article): boolean {
  return !OUT_OF_SCOPE_ARTICLE_PATTERN.test(`${article.title} ${article.slug ?? ''}`);
}

function sanitizeArticleContent(content: string | null): string | null {
  if (!content) return content;

  let sanitized = content
    .replace(ARTICLE_BLOCK_PATTERN, (block) =>
      OUT_OF_SCOPE_BEER_MENTION_PATTERN.test(block) ? '' : block,
    )
    .replace(
      /659A\s+Lạc Long Quân(?:,\s*(?:Phường\s+)?Xuân La)?(?:,\s*(?:Quận\s+)?Tây Hồ)?(?:,\s*Hà Nội)?/gi,
      COMPANY_CONFIG.showroomAddress,
    )
    .replace(
      /Showroom Bia Thầy Tu Lạc Long Quân/gi,
      `Showroom Bia Thầy Tu tại ${COMPANY_CONFIG.showroomAddress}`,
    )
    .replace(/0899(?:[\s.]*)191(?:[\s.]*)313/g, COMPANY_CONFIG.hotline)
    .replace(/0899(?:[\s.]*)19(?:[\s.]*)13(?:[\s.]*)13/g, COMPANY_CONFIG.hotline);

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
    (fullTag, _attrs, slug, text) => {
      if (!visibleProductSlugs.has(slug)) {
        return text;
      }
      return fullTag;
    },
  );

  sanitized = sanitized.replace(
    /\[([^\]]+)\]\((?:https?:\/\/(?:www\.)?biathaytu\.com)?\/san-pham\/([^)\s/?#]+)(?:\s+["'][^"']*["'])?\)/g,
    (fullMatch, text, slug) => {
      if (!visibleProductSlugs.has(slug)) {
        return text;
      }
      return fullMatch;
    },
  );

  return sanitized;
}

const PUBLISHED_ARTICLES: Article[] = (articlesData as unknown as Article[])
  .filter(
    (article) =>
      article.tenant_id === DEFAULT_TENANT_ID &&
      article.status === 'published' &&
      !INTERNAL_ONLY_ARTICLE_SLUGS.has(article.slug ?? '') &&
      isBenediktinerArticle(article),
  )
  .map((article) => ({
    ...article,
    title: toBrochureMetadataCopy(article.title) || article.title,
    content: sanitizeArticleContent(article.content),
    meta_description: toBrochureMetadataCopy(article.meta_description) || article.meta_description,
  }))
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export function getPublishedArticles(): Article[] {
  return PUBLISHED_ARTICLES;
}

export function getArticleBySlugOrId(key: string): Article | null {
  return PUBLISHED_ARTICLES.find((a) => a.slug === key || a.id === key) ?? null;
}

export function getRelatedArticles(excludeId: string, limit = 3): Article[] {
  return PUBLISHED_ARTICLES.filter((a) => a.id !== excludeId).slice(0, limit);
}
