import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.biathaytu.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Do not index internal APIs
          '/login', // Do not index login page
          '/studio', // Do not index admin routes
          '/library',
          '/calendar',
          '/gallery',
          '/accounts',
          '/analytics',
          '/activity',
          '/rules'
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User'],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
