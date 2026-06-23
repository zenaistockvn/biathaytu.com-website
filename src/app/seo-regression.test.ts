import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getPublicBaseUrl } from '@/lib/seo/site';
import { getArticleSchema, getProductSchema } from './(web)/components/JsonLd';

const root = process.cwd();
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
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

    expect(getPublicBaseUrl()).toBe('https://www.biathaytu.com');
  });

  it('keeps a valid public app URL from the environment', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://www.biathaytu.com/';

    expect(getPublicBaseUrl()).toBe('https://www.biathaytu.com');
  });

  it('lets product schema use the page canonical URL and absolute image URLs', () => {
    const canonicalUrl = 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub';
    const schema = getProductSchema({
      id: 'test-product-id',
      name: 'Benediktiner Weissbier Naturtrub',
      slug: 'benediktiner-weissbier-naturtrub',
      url: canonicalUrl,
      price: 100000,
      images: ['/images/products/official/benediktiner/bottle_removebg.png'],
    });

    expect(schema.url).toBe(canonicalUrl);
    expect(schema.image).toBe('https://www.biathaytu.com/images/products/official/benediktiner/bottle_removebg.png');
    expect(schema.offers?.url).toBe(canonicalUrl);
  });

  it('lets article schema use root landing canonical URLs and absolute image URLs', () => {
    const canonicalUrl = 'https://www.biathaytu.com/bia-thay-tu-la-gi';
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
    expect(schema.image).toBe('https://www.biathaytu.com/images/products/story_monastery_v2.png');
  });

  it('does not advertise missing language routes', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');

    expect(layout).not.toContain("`${BASE_URL}/en`");
  });

  it('keeps checkout out of the index with its own canonical URL', () => {
    const checkoutLayout = readProjectFile('src/app/(web)/dat-hang/layout.tsx');

    expect(checkoutLayout).toContain("canonical: 'https://www.biathaytu.com/dat-hang'");
    expect(checkoutLayout).toContain('index: false');
    expect(checkoutLayout).toContain('follow: false');
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

    expect(productLanding).toContain("url: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub'");
    expect(articleLanding).toContain("url: 'https://www.biathaytu.com/bia-thay-tu-la-gi'");
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

    expect(surfaces).toContain('0899.191.313');
    // Bắt mọi biến thể số cũ: 915 312 166 / 915-312-166 / 915.312.166 / 915312166
    expect(surfaces).not.toMatch(/915[\s.\-]?312[\s.\-]?166/);
  });

  it('root layout uses brand metadata, not the internal AMC tool name', () => {
    const rootLayout = readProjectFile('src/app/layout.tsx');

    expect(rootLayout).not.toContain('AI Marketing Center');
    expect(rootLayout).toContain('metadataBase');
  });
});
