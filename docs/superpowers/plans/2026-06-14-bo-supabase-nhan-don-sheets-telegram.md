# Bỏ Supabase — Nhận đơn qua Google Sheets + Telegram — Implementation Plan

> **For agentic workers (Antigravity / Claude / bất kỳ agent nào):** Đây là plan ĐỘC LẬP, không cần ngữ cảnh hội thoại gốc. Thực hiện **tuần tự từng Task**, mỗi Task theo các Step nhỏ (viết test → chạy cho fail → code → chạy cho pass → commit). Dùng cú pháp checkbox `- [ ]` để theo dõi. KHÔNG nhảy cóc. Sau mỗi Task, làm việc kế tiếp chỉ khi Task hiện tại đã xanh (lint/test/build không lỗi mới).

**Goal:** Gỡ bỏ hoàn toàn Supabase khỏi website bán lẻ Bia Thầy Tu; chuyển đọc dữ liệu sang JSON tĩnh có sẵn và chuyển nhận đơn hàng sang **Google Sheets (nguồn sự thật) + Telegram (thông báo)**, đảm bảo không bao giờ báo "thành công giả".

**Architecture:** Thêm 3 lớp thuần, dễ test: `src/lib/data/*` (đọc JSON), `src/lib/orders/*` (validate + tính tiền), `src/lib/integrations/*` (Google Sheets webhook + Telegram). API route `/api/order` chỉ điều phối: validate → tính tiền server-side → ghi Sheets (bắt buộc) → gửi Telegram (best-effort). Các trang đọc dữ liệu gọi hàm `src/lib/data/*` thay cho client Supabase giả, nhờ đó static hóa hoàn toàn.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Vitest 4. Không thêm thư viện runtime mới (chỉ dùng `fetch` có sẵn). Gỡ `@supabase/ssr`, `@supabase/supabase-js`, `nodemailer`, `@types/nodemailer`.

---

## Bối cảnh & Nguyên tắc (đọc trước khi code)

1. **Hiện trạng:** `src/lib/supabase/server.ts` đã trả về một **mock client** (`src/lib/supabase/mockClient.ts`) đọc từ `src/data/*.json`. Trang web **không** kết nối Supabase thật. `src/lib/supabase/client.ts` (browser client thật) **không file nào import** → code chết. Plan này biến hiện trạng đó thành kiến trúc tường minh.
2. **Nguồn dữ liệu giữ nguyên:** `src/data/products.json`, `src/data/articles.json`, `src/data/promo_codes.json`. KHÔNG đổi nội dung các file này.
3. **Nguyên tắc số 1 — không báo thành công giả:** Khách chỉ thấy "Đặt hàng thành công" khi đơn đã **ghi vào Google Sheets**. Sheets lỗi → trả lỗi `502` kèm hotline, KHÔNG báo thành công. Telegram lỗi → chỉ log, KHÔNG chặn đơn.
4. **Chống gian lận giá:** Giá LUÔN lấy từ `products.json` phía server; tuyệt đối không tin `price` client gửi. Đây là hành vi hiện có cần giữ.
5. **An toàn injection:** Telegram gửi **text thuần** (không `parse_mode`). Apps Script chống CSV/formula injection (prefix `'` cho ô bắt đầu bằng `= + - @`).
6. **Cập nhật nội dung sau khi bỏ Supabase:** dữ liệu nằm trong bundle build-time → muốn đổi sản phẩm/bài viết thì sửa JSON rồi **deploy lại**. (Đây là lý do `/api/revalidate` bị gỡ ở Task 14.)
7. **Không làm vỡ test regression có sẵn:** 3 file `*-regression.test.ts` chỉ đọc nội dung text của các file nguồn. Khi sửa trang, GIỮ nguyên các class/chuỗi mà chúng kiểm tra (đặc biệt `dat-hang/page.tsx` giữ nguyên — KHÔNG đụng tới).

---

## Phần 0 — CHUẨN BỊ THỦ CÔNG (con người làm trước, để test thật ở cuối)

> Code và unit test ở các Task dưới **không phụ thuộc** các bước này (test mock `fetch`/env). Nhưng để chạy thật end-to-end (Task 16), cần các giá trị sau điền vào `.env.local`.

**A. Telegram bot**
1. Mở Telegram, chat với **@BotFather** → `/newbot` → đặt tên → nhận `TELEGRAM_BOT_TOKEN` (dạng `123456:ABC...`).
2. Tạo 1 nhóm nhận đơn (hoặc chat riêng), thêm bot vào nhóm.
3. Lấy `TELEGRAM_CHAT_ID`: gửi 1 tin trong nhóm, mở `https://api.telegram.org/bot<TOKEN>/getUpdates`, đọc `chat.id` (nhóm thường âm, vd `-1001234567890`).

**B. Google Sheet + Apps Script** (code .gs ở Task 15)
1. Tạo 1 Google Sheet mới (vd "Đơn hàng Bia Thầy Tu").
2. `Extensions → Apps Script`, dán nội dung file `scripts/google-apps-script-orders.gs` (tạo ở Task 15).
3. Sửa hằng `SECRET` trong script = một chuỗi ngẫu nhiên dài (sẽ dùng lại làm `SHEETS_WEBHOOK_SECRET`).
4. `Deploy → New deployment → Web app`: Execute as **Me**, Who has access **Anyone** → Deploy → copy **Web app URL** = `SHEETS_WEBHOOK_URL`.

**C. Điền `.env.local`** (xem mẫu `.env.example` cập nhật ở Task 15):
```
SHEETS_WEBHOOK_URL=...        # URL web app ở bước B4
SHEETS_WEBHOOK_SECRET=...     # đúng chuỗi SECRET ở bước B3
TELEGRAM_BOT_TOKEN=...        # bước A1
TELEGRAM_CHAT_ID=...          # bước A3
```

---

## File Structure (bản đồ thay đổi)

**Tạo mới:**
- `src/lib/data/products.ts` — đọc products.json, các hàm truy vấn sản phẩm
- `src/lib/data/articles.ts` — đọc articles.json (lọc published + tenant)
- `src/lib/data/promo.ts` — đọc promo_codes.json
- `src/lib/orders/types.ts` — type dùng chung cho luồng đơn
- `src/lib/orders/validation.ts` — validate input (gồm quantity)
- `src/lib/orders/pricing.ts` — tính tiền server-side (auto 5% + promo)
- `src/lib/integrations/googleSheets.ts` — ghi đơn vào Sheets (bắt buộc)
- `src/lib/integrations/telegram.ts` — gửi đơn qua Telegram (best-effort)
- `scripts/google-apps-script-orders.gs` — code dán vào Apps Script
- Test: `src/lib/data/products.test.ts`, `src/lib/data/promo.test.ts`, `src/lib/orders/validation.test.ts`, `src/lib/orders/pricing.test.ts`, `src/lib/integrations/integrations.test.ts`

**Sửa:**
- `src/app/api/order/route.ts` — viết lại, điều phối các lớp mới (bỏ Supabase + nodemailer)
- `src/app/api/promo/validate/route.ts` — dùng `getActivePromoByCode`
- `src/app/(web)/page.tsx` — bỏ `force-dynamic`, dùng `getAllProducts`
- `src/app/(web)/san-pham/page.tsx` — bỏ `force-dynamic`, dùng `getBeerProducts`/`getAccessories`
- `src/app/(web)/san-pham/[slug]/page.tsx` — bỏ `force-dynamic`, thêm `generateStaticParams`, dùng `getProductBySlugOrId`/`getRelatedBeers`
- `src/app/(web)/kien-thuc/page.tsx` — dùng `getPublishedArticles`
- `src/app/(web)/kien-thuc/[slug]/page.tsx` — dùng `getArticleBySlugOrId`/`getRelatedArticles`/`getFeaturedBeers`
- `src/app/sitemap.ts` — dùng `getAllProducts`/`getPublishedArticles`
- `src/app/llms.txt/route.ts` — dùng `getProductsByCategory('bia')`/`getPublishedArticles`
- `src/app/google-merchant.xml/route.ts` — dùng `getProductsByCategory('bia')`
- `.env.example` — bỏ biến Supabase/SMTP, thêm Sheets/Telegram
- `package.json` — gỡ 4 dependency

**Xóa:**
- `src/lib/supabase/` (cả `client.ts`, `server.ts`, `mockClient.ts`)
- `src/app/api/test-db/` (lộ thông tin)
- `src/app/api/revalidate/` (không còn webhook DB; data tĩnh cập nhật qua redeploy)

**KHÔNG đụng tới:** `src/app/(web)/dat-hang/page.tsx`, `src/app/(web)/dat-hang/layout.tsx`, `src/types/database.ts`, `src/types/index.ts`, mọi landing page tĩnh, `JsonLd.tsx`, 3 file `*-regression.test.ts`.

---

## Task 1: Lớp dữ liệu sản phẩm (`src/lib/data/products.ts`)

**Files:**
- Create: `src/lib/data/products.ts`
- Test: `src/lib/data/products.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/data/products.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlugOrId,
  getBeerProducts,
  getAccessories,
  getRelatedBeers,
  getProductsByCategory,
} from './products';

describe('data/products', () => {
  it('returns all products sorted by sort_order ascending', () => {
    const all = getAllProducts();
    expect(all.length).toBeGreaterThan(0);
    for (let i = 1; i < all.length; i++) {
      expect(all[i].sort_order ?? 0).toBeGreaterThanOrEqual(all[i - 1].sort_order ?? 0);
    }
  });

  it('finds a product by slug or by id', () => {
    const first = getAllProducts().find((p) => p.slug);
    expect(first).toBeTruthy();
    expect(getProductBySlugOrId(first!.slug)?.id).toBe(first!.id);
    expect(getProductBySlugOrId(first!.id)?.id).toBe(first!.id);
    expect(getProductBySlugOrId('khong-ton-tai-xyz')).toBeNull();
  });

  it('getBeerProducts can exclude Bitburger', () => {
    const beers = getBeerProducts({ excludeBitburger: true });
    expect(beers.every((p) => p.category === 'bia')).toBe(true);
    expect(beers.every((p) => !p.name.toLowerCase().includes('bitburger'))).toBe(true);
  });

  it('getRelatedBeers excludes the current product and caps the limit', () => {
    const anyBeer = getBeerProducts()[0];
    const related = getRelatedBeers(anyBeer.id, 4);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.every((p) => p.id !== anyBeer.id)).toBe(true);
  });

  it('getAccessories and getProductsByCategory filter by category', () => {
    expect(getAccessories().every((p) => p.category === 'phu-kien')).toBe(true);
    expect(getProductsByCategory('bia').every((p) => p.category === 'bia')).toBe(true);
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/data/products.test.ts`
Expected: FAIL — không tìm thấy module `./products`.

- [ ] **Step 3: Viết implementation**

`src/lib/data/products.ts`:
```ts
import productsData from '@/data/products.json';

/**
 * Kiểu sản phẩm cho phần web bán lẻ.
 * Khai báo `abv: string | null` để khớp ProductCard/ProductTabs (runtime có thể là số,
 * render `{abv}%` vẫn đúng). JSON được ép kiểu qua `unknown` một lần tại đây.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  abv: string | null;
  ibu: number | null;
  volume: string | null;
  images: string[] | null;
  price: number | null;
  haravan_url: string | null;
  category: string | null;
  sort_order: number;
  is_featured: boolean;
  origin: string | null;
  updated_at: string | null;
}

const ALL_PRODUCTS: Product[] = (productsData as unknown as Product[])
  .slice()
  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

function isBitburger(name: string): boolean {
  return name.toLowerCase().includes('bitburger');
}

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

export function getProductBySlugOrId(key: string): Product | null {
  return ALL_PRODUCTS.find((p) => p.slug === key || p.id === key) ?? null;
}

export function getBeerProducts(opts?: { excludeBitburger?: boolean }): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.category === 'bia' && (!opts?.excludeBitburger || !isBitburger(p.name)),
  );
}

export function getAccessories(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === 'phu-kien');
}

export function getRelatedBeers(excludeId: string, limit = 4): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.category === 'bia' && p.id !== excludeId && !isBitburger(p.name),
  ).slice(0, limit);
}

export function getFeaturedBeers(limit = 3): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.is_featured && p.category !== 'vang' && !isBitburger(p.name),
  ).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}
```

- [ ] **Step 4: Chạy cho pass**

Run: `npm run test -- src/lib/data/products.test.ts`
Expected: PASS (5 test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/products.ts src/lib/data/products.test.ts
git commit -m "feat(data): add JSON-backed product data layer"
```

---

## Task 2: Lớp dữ liệu bài viết (`src/lib/data/articles.ts`)

**Files:**
- Create: `src/lib/data/articles.ts`
- (Không có test riêng — được dùng gián tiếp; giữ plan gọn. Type-check ở Task 13/14.)

- [ ] **Step 1: Viết implementation**

`src/lib/data/articles.ts`:
```ts
import articlesData from '@/data/articles.json';
import { DEFAULT_TENANT_ID } from '@/constants';

export interface Article {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  meta_description: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string | null;
  thumbnail_url: string | null;
  tenant_id: string;
  status: string;
}

const PUBLISHED_ARTICLES: Article[] = (articlesData as unknown as Article[])
  .filter((a) => a.tenant_id === DEFAULT_TENANT_ID && a.status === 'published')
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export function getPublishedArticles(): Article[] {
  return PUBLISHED_ARTICLES;
}

export function getArticleBySlugOrId(key: string): Article | null {
  return PUBLISHED_ARTICLES.find((a) => a.slug === key || a.id === key) ?? null;
}

export function getRelatedArticles(excludeId: string, limit = 3): Article[] {
  return PUBLISHED_ARTICLES.filter((a) => a.id !== excludeId).slice(0, limit);
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (0 lỗi).

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/articles.ts
git commit -m "feat(data): add JSON-backed article data layer"
```

---

## Task 3: Lớp dữ liệu mã giảm giá (`src/lib/data/promo.ts`)

**Files:**
- Create: `src/lib/data/promo.ts`
- Test: `src/lib/data/promo.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/data/promo.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { getActivePromoByCode } from './promo';

describe('data/promo', () => {
  it('finds an active promo case-insensitively', () => {
    const promo = getActivePromoByCode('vip10');
    expect(promo).toBeTruthy();
    expect(promo?.code.toUpperCase()).toBe('VIP10');
    expect(promo?.is_active).toBe(true);
  });

  it('returns null for unknown codes', () => {
    expect(getActivePromoByCode('KHONGCO')).toBeNull();
  });

  it('trims whitespace before matching', () => {
    expect(getActivePromoByCode('  FREESHIP  ')?.code.toUpperCase()).toBe('FREESHIP');
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/data/promo.test.ts`
Expected: FAIL — không tìm thấy `./promo`.

- [ ] **Step 3: Viết implementation**

`src/lib/data/promo.ts`:
```ts
import promoData from '@/data/promo_codes.json';

export interface PromoCode {
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  min_order_value?: number;
  is_active: boolean;
  expires_at?: string | null;
}

export function getActivePromoByCode(code: string): PromoCode | null {
  const normalized = code.trim().toUpperCase();
  return (
    (promoData as unknown as PromoCode[]).find(
      (p) => p.code.toUpperCase() === normalized && p.is_active,
    ) ?? null
  );
}
```

- [ ] **Step 4: Chạy cho pass**

Run: `npm run test -- src/lib/data/promo.test.ts`
Expected: PASS (3 test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/promo.ts src/lib/data/promo.test.ts
git commit -m "feat(data): add JSON-backed promo code lookup"
```

---

## Task 4: Type dùng chung cho đơn hàng (`src/lib/orders/types.ts`)

**Files:**
- Create: `src/lib/orders/types.ts`

- [ ] **Step 1: Viết implementation**

`src/lib/orders/types.ts`:
```ts
export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
}

/** Item gửi từ client — KHÔNG tin `price`. */
export interface ClientCartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

/** Item sau khi đối chiếu giá từ dữ liệu server. */
export interface PricedItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTotals {
  items: PricedItem[];
  subTotal: number;
  autoDiscount: number;
  promoDiscount: number;
  promoCode: string | null;
  totalPrice: number;
}

export interface OrderRecord extends OrderTotals {
  orderNumber: string;
  customer: OrderCustomer;
  createdAtISO: string;
}
```

- [ ] **Step 2: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add src/lib/orders/types.ts
git commit -m "feat(orders): add shared order types"
```

---

## Task 5: Validate input đơn hàng (`src/lib/orders/validation.ts`)

**Files:**
- Create: `src/lib/orders/validation.ts`
- Test: `src/lib/orders/validation.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/orders/validation.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { validateOrderInput, MAX_QUANTITY_PER_ITEM } from './validation';
import type { ClientCartItem, OrderCustomer } from './types';

const okCustomer: OrderCustomer = {
  name: 'Nguyễn Văn A',
  phone: '0912345678',
  address: '1 Đội Cấn, Hà Nội',
};
const okItems: ClientCartItem[] = [
  { id: 'p1', name: 'Bia A', image: '', price: 100000, quantity: 2 },
];

describe('orders/validation', () => {
  it('accepts a valid order', () => {
    expect(validateOrderInput(okCustomer, okItems).ok).toBe(true);
  });

  it('rejects missing required fields', () => {
    expect(validateOrderInput(undefined, okItems).ok).toBe(false);
    expect(validateOrderInput(okCustomer, []).ok).toBe(false);
    expect(validateOrderInput({ ...okCustomer, name: 'A' }, okItems).ok).toBe(false);
  });

  it('rejects an invalid phone number', () => {
    expect(validateOrderInput({ ...okCustomer, phone: '12345' }, okItems).ok).toBe(false);
  });

  it('rejects bad quantities (0, negative, fractional, too large)', () => {
    for (const q of [0, -3, 1.5, MAX_QUANTITY_PER_ITEM + 1]) {
      const items: ClientCartItem[] = [{ ...okItems[0], quantity: q }];
      expect(validateOrderInput(okCustomer, items).ok, `q=${q}`).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/orders/validation.test.ts`
Expected: FAIL — không tìm thấy `./validation`.

- [ ] **Step 3: Viết implementation**

`src/lib/orders/validation.ts`:
```ts
import type { OrderCustomer, ClientCartItem } from './types';

const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;
export const MAX_QUANTITY_PER_ITEM = 99;

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateOrderInput(
  customer: OrderCustomer | undefined,
  items: ClientCartItem[] | undefined,
): ValidationResult {
  if (!customer?.name || !customer?.phone || !customer?.address || !items || items.length === 0) {
    return { ok: false, error: 'Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc' };
  }
  if (customer.name.trim().length < 2) {
    return { ok: false, error: 'Tên không hợp lệ' };
  }
  if (!PHONE_REGEX.test(customer.phone)) {
    return { ok: false, error: 'Số điện thoại không hợp lệ' };
  }
  for (const item of items) {
    const q = item.quantity;
    if (
      !item.id ||
      typeof q !== 'number' ||
      !Number.isInteger(q) ||
      q < 1 ||
      q > MAX_QUANTITY_PER_ITEM
    ) {
      return { ok: false, error: `Số lượng không hợp lệ cho sản phẩm ${item.name || item.id}` };
    }
  }
  return { ok: true };
}
```

- [ ] **Step 4: Chạy cho pass**

Run: `npm run test -- src/lib/orders/validation.test.ts`
Expected: PASS (4 test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/orders/validation.ts src/lib/orders/validation.test.ts
git commit -m "feat(orders): validate customer + quantity bounds"
```

---

## Task 6: Tính tiền server-side (`src/lib/orders/pricing.ts`)

**Files:**
- Create: `src/lib/orders/pricing.ts`
- Test: `src/lib/orders/pricing.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/orders/pricing.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { calculateOrderTotals, AUTO_DISCOUNT_THRESHOLD } from './pricing';
import type { Product } from '@/lib/data/products';
import type { PromoCode } from '@/lib/data/promo';
import type { ClientCartItem } from './types';

function makeProduct(id: string, price: number, name = 'Bia ' + id): Product {
  return {
    id, name, slug: id, description: null, abv: null, ibu: null, volume: null,
    images: null, price, haravan_url: null, category: 'bia', sort_order: 0,
    is_featured: false, origin: null, updated_at: null,
  };
}
const lookup = (id: string) =>
  ({ p1: makeProduct('p1', 100000), big: makeProduct('big', 3000000) } as Record<string, Product>)[id] ?? null;

describe('orders/pricing', () => {
  it('computes subtotal from server price, ignoring client price', () => {
    const items: ClientCartItem[] = [{ id: 'p1', name: 'x', image: '', price: 1, quantity: 3 }];
    const t = calculateOrderTotals(items, lookup, null);
    expect(t.subTotal).toBe(300000);
    expect(t.items[0].price).toBe(100000);
  });

  it('applies 5% auto discount at/above the threshold', () => {
    const items: ClientCartItem[] = [{ id: 'big', name: 'x', image: '', price: 0, quantity: 1 }];
    const t = calculateOrderTotals(items, lookup, null);
    expect(t.subTotal).toBe(3000000);
    expect(t.subTotal).toBeGreaterThanOrEqual(AUTO_DISCOUNT_THRESHOLD);
    expect(t.autoDiscount).toBe(150000);
    expect(t.totalPrice).toBe(2850000);
  });

  it('applies a percent promo on top of subtotal', () => {
    const promo: PromoCode = { code: 'VIP10', discount_type: 'percent', discount_value: 10, is_active: true };
    const items: ClientCartItem[] = [{ id: 'p1', name: 'x', image: '', price: 0, quantity: 1 }];
    const t = calculateOrderTotals(items, lookup, promo);
    expect(t.promoDiscount).toBe(10000);
    expect(t.promoCode).toBe('VIP10');
  });

  it('ignores a promo whose min_order_value is not met', () => {
    const promo: PromoCode = { code: 'FREESHIP', discount_type: 'amount', discount_value: 30000, min_order_value: 500000, is_active: true };
    const items: ClientCartItem[] = [{ id: 'p1', name: 'x', image: '', price: 0, quantity: 1 }];
    const t = calculateOrderTotals(items, lookup, promo);
    expect(t.promoDiscount).toBe(0);
    expect(t.promoCode).toBeNull();
  });

  it('throws when a product is missing or has no price', () => {
    const items: ClientCartItem[] = [{ id: 'ghost', name: 'Ghost', image: '', price: 0, quantity: 1 }];
    expect(() => calculateOrderTotals(items, lookup, null)).toThrow();
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/orders/pricing.test.ts`
Expected: FAIL — không tìm thấy `./pricing`.

- [ ] **Step 3: Viết implementation**

`src/lib/orders/pricing.ts`:
```ts
import type { ClientCartItem, PricedItem, OrderTotals } from './types';
import type { Product } from '@/lib/data/products';
import type { PromoCode } from '@/lib/data/promo';

export const AUTO_DISCOUNT_THRESHOLD = 2_000_000;
export const AUTO_DISCOUNT_RATE = 0.05;

/**
 * Tính tiền hoàn toàn từ dữ liệu server. `productLookup` trả Product theo id.
 * Ném lỗi nếu một item không khớp sản phẩm hoặc thiếu giá.
 */
export function calculateOrderTotals(
  items: ClientCartItem[],
  productLookup: (id: string) => Product | null,
  promo: PromoCode | null,
): OrderTotals {
  const priced: PricedItem[] = items.map((item) => {
    const product = productLookup(item.id);
    if (!product || !product.price) {
      throw new Error(`Sản phẩm ${item.name || item.id} không tồn tại hoặc lỗi giá`);
    }
    return {
      id: product.id,
      name: product.name,
      image: item.image,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    };
  });

  const subTotal = priced.reduce((sum, i) => sum + i.subtotal, 0);

  let autoDiscount = 0;
  if (subTotal >= AUTO_DISCOUNT_THRESHOLD) {
    autoDiscount = subTotal * AUTO_DISCOUNT_RATE;
  }

  let promoDiscount = 0;
  let promoCode: string | null = null;
  if (promo) {
    const minOrder = promo.min_order_value ?? 0;
    const notExpired = !promo.expires_at || new Date(promo.expires_at) >= new Date();
    if (notExpired && subTotal >= minOrder) {
      promoCode = promo.code.toUpperCase();
      promoDiscount =
        promo.discount_type === 'percent'
          ? subTotal * (promo.discount_value / 100)
          : promo.discount_value;
    }
  }

  const totalPrice = Math.max(0, subTotal - autoDiscount - promoDiscount);
  return { items: priced, subTotal, autoDiscount, promoDiscount, promoCode, totalPrice };
}
```

- [ ] **Step 4: Chạy cho pass**

Run: `npm run test -- src/lib/orders/pricing.test.ts`
Expected: PASS (5 test).

- [ ] **Step 5: Commit**

```bash
git add src/lib/orders/pricing.ts src/lib/orders/pricing.test.ts
git commit -m "feat(orders): server-side totals with auto + promo discounts"
```

---

## Task 7: Tích hợp Google Sheets + Telegram (`src/lib/integrations/*`)

**Files:**
- Create: `src/lib/integrations/googleSheets.ts`
- Create: `src/lib/integrations/telegram.ts`
- Test: `src/lib/integrations/integrations.test.ts`

- [ ] **Step 1: Viết test fail trước**

`src/lib/integrations/integrations.test.ts`:
```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendOrderToSheet } from './googleSheets';
import { buildTelegramMessage, sendOrderToTelegram } from './telegram';
import type { OrderRecord } from '@/lib/orders/types';

const order: OrderRecord = {
  orderNumber: 'BTU-20260614-1234',
  createdAtISO: '2026-06-14T00:00:00.000Z',
  customer: { name: 'Nguyễn Văn A', phone: '0912345678', address: 'Hà Nội' },
  items: [{ id: 'p1', name: 'Bia A', image: '', price: 100000, quantity: 2, subtotal: 200000 }],
  subTotal: 200000, autoDiscount: 0, promoDiscount: 0, promoCode: null, totalPrice: 200000,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('integrations/googleSheets', () => {
  it('throws when env is missing', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', '');
    await expect(appendOrderToSheet(order)).rejects.toThrow();
  });

  it('throws when the webhook returns non-ok', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 's');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'err' }));
    await expect(appendOrderToSheet(order)).rejects.toThrow();
  });

  it('resolves when the webhook returns ok:true', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 's');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }));
    await expect(appendOrderToSheet(order)).resolves.toBeUndefined();
  });
});

describe('integrations/telegram', () => {
  it('builds a plain-text message with order number and customer name', () => {
    const msg = buildTelegramMessage(order);
    expect(msg).toContain('BTU-20260614-1234');
    expect(msg).toContain('Nguyễn Văn A');
    expect(msg).toContain('Bia A');
  });

  it('throws when env is missing', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');
    await expect(sendOrderToTelegram(order)).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Chạy cho fail**

Run: `npm run test -- src/lib/integrations/integrations.test.ts`
Expected: FAIL — không tìm thấy module.

- [ ] **Step 3: Viết `googleSheets.ts`**

`src/lib/integrations/googleSheets.ts`:
```ts
import type { OrderRecord } from '@/lib/orders/types';

/**
 * Ghi đơn vào Google Sheets qua Apps Script Web App.
 * Ném lỗi nếu thiếu cấu hình hoặc webhook không trả { ok: true }.
 * Caller PHẢI coi lỗi ở đây là "đơn chưa được lưu".
 */
export async function appendOrderToSheet(order: OrderRecord): Promise<void> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!url || !secret) {
    throw new Error('SHEETS_WEBHOOK_URL hoặc SHEETS_WEBHOOK_SECRET chưa được cấu hình');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, order }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Google Sheets webhook lỗi ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!data || data.ok !== true) {
    throw new Error('Google Sheets webhook trả về trạng thái thất bại');
  }
}
```

- [ ] **Step 4: Viết `telegram.ts`**

`src/lib/integrations/telegram.ts`:
```ts
import type { OrderRecord } from '@/lib/orders/types';
import { formatPrice } from '@/utils/formatPrice';

/** Text THUẦN (không parse_mode) → an toàn trước injection. */
export function buildTelegramMessage(order: OrderRecord): string {
  const lines = [
    `🍺 ĐƠN HÀNG MỚI: ${order.orderNumber}`,
    ``,
    `Khách: ${order.customer.name}`,
    `SĐT: ${order.customer.phone}`,
    `Email: ${order.customer.email || '—'}`,
    `Địa chỉ: ${order.customer.address}`,
    `Ghi chú: ${order.customer.note || '—'}`,
    ``,
    `Sản phẩm:`,
    ...order.items.map((i) => `• ${i.name} x${i.quantity} = ${formatPrice(i.subtotal)}`),
    ``,
    `Tạm tính: ${formatPrice(order.subTotal)}`,
  ];
  if (order.autoDiscount > 0) lines.push(`Giảm 5%: -${formatPrice(order.autoDiscount)}`);
  if (order.promoDiscount > 0) lines.push(`Mã ${order.promoCode}: -${formatPrice(order.promoDiscount)}`);
  lines.push(`TỔNG: ${formatPrice(order.totalPrice)}`);
  return lines.join('\n');
}

/** Best-effort: caller bắt lỗi và KHÔNG chặn đơn nếu thất bại. */
export async function sendOrderToTelegram(order: OrderRecord): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID chưa được cấu hình');
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(order),
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Telegram lỗi ${res.status}: ${text.slice(0, 200)}`);
  }
}
```

- [ ] **Step 5: Chạy cho pass**

Run: `npm run test -- src/lib/integrations/integrations.test.ts`
Expected: PASS (5 test).

- [ ] **Step 6: Commit**

```bash
git add src/lib/integrations/googleSheets.ts src/lib/integrations/telegram.ts src/lib/integrations/integrations.test.ts
git commit -m "feat(integrations): Google Sheets webhook + Telegram notifier"
```

---

## Task 8: Viết lại `/api/order` (điều phối)

**Files:**
- Modify (viết lại toàn bộ): `src/app/api/order/route.ts`

- [ ] **Step 1: Thay TOÀN BỘ nội dung file**

`src/app/api/order/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugOrId } from '@/lib/data/products';
import { getActivePromoByCode } from '@/lib/data/promo';
import { validateOrderInput } from '@/lib/orders/validation';
import { calculateOrderTotals } from '@/lib/orders/pricing';
import { appendOrderToSheet } from '@/lib/integrations/googleSheets';
import { sendOrderToTelegram } from '@/lib/integrations/telegram';
import type { OrderCustomer, ClientCartItem, OrderRecord } from '@/lib/orders/types';

// ─── Rate limiting (in-memory, đủ cho mức hiện tại) ───────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts.entries()) {
    if (now > entry.resetAt) requestCounts.delete(ip);
  }
}, 5 * 60_000);

function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BTU-${yyyy}${mm}${dd}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { customer, items, appliedCode } = body as {
      customer: OrderCustomer;
      items: ClientCartItem[];
      appliedCode?: string;
    };

    // 1. Validate input (gồm chặn quantity bất thường)
    const validation = validateOrderInput(customer, items);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 2. Tính tiền hoàn toàn từ dữ liệu server (chống sửa giá)
    const promo = appliedCode ? getActivePromoByCode(appliedCode) : null;
    let totals;
    try {
      totals = calculateOrderTotals(items, getProductBySlugOrId, promo);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Lỗi xác thực sản phẩm';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const order: OrderRecord = {
      ...totals,
      orderNumber: generateOrderNumber(),
      customer,
      createdAtISO: new Date().toISOString(),
    };

    // 3. BẮT BUỘC: ghi Google Sheets (nguồn sự thật). Lỗi → KHÔNG báo thành công.
    try {
      await appendOrderToSheet(order);
    } catch (e) {
      console.error('Sheets append failed:', e);
      return NextResponse.json(
        {
          error:
            'Hệ thống đang bận, chưa lưu được đơn. Vui lòng gọi hotline 0899.191.313 để đặt hàng.',
        },
        { status: 502 },
      );
    }

    // 4. BEST-EFFORT: thông báo Telegram (lỗi không chặn đơn)
    try {
      await sendOrderToTelegram(order);
    } catch (e) {
      console.error('Telegram notify failed:', e);
    }

    // 5. Thành công thật sự
    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi server';
    console.error('Order API Error:', message);
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại.' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (0 lỗi).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/order/route.ts
git commit -m "refactor(order): orchestrate Sheets+Telegram, drop Supabase+nodemailer"
```

---

## Task 9: Viết lại `/api/promo/validate`

**Files:**
- Modify (viết lại toàn bộ): `src/app/api/promo/validate/route.ts`

- [ ] **Step 1: Thay TOÀN BỘ nội dung file**

`src/app/api/promo/validate/route.ts`:
```ts
import { NextResponse } from 'next/server';
import { getActivePromoByCode } from '@/lib/data/promo';

/**
 * POST /api/promo/validate — validate mã giảm giá server-side.
 */
export async function POST(req: Request) {
  try {
    const { code, subTotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không hợp lệ' });
    }

    const promo = getActivePromoByCode(code);
    if (!promo) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    }

    const now = new Date();
    const expiresAt = promo.expires_at ? new Date(promo.expires_at) : null;
    const minOrderValue = promo.min_order_value || 0;

    if (expiresAt && now > expiresAt) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá đã hết hạn sử dụng' });
    }

    if (typeof subTotal === 'number' && subTotal < minOrderValue) {
      return NextResponse.json({
        valid: false,
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(minOrderValue)}₫`,
      });
    }

    let discountAmount = 0;
    let label = '';
    if (promo.discount_type === 'percent') {
      if (typeof subTotal === 'number') discountAmount = subTotal * (promo.discount_value / 100);
      label = `Giảm ${promo.discount_value}%`;
    } else {
      discountAmount = promo.discount_value;
      label = `Giảm ${new Intl.NumberFormat('vi-VN').format(promo.discount_value)}₫`;
    }

    return NextResponse.json({
      valid: true,
      code: promo.code.toUpperCase(),
      label,
      discountAmount,
    });
  } catch {
    return NextResponse.json({ valid: false, message: 'Lỗi server' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add src/app/api/promo/validate/route.ts
git commit -m "refactor(promo): validate against JSON promo layer"
```

---

## Task 10: Trang chủ `src/app/(web)/page.tsx` — static hóa

**Files:**
- Modify: `src/app/(web)/page.tsx`

- [ ] **Step 1: Sửa import + bỏ force-dynamic + đổi nguồn dữ liệu**

Tìm đầu file:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
```
Thay bằng:
```ts
import { getAllProducts } from '@/lib/data/products';
```

Tìm và **xóa** dòng:
```ts
export const dynamic = 'force-dynamic';
```

Trong `export default async function LandingPage()`, tìm:
```ts
  const supabase = await createServerSupabase();
  
  // Fetch all products to display on homepage
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('id, name, slug, description, images, abv, ibu, volume, price, haravan_url, category, sort_order')
    .order('sort_order', { ascending: true });
```
Thay bằng:
```ts
  const featuredProducts = getAllProducts();
```

- [ ] **Step 2: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/page.tsx"
git commit -m "refactor(home): read products from data layer, make static"
```

---

## Task 11: `src/app/(web)/san-pham/page.tsx` — static hóa

**Files:**
- Modify: `src/app/(web)/san-pham/page.tsx`

- [ ] **Step 1: Sửa import + bỏ force-dynamic**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
```
bằng:
```ts
import { getBeerProducts, getAccessories } from '@/lib/data/products';
```

Xóa dòng:
```ts
export const dynamic = 'force-dynamic';
```

- [ ] **Step 2: Đổi 2 truy vấn**

Tìm trong `ProductsPage()`:
```ts
  const supabase = await createServerSupabase();
  
  const { data: beerProducts } = await supabase
    .from('products')
    .select('id, name, slug, description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('category', 'bia')
    .not('name', 'ilike', '%bitburger%')
    .order('sort_order', { ascending: true });


  const { data: accessories } = await supabase
    .from('products')
    .select('id, name, slug, description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('category', 'phu-kien')
    .order('sort_order', { ascending: true });
```
Thay bằng:
```ts
  const beerProducts = getBeerProducts({ excludeBitburger: true });
  const accessories = getAccessories();
```

- [ ] **Step 3: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/san-pham/page.tsx"
git commit -m "refactor(catalog): read products from data layer, make static"
```

---

## Task 12: `src/app/(web)/san-pham/[slug]/page.tsx` — static + generateStaticParams

**Files:**
- Modify: `src/app/(web)/san-pham/[slug]/page.tsx`

- [ ] **Step 1: Sửa import + bỏ force-dynamic + thêm generateStaticParams**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
```
bằng:
```ts
import { getProductBySlugOrId, getRelatedBeers, getAllProducts } from '@/lib/data/products';
```

Thay dòng:
```ts
export const dynamic = 'force-dynamic';
```
bằng:
```ts
export function generateStaticParams() {
  return getAllProducts()
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));
}
```

- [ ] **Step 2: Đổi truy vấn trong generateMetadata**

Tìm:
```ts
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('products')
    .select('name, slug, id, description, images')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  const product = data as ProductData | null;
```
Thay bằng:
```ts
  const product = getProductBySlugOrId(slug) as ProductData | null;
```

- [ ] **Step 3: Đổi truy vấn trong ProductDetailPage**

Tìm:
```ts
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('products')
    .select('id, name, slug, description, abv, ibu, volume, images, price, haravan_url, origin, category')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  const product = data as ProductData | null;

  if (!product) {
    notFound();
  }

  // Fetch related products (Cross-sell)
  const { data: relatedProductsData } = await supabase
    .from('products')
    .select('id, name, slug, description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('category', 'bia')
    .neq('id', product.id)
    .not('name', 'ilike', '%bitburger%')
    .order('sort_order', { ascending: true })
    .limit(4);
```
Thay bằng:
```ts
  const { slug } = await params;

  const product = getProductBySlugOrId(slug) as ProductData | null;

  if (!product) {
    notFound();
  }

  // Related products (Cross-sell)
  const relatedProductsData = getRelatedBeers(product.id, 4);
```

- [ ] **Step 4: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/san-pham/[slug]/page.tsx"
git commit -m "refactor(product): data layer + generateStaticParams, make static (SSG)"
```

---

## Task 13: Trang Kiến thức (list + detail)

**Files:**
- Modify: `src/app/(web)/kien-thuc/page.tsx`
- Modify: `src/app/(web)/kien-thuc/[slug]/page.tsx`

- [ ] **Step 1: `kien-thuc/page.tsx` — đổi nguồn dữ liệu**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
import { DEFAULT_TENANT_ID } from '@/constants';
```
bằng:
```ts
import { getPublishedArticles } from '@/lib/data/articles';
```

Tìm trong `KienThucPage()`:
```ts
  const supabase = await createServerSupabase();
  
  const { data: articles } = await supabase
    .from('seo_articles')
    .select('id, title, slug, meta_description, word_count, created_at, thumbnail_url')
    .eq('tenant_id', DEFAULT_TENANT_ID)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const articleList = (articles ?? []) as ArticleSummary[];
```
Thay bằng:
```ts
  const articleList = getPublishedArticles() as unknown as ArticleSummary[];
```

- [ ] **Step 2: `kien-thuc/[slug]/page.tsx` — đổi nguồn dữ liệu**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
import { DEFAULT_TENANT_ID } from '@/constants';
```
bằng:
```ts
import { getArticleBySlugOrId, getRelatedArticles } from '@/lib/data/articles';
import { getFeaturedBeers } from '@/lib/data/products';
```

Xóa hàm `buildArticleQuery` (toàn bộ khối):
```ts
function buildArticleQuery(supabase: Awaited<ReturnType<typeof createServerSupabase>>, slug: string, fields: string) {
  const isId = UUID_REGEX.test(slug);
  const query = supabase
    .from('seo_articles')
    .select(fields)
    .eq('tenant_id', DEFAULT_TENANT_ID)
    .eq('status', 'published');
  return isId ? query.eq('id', slug) : query.eq('slug', slug);
}
```
(Cũng xóa hằng `UUID_REGEX` ngay phía trên nó vì không còn dùng.)

Trong `generateMetadata`, thay:
```ts
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await buildArticleQuery(supabase, slug, 'title, meta_description, slug, thumbnail_url').single();

  const article = data as unknown as { title: string; meta_description: string | null; slug: string; thumbnail_url: string | null } | null;
```
bằng:
```ts
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug) as unknown as { title: string; meta_description: string | null; slug: string; thumbnail_url: string | null } | null;
```

Trong `ArticleDetailPage`, thay:
```ts
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await buildArticleQuery(supabase, slug, 'id, title, slug, content, meta_description, word_count, created_at, updated_at, thumbnail_url, tenant_id, status').single();
  const article = data as unknown as ArticleData | null;
```
bằng:
```ts
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug) as unknown as ArticleData | null;
```

Thay khối related articles:
```ts
  // Fetch related articles (3 most recent, excluding current)
  const { data: relatedRaw } = await supabase
    .from('seo_articles')
    .select('id, title, slug, meta_description, word_count, created_at, thumbnail_url')
    .eq('tenant_id', DEFAULT_TENANT_ID)
    .eq('status', 'published')
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3);
  const relatedArticles = (relatedRaw ?? []) as Array<{
    id: string; title: string; slug: string | null;
    meta_description: string | null; word_count: number | null; created_at: string;
    thumbnail_url: string | null;
  }>;
```
bằng:
```ts
  // Related articles (3 most recent, excluding current)
  const relatedArticles = getRelatedArticles(article.id, 3) as unknown as Array<{
    id: string; title: string; slug: string | null;
    meta_description: string | null; word_count: number | null; created_at: string;
    thumbnail_url: string | null;
  }>;
```

Thay khối suggested products:
```ts
  // Fetch suggested products for CTA
  const { data: suggestedProducts } = await supabase
    .from('products')
    .select('id, name, slug, description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('is_featured', true)
    .neq('category', 'vang')
    .not('name', 'ilike', '%bitburger%') // Suggest Benediktiner primarily
    .order('sort_order', { ascending: true })
    .limit(3);
```
bằng:
```ts
  // Suggested products for CTA (featured Benediktiner)
  const suggestedProducts = getFeaturedBeers(3);
```

> Lưu ý: `import articles from '@/data/articles.json'` và `generateStaticParams()` hiện có ở file này GIỮ NGUYÊN — chúng đã đọc JSON trực tiếp, không liên quan Supabase.

- [ ] **Step 3: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/(web)/kien-thuc/page.tsx" "src/app/(web)/kien-thuc/[slug]/page.tsx"
git commit -m "refactor(kien-thuc): read articles+products from data layer"
```

---

## Task 14: SEO endpoints (sitemap, llms.txt, google-merchant) + xóa revalidate

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `src/app/google-merchant.xml/route.ts`
- Delete: `src/app/api/revalidate/`

- [ ] **Step 1: `sitemap.ts`**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
import { getPublicBaseUrl } from '@/lib/seo/site';
```
bằng:
```ts
import { getAllProducts } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';
import { getPublicBaseUrl } from '@/lib/seo/site';
```

Tìm:
```ts
  const supabase = await createServerSupabase();
  const baseUrl = getPublicBaseUrl();
```
Thay bằng:
```ts
  const baseUrl = getPublicBaseUrl();
```

Thay khối products:
```ts
  // [C1 FIX] Fetch dynamic products with proper typing
  const { data: products } = await supabase.from('products').select('slug, id, updated_at');
  if (products) {
    for (const product of products as SitemapProduct[]) {
```
bằng:
```ts
  const products = getAllProducts();
  if (products) {
    for (const product of products as unknown as SitemapProduct[]) {
```

Thay khối articles:
```ts
  // [C1 FIX] Fetch dynamic articles with proper typing
  const { data: articles } = await supabase.from('seo_articles').select('slug, id, updated_at');
  if (articles) {
    for (const article of articles as SitemapArticle[]) {
```
bằng:
```ts
  const articles = getPublishedArticles();
  if (articles) {
    for (const article of articles as unknown as SitemapArticle[]) {
```

> `sitemap()` vẫn có thể là `async` (không sao). Không cần đổi chữ ký.

- [ ] **Step 2: `llms.txt/route.ts`**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
```
bằng:
```ts
import { getProductsByCategory } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';
```

Tìm:
```ts
  const supabase = await createServerSupabase();
  const baseUrl = getPublicBaseUrl();

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, description, price, category, abv, volume, origin')
    .eq('category', 'bia');

  // Fetch articles
  const { data: articles } = await supabase
    .from('seo_articles')
    .select('id, title, slug, meta_description, created_at')
    .eq('status', 'published');
```
Thay bằng:
```ts
  const baseUrl = getPublicBaseUrl();

  const products = getProductsByCategory('bia') as unknown as ProductItem[];
  const articles = getPublishedArticles() as unknown as ArticleItem[];
```

> Phần `(products as ProductItem[])` / `(articles as ArticleItem[])` ở dưới có thể giữ nguyên — ép kiểu lặp lại vô hại. Build vẫn xanh.

- [ ] **Step 3: `google-merchant.xml/route.ts`**

Thay:
```ts
import { createServerSupabase } from '@/lib/supabase/server';
import { getPublicBaseUrl } from '@/lib/seo/site';
```
bằng:
```ts
import { getProductsByCategory } from '@/lib/data/products';
import { getPublicBaseUrl } from '@/lib/seo/site';
```

Tìm:
```ts
  const supabase = await createServerSupabase();
  const baseUrl = getPublicBaseUrl();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, description, price, category, images')
    .eq('category', 'bia');
```
Thay bằng:
```ts
  const baseUrl = getPublicBaseUrl();
  const products = getProductsByCategory('bia') as unknown as ProductItem[];
```

- [ ] **Step 4: Xóa route revalidate (không còn webhook DB)**

```bash
git rm -r "src/app/api/revalidate"
```

- [ ] **Step 5: Type-check & commit**

Run: `npx tsc --noEmit` → Expected: PASS
```bash
git add "src/app/sitemap.ts" "src/app/llms.txt/route.ts" "src/app/google-merchant.xml/route.ts"
git commit -m "refactor(seo): sitemap/llms/merchant read from data layer; drop revalidate webhook"
```

---

## Task 15: Dọn Supabase + tạo Apps Script + cập nhật env & deps

**Files:**
- Delete: `src/lib/supabase/` (client.ts, server.ts, mockClient.ts)
- Delete: `src/app/api/test-db/`
- Create: `scripts/google-apps-script-orders.gs`
- Modify: `.env.example`
- Modify: `package.json`

- [ ] **Step 1: Xóa thư mục Supabase + test-db**

```bash
git rm -r "src/lib/supabase" "src/app/api/test-db"
```

- [ ] **Step 2: Tạo `scripts/google-apps-script-orders.gs`**

```js
/**
 * Google Apps Script — Web App nhận đơn Bia Thầy Tu, ghi vào sheet "Orders".
 * Cài đặt: dán vào Apps Script của Google Sheet → sửa SECRET → Deploy as Web App
 * (Execute as Me, Access: Anyone) → copy URL làm SHEETS_WEBHOOK_URL.
 */
const SECRET = 'DOI_THANH_CHUOI_NGAU_NHIEN_DAI'; // == SHEETS_WEBHOOK_SECRET trong .env

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }
    const o = body.order || {};
    const cust = o.customer || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Thời gian', 'Mã đơn', 'Khách', 'SĐT', 'Email', 'Địa chỉ', 'Ghi chú',
        'Sản phẩm', 'Tạm tính', 'Giảm tự động', 'Mã giảm', 'Giảm theo mã', 'Tổng',
      ]);
    }
    const items = (o.items || []).map(function (i) { return i.name + ' x' + i.quantity; }).join('; ');
    sheet.appendRow([
      s(o.createdAtISO), s(o.orderNumber), s(cust.name), s("'" + (cust.phone || '')),
      s(cust.email || ''), s(cust.address), s(cust.note || ''),
      s(items), num(o.subTotal), num(o.autoDiscount), s(o.promoCode || ''),
      num(o.promoDiscount), num(o.totalPrice),
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Chống CSV/formula injection: prefix ' nếu ô bắt đầu bằng = + - @
function s(v) {
  v = v == null ? '' : String(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function num(v) {
  return typeof v === 'number' ? v : 0;
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 3: Thay TOÀN BỘ `.env.example`**

```
# App URL (dùng cho canonical/sitemap; localhost sẽ tự fallback về production)
NEXT_PUBLIC_APP_URL=https://www.biathaytu.com

# Marketing & Tracking
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id
NEXT_PUBLIC_ZALO_OA_ID=your_zalo_oa_id

# Nhận đơn — Google Sheets (Apps Script Web App)
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
SHEETS_WEBHOOK_SECRET=dat-mot-chuoi-ngau-nhien-dai-trung-voi-SECRET-trong-apps-script

# Nhận đơn — Telegram bot
TELEGRAM_BOT_TOKEN=123456:ABC-xxx
TELEGRAM_CHAT_ID=-1001234567890
```

- [ ] **Step 4: Gỡ 4 dependency trong `package.json`**

Xóa các dòng sau khỏi `"dependencies"`:
```json
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.4",
    "nodemailer": "^8.0.6",
```
Xóa dòng sau khỏi `"devDependencies"`:
```json
    "@types/nodemailer": "^8.0.0",
```

- [ ] **Step 5: Cài lại lockfile + verify không còn import Supabase/nodemailer**

```bash
npm install
```
Run kiểm tra (phải KHÔNG còn kết quả nào trong `src/`):
```bash
git grep -n "@/lib/supabase\|@supabase\|nodemailer" -- "src/" || echo "CLEAN"
```
Expected: in ra `CLEAN`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove Supabase + nodemailer + test-db; add Apps Script + new env"
```

---

## Task 16: Verify toàn hệ thống (lint + test + build)

**Files:** không sửa — chỉ chạy kiểm tra.

- [ ] **Step 1: Lint** — Run: `npm run lint`
Expected: KHÔNG còn warning về `@/lib/supabase`, `nodemailer`. (Cảnh báo `any` trong mock/server đã biến mất do file bị xóa. Lý tưởng: 0 error; warning còn lại nếu có phải ít hơn 29 trước đây.)

- [ ] **Step 2: Unit test** — Run: `npm run test`
Expected: tất cả PASS — gồm 3 file regression cũ + 5 file test mới (products, promo, validation, pricing, integrations).

- [ ] **Step 3: Build** — Run: `npm run build`
Expected: build thành công. Trong bảng route, xác nhận:
  - `/` → `○ (Static)` (trước là `ƒ`)
  - `/san-pham` → `○ (Static)`
  - `/san-pham/[slug]` → `● (SSG)` với danh sách slug
  - KHÔNG còn dòng `/api/test-db`, `/api/revalidate`

- [ ] **Step 4: (Sau khi điền `.env.local` ở Phần 0) Smoke test thật**

```bash
npm run dev
```
Gửi 1 đơn thử qua trang `/dat-hang`, rồi kiểm tra:
  - Google Sheet xuất hiện 1 dòng mới ở tab "Orders".
  - Nhóm Telegram nhận tin nhắn đơn hàng.
  - Tắt mạng/đổi `SHEETS_WEBHOOK_URL` sai → đặt đơn phải hiện thông báo lỗi + hotline, KHÔNG hiện "thành công".

- [ ] **Step 5: Commit (nếu có chỉnh sửa nhỏ phát sinh khi verify)**

```bash
git add -A
git commit -m "test: verify Sheets+Telegram order flow end-to-end"
```

---

## Lưu ý ngoài phạm vi (KHÔNG làm trong plan này — chỉ ghi nhận)

1. **Mâu thuẫn địa chỉ showroom:** `JsonLd.tsx` ghi "218 Đội Cấn, Ba Đình"; `llms.txt` ghi "659A Lạc Long Quân, Tây Hồ". Cần chủ shop xác nhận địa chỉ đúng rồi thống nhất — tách thành task riêng.
2. **493MB trong `public/`** (file `.docx`, `.eps`, `.pdf`, ảnh >10MB) và **i18n nửa vời** (LanguageSwitcher chỉ dịch nav/hero/footer) là các vấn đề riêng, không thuộc plan bỏ Supabase.
3. Test `product-data-regression.test.ts` có tiêu đề nhắc "Supabase schema" — sau plan này tên hơi lỗi thời nhưng vẫn pass (chỉ kiểm tra text). Để nguyên, không cần sửa.

---

## Self-Review (tác giả plan tự rà)

**1. Spec coverage:**
- Bỏ Supabase đọc dữ liệu → Task 1–3, 10–14 ✅
- Nhận đơn Sheets (nguồn sự thật) + Telegram (best-effort) → Task 7, 8 ✅
- Không báo thành công giả → Task 8 Step 1 (Sheets lỗi → 502, không success) ✅
- Validate quantity → Task 5 ✅
- Giữ cả 2 mức giảm giá, promo từ JSON → Task 6, 9 ✅
- Dọn client.ts + @supabase + nodemailer + test-db → Task 15 ✅
- Bỏ force-dynamic, static hóa → Task 10–12, verify Task 16 ✅
- generateStaticParams cho san-pham/[slug] → Task 12 ✅
- env mới → Task 15 ✅
- Chuẩn bị thủ công (bot/sheet) → Phần 0 ✅

**2. Placeholder scan:** Không có "TBD/TODO/implement later". Mọi step có code/lệnh cụ thể. ✅

**3. Type consistency:** `Product`, `PromoCode`, `Article`, `OrderRecord`, `ClientCartItem`, `OrderTotals`, `PricedItem`, `ValidationResult` định nghĩa ở Task 1–6 và dùng nhất quán ở Task 7–14. Hàm: `getAllProducts/getProductBySlugOrId/getBeerProducts/getAccessories/getRelatedBeers/getFeaturedBeers/getProductsByCategory`, `getPublishedArticles/getArticleBySlugOrId/getRelatedArticles`, `getActivePromoByCode`, `validateOrderInput`, `calculateOrderTotals`, `appendOrderToSheet`, `sendOrderToTelegram/buildTelegramMessage` — tên khớp giữa định nghĩa và nơi gọi. ✅

**4. Ambiguity:** Mỗi sửa file chỉ rõ "tìm khối X → thay bằng Y". ✅
