# Plan Thực Thi — Sửa Lỗi Giao Diện & Chức Năng · biathaytu.com

> **Ngày:** 2026-07-29 · **Báo cáo audit:** `docs/superpowers/plans/2026-07-29-ui-functionality-audit-report.md`
> **Repo:** `biathaytu-web` · **Branch xuất phát:** `feature/age-verification-and-compliance`
> **Nguyên tắc:** viết test trước → code sau → chạy lệnh verify. Không refactor ngoài phạm vi từng Phase.
> **Tài liệu này tự chứa** — người thực thi không cần ngữ cảnh hội thoại.

## Bối cảnh tối thiểu cần biết

- Next.js 16 App Router. Toàn bộ site nằm trong route group `src/app/(web)/`.
- CSS duy nhất: `src/app/web.css` (5.744 dòng, scope `.web-app`). **Không có Tailwind.**
- Dữ liệu sản phẩm: `src/data/products.json` (28 SKU, sinh bởi `scripts/dump_data.js` từ Neon) hợp nhất với `src/lib/data/localProducts.ts` (6 SKU tay) trong `src/lib/data/products.ts`.
- Test: `vitest` (70 test đang pass). Lệnh: `npm test`.
- Build: `npx next build` (bỏ qua `npm run build` vì nó chạy `dump_data.js` cần DB).

## Lệnh verify dùng chung (chạy sau **mỗi** Phase)

```bash
npm test && npx next build && npx eslint .
```

---

# PHASE 1 — Cổng tuổi phải thực sự chặn (P0.1, P0.3, P0.5)

**Vấn đề:** popup quảng cáo bia che cổng tuổi và bấm được xuyên qua; API nhận đơn không kiểm checkbox 18+; trang `/chua-du-tuoi` phục vụ link mua bia.

## 1.1 — Test trước

Tạo `src/lib/orders/age-enforcement.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateOrderInput } from './validation';
import type { OrderCustomer, ClientCartItem } from './types';

const items: ClientCartItem[] = [{ id: 'p1', name: 'Bia', quantity: 1, image: '', price: 1000 }];
const base = { name: 'Nguyen Van A', phone: '0912345678', address: '1 Test' };

describe('validateOrderInput — bắt buộc xác nhận tuổi', () => {
  it('từ chối khi THIẾU purchaser_age_confirmed', () => {
    const r = validateOrderInput({ ...base, receiver_age_confirmed: true, terms_agreed: true } as OrderCustomer, items);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/người đặt hàng từ đủ 18/i);
  });

  it('từ chối khi THIẾU receiver_age_confirmed', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: true, terms_agreed: true } as OrderCustomer, items);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/người nhận hàng từ đủ 18/i);
  });

  it('từ chối khi THIẾU terms_agreed', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: true, receiver_age_confirmed: true } as OrderCustomer, items);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/điều khoản/i);
  });

  it('từ chối khi giá trị không phải boolean true', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: 'yes', receiver_age_confirmed: true, terms_agreed: true } as unknown as OrderCustomer, items);
    expect(r.ok).toBe(false);
  });

  it('chấp nhận khi cả 3 đều === true', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: true, receiver_age_confirmed: true, terms_agreed: true } as OrderCustomer, items);
    expect(r.ok).toBe(true);
  });
});
```

Chạy → **phải fail 4 test đầu**. Đó là bằng chứng lỗi tồn tại.

## 1.2 — Sửa `src/lib/orders/validation.ts`

Thay 3 khối `=== false` bằng `!== true`:

```ts
  // Validate purchaser & receiver age confirmations — BẮT BUỘC phải là true
  if (customer.purchaser_age_confirmed !== true) {
    return { ok: false, error: 'Bạn phải xác nhận người đặt hàng từ đủ 18 tuổi trở lên' };
  }
  if (customer.receiver_age_confirmed !== true) {
    return { ok: false, error: 'Bạn phải xác nhận người nhận hàng từ đủ 18 tuổi trở lên' };
  }
  if (customer.terms_agreed !== true) {
    return { ok: false, error: 'Bạn phải đồng ý với điều khoản bán hàng và chính sách bảo mật' };
  }
```

Trong `src/lib/orders/types.ts`, đảm bảo 3 field là `boolean` **bắt buộc** (không `?`) trên `OrderCustomer` nếu chưa. Nếu đổi sang bắt buộc gây lỗi type ở `integrations.test.ts`, xử lý ở Phase 6.

## 1.3 — Sửa `src/app/api/order/route.ts`: không ghi cứng `age_verified`

```ts
      age_verified: customer.purchaser_age_confirmed === true && customer.receiver_age_confirmed === true,
```

(giữ nguyên các field khác)

## 1.4 — Popup không được che cổng tuổi

**(a)** Trong `src/utils/ageVerification.ts`, thêm event khi xác minh thành công — cuối hàm `setAgeVerifiedStatus()`:

```ts
  window.dispatchEvent(new Event('ageVerificationPassed'));
```

**(b)** `src/app/(web)/components/FootballCampaignPopup.tsx` — chỉ hẹn giờ **sau khi** đã xác minh tuổi:

```tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AlcoholWarning from './AlcoholWarning';
import { isAgeVerified } from '@/utils/ageVerification';

/** Chiến dịch chỉ hiển thị trong khoảng thời gian này (ISO). Hết hạn → không render. */
const CAMPAIGN_ENDS_AT = '2026-08-31T23:59:59+07:00';

export default function FootballCampaignPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'keg' | 'combo'>('keg');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/chua-du-tuoi') return;
    if (new Date() > new Date(CAMPAIGN_ENDS_AT)) return;
    if (sessionStorage.getItem('football_campaign_popup_shown')) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      timer = setTimeout(() => setIsOpen(true), 1500);
    };

    if (isAgeVerified()) {
      arm();
      return () => clearTimeout(timer);
    }

    // Chưa xác minh tuổi → chờ tới khi cổng tuổi được vượt qua
    window.addEventListener('ageVerificationPassed', arm, { once: true });
    return () => {
      window.removeEventListener('ageVerificationPassed', arm);
      clearTimeout(timer);
    };
  }, [pathname]);

  // Lock scroll + đóng bằng Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('football_campaign_popup_shown', 'true');
  };

  if (!isOpen) return null;
  // ... phần return còn lại giữ nguyên, CHỈ sửa thẻ overlay như dưới
}
```

Thẻ overlay: thêm accessible name + đóng khi click nền:

```tsx
    <div
      className="football-popup-overlay"
      aria-modal="true"
      role="dialog"
      aria-label="Ưu đãi Bitburger Football Edition 2026"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
```

**(c)** `src/app/web.css` — hạ z-index popup xuống dưới cookie banner (9999) và cổng tuổi (99999). Tìm `.football-popup-overlay` và đổi `z-index` thành `9000`.

**(d)** `src/app/(web)/layout.tsx` — đưa `AgeVerificationGate` xuống **sau cùng** trong cây để nó luôn paint trên mọi thứ:

```tsx
      <LanguageProvider>
        <JsonLd type="organization" data={getOrganizationSchema()} />
        <JsonLd type="website" data={getWebsiteSchema()} />
        <WebHeader />
        <main>{children}</main>
        <WebFooter />
        <FloatingZaloCTA />
        <FootballCampaignPopup />
        <MobileBottomNav />
        <Toast />
        <ScrollRevealObserver />
        <Suspense fallback={null}>
          <FacebookPixel />
          <FacebookMessengerChat />
        </Suspense>
        {/* Gate & consent render CUỐI CÙNG để luôn nằm trên */}
        <CookieConsent />
        <AgeVerificationGate />
      </LanguageProvider>
```

## 1.5 — Trang `/chua-du-tuoi` không được chứa nội dung thương mại

Tạo route group riêng, không có header/footer/CTA:

**(a)** `git mv "src/app/(web)/chua-du-tuoi" "src/app/(bare)/chua-du-tuoi"`

**(b)** Tạo `src/app/(bare)/layout.tsx`:

```tsx
import '../web.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông Báo Kiểm Soát Độ Tuổi | Bia Thầy Tu',
  description: 'Trang thông báo dành cho người truy cập chưa đủ 18 tuổi theo Luật Phòng, chống tác hại của rượu, bia.',
  alternates: { canonical: 'https://www.biathaytu.com/chua-du-tuoi' },
  robots: { index: false, follow: false },
};

export default function BareLayout({ children }: { children: React.ReactNode }) {
  return <div className="web-app">{children}</div>;
}
```

**(c)** Trong `src/app/(web)/components/AgeVerificationGate.tsx`, giữ nguyên các nhánh `pathname === '/chua-du-tuoi'` (vô hại, phòng khi route đổi lại).

## 1.6 — Verify Phase 1

```bash
npm test && npx next build && npx eslint .
```

Kiểm tra tay trên `npm run dev` (xoá cookie + localStorage + sessionStorage trước):
1. Mở `/` → **chỉ** thấy cổng tuổi. Đợi 5 giây → **không** có popup bóng đá.
2. Nhấn Tab liên tục → focus **không** ra được nội dung phía sau *(sẽ hoàn thiện ở Phase 5; ở Phase 1 chỉ cần popup không che)*.
3. Xác minh đủ tuổi → popup xuất hiện sau ~1,5s → Escape đóng được, click nền đóng được.
4. Mở `/chua-du-tuoi` → **không** có header, footer, floating Zalo, bottom nav, không link `/san-pham` nào. Xem `view-source` xác nhận `<meta name="robots" content="noindex, nofollow">`.
5. Trong DevTools Console:
   ```js
   fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({customer:{name:'Nguyen Test',phone:'0912345678',address:'1 Test'},items:[{id:'x',name:'x',quantity:1}]})})
     .then(r=>r.json()).then(console.log)
   ```
   → phải trả `{"error":"Bạn phải xác nhận người đặt hàng từ đủ 18 tuổi trở lên"}` (**không** phải lỗi sản phẩm).

---

# PHASE 2 — Checkout trả được tiền + ảnh không vỡ (P0.2, P0.6)

## 2.1 — Test trước

Tạo `src/constants/compliance.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { BANK_CONFIG } from './compliance';

describe('BANK_CONFIG', () => {
  it('không bao giờ chứa placeholder pháp chế', () => {
    const all = Object.values(BANK_CONFIG).join(' ');
    expect(all).not.toMatch(/CẦN PHÁP CHẾ/i);
    expect(all).not.toMatch(/\[/);
  });
});
```

Tạo `src/app/(web)/asset-integrity.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from '@/lib/data/localProducts';

function localFileFor(url: string) {
  return path.join(process.cwd(), 'public', decodeURIComponent(url));
}

describe('toàn vẹn asset ảnh', () => {
  it('mọi ảnh sản phẩm nội bộ đều tồn tại trong public/', () => {
    const urls = [
      ...(productsData as Array<{ images: string[] | null }>).flatMap((p) => p.images ?? []),
      ...LOCAL_STOREFRONT_PRODUCTS.flatMap((p) => p.images ?? []),
    ].filter((u) => u.startsWith('/'));

    const missing = urls.filter((u) => !fs.existsSync(localFileFor(u)));
    expect(missing).toEqual([]);
  });

  it('mọi ảnh hardcode trong component đều tồn tại', () => {
    const dir = path.join(process.cwd(), 'src');
    const files: string[] = [];
    (function walk(d: string) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.tsx?$/.test(e.name)) files.push(p);
      }
    })(dir);

    const missing: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8');
      for (const m of src.matchAll(/src="(\/[^"]+\.(?:png|jpe?g|webp|svg|avif))"/g)) {
        if (!fs.existsSync(localFileFor(m[1]))) missing.push(`${path.relative(process.cwd(), f)} → ${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
```

Chạy → phải fail: `BANK_CONFIG` chứa placeholder, `/images/logo.png` và `.../kostritzer_keg.png` thiếu.

## 2.2 — Sửa cấu hình ngân hàng

`src/constants/compliance.ts`:

```ts
/**
 * Thông tin chuyển khoản. Bắt buộc cấu hình qua ENV trước khi deploy.
 * KHÔNG dùng placeholder — nếu thiếu ENV, UI phải ẩn phương thức chuyển khoản.
 */
export const BANK_CONFIG = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? '',
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? '',
  accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? '',
};

/** true khi đủ 3 thông tin để hiển thị phương thức chuyển khoản. */
export const IS_BANK_TRANSFER_ENABLED =
  Boolean(BANK_CONFIG.bankName && BANK_CONFIG.accountNumber && BANK_CONFIG.accountHolder);
```

Thêm vào `.env.example`:

```
# Thông tin chuyển khoản hiển thị ở checkout (BẮT BUỘC — thiếu sẽ ẩn phương thức chuyển khoản)
NEXT_PUBLIC_BANK_NAME=MB Bank
NEXT_PUBLIC_BANK_ACCOUNT=0000000000
NEXT_PUBLIC_BANK_HOLDER=CONG TY TNHH EURO CHOICE VIET NAM
```

Thêm cùng 3 biến (giá trị thật) vào `.env.local` **và** biến môi trường trên host deploy.

`src/app/(web)/dat-hang/page.tsx`:
- import `IS_BANK_TRANSFER_ENABLED` cùng `BANK_CONFIG`.
- `paymentMethod` khởi tạo: `IS_BANK_TRANSFER_ENABLED ? 'bank' : 'cod'`.
- Bọc **cả** `<label>` radio "bank" và khối thông tin ngân hàng trong `{IS_BANK_TRANSFER_ENABLED && ( ... )}`.
- Sửa nhãn: bỏ chữ "QR Code" nếu chưa có ảnh QR (đã có `public/qr-biathaytu-com.png` nhưng đó là QR **website**, không phải QR thanh toán — không dùng ở đây).

## 2.3 — Sửa logo cổng tuổi

`src/app/(web)/components/AgeVerificationGate.tsx:161` → `src="/logo.jpg"` (file tồn tại, 917 KB, `next/image` sẽ tối ưu về 120px).

*Tốt hơn:* xuất một `public/images/logo.png` nền trong suốt ~240×120 và dùng file đó. Nếu làm vậy, giữ `src="/images/logo.png"`.

## 2.4 — Sửa ảnh Köstritzer

`public/` **không có ảnh Köstritzer nào**. Không được tiếp tục hiển thị ảnh bom Bitburger cho sản phẩm Köstritzer.

Chọn **một** trong hai, theo quyết định kinh doanh:

**Cách A (khuyến nghị) — bổ sung ảnh thật:**
1. Lưu ảnh chính hãng vào `public/images/products/official/kostritzer/kostritzer_keg_5l.png`.
2. Sửa `src/lib/data/localProducts.ts:103` → đường dẫn mới.
3. Sửa ảnh của SKU `kostritzer-schwarzbier-bom-5l` trong DB rồi chạy `npm run dump-data`; hoặc tạm override trong `src/app/(web)/utils/productImages.ts`.
4. **Xoá** entry `KNOWN_MISSING_IMAGE_REPLACEMENTS` trỏ sang ảnh Bitburger.

**Cách B — tạm ẩn khỏi bán:**
1. Đặt `is_featured: false` và loại 2 SKU Köstritzer khỏi `STOREFRONT_CATEGORIES` (hoặc thêm cờ `is_hidden`).
2. Ghi rõ trong `docs/` là đang chờ ảnh.

Trong cả hai cách: **xoá** `KNOWN_MISSING_IMAGE_REPLACEMENTS` — map ảnh sản phẩm sang thương hiệu khác là sai về bản chất.

## 2.5 — Đồng nhất ảnh khi thêm vào giỏ

`src/app/(web)/components/ProductOrderActions.tsx:31,44` dùng `product.images?.[0] || ''` → chuỗi rỗng làm `<Image src="">` ở `/dat-hang` lỗi. Dùng chung helper:

```ts
import { getDisplayProductImage } from '../utils/productImages';
// ...
const cartImage = getDisplayProductImage({ images: product.images, category: (product as { category?: string | null }).category ?? null });
```

Truyền `cartImage` cho cả `handleAddCart` và `handleBuyNow`. Đồng thời thêm guard ở `dat-hang/page.tsx:266`:

```tsx
{item.image ? <Image src={item.image} alt={item.name} fill sizes="80px" /> : <span className="checkout-item-image-empty" aria-hidden="true" />}
```

## 2.6 — Verify Phase 2

```bash
npm test && npx next build
```

Tay: thêm 1 sản phẩm vào giỏ → `/dat-hang` → khối chuyển khoản hiển thị **số tài khoản thật** (hoặc phương thức bị ẩn nếu chưa cấu hình ENV). Mở `/` ở tab ẩn danh → logo cổng tuổi hiện đúng. Mở `/san-pham/kostritzer-schwarzbier-bom-5l` → có ảnh, hoặc SKU không còn tồn tại (404) nếu chọn Cách B.

---

# PHASE 3 — Bỏ đánh giá bịa + dọn placeholder schema (P0.4)

## 3.1 — Test trước

Thêm vào `src/app/(web)/components/JsonLd.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getProductSchema, getStoreSchema } from './JsonLd';

describe('Product schema — không được bịa dữ liệu', () => {
  it('KHÔNG chứa aggregateRating khi chưa có review thật', () => {
    const s = getProductSchema({ name: 'Benediktiner Naturtrüb', slug: 'x', price: 1000, category: 'bia' }) as Record<string, unknown>;
    expect(s.aggregateRating).toBeUndefined();
    expect(s.review).toBeUndefined();
  });
});

describe('Store schema — không placeholder', () => {
  it('không phát chuỗi placeholder ra public', () => {
    const json = JSON.stringify(getStoreSchema());
    expect(json.toLowerCase()).not.toContain('placeholder');
  });
});
```

## 3.2 — Sửa `src/app/(web)/components/JsonLd.tsx`

1. **Xoá** toàn bộ khối `hashCode` / `ratingValue` / `reviewCount` (dòng ~165-175) và trường `aggregateRating` trong object trả về (dòng ~203-209).
2. Trong `getStoreSchema()`: xoá `hasMap` và 2 phần tử `sameAs` chứa `placeholder`. Chỉ giữ URL thật (`https://www.facebook.com/tiepkhachsanhdieu`, `https://zalo.me/0899191313`). Khi có Google Business Profile thật thì thêm lại `hasMap` bằng URL thật.
3. Đưa `availability` theo dữ liệu thật thay vì cứng `InStock`. Nếu chưa có tồn kho, thêm tham số:

```ts
availability: product.inStock === false
  ? 'https://schema.org/OutOfStock'
  : 'https://schema.org/InStock',
```
và bỏ `priceValidUntil` cố định `'2027-12-31'` (hoặc tính `now + 90 ngày` tại thời điểm build).

4. Prop `type` của component `JsonLd` không được dùng (eslint warning). Hoặc bỏ prop, hoặc dùng nó để set `data-schema-type` phục vụ debug. Đừng để chữ ký hàm nói dối.

## 3.3 — Đồng bộ UI với dữ liệu thật

`src/app/(web)/components/ProductCard.tsx:154-158`: khối `card-trust-signals` hardcode `"✓ Còn hàng"` + `"⚡ Giao nội thành 24h"`. Hoặc:
- lấy từ dữ liệu (`product.in_stock`), hoặc
- đổi sang câu không phải là cam kết kiểm chứng được: `"Giao nội thành Hà Nội trong ngày"` — và bỏ `"✓ Còn hàng"` nếu không có tồn kho thật.

Đồng thời chuyển inline style của khối này sang class trong `web.css` (`.card-trust-signals`, `.card-unit-price`) theo yêu cầu của `DESIGN.md`.

## 3.4 — Verify

```bash
npm test && npx next build
```

Tay: mở PDP bất kỳ, `view-source`, tìm `aggregateRating` → **không còn**. Dán JSON-LD vào https://validator.schema.org → không có warning về review.

---

# PHASE 4 — Mở lại 18 SKU + sửa link 404 + canonical (P1.1, P1.2, P1.3)

## 4.1 — Test trước

Tạo `src/app/(web)/catalog-coverage.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getAllProducts, getBeerProducts, getComboProducts, getProductsByCategory, getProductBySlugOrId } from '@/lib/data/products';

describe('phủ catalog', () => {
  it('mọi SKU bán được đều có trang chi tiết', () => {
    const orphans = getAllProducts().filter((p) => !getProductBySlugOrId(p.slug));
    expect(orphans).toEqual([]);
  });

  it('có đủ SKU theo nhóm để render trên /san-pham', () => {
    expect(getBeerProducts().length).toBeGreaterThanOrEqual(17); // KHÔNG loại Bitburger
    expect(getProductsByCategory('vang').length).toBe(9);
    expect(getComboProducts().length).toBe(3);
  });
});
```

Tạo `src/app/(web)/components/footer-links.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getProductBySlugOrId } from '@/lib/data/products';

describe('link sản phẩm trong footer', () => {
  it('mọi /san-pham/<slug> trong WebFooter đều tồn tại', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/WebFooter.tsx'), 'utf8');
    const slugs = [...src.matchAll(/href="\/san-pham\/([^"]+)"/g)].map((m) => m[1]);
    expect(slugs.length).toBeGreaterThan(0);
    const broken = slugs.filter((s) => !getProductBySlugOrId(s));
    expect(broken).toEqual([]);
  });
});
```

## 4.2 — Sửa footer

`src/app/(web)/components/WebFooter.tsx:60-61`:

```tsx
<Link href="/san-pham/benediktiner-naturtrub-thung-12-chai-500ml">Benediktiner Weissbier</Link>
<Link href="/san-pham/benediktiner-dunkel-thung-12-chai-500ml">Benediktiner Dunkel</Link>
```

## 4.3 — Hiển thị đủ SKU trên `/san-pham`

`src/app/(web)/san-pham/page.tsx`:

1. Bỏ `excludeBitburger`: `const beerProducts = getBeerProducts();`
2. Thêm 2 section còn thiếu, đặt **combo trước vang** (combo có margin tốt hơn):

```tsx
      {/* COMBO */}
      {comboProducts.length > 0 && (
        <section className="container mt-100" id="combo" aria-label="Combo tiết kiệm">
          <div className="section-header-center mb-48">
            <span className="section-label">Mua Theo Combo</span>
            <h2 className="section-title">Combo Tiết Kiệm</h2>
            <p className="page-subtitle">Bia Đức kèm xúc xích chuẩn vị — giá tốt hơn mua lẻ.</p>
          </div>
          <div className="grid-featured-products">
            {comboProducts.map((product) => (
              <ProductCard key={product.id} {...product} description={product.description} showCTA />
            ))}
          </div>
        </section>
      )}

      {/* RƯỢU VANG ĐỨC */}
      {wineProducts.length > 0 && (
        <section className="container mt-100" id="ruou-vang" aria-label="Rượu vang Đức">
          <div className="section-header-center mb-48">
            <span className="section-label">Tuyển Chọn Thêm</span>
            <h2 className="section-title">Rượu Vang Đức</h2>
            <p className="page-subtitle">Riesling, Spätburgunder từ Rappenhof, Thörle — nhập khẩu nguyên chai.</p>
          </div>
          <div className="grid-featured-products">
            {wineProducts.map((product) => (
              <ProductCard key={product.id} {...product} description={product.description} showCTA />
            ))}
          </div>
        </section>
      )}
```
với `const wineProducts = getProductsByCategory('vang');`

3. Cập nhật pill nav (thêm `#combo`, `#ruou-vang`; đổi nhãn "Bia Đức" → "Bia Đức (Benediktiner & Bitburger)" nếu vừa).
4. Thêm tab `combo` vào `src/app/(web)/components/ProductTabs.tsx` (type `TabId`, mảng `tabs`, `getFilteredProducts`) để trang chủ không còn bỏ sót combo.

**Lưu ý dữ liệu:** SKU `bitburger-premium-pils` có `price: null` → card sẽ không có nút "Mua Ngay". Hoặc cập nhật giá trong DB rồi `npm run dump-data`, hoặc loại SKU trùng lặp này (đã có `bitburger-premium-pils-thung-12-chai-330ml` và `...-ket-24-lon-330ml`).

## 4.4 — Sửa canonical kế thừa sai

**(a)** `src/app/(web)/layout.tsx` — **xoá** `canonical` khỏi `alternates`, giữ `languages`:

```ts
  alternates: {
    languages: { 'vi-VN': BASE_URL },
  },
```

**(b)** Thêm `alternates: { canonical: 'https://www.biathaytu.com/<slug>' }` vào metadata của 8 trang còn thiếu:

`chinh-sach-bao-mat`, `chinh-sach-doi-tra`, `chinh-sach-giao-hang`, `chinh-sach-kiem-soat-do-tuoi`, `chinh-sach-thanh-toan`, `chinh-sach-cookie`, `dieu-khoan-su-dung`, `nhan-uu-dai`.

(`chua-du-tuoi` đã được xử lý ở Phase 1.5.)

**(c)** `nhan-uu-dai/page.tsx` — bổ sung `title` + `description` riêng (hiện đang dùng của trang chủ):

```ts
export const metadata: Metadata = {
  title: 'Nhận Ưu Đãi Bia Đức — Quà Tặng Độc Quyền',
  description: 'Đăng ký nhận ưu đãi và quà tặng độc quyền từ Bia Thầy Tu. Bia Đức nhập khẩu chính hãng, giao hàng toàn quốc.',
  alternates: { canonical: 'https://www.biathaytu.com/nhan-uu-dai' },
};
```

**(d)** Bỏ trùng tên thương hiệu trong `<title>`: template ở layout là `'%s | Bia Thầy Tu'`, nên **bỏ** cụm "Bia Thầy Tu"/"— Bia Thầy Tu" khỏi title của các trang con:
- `dat-hang/layout.tsx:4` → `'Thanh Toán'`
- `kien-thuc/page.tsx:9,15,30` → `'Kiến Thức Bia Đức'`
- `thuong-hieu/page.tsx` → `'Câu Chuyện Thương Hiệu — 400 Năm Ủ Bia'`
- `ve-chung-toi/page.tsx` → `'Về Chúng Tôi — Nhà Nhập Khẩu Bia Đức Độc Quyền'`
- `benediktiner-weissbier-naturtrub/page.tsx` → `'Benediktiner Weissbier Naturtrüb — Nhập Khẩu Đức'`
- `san-pham/[slug]/page.tsx:48` → `title: product.name`
- `kien-thuc/[slug]/page.tsx:50` → `title: article.title`

Thêm test chặn hồi quy — `src/app/seo-regression.test.ts`:

```ts
it('title của trang con không lặp tên thương hiệu', () => {
  // đọc metadata title từ các file page và assert không chứa 'Bia Thầy Tu'
});
```

**(e)** `src/app/(web)/san-pham/page.tsx:60-61` — đổi `https://biathaytu.com` → `https://www.biathaytu.com` trong breadcrumb JSON-LD.

**(f)** Sitemap: bỏ **một** trong hai nguồn. Khuyến nghị giữ `src/app/sitemap.ts` (động, đúng chuẩn App Router):
- Xoá `postbuild` khỏi `package.json` và xoá `public/sitemap.xml` (file tĩnh này đang tranh chấp đường dẫn với route).
- Thay `CONTENT_LAST_UPDATED` hardcode bằng ngày build: `new Date()`.
- Thêm các trang chính sách vào `routes` (priority 0.3).

## 4.5 — Verify

```bash
npm test && npx next build
```

Tay: `/san-pham` phải có **≥ 34 card** và có section Combo, Rượu Vang, và các SKU Bitburger. Click cả 5 link sản phẩm ở footer → không có 404. Kiểm canonical:

```js
// dán vào Console
(async()=>{for(const p of ['/chinh-sach-bao-mat','/chinh-sach-cookie','/dieu-khoan-su-dung','/nhan-uu-dai','/chua-du-tuoi']){
 const d=new DOMParser().parseFromString(await (await fetch(p)).text(),'text/html');
 console.log(p, d.querySelector('link[rel=canonical]')?.href, d.querySelector('title')?.textContent);}})()
```
→ mỗi trang phải tự trỏ về chính nó.

---

# PHASE 5 — Consent, dữ liệu đơn hàng, a11y (P1.5, P1.6, P1.7, P1.8, P1.11)

## 5.1 — Gate SDK Messenger theo consent (P1.5)

`src/app/(web)/components/FacebookMessengerChat.tsx`: áp đúng mẫu của `FacebookPixel.tsx`.

```tsx
import { getCookieConsentPreferences, CookiePreferences } from './CookieConsent';
// ...
const [hasMarketingConsent, setHasMarketingConsent] = useState(false);

useEffect(() => {
  const check = () => setHasMarketingConsent(Boolean(getCookieConsentPreferences()?.marketing));
  check();
  const onUpdate = (e: Event) =>
    setHasMarketingConsent(Boolean((e as CustomEvent<CookiePreferences>).detail?.marketing));
  window.addEventListener('cookieConsentUpdated', onUpdate);
  return () => window.removeEventListener('cookieConsentUpdated', onUpdate);
}, []);

useEffect(() => {
  if (!hasMarketingConsent || !currentPageId) return;
  // ... toàn bộ logic inject SDK hiện tại
}, [currentPageId, hasMarketingConsent]);
```

Đồng thời **dọn dẹp khi mất consent**: xoá `#fb-root`, `#fb-customer-chat`, `#facebook-jssdk` và iframe `fbc_*`.

Thay `FB?: any` bằng `FB?: { init: (o: Record<string, unknown>) => void; XFBML?: { parse: () => void } }`.

**Quyết định UX kèm theo:** đang có **2 widget chat** cùng góc phải dưới (nút Messenger trong `FloatingZaloCTA` + bong bóng Facebook plugin). Chọn một. Khuyến nghị: **bỏ plugin Facebook Customer Chat**, giữ `FloatingZaloCTA` (nhẹ hơn, không cần consent, không cookie bên thứ ba). Nếu bỏ, xoá luôn `FacebookMessengerChat` khỏi layout — giải quyết P1.5 triệt để nhất.

## 5.2 — Sửa regex số điện thoại (P1.7)

Test trước — `src/lib/orders/phone.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateOrderInput } from './validation';

const ok = ['0912345678','0387654321','0523456789','0762345678','0812345678','0999888777'];
const bad = ['0|12345678','030312345678','1234567890','091234567','09123456789','0012345678','abcdefghij',''];

describe('PHONE_REGEX', () => {
  const items = [{ id: 'p', name: 'x', quantity: 1, image: '', price: 1 }];
  const base = { name: 'Nguyen A', address: '1 T', purchaser_age_confirmed: true, receiver_age_confirmed: true, terms_agreed: true };
  it.each(ok)('nhận %s', (phone) => {
    expect(validateOrderInput({ ...base, phone } as never, items as never).error).not.toMatch(/điện thoại/i);
  });
  it.each(bad)('từ chối %s', (phone) => {
    expect(validateOrderInput({ ...base, phone } as never, items as never).error).toMatch(/điện thoại/i);
  });
});
```

Sửa cả 2 nơi (`src/lib/orders/validation.ts:3` và `src/app/(web)/dat-hang/page.tsx:117`) — **và** để client import từ server module thay vì copy:

```ts
// src/lib/orders/validation.ts
/** Đầu số di động Việt Nam: 03x(2-9) 05x(2,6,8,9) 07x(0,6-9) 08x(1-9) 09x */
export const PHONE_REGEX = /^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
```

```ts
// dat-hang/page.tsx
import { PHONE_REGEX } from '@/lib/orders/validation';
// ...
if (!PHONE_REGEX.test(formData.phone)) { ... }
```

Thêm `inputMode="numeric"` + `autoComplete="tel"` cho input SĐT.

## 5.3 — Đường ống đơn hàng chịu lỗi (P1.8)

1. **Mã đơn không trùng:** đổi `generateOrderNumber` sang `BTU-YYYYMMDD-HHmmss-XXX` (thêm giờ-phút-giây + 3 ký tự base36 random) — hoặc dùng counter/UUID ngắn.
2. **Fallback khi Sheets lỗi:** không trả 502 mất đơn. Ghi đơn vào một kênh thứ hai trước khi báo lỗi — thứ tự khuyến nghị: (a) Sheets, (b) nếu lỗi → Telegram với nhãn `⚠️ ĐƠN CHƯA VÀO SHEET`, (c) chỉ trả 502 khi **cả hai** kênh lỗi. Hiện Telegram là best-effort *sau* Sheets nên khi Sheets lỗi thì không ai biết có đơn.
3. **Kiểm tra ENV lúc khởi động:** thêm test đảm bảo `.env.example` liệt kê đủ mọi `process.env.*` mà `src/` đọc:

```ts
// src/lib/config.test.ts — quét src/ tìm process.env.X rồi assert X có trong .env.example
```
4. Rate limit: ghi chú rõ trong code là in-memory chỉ có tác dụng trên single instance; nếu deploy serverless cần Upstash/KV. Bỏ `setInterval` ở module scope (leak trên mỗi lambda) — dọn lazy trong `isRateLimited`.
5. Thêm kiểm tra `Origin` header cho `POST /api/order`.

## 5.4 — A11y checkout & điều hướng (P1.6)

`src/app/(web)/dat-hang/page.tsx` — mọi input text/tel/email/textarea:

```tsx
<div className="checkout-field">
  <label className="checkout-label" htmlFor="co-name">Họ và Tên người đặt *</label>
  <input id="co-name" name="name" autoComplete="name" required type="text" ... />
</div>
```

Bảng `id` / `autoComplete` cần dùng:

| Field | id | autoComplete | thêm |
|-------|----|--------------|------|
| name | `co-name` | `name` | |
| phone | `co-phone` | `tel` | `inputMode="numeric"` |
| email | `co-email` | `email` | |
| receiverName | `co-recv-name` | `name` | |
| receiverPhone | `co-recv-phone` | `tel` | `inputMode="numeric"` |
| address | `co-address` | `street-address` | |
| note | `co-note` | `off` | |

Kích thước target (thêm vào `web.css`, thay cho inline style):
- `.checkout-qty-btn { min-width: 44px; min-height: 44px; }`
- `.cart-icon-wrap { min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; }`
- `.footer-links a { display: block; padding: 10px 0; }` (từ 22px → 42px+)
- `.btn-sm { min-height: 44px; }`

Header (`WebHeader.tsx`): thêm `aria-expanded={menuOpen}` + `aria-controls="mobile-menu"` cho hamburger, `id="mobile-menu"` cho overlay, đóng bằng Escape, và thêm **skip-to-content link** đầu `(web)/layout.tsx`:

```tsx
<a href="#main-content" className="skip-link">Bỏ qua tới nội dung chính</a>
...
<main id="main-content">{children}</main>
```
kèm CSS `.skip-link` (ẩn tới khi `:focus`).

`Toast.tsx`: thêm `role="status" aria-live="polite"`, và trên mobile đổi vị trí xuống dưới (`bottom: calc(nav-height + 12px)`) để không che hamburger/giỏ hàng.

## 5.5 — Cổng tuổi: bẫy focus + giảm dữ liệu thu thập (P1.11)

1. **Bẫy focus:** khi mở, set `inert` cho nội dung nền và vòng Tab trong modal.

```tsx
useEffect(() => {
  if (!isOpen) return;
  const siblings = Array.from(document.querySelectorAll('.web-app > *')).filter((el) => el !== modalRef.current);
  siblings.forEach((el) => el.setAttribute('inert', ''));
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); setErrorMsg('Vui lòng hoàn thành xác nhận độ tuổi để tiếp tục.'); return; }
    if (e.key !== 'Tab' || !modalRef.current) return;
    const f = modalRef.current.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => { siblings.forEach((el) => el.removeAttribute('inert')); window.removeEventListener('keydown', onKeyDown); };
}, [isOpen]);
```

2. **Bỏ trường "Họ và tên"** — nó không được lưu, không dùng để xác minh, chỉ tạo ma sát và thu thập dữ liệu cá nhân vượt mức (nguyên tắc tối thiểu hoá dữ liệu). Giữ ngày sinh + checkbox xác nhận. Cập nhật `compliance.test.ts` tương ứng.
   *(Nếu pháp chế yêu cầu giữ họ tên, ghi rõ lý do vào `docs/` và giữ — nhưng phải nêu trong Chính sách bảo mật là không lưu.)*

3. `<h1 id="age-gate-title">` → đổi thành `<h2>` hoặc `<p role="heading" aria-level={1}>` để trang không có 2 `<h1>`.

4. Đổi màu cổng tuổi + cookie banner sang token thương hiệu (xem Phase 6).

## 5.6 — Verify

```bash
npm test && npx next build && npx eslint .
```

Tay:
- Từ chối cookie tiếp thị → reload → Console: `performance.getEntriesByType('resource').filter(r=>/facebook/.test(r.name))` phải **rỗng**.
- Cổng tuổi mở → Tab vòng tròn trong modal, không ra được nền.
- Checkout: dùng screen reader (NVDA/VoiceOver) đọc đủ nhãn 7 field; trên mobile bàn phím số hiện cho SĐT; autofill hoạt động.

---

# PHASE 6 — Hợp nhất design system (P1.4, P1.10) — **cần quyết định thiết kế trước khi code**

Đây là phase lớn nhất và là điều tạo nên cảm nhận "cao cấp". **Không bắt đầu code trước khi chủ dự án chốt câu hỏi 1.**

## 6.1 — Ba quyết định cần chốt

1. **Site theo hệ sáng (đá ấm + xanh rừng) hay hệ tối (đen + vàng kim)?** Hiện đang có cả hai: `/` là `rgb(244,241,233)`, `/benediktiner-weissbier-naturtrub` là `rgb(7,11,18)`. Phải chọn một làm chuẩn.
2. **Bảng màu chính thức là gì?** `DESIGN.md` tự mâu thuẫn: frontmatter ghi `Be Vietnam Pro` + xanh; phần văn bản ghi Gold `#B8860B` + Navy + `Playfair Display`; code nạp **Inter + Playfair**.
3. **Có giữ 3 landing riêng theme tối** (`weissbier`, `bitburger`, `uudai`) hay chuyển chúng về hệ chung?

## 6.2 — Sau khi chốt: viết lại `DESIGN.md` thành nguồn sự thật duy nhất

Frontmatter phải khớp **chính xác** biến trong `web.css` và font trong `src/app/layout.tsx`. Thêm test:

```ts
// src/app/design-tokens.test.ts
// parse frontmatter DESIGN.md → assert mọi màu đều xuất hiện trong web.css :root/.web-app
// assert font trong DESIGN.md khớp import next/font trong layout.tsx
```

## 6.3 — Dọn di chứng palette cũ (làm được ngay, không chờ quyết định)

| Chỗ | Hiện tại | Sửa thành |
|-----|----------|-----------|
| `.btn-primary:hover` | `background: #5c4a00` (nâu) | `var(--web-gold-hover)` |
| `.btn-primary` box-shadow | `rgba(115,92,0,.25)` | `rgba(47,93,58,.25)` |
| `.checkout-input-text:focus` | `box-shadow: rgba(115,92,0,.25)` | token xanh |
| `.icon-circle-gold` | gradient `rgba(218,165,32,…)` | token |
| `.glass-card-dark` border | `rgba(218,165,32,.3)` | token |
| `.product-tab-btn.active` shadow | `rgba(184,134,11,.2)` | token |
| `.mobile-bottom-nav` background | `rgba(254,252,248,.96)` | `rgba(244,241,233,.96)` |
| `.web-header--solid` background | `rgba(253,252,240,.88)` | token |
| `.product-card-v2.wine-card` | `rgba(114,47,55,.08)` | token |

Kèm theo: **xoá `!important` không còn cần thiết.** File `web.css` mở đầu bằng comment nói scope `.web-app` để chống `globals.css` ghi đè — **`globals.css` không còn tồn tại trong repo**. 748 `!important` đang phòng thủ một file đã bị xoá. Xoá theo lô nhỏ, kiểm tra trực quan từng lô.

## 6.4 — Sửa tương phản (P1.10)

| Selector | Sửa |
|----------|-----|
| `.footer-links a`, `.footer-brand` | `#4A7D55` (3.36:1) → sáng hơn, cần **≥ 4.5:1** trên `#14241A`. Ví dụ `#8FBF9C` (≈7.4:1). |
| `.footer-18-badge` | tăng font từ **8px → ≥12px**; dùng nền sáng + chữ tối để đạt ≥4.5:1 |
| `.disclaimer-text` | `--web-text-muted` (4.45:1) → `--web-text-secondary` `#4B5A50` (≈6.1:1). **Cảnh báo pháp lý phải là chữ dễ đọc nhất, không phải khó nhất.** |
| `.p-body` trong `.section-alt` | dùng `--web-text-secondary` thay `--web-text-muted` |
| `.tab-count` | dùng `--web-text-secondary` |

Thêm test tự động (Phase 6 cuối): script Playwright/Puppeteer chạy hàm đo tương phản trên các trang chính và fail CI nếu có vi phạm AA. Đoạn script đo đã dùng trong audit nằm ở mục 4 của báo cáo — tái sử dụng được.

## 6.5 — Dọn inline style theo `DESIGN.md`

Ưu tiên theo mức độ khách nhìn thấy: `dat-hang` → `san-pham/[slug]` (khối pairings) → `kien-thuc/[slug]` → `AlcoholWarning` → `AgeVerificationGate` → `CookieConsent`.

`AlcoholWarning` đặc biệt: 5 variant với 5 bộ màu không liên quan. Viết lại thành 5 class trong `web.css` dùng cùng token; đổi `role="alert"` → `role="note"` cho banner tĩnh (`role="alert"` khiến trình đọc màn hình đọc chen ngang mọi lần tải trang); xoá `minHeight: '10%'` (CSS vô nghĩa).

## 6.6 — Sửa chiều cao bottom nav

`--web-mobile-bottom-nav-height: 60px` nhưng thanh nav render **75px** (do padding + safe-area). Hoặc đặt `height` cố định cho nav, hoặc sửa biến thành `75px`. Kiểm tra lại: `main` padding-bottom đủ, và floating Zalo (`bottom: nav + 10`) không đè lên nav.

---

# PHASE 7 — P2 theo sprint

Thứ tự đề xuất (chi tiết từng mục trong mục 4 của báo cáo audit):

1. **i18n** — hoặc dịch đủ (URL `/en`, `/de` + `<html lang>` động + dịch nội dung/chính sách), hoặc **tạm ẩn switcher**. Hiện tại switcher hứa 3 ngôn ngữ nhưng chỉ dịch ~25 chuỗi → tệ hơn không có. **Sửa ngay bất kể chọn gì:** `LanguageContext.tsx:116` còn hotline đã bỏ `+84 91 531 2166`.
2. **Bộ ảnh nội bộ** — thay 19 ảnh hotlink từ `product.hstatic.net` (gồm cả 8 SKU Benediktiner chủ lực) bằng asset riêng; đồng thời pre-optimize PNG 2–2,9 MB sang WebP/AVIF đúng kích thước (dev optimizer đã fail trên `lifestyle_garden_v2.png`).
3. **Sanitize `ArticleBody`** — thêm `isomorphic-dompurify` cho `dangerouslySetInnerHTML`.
4. **Sửa 3 slug hỏng** + thêm redirect 301 từ slug cũ.
5. **Thứ tự heading** — sửa H1→H3 / H2→H4 trên trang chủ, H1→H4 trên PDP.
6. **Nhất quán nội dung thương hiệu** — chốt 1330 vs 1609 vs "400 năm"; cập nhật FAQ (trang chủ + `getLandingFAQSchema`) cho khớp catalog thật.
7. **Feed Google Merchant** — thêm mọi category, `identifier_exists=no`, `g:shipping`; loại SKU `0 VND`.
8. **Form liên hệ trên `/lien-he`** — hiện chỉ có Zalo/điện thoại, chặn khách B2B và khách EN/DE.
9. **Giới hạn mã giảm giá** — `VIP10` (10%, min 0, không hết hạn) cộng dồn với auto 5% → 15% mọi đơn, không giới hạn lượt.
10. **Dọn kỹ thuật** — `.web-app` lồng nhau (5 trang), `.btn-secondary`/`.btn-ghost` không tồn tại, `FloatingZaloCTA` inline `display` chặn transition, `catch {}` rỗng, 40 eslint warning, `setState`-in-effect.
11. **Sửa `tsc --noEmit`** — `integrations.test.ts:6` thiếu 7 field compliance của `OrderRecord`; nhân đó **bổ sung test cho payload compliance**.
12. **Chốt nền tảng deploy** — `netlify.toml` đặt `publish = ".next"` (Next.js trên Netlify cần runtime plugin) và có cả `vercel.json`. Xoá cái không dùng.

---

## Định nghĩa "xong"

- [ ] `npm test && npx next build && npx eslint .` sạch (eslint 0 error; warning giảm so với 40)
- [ ] `npx tsc --noEmit` sạch
- [ ] Khách mới: **chỉ** cổng tuổi hiện ra; không popup nào che nó; Tab không ra được nền
- [ ] `/chua-du-tuoi` không có link mua bia nào, `noindex`
- [ ] `POST /api/order` thiếu field tuổi → 400 với lỗi về tuổi
- [ ] Checkout hiển thị số tài khoản thật (hoặc ẩn phương thức nếu chưa cấu hình)
- [ ] Không còn `aggregateRating` trong bất kỳ JSON-LD nào
- [ ] `/san-pham` render đủ 34 SKU; 0 link footer 404
- [ ] 9 trang canonical trỏ đúng chính nó; không title nào lặp "Bia Thầy Tu"
- [ ] Không ảnh nào `naturalWidth === 0` trên `/`, `/san-pham`, mọi PDP
- [ ] SDK Facebook không nạp khi `marketing: false`
- [ ] 0 vi phạm tương phản WCAG AA trên `/`, `/san-pham`, `/dat-hang`
- [ ] Mọi input checkout có label liên kết + `autocomplete`; target ≥ 44px
