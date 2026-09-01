import { MetadataRoute } from 'next';
import { getVisibleProducts } from '@/lib/data/products';
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
  const CONTENT_LAST_UPDATED = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/san-pham`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/kien-thuc`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/thuong-hieu`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/lien-he`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const policyPages = [
    'chinh-sach-bao-mat',
    'chinh-sach-kiem-soat-do-tuoi',
    'chinh-sach-cookie',
    'dieu-khoan-su-dung',
    'thong-tin-mua-hang',
    'nhan-uu-dai',
  ];
  for (const slug of policyPages) {
    routes.push({
      url: `${baseUrl}/${slug}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.3,
    });
  }

  const landingPages = [
    'bia-thay-tu-la-gi',
    'bia-benediktiner-chinh-hang',
    'bia-duc-nhap-khau',
    'benediktiner-weissbier-naturtrub',
    'benediktiner-dunkel',
    'bom-bia-5l-benediktiner',
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

  const products = getVisibleProducts();
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
