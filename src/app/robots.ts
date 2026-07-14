import { MetadataRoute } from 'next';
import { getPublicBaseUrl } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicBaseUrl();

  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'Perplexity-User',
          'ClaudeBot',
          'Claude-User',
          'anthropic-ai',
          'Google-Extended',
          'Applebot',
          'Applebot-Extended',
          'cohere-bot',
          'Meta-ExternalAgent',
          'Bytespider',
          'CCBot',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/tai-khoan',
          '/account',
          '/search',
          '/*?sort=',
          '/*?filter=',
          '/*?utm_',
        ],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/tai-khoan',
          '/account',
          '/search',
          '/*?sort=',
          '/*?filter=',
          '/*?utm_',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/llms.txt`,
      `${baseUrl}/llms-full.txt`,
    ],
  };
}

