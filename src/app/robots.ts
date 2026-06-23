import { MetadataRoute } from 'next';
import { getPublicBaseUrl } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Chặn bot crawl các API endpoints nội bộ để bảo mật và tối ưu Crawl Budget
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Perplexity-User',
          'ClaudeBot',          // Anthropic Claude
          'Google-Extended',   // Google Gemini & AI Overviews
          'Applebot-Extended', // Apple Intelligence
          'cohere-bot',        // Cohere AI
        ],
        allow: '/',
        disallow: [
          '/api/',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
