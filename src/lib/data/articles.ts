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

const PUBLISHED_ARTICLES: Article[] = (articlesData as unknown as Article[])
  .filter((a) => a.tenant_id === DEFAULT_TENANT_ID && a.status === 'published')
  .map((article) => ({
    ...article,
    title: toBrochureMetadataCopy(article.title) || article.title,
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
