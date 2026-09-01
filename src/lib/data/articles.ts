import articlesData from '@/data/articles.json';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';

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
  /(?:chimay|la[-\s]*trappe|rochefort|bitburger|köstritzer|kostritzer|bia[-\s]*b[iỉ])/i;
const OUT_OF_SCOPE_BEER_MENTION_PATTERN =
  /(?:chimay|la\s*trappe|rochefort|bitburger|köstritzer|kostritzer)/i;
const ARTICLE_BLOCK_PATTERN = /<(p|li|h2|h3|h4|figure)\b[^>]*>[\s\S]*?<\/\1>/gi;

function isBenediktinerArticle(article: Article): boolean {
  return !OUT_OF_SCOPE_ARTICLE_PATTERN.test(`${article.title} ${article.slug ?? ''}`);
}

function sanitizeArticleContent(content: string | null): string | null {
  if (!content) return content;

  return content
    .replace(ARTICLE_BLOCK_PATTERN, (block) =>
      OUT_OF_SCOPE_BEER_MENTION_PATTERN.test(block) ? '' : block,
    )
    .replace(
      /659A\s+Lạc Long Quân(?:,\s*(?:Phường\s+)?Xuân La)?(?:,\s*(?:Quận\s+)?Tây Hồ)?(?:,\s*Hà Nội)?/gi,
      '26 Vạn Phúc, Ba Đình, Hà Nội',
    )
    .replace(
      /Showroom Bia Thầy Tu Lạc Long Quân/gi,
      'Showroom Bia Thầy Tu tại 26 Vạn Phúc, Ba Đình, Hà Nội',
    )
    .replace(/0899(?:[\s.]*)191(?:[\s.]*)313/g, '0915 31 21 66')
    .replace(/0899(?:[\s.]*)19(?:[\s.]*)13(?:[\s.]*)13/g, '0915 31 21 66');
}

const PUBLISHED_ARTICLES: Article[] = (articlesData as unknown as Article[])
  .filter(
    (article) =>
      article.tenant_id === DEFAULT_TENANT_ID &&
      article.status === 'published' &&
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
