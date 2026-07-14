import { NextResponse } from 'next/server';
import { getPublishedArticles } from '@/lib/data/articles';
import { getPublicBaseUrl } from '@/lib/seo/site';

export const revalidate = 86400; // Cache 24h

export async function GET() {
  const baseUrl = getPublicBaseUrl();
  const articles = getPublishedArticles();

  const urlElements = articles
    .map((article) => {
      const slug = article.slug || article.id;
      const lastmod = article.updated_at
        ? new Date(article.updated_at).toISOString()
        : new Date().toISOString();
      return `  <url>
    <loc>${baseUrl}/kien-thuc/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
