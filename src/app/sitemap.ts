import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';
import { getPublicBaseUrl } from '@/lib/seo/site';

interface SitemapProduct {
  slug: string | null;
  id: string;
  updated_at: string | null;
}

interface SitemapArticle {
  slug: string | null;
  id: string;
  updated_at: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicBaseUrl();

  // Ngày cập nhật nội dung tĩnh gần nhất (cập nhật thủ công khi sửa landing/nội dung)
  const CONTENT_LAST_UPDATED = new Date('2026-06-14');

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kien-thuc`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/thuong-hieu`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // GEO landing pages
  const landingPages = [
    'bia-thay-tu-la-gi',
    'bia-benediktiner-chinh-hang',
    'mua-bia-benediktiner-chinh-hang',
    'bia-duc-nhap-khau',
    'benediktiner-weissbier-naturtrub',
    'benediktiner-dunkel',
    'bom-bia-5l-benediktiner',
    'bitburger-premium-pils',
    'bia-duc-cho-nha-hang-khach-san',
    'qua-tang-bia-duc',
    'food-pairing-bia-duc',
    'huong-dan-rot-bia-lua-mi',
    'bang-gia-si-dai-ly',
    'chung-nhan-nhap-khau-chinh-hang',
    've-chung-toi',
  ];
  for (const slug of landingPages) {
    routes.push({
      url: `${baseUrl}/${slug}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  // [C1 FIX] Fetch dynamic products with proper typing
  const products = getAllProducts();
  if (products) {
    for (const product of products as unknown as SitemapProduct[]) {
      routes.push({
        url: `${baseUrl}/san-pham/${product.slug || product.id}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // [C1 FIX] Fetch dynamic articles with proper typing
  const articles = getPublishedArticles();
  if (articles) {
    for (const article of articles as unknown as SitemapArticle[]) {
      routes.push({
        url: `${baseUrl}/kien-thuc/${article.slug || article.id}`,
        lastModified: new Date(article.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return routes;
}
