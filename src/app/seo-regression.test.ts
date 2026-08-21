import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { BRAND } from '@/lib/brand';
import { getAllProducts, MAX_SHORT_DESCRIPTION_LENGTH, PRODUCT_IMAGE_TODOS } from '@/lib/data/products';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/data/productImage';
import { normalizeBrandIdentity, toMetaDescription } from '@/lib/seo/metadataCopy';
import { getPublicBaseUrl } from '@/lib/seo/site';
import { getArticleSchema, getProductSchema } from './(web)/components/JsonLd';

const root = process.cwd();
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return listSourceFiles(path);
    return /\.(?:ts|tsx)$/.test(entry) && !entry.includes('.test.') ? [path] : [];
  });
}

afterEach(() => {
  if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
  else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
});

describe('German Taste brand, SEO and GEO regressions', () => {
  it('uses biathaytu.com.vn as the public production host', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    expect(getPublicBaseUrl()).toBe(BRAND.siteUrl);

    process.env.NEXT_PUBLIC_APP_URL = 'https://biathaytu.com.vn/';
    expect(getPublicBaseUrl()).toBe(BRAND.siteUrl);
  });

  it('keeps the approved German Taste identity in one BRAND object', () => {
    expect(BRAND.legalName).toBe('CÔNG TY TNHH GERMAN TASTE');
    expect(BRAND.taxCode).toBe('0110870013');
    expect(BRAND.showroomAddress).toBe('26 Vạn Phúc, Ba Đình, Hà Nội');
    expect(BRAND.hotline).toBe('0915 31 21 66');
    expect(BRAND.email).toBe('info@biathaytu.com.vn');
    expect(BRAND.siteUrl).toBe('https://biathaytu.com.vn');
    expect(BRAND.exclusivity).toBe('Nhà nhập khẩu và phân phối độc quyền Benediktiner Weissbräu tại Việt Nam');
    expect(BRAND.legalDisclaimer).toContain('18 tuổi');
  });

  it('normalizes known legacy identity strings and deletes the Tây Hồ product sentence', () => {
    const legacy = 'Công ty TNHH Euro Choice Việt Nam, 659A Lạc Long Quân, Tây Hồ. Hotline 0899.191.313. Email info@biathaytu.com. Phân phối chính hãng tại Tây Hồ, Hà Nội.';
    const normalized = normalizeBrandIdentity(legacy) || '';

    expect(normalized).toContain(BRAND.legalName);
    expect(normalized).toContain(BRAND.hotline);
    expect(normalized).toContain(BRAND.email);
    expect(normalized).not.toContain('Euro Choice');
    expect(normalized).not.toContain('659A');
    expect(normalized).not.toContain('Lạc Long Quân');
    expect(normalized).not.toContain('Tây Hồ');
    expect(normalized).not.toContain('Phân phối chính hãng tại');
  });

  it('keeps every catalog shortDescription complete and within 90 characters', () => {
    for (const product of getAllProducts()) {
      expect(product.shortDescription, product.slug).toBeTruthy();
      expect(product.shortDescription!.length, product.slug).toBeLessThanOrEqual(MAX_SHORT_DESCRIPTION_LENGTH);
      expect(product.shortDescription, product.slug).toMatch(/[.!?]$/);
    }
  });

  it('quarantines known product-image mismatches behind placeholder + TODO', () => {
    for (const slug of Object.keys(PRODUCT_IMAGE_TODOS)) {
      const product = getAllProducts().find((item) => item.slug === slug);
      expect(product, slug).toBeTruthy();
      expect(product!.images).toEqual([PRODUCT_IMAGE_PLACEHOLDER]);
      expect(product!.imageTodo).toMatch(/^TODO:/);
    }
  });

  it('has no meta keywords in application source', () => {
    const files = listSourceFiles(join(root, 'src', 'app'));
    const offenders = files
      .filter((file) => /\bkeywords\s*:/.test(readFileSync(file, 'utf8')))
      .map((file) => file.replace(`${root}/`, ''));

    expect(offenders).toEqual([]);
  });

  it('uses one shared header with the approved navigation and no /dat-hang label', () => {
    const header = readProjectFile('src/app/(web)/components/WebHeader.tsx');
    const language = readProjectFile('src/app/(web)/context/LanguageContext.tsx');
    const layout = readProjectFile('src/app/(web)/layout.tsx');

    expect(layout).toContain('<WebHeader />');
    expect(language).toContain("{ href: '/san-pham', label: 'Benediktiner' }");
    expect(language).toContain("{ href: '/thuong-hieu', label: 'Câu chuyện' }");
    expect(language).toContain("{ href: '/food-pairing-bia-duc', label: 'Thưởng thức' }");
    expect(language).toContain("{ href: '/kien-thuc', label: 'Kiến thức' }");
    expect(language).toContain("{ href: '/bia-duc-cho-nha-hang-khach-san', label: 'HORECA' }");
    expect(language).toContain("{ href: '/lien-he', label: 'Liên hệ tư vấn' }");
    expect(header).not.toContain('/dat-hang');
    expect(language).not.toContain("label: '/dat-hang'");
  });

  it('uses logo.png and no source code points at logo.jpg', () => {
    const appFiles = listSourceFiles(join(root, 'src', 'app'));
    const source = appFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
    expect(source).not.toContain('/logo.jpg');
    expect(source).toContain('/logo.png');
  });

  it('caps generated metadata copy at 155 characters without mid-word clipping', () => {
    const copy = toMetaDescription('Một mô tả rất dài '.repeat(30));
    expect(copy).toBeTruthy();
    expect(copy!.length).toBeLessThanOrEqual(155);
    expect(copy).toMatch(/[.!?]$/);
    expect(copy).not.toMatch(/\s\./);
  });

  it('lets product schema use the page canonical URL and absolute image URLs without offers', () => {
    const canonicalUrl = `${BRAND.siteUrl}/benediktiner-weissbier-naturtrub`;
    const schema = getProductSchema({
      id: 'test-product-id',
      name: 'Benediktiner Weissbier Naturtrub',
      slug: 'benediktiner-weissbier-naturtrub',
      url: canonicalUrl,
      price: 100000,
      images: ['/images/products/official/benediktiner/bottle_removebg.png'],
    });

    expect(schema.url).toBe(canonicalUrl);
    expect(schema.image).toBe(`${BRAND.siteUrl}/images/products/official/benediktiner/bottle_removebg.png`);
    expect((schema as Record<string, unknown>).offers).toBeUndefined();
  });

  it('lets article schema use current-domain canonicals and logo.png fallback', () => {
    const canonicalUrl = `${BRAND.siteUrl}/bia-thay-tu-la-gi`;
    const schema = getArticleSchema({
      title: 'Bia Thầy Tu Là Gì?',
      slug: 'bia-thay-tu-la-gi',
      url: canonicalUrl,
      description: 'Nguồn gốc Bia Thầy Tu.',
      datePublished: '2026-04-24',
      dateModified: '2026-04-24',
    });

    expect(schema.mainEntityOfPage['@id']).toBe(canonicalUrl);
    expect(schema.image).toBe(`${BRAND.siteUrl}/logo.png`);
  });

  it('does not advertise missing language routes', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');
    expect(layout).not.toContain('`${BASE_URL}/en`');
  });

  it('uses permanent redirects for legacy blog URLs', () => {
    const blogPage = readProjectFile('src/app/(web)/blog/page.tsx');
    const blogSlugPage = readProjectFile('src/app/(web)/blog/[slug]/page.tsx');
    expect(blogPage).toContain("permanentRedirect('/kien-thuc')");
    expect(blogSlugPage).toContain('permanentRedirect(`/kien-thuc/${slug}`)');
  });

  it('root layout uses brand metadata, not the internal AMC tool name', () => {
    const rootLayout = readProjectFile('src/app/layout.tsx');
    expect(rootLayout).not.toContain('AI Marketing Center');
    expect(rootLayout).toContain('metadataBase');
  });
});
