import { NextResponse } from 'next/server';
import { getPublicBaseUrl } from '@/lib/seo/site';

export const revalidate = 86400; // Cache 24h

export async function GET() {
  const baseUrl = getPublicBaseUrl();
  const lastmod = '2026-07-11T20:00:00+07:00';

  const pages = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '/san-pham', changefreq: 'weekly', priority: '0.8' },
    { loc: '/kien-thuc', changefreq: 'daily', priority: '0.8' },
    { loc: '/thuong-hieu', changefreq: 'monthly', priority: '0.6' },
    { loc: '/lien-he', changefreq: 'monthly', priority: '0.6' },
    { loc: '/bia-thay-tu-la-gi', changefreq: 'monthly', priority: '0.8' },
    { loc: '/bia-benediktiner-chinh-hang', changefreq: 'monthly', priority: '0.8' },
    { loc: '/mua-bia-benediktiner-chinh-hang', changefreq: 'monthly', priority: '0.8' },
    { loc: '/bia-duc-nhap-khau', changefreq: 'monthly', priority: '0.8' },
    { loc: '/benediktiner-weissbier-naturtrub', changefreq: 'monthly', priority: '0.9' },
    { loc: '/benediktiner-dunkel', changefreq: 'monthly', priority: '0.9' },
    { loc: '/bom-bia-5l-benediktiner', changefreq: 'monthly', priority: '0.9' },
    { loc: '/bitburger-premium-pils', changefreq: 'monthly', priority: '0.9' },
    { loc: '/bia-duc-cho-nha-hang-khach-san', changefreq: 'monthly', priority: '0.7' },
    { loc: '/qua-tang-bia-duc', changefreq: 'monthly', priority: '0.7' },
    { loc: '/food-pairing-bia-duc', changefreq: 'monthly', priority: '0.7' },
    { loc: '/huong-dan-rot-bia-lua-mi', changefreq: 'monthly', priority: '0.7' },
    { loc: '/bang-gia-si-dai-ly', changefreq: 'monthly', priority: '0.7' },
    { loc: '/chung-nhan-nhap-khau-chinh-hang', changefreq: 'monthly', priority: '0.7' },
    { loc: '/ve-chung-toi', changefreq: 'monthly', priority: '0.6' },
  ];

  const urlElements = pages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
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
