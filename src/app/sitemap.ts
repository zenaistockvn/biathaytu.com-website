import { MetadataRoute } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabase();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.biathaytu.com';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kien-thuc`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/thuong-hieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  // Fetch dynamic products
  const { data: products } = await supabase.from('products').select('slug, id, updated_at');
  if (products) {
    for (const product of products as any[]) {
      routes.push({
        url: `${baseUrl}/san-pham/${product.slug || product.id}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Fetch dynamic blog posts
  const { data: articles } = await supabase.from('seo_articles').select('slug, id, updated_at');
  if (articles) {
    for (const article of articles as any[]) {
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
