# SEO + GEO Fixes — Implementation Plan

> **For agentic workers (Antigravity / Claude / bất kỳ agent nào):** Plan ĐỘC LẬP, không cần ngữ cảnh hội thoại gốc. Làm **tuần tự từng Task**, mỗi Task theo Step nhỏ (test → fail → code → pass → commit). Dùng checkbox `- [ ]`. Chỉ qua Task sau khi Task hiện tại `tsc`/test xanh và đã commit.

**Goal:** Sửa các lỗi SEO kỹ thuật và GEO (Generative Engine Optimization) để AI (ChatGPT, Perplexity, Google AI Overview, Gemini, Claude) **tin tưởng, trích dẫn và đề xuất** biathaytu.com chính xác — trọng tâm: nhất quán thực thể (NAP), structured data đúng sự thật, đủ giá, hợp nhất llms.txt.

**Architecture:** Tạo 2 module nền (`src/lib/seo/business.ts` cho NAP + nhận diện thương hiệu; `src/lib/seo/productPricing.ts` cho khoảng giá dòng sản phẩm), refactor `JsonLd.tsx` để schema lấy dữ liệu từ nền này (brand động, offers đúng), rồi đồng bộ NAP trên toàn bộ trang + hợp nhất llms.txt.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Vitest 4. Không thêm thư viện mới.

---

## NAP chuẩn (đã được chủ sở hữu xác nhận — dùng XUYÊN SUỐT)
- **Tên:** Bia Thầy Tu
- **Địa chỉ:** 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội
- **Hotline/Zalo:** 0899.191.313  (E.164: `+84899191313`)
- **Email:** info@biathaytu.com
- **Website:** https://www.biathaytu.com

> ⚠️ Mọi nơi đang ghi **"218 Đội Cấn…"** đều SAI và phải đổi về địa chỉ trên. Mọi nơi ghi **"+84 915 312 166" / "+84-915-312-166"** đều là số CŨ, phải bỏ.

## Nguyên tắc GEO áp dụng
1. **Một sự thật duy nhất:** NAP + thương hiệu chỉ khai báo ở 1 nguồn (`business.ts`), nơi khác tham chiếu/đồng bộ. Mâu thuẫn nội bộ làm AI mất tin tưởng → không đề xuất.
2. **Structured data phải đúng sự thật:** không gắn brand/giải thưởng/luật bia cho sản phẩm không thuộc về nó (Bitburger, Köstritzer, rượu vang KHÔNG phải Benediktiner).
3. **Offers phải có giá:** trang dòng sản phẩm nhiều SKU dùng `AggregateOffer` (lowPrice/highPrice); trang 1 SKU dùng `Offer`.

## Tương tác với plan "Bỏ Supabase" (nếu có chạy)
Plan này ĐỘC LẬP, chạy trước/sau đều được. 3 file chạm chung với plan bỏ Supabase — **đều khác dòng, ít rủi ro**:
- `src/app/(web)/san-pham/[slug]/page.tsx` (Supabase plan đổi data-fetch; plan này đổi tham số `getProductSchema`).
- `src/app/sitemap.ts` (Supabase plan đổi data-fetch; plan này đổi `lastModified`).
- `src/app/llms.txt/route.ts` (Supabase plan đổi data-fetch; plan này đổi text NAP).
Nếu chạy cả hai: **làm plan này SAU** để các khối trên đã ổn định.

---

## File Structure
**Tạo mới:** `src/lib/seo/business.ts`, `src/lib/seo/productPricing.ts` + test tương ứng; test `src/app/(web)/components/JsonLd.test.ts`.
**Sửa:** `src/app/(web)/components/JsonLd.tsx` (Organization NAP, getProductSchema brand+offers, getFaqSchema generic); `san-pham/[slug]/page.tsx`; 4 product landing (`benediktiner-weissbier-naturtrub`, `benediktiner-dunkel`, `bom-bia-5l-benediktiner`, `bitburger-premium-pils`); NAP text ở `ve-chung-toi`, `lien-he`, `mua-bia-benediktiner-chinh-hang`, `bia-thay-tu-la-gi`, `page.tsx`; `llms.txt/route.ts`; `sitemap.ts`; cannibalization (`bia-benediktiner-chinh-hang` + `mua-bia-benediktiner-chinh-hang`); FAQ (`bia-thay-tu-la-gi`, `food-pairing-bia-duc`).
**Xóa:** `public/llms.txt` (file chết — route động `/llms.txt` luôn thắng).
**KHÔNG đụng:** 3 file `*-regression.test.ts` (giữ xanh).

---

## Task 1: Module nền — NAP + nhận diện thương hiệu (`src/lib/seo/business.ts`)

**Files:** Create `src/lib/seo/business.ts`, Test `src/lib/seo/business.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/seo/business.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { BUSINESS, getBrandInfo } from './business';

describe('seo/business', () => {
  it('exposes the canonical NAP', () => {
    expect(BUSINESS.streetAddress).toBe('659A Lạc Long Quân');
    expect(BUSINESS.phoneE164).toBe('+84899191313');
    expect(BUSINESS.phoneDisplay).toBe('0899.191.313');
  });

  it('identifies Bitburger and Köstritzer as their own beer brands', () => {
    expect(getBrandInfo('Bitburger Premium Pils').brand).toBe('Bitburger');
    expect(getBrandInfo('Bitburger Premium Pils').isAwardWinner).toBe(false);
    expect(getBrandInfo('Köstritzer Schwarzbier Bom 5L').brand).toBe('Köstritzer');
    expect(getBrandInfo('Köstritzer Schwarzbier Bom 5L').isBeer).toBe(true);
  });

  it('treats wine as non-beer with its own brand (no Reinheitsgebot/award)', () => {
    const info = getBrandInfo('Vang Trắng Thörle Riesling 750ml', 'vang');
    expect(info.isBeer).toBe(false);
    expect(info.isAwardWinner).toBe(false);
    expect(info.brand).toBe('Thörle');
  });

  it('marks Benediktiner Weissbier Naturtrüb as award winner, Dunkel not', () => {
    expect(getBrandInfo('Benediktiner Naturtrüb — Thùng 12 Chai 500ml').brand).toBe('Benediktiner');
    expect(getBrandInfo('Benediktiner Naturtrüb — Thùng 12 Chai 500ml').isAwardWinner).toBe(true);
    expect(getBrandInfo('Benediktiner Dunkel — Thùng 12 Lon 500ml').isAwardWinner).toBe(false);
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/seo/business.test.ts`
Expected: FAIL — không tìm thấy `./business`.

- [ ] **Step 3: Viết implementation**

`src/lib/seo/business.ts`:
```ts
/** Nguồn sự thật duy nhất cho NAP (Name-Address-Phone) của Bia Thầy Tu. */
export const BUSINESS = {
  name: 'Bia Thầy Tu',
  legalName: 'Bia Thầy Tu (Benediktiner Vietnam)',
  streetAddress: '659A Lạc Long Quân',
  addressLocality: 'Phường Tây Hồ',
  addressRegion: 'Hà Nội',
  addressCountry: 'VN',
  addressFull: '659A Lạc Long Quân, Phường Tây Hồ, Hà Nội',
  phoneDisplay: '0899.191.313',
  phoneE164: '+84899191313',
  phoneTel: '0899191313',
  email: 'info@biathaytu.com',
  zaloUrl: 'https://zalo.me/0899191313',
  websiteUrl: 'https://www.biathaytu.com',
} as const;

export interface BrandInfo {
  brand: string;
  manufacturer: string | null;
  manufacturerCountry: string;
  isBeer: boolean;        // category bia → áp Reinheitsgebot 1516
  isAwardWinner: boolean; // chỉ Benediktiner Weissbier/Naturtrüb đạt iTQi 3 sao
}

/** Suy ra thương hiệu/nhà sản xuất từ tên sản phẩm — KHÔNG hardcode Benediktiner cho tất cả. */
export function getBrandInfo(name: string, category?: string | null): BrandInfo {
  const n = (name || '').toLowerCase();
  const isWine =
    category === 'vang' ||
    /riesling|spätburgunder|spatburgunder|sauvignon|kabinett|auslese|trocken|rappenhof|thörle|thorle|austernkalk|\bvang\b/.test(n);

  if (n.includes('bitburger')) {
    return { brand: 'Bitburger', manufacturer: 'Bitburger Braugruppe GmbH', manufacturerCountry: 'DE', isBeer: true, isAwardWinner: false };
  }
  if (n.includes('köstritzer') || n.includes('kostritzer')) {
    return { brand: 'Köstritzer', manufacturer: 'Köstritzer Schwarzbierbrauerei', manufacturerCountry: 'DE', isBeer: true, isAwardWinner: false };
  }
  if (isWine) {
    let brand = 'Rượu vang Đức';
    if (n.includes('rappenhof')) brand = 'Rappenhof';
    else if (n.includes('thörle') || n.includes('thorle')) brand = 'Thörle';
    else if (n.includes('austernkalk')) brand = 'Austernkalk';
    return { brand, manufacturer: null, manufacturerCountry: 'DE', isBeer: false, isAwardWinner: false };
  }
  const isAwardWinner = n.includes('naturtrüb') || n.includes('naturtrub') || n.includes('weissbier');
  return { brand: 'Benediktiner', manufacturer: 'Benediktiner Weißbräu GmbH', manufacturerCountry: 'DE', isBeer: true, isAwardWinner };
}
```

- [ ] **Step 4: Chạy cho pass**

Run: `npm run test -- src/lib/seo/business.test.ts`
Expected: PASS (4 test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/business.ts src/lib/seo/business.test.ts
git commit -m "feat(seo): single source of truth for NAP + brand identification"
```

---

## Task 2: Khoảng giá dòng sản phẩm (`src/lib/seo/productPricing.ts`)

**Files:** Create `src/lib/seo/productPricing.ts`, Test `src/lib/seo/productPricing.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/seo/productPricing.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { getPriceRange } from './productPricing';

describe('seo/productPricing', () => {
  it('aggregates the Naturtrüb product line price range', () => {
    const range = getPriceRange((p) => p.name.includes('Naturtrüb'));
    expect(range).not.toBeNull();
    expect(range!.lowPrice).toBe(790000);
    expect(range!.highPrice).toBe(1550000);
    expect(range!.offerCount).toBeGreaterThanOrEqual(3);
  });

  it('ignores products without a numeric price', () => {
    // "Bitburger Premium Pils" (slug bitburger-premium-pils) có price=null phải bị bỏ
    const range = getPriceRange((p) => p.name.includes('Bitburger'));
    expect(range).not.toBeNull();
    expect(range!.lowPrice).toBeGreaterThan(0);
    expect(range!.lowPrice).toBeLessThanOrEqual(range!.highPrice);
  });

  it('returns null when nothing matches', () => {
    expect(getPriceRange(() => false)).toBeNull();
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/seo/productPricing.test.ts`
Expected: FAIL — không tìm thấy `./productPricing`.

- [ ] **Step 3: Viết implementation**

`src/lib/seo/productPricing.ts`:
```ts
import productsData from '@/data/products.json';

interface RawProduct {
  name: string;
  slug: string | null;
  price: number | null;
  category: string | null;
}

export interface PriceRange {
  lowPrice: number;
  highPrice: number;
  offerCount: number;
}

/**
 * Tính khoảng giá của một dòng sản phẩm (nhiều SKU) từ products.json.
 * Bỏ qua sản phẩm không có giá số dương. Trả null nếu không có SKU nào hợp lệ.
 */
export function getPriceRange(
  predicate: (p: { name: string; category: string | null }) => boolean,
): PriceRange | null {
  const prices = (productsData as unknown as RawProduct[])
    .filter((p) => predicate({ name: p.name || '', category: p.category }))
    .map((p) => p.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  if (prices.length === 0) return null;
  return { lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length };
}
```

- [ ] **Step 4: Chạy cho pass**

Run: `npm run test -- src/lib/seo/productPricing.test.ts`
Expected: PASS (3 test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/productPricing.ts src/lib/seo/productPricing.test.ts
git commit -m "feat(seo): aggregate product-line price range from data"
```

---

## Task 3: Refactor Organization schema (NAP) + tách FAQ schema generic

**Files:** Modify `src/app/(web)/components/JsonLd.tsx`

- [ ] **Step 1: Thêm import BUSINESS ở đầu file**

Sau dòng `import { getPublicBaseUrl, toAbsoluteSiteUrl } from '@/lib/seo/site';` thêm:
```ts
import { BUSINESS, getBrandInfo } from '@/lib/seo/business';
```

- [ ] **Step 2: Sửa `getOrganizationSchema` dùng BUSINESS (NAP + phone đúng)**

Tìm khối:
```ts
    address: {
      '@type': 'PostalAddress',
      streetAddress: '218 Đội Cấn, Phường Liễu Giai',
      addressLocality: 'Quận Ba Đình',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-915-312-166',
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
      areaServed: 'VN',
    },
```
Thay bằng:
```ts
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phoneE164,
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
      areaServed: 'VN',
    },
```

- [ ] **Step 3: Sửa địa chỉ trong FAQ answer (dòng ~177)**

Tìm: `hoặc tại Showroom 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc.`
Thay: `hoặc tại Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc.`

- [ ] **Step 4: Thêm `getFaqSchema` generic (tái sử dụng)**

Tìm:
```ts
export function getLandingFAQSchema() {
  const faqs = [
```
Thay bằng (chèn hàm generic phía trên, rồi cho getLandingFAQSchema dùng lại):
```ts
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function getLandingFAQSchema() {
  const faqs = [
```
Sau đó ở CUỐI `getLandingFAQSchema`, tìm khối return:
```ts
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
```
Thay bằng:
```ts
  return getFaqSchema(faqs);
}
```

- [ ] **Step 5: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/components/JsonLd.tsx"
git commit -m "fix(seo): Organization NAP from single source, extract reusable FAQ schema"
```

---

## Task 4: Refactor `getProductSchema` — brand động + offers đúng

**Files:** Modify `src/app/(web)/components/JsonLd.tsx`, Test `src/app/(web)/components/JsonLd.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/app/(web)/components/JsonLd.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { getProductSchema } from './JsonLd';

describe('getProductSchema brand + offers', () => {
  it('uses the real brand for Bitburger (not Benediktiner)', () => {
    const s = getProductSchema({ name: 'Bitburger Premium Pils', slug: 'bitburger-premium-pils', category: 'bia' });
    expect(s.brand.name).toBe('Bitburger');
    // KHÔNG gắn giải iTQi cho Bitburger
    expect((s as Record<string, unknown>).award).toBeUndefined();
  });

  it('does not apply Reinheitsgebot/award to wine', () => {
    const s = getProductSchema({ name: 'Vang Trắng Thörle Riesling 750ml', slug: 'thorle-riesling', category: 'vang' });
    expect(s.brand.name).toBe('Thörle');
    const props = (s.additionalProperty as Array<{ name: string }>).map((p) => p.name);
    expect(props).not.toContain('Brewing Standard');
  });

  it('emits a single Offer when price is given', () => {
    const s = getProductSchema({ name: 'Benediktiner Naturtrüb', slug: 'x', price: 990000, category: 'bia' });
    expect(s.offers?.['@type']).toBe('Offer');
    expect(s.offers?.price).toBe(990000);
    expect((s as Record<string, unknown>).award).toBe('iTQi Superior Taste Award 3 Stars 2022');
  });

  it('emits an AggregateOffer for a product line price range', () => {
    const s = getProductSchema({ name: 'Benediktiner Naturtrüb', slug: 'x', priceFrom: 790000, priceTo: 1550000, offerCount: 4, category: 'bia' });
    expect(s.offers?.['@type']).toBe('AggregateOffer');
    expect(s.offers?.lowPrice).toBe(790000);
    expect(s.offers?.highPrice).toBe(1550000);
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- "src/app/(web)/components/JsonLd.test.ts"`
Expected: FAIL — brand vẫn 'Benediktiner' / chưa hỗ trợ AggregateOffer.

- [ ] **Step 3: Thay TOÀN BỘ hàm `getProductSchema`**

Tìm hàm `export function getProductSchema(product: {...}) { ... }` (từ `export function getProductSchema` đến dấu `}` đóng hàm, ngay trước `export function getBreadcrumbSchema`) và thay bằng:
```ts
export function getProductSchema(product: {
  name: string;
  slug: string;
  url?: string;
  description?: string;
  price?: number;
  priceFrom?: number;
  priceTo?: number;
  offerCount?: number;
  images?: string[];
  abv?: string;
  volume?: string;
  category?: string | null;
}) {
  const productUrl = product.url || `${BASE_URL}/san-pham/${product.slug}`;
  const info = getBrandInfo(product.name, product.category);

  let offers: Record<string, unknown> | undefined;
  if (typeof product.price === 'number') {
    offers = {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}/#organization` },
    };
  } else if (typeof product.priceFrom === 'number') {
    offers = {
      '@type': 'AggregateOffer',
      url: productUrl,
      priceCurrency: 'VND',
      lowPrice: product.priceFrom,
      ...(typeof product.priceTo === 'number' ? { highPrice: product.priceTo } : {}),
      ...(typeof product.offerCount === 'number' ? { offerCount: product.offerCount } : {}),
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}/#organization` },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: productUrl,
    image: toAbsoluteSiteUrl(product.images?.[0] || '/logo.jpg', BASE_URL),
    description: product.description || `${product.name} — nhập khẩu chính hãng từ Đức.`,
    brand: { '@type': 'Brand', name: info.brand },
    ...(info.manufacturer
      ? {
          manufacturer: {
            '@type': 'Organization',
            name: info.manufacturer,
            address: { '@type': 'PostalAddress', addressCountry: info.manufacturerCountry, addressRegion: 'Bavaria' },
          },
        }
      : {}),
    countryOfOrigin: { '@type': 'Country', name: 'Germany' },
    ...(offers ? { offers } : {}),
    additionalProperty: [
      ...(product.abv ? [{ '@type': 'PropertyValue', name: 'Alcohol by Volume', value: `${product.abv}%` }] : []),
      ...(product.volume ? [{ '@type': 'PropertyValue', name: 'Volume', value: product.volume }] : []),
      { '@type': 'PropertyValue', name: 'Origin', value: 'Germany (Bavaria)' },
      ...(info.isBeer
        ? [{ '@type': 'PropertyValue', name: 'Brewing Standard', value: 'Reinheitsgebot 1516 (German Purity Law)' }]
        : []),
    ],
    ...(info.isAwardWinner ? { award: 'iTQi Superior Taste Award 3 Stars 2022' } : {}),
  };
}
```

- [ ] **Step 4: Chạy cho pass + bảo đảm seo-regression vẫn xanh**

Run: `npm run test -- "src/app/(web)/components/JsonLd.test.ts" src/app/seo-regression.test.ts`
Expected: PASS toàn bộ (seo-regression vẫn pass vì `schema.url`/`schema.image`/`schema.offers.url` không đổi).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(web)/components/JsonLd.tsx" "src/app/(web)/components/JsonLd.test.ts"
git commit -m "fix(seo): correct brand/manufacturer per product, support AggregateOffer"
```

---

## Task 5: Áp brand đúng cho trang chi tiết sản phẩm `/san-pham/[slug]`

**Files:** Modify `src/app/(web)/san-pham/[slug]/page.tsx`

- [ ] **Step 1: Truyền `category` vào getProductSchema**

Tìm:
```tsx
      <JsonLd type="product" data={getProductSchema({
        name: product.name,
        slug: product.slug || product.id,
        description: product.description || undefined,
        price: product.price || undefined,
        images: product.images || undefined,
        abv: product.abv || undefined,
        volume: product.volume || undefined,
      })} />
```
Thay bằng (thêm `category` — brand sẽ tự suy đúng cho Bitburger/Köstritzer/vang):
```tsx
      <JsonLd type="product" data={getProductSchema({
        name: product.name,
        slug: product.slug || product.id,
        description: product.description || undefined,
        price: product.price || undefined,
        images: product.images || undefined,
        abv: product.abv || undefined,
        volume: product.volume || undefined,
        category: product.category,
      })} />
```

> `ProductData` interface trong file này cần có `category`. Nếu chưa có, thêm `category: string | null;` vào interface `ProductData` (khối query đã select `category`).

- [ ] **Step 2: Đảm bảo interface có `category`**

Trong `interface ProductData { ... }`, nếu thiếu, thêm dòng:
```ts
  category: string | null;
```

- [ ] **Step 3: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/san-pham/[slug]/page.tsx"
git commit -m "fix(seo): pass category so product detail schema uses correct brand"
```

---

## Task 6: Áp brand + giá (AggregateOffer) cho 4 trang landing sản phẩm

**Files:** Modify `benediktiner-weissbier-naturtrub`, `benediktiner-dunkel`, `bom-bia-5l-benediktiner`, `bitburger-premium-pils` (đều trong `src/app/(web)/`)

> Mỗi landing là một *dòng* nhiều SKU → dùng `getPriceRange` để có giá "từ … đến …".

- [ ] **Step 1: `benediktiner-weissbier-naturtrub/page.tsx`**

Thêm import (cạnh import JsonLd):
```ts
import { getPriceRange } from '@/lib/seo/productPricing';
```
Trong `export default function Page()`, ngay trước `return (`, thêm:
```ts
  const priceRange = getPriceRange((p) => p.name.includes('Naturtrüb'));
```
Sửa lời gọi schema — tìm:
```tsx
      <JsonLd type="product" data={getProductSchema(product)} />
```
Thay bằng:
```tsx
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
```

- [ ] **Step 2: `benediktiner-dunkel/page.tsx`** — như trên, predicate Dunkel

Thêm `import { getPriceRange } from '@/lib/seo/productPricing';`
Trước `return (`: 
```ts
  const priceRange = getPriceRange((p) => p.name.includes('Dunkel'));
```
Sửa `getProductSchema(product)` → `getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })`

- [ ] **Step 3: `bom-bia-5l-benediktiner/page.tsx`** — predicate Benediktiner Bom 5L

Thêm `import { getPriceRange } from '@/lib/seo/productPricing';`
Trước `return (`:
```ts
  const priceRange = getPriceRange((p) => p.name.includes('Bom 5L') && p.name.includes('Benediktiner'));
```
Sửa `getProductSchema(product)` → `getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })`

- [ ] **Step 4: `bitburger-premium-pils/page.tsx`** — predicate Bitburger

Thêm `import { getPriceRange } from '@/lib/seo/productPricing';`
Trước `return (`:
```ts
  const priceRange = getPriceRange((p) => p.name.includes('Bitburger'));
```
Sửa `getProductSchema(product)` → `getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })`

> Brand "Bitburger" sẽ tự đúng nhờ `getBrandInfo`. Không cần sửa gì thêm.

- [ ] **Step 5: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/benediktiner-weissbier-naturtrub/page.tsx" "src/app/(web)/benediktiner-dunkel/page.tsx" "src/app/(web)/bom-bia-5l-benediktiner/page.tsx" "src/app/(web)/bitburger-premium-pils/page.tsx"
git commit -m "fix(seo): add price (AggregateOffer) + correct brand to product landing schema"
```

---

## Task 7: Đồng bộ NAP text trên toàn bộ trang (sửa "218 Đội Cấn" → "659A Lạc Long Quân")

**Files:** Modify `ve-chung-toi`, `bia-thay-tu-la-gi`, `mua-bia-benediktiner-chinh-hang`, `lien-he`, `page.tsx`

- [ ] **Step 1: `ve-chung-toi/page.tsx`**

Tìm: `<p><strong>Showroom bán lẻ:</strong> 218 Đội Cấn, Quận Ba Đình, TP. Hà Nội</p>`
Thay: `<p><strong>Showroom bán lẻ:</strong> 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội</p>`

Tìm: `<p><strong>Cơ sở:</strong> 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc. Số điện thoại (Hotline / Zalo): 0899.191.313.</p>`
Thay: `<p><strong>Cơ sở:</strong> 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc. Số điện thoại (Hotline / Zalo): 0899.191.313.</p>`

- [ ] **Step 2: `bia-thay-tu-la-gi/page.tsx`**

Tìm: `Showroom 218 Đội Cấn, Hà Nội.`
Thay: `Showroom 659A Lạc Long Quân, Tây Hồ, Hà Nội.`

- [ ] **Step 3: `mua-bia-benediktiner-chinh-hang/page.tsx`** (2 chỗ)

Tìm: `hoặc ghé Showroom 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc — miễn phí nội thành Hà Nội.`
Thay: `hoặc ghé Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc — miễn phí nội thành Hà Nội.`

Tìm: `Zalo 0899.191.313 · Showroom 218 Đội Cấn, Hà Nội.`
Thay: `Zalo 0899.191.313 · Showroom 659A Lạc Long Quân, Tây Hồ, Hà Nội.`

- [ ] **Step 4: `lien-he/page.tsx`** (body — metadata đã đúng 659A)

Tìm: `<span className="muted">218 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, Hà Nội</span>`
Thay: `<span className="muted">659A Lạc Long Quân, Phường Tây Hồ, Hà Nội</span>`

- [ ] **Step 5: `page.tsx` (FAQ homepage)**

Tìm: `hoặc tại Showroom 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc.`
Thay: `hoặc tại Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc.`

- [ ] **Step 6: Verify không còn "218 Đội Cấn" + commit**

Run: `git grep -n "218 Đội Cấn" -- "src/"` → Expected: KHÔNG còn kết quả.
```bash
git add -A
git commit -m "fix(seo): unify showroom address to 659A Lạc Long Quân across all pages"
```

---

## Task 8: Hợp nhất llms.txt + xóa số điện thoại cũ

**Files:** Modify `src/app/llms.txt/route.ts`, Delete `public/llms.txt`

- [ ] **Step 1: Sửa hotline trong llms route (bỏ số cũ)**

Tìm: `markdown += `- **Hotline đặt hàng:** 0899.191.313 / +84 915 312 166\n`;`
Thay: `markdown += `- **Hotline đặt hàng:** 0899.191.313\n`;`

- [ ] **Step 2: Xóa file llms.txt tĩnh (chết — route động luôn thắng)**

```bash
git rm "public/llms.txt"
```

> Giữ `public/llms-full.txt` (được phục vụ tại `/llms-full.txt`, không trùng route). Đã dùng đúng hotline 0899.191.313 và không chứa địa chỉ mâu thuẫn — không cần sửa.

- [ ] **Step 3: Verify số cũ đã sạch toàn repo nguồn + commit**

Run: `git grep -n "915 312 166\|915312166\|915\.312\.166" -- "src/" "public/"` → Expected: KHÔNG còn kết quả.
```bash
git add -A
git commit -m "fix(seo): single llms.txt source, drop legacy phone number"
```

---

## Task 9: Tín hiệu độ tươi (freshness) — ngày thật thay vì new Date()

**Files:** Modify `src/app/sitemap.ts`

> Mục tiêu: base routes + landing pages không "thay đổi" giả mỗi lần build. Dùng một hằng ngày cập nhật nội dung.

- [ ] **Step 1: Thêm hằng ngày cập nhật ở đầu hàm sitemap**

Trong `export default async function sitemap()`, ngay sau dòng `const baseUrl = getPublicBaseUrl();` thêm:
```ts
  // Ngày cập nhật nội dung tĩnh gần nhất (cập nhật thủ công khi sửa landing/nội dung)
  const CONTENT_LAST_UPDATED = new Date('2026-06-14');
```

- [ ] **Step 2: Thay `new Date()` cho base routes + landing**

Trong mảng `routes` (5 base route) và vòng lặp `landingPages`, đổi mọi `lastModified: new Date(),` thành `lastModified: CONTENT_LAST_UPDATED,`.

> Giữ nguyên `lastModified: new Date(product.updated_at || ...)` và `new Date(article.updated_at || ...)` cho products/articles (đó là ngày thật từ dữ liệu).

- [ ] **Step 3: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/sitemap.ts"
git commit -m "fix(seo): stable lastModified for static routes (real freshness signal)"
```

---

## Task 10: Giải quyết keyword cannibalization (2 trang Benediktiner)

**Files:** Modify `bia-benediktiner-chinh-hang/page.tsx`, `mua-bia-benediktiner-chinh-hang/page.tsx`

> Chiến lược: phân hóa intent rõ ràng + liên kết chéo (giữ cả 2 vì đã index).
> - `bia-benediktiner-chinh-hang` = trang **THÔNG TIN/THƯƠNG HIỆU** ("Benediktiner chính hãng là gì, vì sao nhận biết").
> - `mua-bia-benediktiner-chinh-hang` = trang **GIAO DỊCH** ("mua ở đâu, giá, giao hàng").

- [ ] **Step 1: Phân hóa metadata `bia-benediktiner-chinh-hang/page.tsx`**

Đổi `title` (cả `metadata.title`, `openGraph.title`, `twitter.title`) từ:
`'Bia Benediktiner Chính Hãng — Nhập Khẩu Nguyên Chai Từ Đức'`
thành:
`'Bia Benediktiner Chính Hãng Là Gì? Cách Nhận Biết Hàng Thật'`
Đổi `description` (cả 3 nơi) thành:
`'Tìm hiểu thương hiệu bia Benediktiner chính hãng từ Tu Viện Ettal: dấu hiệu nhận biết hàng nhập khẩu nguyên chai, phân biệt thật–giả, tiêu chuẩn Reinheitsgebot 1516.'`

- [ ] **Step 2: Thêm liên kết chéo sang trang mua trong `bia-benediktiner-chinh-hang/page.tsx`**

Ngay trước thẻ đóng cuối của khối nội dung (trước `</article>` hoặc khối CTA cuối), thêm 1 dòng liên kết (đặt cạnh đoạn CTA hiện có):
```tsx
          <p style={{ marginTop: '16px' }}>Sẵn sàng đặt mua? Xem <a href="/mua-bia-benediktiner-chinh-hang" style={{ color: 'var(--web-gold-dark)', fontWeight: 600 }}>giá &amp; cách mua bia Benediktiner chính hãng →</a></p>
```

- [ ] **Step 3: Thêm liên kết chéo ngược trong `mua-bia-benediktiner-chinh-hang/page.tsx`**

Gần đầu phần nội dung (sau đoạn "Mua bia Benediktiner ở đâu?"), thêm:
```tsx
          <p style={{ marginTop: '12px' }}>Chưa rõ Benediktiner chính hãng là gì? Đọc <a href="/bia-benediktiner-chinh-hang" style={{ color: 'var(--web-gold-dark)', fontWeight: 600 }}>cách nhận biết bia Benediktiner chính hãng →</a></p>
```

- [ ] **Step 4: Build kiểm tra + commit**

Run: `npm run build` → Expected: thành công, 2 trang có title khác biệt.
```bash
git add "src/app/(web)/bia-benediktiner-chinh-hang/page.tsx" "src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx"
git commit -m "fix(seo): differentiate intent of two Benediktiner pages + cross-link"
```

---

## Task 11: FAQ schema + Q&A hiển thị cho 2 landing (AI Overview / People-Also-Ask)

**Files:** Modify `bia-thay-tu-la-gi/page.tsx`, `food-pairing-bia-duc/page.tsx`

> Google yêu cầu FAQ schema khớp Q&A **hiển thị trên trang** → thêm cả phần hiển thị lẫn schema.

- [ ] **Step 1: `bia-thay-tu-la-gi/page.tsx` — thêm import + dữ liệu FAQ**

Sửa dòng import JsonLd để gồm `getFaqSchema`. Ví dụ nếu hiện là:
```ts
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
```
thành:
```ts
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from '../components/JsonLd';
```
Trong `export default function Page()`, trước `return (`, thêm:
```ts
  const faqs = [
    { question: 'Bia Thầy Tu là bia gì?', answer: 'Bia Thầy Tu là tên gọi tại Việt Nam của dòng bia lúa mì Đức Benediktiner Weissbier, được ủ theo truyền thống tu viện Ettal (Bavaria) từ năm 1609, tuân thủ Luật Tinh Khiết Reinheitsgebot 1516.' },
    { question: 'Vì sao gọi là "bia thầy tu"?', answer: 'Vì bia Benediktiner gắn với phương pháp ủ bia của các tu sĩ dòng Benedictine tại Tu Viện Ettal — nơi gìn giữ công thức và tiêu chuẩn ủ bia suốt hơn 400 năm.' },
    { question: 'Bia Thầy Tu mua ở đâu chính hãng?', answer: 'Đặt mua tại website biathaytu.com, Zalo/Hotline 0899.191.313, hoặc Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc.' },
  ];
```

- [ ] **Step 2: Thêm JsonLd FAQ + section hiển thị**

Ngay sau dòng `<JsonLd type="breadcrumb" ... />` đầu trang, thêm:
```tsx
      <JsonLd type="faq" data={getFaqSchema(faqs)} />
```
Trước thẻ đóng ngoài cùng của trang (cuối `return`, trước `</div>` cuối), thêm khối hiển thị:
```tsx
      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Câu Hỏi Thường Gặp</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>{f.question}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.7 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
```

- [ ] **Step 3: `food-pairing-bia-duc/page.tsx` — lặp lại với FAQ phù hợp**

Thêm `getFaqSchema` vào import JsonLd (như Step 1). Thêm trước `return (`:
```ts
  const faqs = [
    { question: 'Bia Đức ăn với món gì ngon?', answer: 'Weissbier hợp hải sản hấp, gà nướng, phô mai mềm; Dunkel hợp steak, sườn BBQ, chocolate đen; Pilsner hợp pizza, đồ nhắm, BBQ. Bia lúa mì Đức cũng rất hợp món Việt như phở và hải sản.' },
    { question: 'Uống bia Đức ở nhiệt độ nào ngon nhất?', answer: 'Weissbier và Dunkel ngon nhất ở 6–8°C; Pilsner ở 4–6°C. Dùng đúng loại ly (ly Weizen cao cho bia lúa mì) để giữ bọt và hương.' },
    { question: 'Bia lúa mì khác bia thường thế nào?', answer: 'Bia lúa mì (Weissbier) dùng nhiều malt lúa mì, lên men đỉnh, thường không lọc (Naturtrüb) nên đục tự nhiên, hương chuối chín và đinh hương đặc trưng, bọt dày.' },
  ];
```
Thêm `<JsonLd type="faq" data={getFaqSchema(faqs)} />` cạnh các JsonLd đầu trang, và chèn cùng khối `<section>` hiển thị FAQ như Step 2 trước thẻ đóng cuối trang.

- [ ] **Step 4: Build + commit**

Run: `npm run build` → Expected: thành công.
```bash
git add "src/app/(web)/bia-thay-tu-la-gi/page.tsx" "src/app/(web)/food-pairing-bia-duc/page.tsx"
git commit -m "feat(seo): add visible FAQ + FAQPage schema to key landing pages"
```

---

## Task 12: Verify toàn diện

**Files:** không sửa — chỉ kiểm tra.

- [ ] **Step 1:** `npm run test` → tất cả PASS (3 regression cũ + business + productPricing + JsonLd mới).
- [ ] **Step 2:** `npx tsc --noEmit` → 0 lỗi.
- [ ] **Step 3:** `npm run build` → thành công.
- [ ] **Step 4: Kiểm tra nhất quán cuối**

```bash
git grep -n "218 Đội Cấn" -- "src/"
git grep -n "915 312 166\|915312166" -- "src/" "public/"
```
Cả hai phải KHÔNG còn kết quả.

- [ ] **Step 5: Kiểm thử structured data thủ công (sau deploy hoặc dev)**

- Mở Google Rich Results Test cho `/san-pham/bitburger-premium-pils-thung-12-chai-330ml` → brand phải là **Bitburger**, không phải Benediktiner.
- Mở 1 trang vang `/san-pham/thorle-riesling` → KHÔNG có "Reinheitsgebot"/award; brand là Thörle.
- `/benediktiner-weissbier-naturtrub` → Product có `AggregateOffer` với lowPrice.
- Truy cập `/llms.txt` → hotline chỉ còn 0899.191.313, địa chỉ 659A Lạc Long Quân.

---

## Ngoài phạm vi / ghi nhận (KHÔNG làm tự động)

1. **aggregateRating / review schema** (để có sao vàng SERP): cần review THẬT gắn từng sản phẩm và hiển thị trên trang đó; không tự thêm để tránh vi phạm chính sách Google structured data. Cân nhắc chuyển Organization → `LocalBusiness` + `aggregateRating` khớp 6 testimonial hiển thị ở trang chủ (làm riêng, có kiểm soát).
2. **hreflang / bản tiếng Anh thật**: LanguageSwitcher đổi vi/en/de client-side, Google/AI chỉ thấy bản tiếng Việt. Chỉ cần xử lý nếu muốn AI quốc tế (hỏi tiếng Anh) đề xuất — đầu tư i18n route-based (`/en`).
3. **OG image đặc trưng từng sản phẩm** + rút gọn `<title>` >60 ký tự: cải thiện CTR/hiển thị, mức Low.
4. **Article author E-E-A-T**: `getArticleSchema` author mặc định "Bia Thầy Tu" dạng Person — cân nhắc tác giả thật có hồ sơ.

---

## Self-Review (tác giả tự rà)

**1. Spec coverage (so với audit SEO/GEO):**
- #1 NAP mâu thuẫn → Task 1 (nguồn chuẩn) + Task 3 (Org schema) + Task 7 (text) + Task 8 (llms/phone) ✅
- #2 brand sai (Bitburger/vang) → Task 4 + 5 + 6 ✅
- #3 hợp nhất llms.txt → Task 8 ✅
- #4 thiếu giá Product schema → Task 2 + Task 6 (AggregateOffer) ✅
- #5 cannibalization → Task 10 ✅
- #7 FAQ schema landing → Task 11 ✅
- #8 freshness → Task 9 ✅
- #6 rating, #9 hreflang, #10–13 → mục "ngoài phạm vi" (có lý do) ✅

**2. Placeholder scan:** Không có TBD/TODO. Mọi step có code/lệnh cụ thể, NAP giá trị thật. ✅

**3. Type consistency:** `BUSINESS`, `BrandInfo`, `getBrandInfo`, `PriceRange`, `getPriceRange`, `getFaqSchema`, `getProductSchema` (mở rộng tham số `priceFrom/priceTo/offerCount/category`) dùng nhất quán giữa các task. seo-regression test giữ xanh vì `schema.url/image/offers.url` không đổi. ✅

**4. Ambiguity:** Mỗi sửa nêu rõ "tìm chuỗi X → thay Y" + file cụ thể. ✅
```
