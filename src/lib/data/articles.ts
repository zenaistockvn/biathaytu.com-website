import articlesData from '@/data/articles.json';
import { normalizeBrandIdentity, toBrochureMetadataCopy, toMetaDescription } from '@/lib/seo/metadataCopy';

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

const COMMERCIAL_TERMS = /(?:báo\s+)?giá\s+sỉ|giá\s+B2B|chiết\s+khấu/i;

/**
 * Public editorial pages may discuss partnership availability, but must never expose
 * wholesale/B2B prices or discount language. Keep this normalization at the loader
 * boundary because articles.json is regenerated from the database during builds.
 */
export function sanitizePublicCommercialCopy(value: string | null): string | null {
  if (!value) return value;

  let safe = normalizeBrandIdentity(value) ?? value;

  // Remove whole commercial price tables instead of attempting to reinterpret old prices.
  safe = safe.replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (table) =>
    COMMERCIAL_TERMS.test(table) ? '' : table,
  );

  safe = safe
    .replace(/(?:báo\s+)?giá\s+sỉ/gi, 'thông tin hợp tác')
    .replace(/giá\s+B2B/gi, 'chính sách đối tác')
    .replace(/mức\s+chiết\s+khấu/gi, 'quyền lợi thương mại')
    .replace(/chiết\s+khấu/gi, 'quyền lợi thương mại');

  return safe;
}

const PUBLISHED_ARTICLES: Article[] = (articlesData as unknown as Article[])
  .filter((a) => a.tenant_id === DEFAULT_TENANT_ID && a.status === 'published')
  .map((article) => {
    const safeTitle = sanitizePublicCommercialCopy(article.title) ?? article.title;
    const safeContent = sanitizePublicCommercialCopy(article.content);
    const safeMeta = sanitizePublicCommercialCopy(article.meta_description);

    return {
      ...article,
      title: toBrochureMetadataCopy(safeTitle) || safeTitle,
      content: safeContent,
      meta_description: toMetaDescription(safeMeta) || safeMeta,
    };
  })
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
