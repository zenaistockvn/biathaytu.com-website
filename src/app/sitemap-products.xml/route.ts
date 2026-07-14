import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data/products';
import { getPublicBaseUrl } from '@/lib/seo/site';

export const revalidate = 86400; // Cache 24h

export async function GET() {
  const baseUrl = getPublicBaseUrl();
  const products = getAllProducts();

  const urlElements = products
    .map((product) => {
      const slug = product.slug || product.id;
      const lastmod = product.updated_at
        ? new Date(product.updated_at).toISOString()
        : new Date().toISOString();
      return `  <url>
    <loc>${baseUrl}/san-pham/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
