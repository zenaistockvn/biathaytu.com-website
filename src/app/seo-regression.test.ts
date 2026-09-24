import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getPublicBaseUrl } from '@/lib/seo/site';
import { getArticleSchema, getProductSchema } from './(web)/components/JsonLd';

const root = process.cwd();
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

function readContactConsumers(directory = join(root, 'src')): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = join(directory, entry.name);

      if (entry.isDirectory()) return [readContactConsumers(absolutePath)];
      if (!entry.isFile() || !/\.(ts|tsx)$/.test(entry.name) || /\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
      if (absolutePath === join(root, 'src/config/company.ts')) return [];

      return [readFileSync(absolutePath, 'utf8')];
    })
    .join('\n');
}

afterEach(() => {
  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }
});

describe('SEO and GEO regressions', () => {
  it('uses the public production host when env contains a localhost URL', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

    expect(getPublicBaseUrl()).toBe('https://www.biathaytu.com.vn');
  });

  it('keeps a valid public app URL from the environment', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://www.biathaytu.com.vn/';

    expect(getPublicBaseUrl()).toBe('https://www.biathaytu.com.vn');

    process.env.NEXT_PUBLIC_APP_URL = 'https://staging.example.vn/';
    expect(getPublicBaseUrl()).toBe('https://staging.example.vn');
  });

  it('uses biathaytu.com.vn even when the environment still points at the secondary .com domain', () => {
    for (const legacy of ['https://www.biathaytu.com', 'https://biathaytu.com/', 'https://biathaytu.com.vn']) {
      process.env.NEXT_PUBLIC_APP_URL = legacy;
      expect(getPublicBaseUrl(), legacy).toBe('https://www.biathaytu.com.vn');
    }
  });

  it('redirects every path on the secondary .com domain to the same path on biathaytu.com.vn', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nextConfig = require('../../next.config.js');
    const redirects: Array<{ source: string; destination: string; statusCode?: number; has?: Array<{ type: string; value: string }> }> = await nextConfig.redirects();
    for (const host of ['www.biathaytu.com', 'biathaytu.com']) {
      const rule = redirects.find((r) => r.has?.some((h) => h.type === 'host' && h.value === host));
      expect(rule, host).toMatchObject({ source: '/:path*', destination: 'https://www.biathaytu.com.vn/:path*', statusCode: 301 });
    }
    // Đổi domain phải chạy trước các redirect theo đường dẫn.
    expect(redirects[0].has?.[0]?.type).toBe('host');
  });

  it('article content from the database is served with the biathaytu.com.vn domain', async () => {
    const { getPublishedArticles } = await import('@/lib/data/articles');
    const leaks = getPublishedArticles()
      .filter((article) => /biathaytu\.com(?!\.vn)/i.test(article.content ?? ''))
      .map((article) => article.slug);
    expect(leaks).toEqual([]);
  });

  it('no source file hardcodes the secondary .com domain as a URL', () => {
    const offenders: string[] = [];
    (function walk(directory: string) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const absolutePath = join(directory, entry.name);
        if (entry.isDirectory()) walk(absolutePath);
        else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) {
          const content = readFileSync(absolutePath, 'utf8');
          // Bỏ qua biểu thức chính quy nhận diện link nội bộ (dạng biathaytu\.com).
          if (/https?:\/\/(?:www\.)?biathaytu\.com(?!\.vn)/.test(content)) offenders.push(absolutePath);
        }
      }
    })(join(root, 'src'));
    expect(offenders).toEqual([]);
  });

  it('lets product schema use the page canonical URL and absolute image URLs', () => {
    const canonicalUrl = 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub';
    const schema = getProductSchema({
      id: 'test-product-id',
      name: 'Benediktiner Weissbier Naturtrub',
      slug: 'benediktiner-weissbier-naturtrub',
      url: canonicalUrl,
      price: 100000,
      images: ['/images/products/official/benediktiner/bottle_removebg.png'],
    });

    expect(schema.url).toBe(canonicalUrl);
    expect(schema.image).toBe('https://www.biathaytu.com.vn/images/products/official/benediktiner/bottle_removebg.png');
    expect((schema as Record<string, unknown>).offers).toBeUndefined();
  });

  it('lets article schema use root landing canonical URLs and absolute image URLs', () => {
    const canonicalUrl = 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi';
    const schema = getArticleSchema({
      title: 'Bia Thay Tu La Gi?',
      slug: 'bia-thay-tu-la-gi',
      url: canonicalUrl,
      description: 'Nguon goc Bia Thay Tu.',
      imageUrl: '/images/products/story_monastery_v2.png',
      datePublished: '2026-04-24',
      dateModified: '2026-04-24',
    });

    expect(schema.mainEntityOfPage['@id']).toBe(canonicalUrl);
    expect(schema.image).toBe('https://www.biathaytu.com.vn/images/products/story_monastery_v2.png');
  });

  it('does not advertise missing language routes', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');

    expect(layout).not.toContain("`${BASE_URL}/en`");
  });

  it('uses permanent redirects for legacy blog URLs', () => {
    const blogPage = readProjectFile('src/app/(web)/blog/page.tsx');
    const blogSlugPage = readProjectFile('src/app/(web)/blog/[slug]/page.tsx');

    expect(blogPage).toContain("permanentRedirect('/kien-thuc')");
    expect(blogSlugPage).toContain('permanentRedirect(`/kien-thuc/${slug}`)');
  });

  it('sets page-specific OpenGraph URLs for root landing pages', () => {
    const productLanding = readProjectFile('src/app/(web)/benediktiner-weissbier-naturtrub/page.tsx');
    const articleLanding = readProjectFile('src/app/(web)/bia-thay-tu-la-gi/page.tsx');

    expect(productLanding).toContain("url: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub'");
    expect(articleLanding).toContain("url: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi'");
  });

  it('uses the current hotline and never leaks the legacy number across SEO surfaces', () => {
    const surfaces = [
      'src/app/(web)/page.tsx',
      'src/app/(web)/lien-he/page.tsx',
      'src/app/(web)/components/JsonLd.tsx',
      'src/app/llms.txt/route.ts',
    ]
      .map(readProjectFile)
      .join('\n');

    const companyConfig = readProjectFile('src/config/company.ts');

    expect(companyConfig).toContain("hotline: '0915 31 21 66'");
    expect(surfaces).toContain('COMPANY_CONFIG');
    // Bắt mọi biến thể số cũ: 915 312 166 / 915-312-166 / 915.312.166 / 915312166
    expect(surfaces).not.toMatch(/915[\s.\-]?312[\s.\-]?166/);
  });

  it('keeps canonical contact literals centralized in company config', () => {
    const consumers = readContactConsumers();

    expect(consumers).not.toContain('0915 31 21 66');
    expect(consumers).not.toContain('0915312166');
    expect(consumers).not.toContain('26 Vạn Phúc, Ba Đình, Hà Nội');
  });

  it('root layout uses brand metadata, not the internal AMC tool name', () => {
    const rootLayout = readProjectFile('src/app/layout.tsx');

    expect(rootLayout).not.toContain('AI Marketing Center');
    expect(rootLayout).toContain('metadataBase');
  });
});
