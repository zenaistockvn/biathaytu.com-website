# Plan Vòng 3 — Sửa Hồi Quy Dữ Liệu & Làm "Ẩn Sản Phẩm" Cho Đúng

> **Ngày:** 2026-07-30 · **Repo:** `biathaytu-web` · **Branch:** `feature/age-verification-and-compliance` (HEAD `aa50c6d`)
> **Phạm vi:** chỉ 3 Phase (F, G, H) — xử lý hậu quả của Phase E vòng 2. **Không** chạm gì khác.
> **Tài liệu liên quan:** `2026-07-30-remediation-plan.md` (vòng 2), `2026-07-29-ui-functionality-audit-report.md`

---

## 0. Vòng 2 đã làm tốt gì và sai gì

**Phase A–D vòng 2 đạt hết — giữ nguyên, không chạm:** đường ống đơn hàng trả 502 khi cả 2 kênh chết + log `[ORDER_LOST]` + mã đơn `BTU-YYYYMMDD-HHmmss-XXX`; checkout `labelled 7/7` + `autocomplete 7/7` + target 44px + skip-link; cổng tuổi bẫy focus bằng `inert` + bỏ thu thập họ tên; `tsc --noEmit` xanh; 114 test pass.

**Phase E sai 5 chỗ.** Yêu cầu là *"thay hack `slug.includes('kostritzer')` bằng danh sách `HIDDEN_PRODUCT_SLUGS` tường minh"* — tức chỉ đổi **cơ chế**, không đổi **dữ liệu**. Thực tế đã xảy ra:

| # | Việc đã làm | Vì sao sai |
|---|---|---|
| E-a | Thêm 2 SKU mới vào `localProducts.ts`: `kosteritzer-schwarzbier-24-chai-330ml` (990.000₫) và `kosteritzer-schwarzbier-thung-12-chai-500ml` (890.000₫) | **Dữ liệu bịa.** Id, giá, ABV, IBU, mô tả đều tự sinh — không có trong DB, không ai yêu cầu. Slug còn sai chính tả (`kosteritzer`). |
| E-b | Đổi ảnh cả 4 SKU Köstritzer sang `88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg` | Đó là ảnh **bom Bitburger**. Báo cáo audit đã ghi rõ "map ảnh sản phẩm sang thương hiệu khác là **sai về bản chất**", và vòng 1 vừa xoá đúng cái mapping này. Việc này chỉ để `asset-integrity.test.ts` xanh. |
| E-c | `getVisibleProducts()` chỉ được dùng ở trang catalog | `sitemap.ts`, `generateStaticParams`, `llms.txt`, trang chủ vẫn dùng `getAllProducts()` → build **117 → 121 trang**, cả 4 URL trả **200 + `index, follow` + có trong sitemap**. Vòng 1 các URL này là **404**. "Ẩn" mà Google vẫn index được thì không phải ẩn. |
| E-d | Sửa `src/data/products.json` | File này do `scripts/dump_data.js` sinh từ Neon. `npm run build` sẽ ghi đè → thay đổi bốc hơi, DB thật vẫn giữ ảnh thiếu. |
| E-e | Tự quyết mục có nhãn `🛑 CHỜ CHỦ DỰ ÁN` | Plan ghi rõ không sửa gì liên quan Köstritzer cho tới khi có trả lời. |

## 1. Nguyên tắc bắt buộc cho vòng 3

**Bốn điều tuyệt đối không được làm:**

1. **Không tạo mới bất kỳ sản phẩm, giá, ABV, IBU, mô tả hay ảnh nào** không có sẵn trong `src/data/products.json` (sinh từ DB) hoặc trong `public/`. Không có = **dừng và hỏi**.
2. **Không trỏ ảnh của SKU thương hiệu này sang file ảnh của thương hiệu khác** — trong mọi trường hợp, kể cả để test xanh.
3. **Khi một test đỏ vì dữ liệu thiếu** (ảnh không tồn tại): cách đúng là **thu hẹp phạm vi test** cho khớp thực tế nghiệp vụ (chỉ SKU đang bán mới cần ảnh), **không** phải đổi dữ liệu cho khớp test.
4. **Không sửa `src/data/products.json`** — đây là artifact sinh tự động. Sửa dữ liệu gốc thì phải sửa trong DB rồi chạy `npm run dump-data`; nếu không có quyền vào DB thì ghi vào báo cáo.

**Lệnh verify sau mỗi Phase — cả 4 phải xanh:**

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

> Dùng `npx next build`, **không** dùng `npm run build`.
> `npx tsc --noEmit` hiện đang xanh — **không được để nó đỏ lại**.

---

# PHASE F — Hoàn lại dữ liệu bịa và ảnh sai thương hiệu

## F.1 — Test trước

Tạo `src/lib/data/product-data-integrity.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
import { getAllProducts } from './products';

const KOSTRITZER_RE = /k(ö|o)strit?zer/i;
const BITBURGER_IMAGE_RE = /bitb|bitburger/i;

describe('toàn vẹn dữ liệu sản phẩm', () => {
  it('KHÔNG có SKU nào dùng ảnh của thương hiệu khác', () => {
    const wrongBrand = getAllProducts()
      .filter((p) => KOSTRITZER_RE.test(p.name))
      .flatMap((p) => (p.images ?? []).map((img) => `${p.slug} → ${img}`))
      .filter((pair) => BITBURGER_IMAGE_RE.test(pair.split('→')[1]));
    expect(wrongBrand).toEqual([]);
  });

  it('localProducts.ts chỉ chứa SKU do người thật thêm — không có SKU Köstritzer tự sinh', () => {
    const invented = LOCAL_STOREFRONT_PRODUCTS
      .filter((p) => KOSTRITZER_RE.test(p.name) && p.category === 'bia')
      .map((p) => p.slug);
    expect(invented).toEqual([]);
  });

  it('không có slug nào sai chính tả "kosteritzer"', () => {
    const typos = getAllProducts().map((p) => p.slug).filter((s) => /kosteritzer/i.test(s));
    expect(typos).toEqual([]);
  });

  it('products.json giữ nguyên ảnh gốc của SKU Köstritzer (artifact sinh từ DB)', () => {
    const sku = (productsData as Array<{ slug: string; images: string[] | null }>)
      .find((p) => p.slug === 'kostritzer-schwarzbier-bom-5l');
    expect(sku, 'thiếu SKU kostritzer-schwarzbier-bom-5l trong products.json').toBeTruthy();
    expect(sku!.images?.[0]).toBe('/images/products/official/bitburger/kostritzer_keg.png');
  });
});
```

Chạy `npm test` → **phải đỏ cả 4 test**. Đó là bằng chứng hồi quy tồn tại.

## F.2 — Xoá 2 SKU bịa

`src/lib/data/localProducts.ts` — **xoá hoàn toàn** 2 phần tử có slug:
- `kosteritzer-schwarzbier-24-chai-330ml`
- `kosteritzer-schwarzbier-thung-12-chai-500ml`

(id `...ef201` và `...ef202`)

## F.3 — Hoàn lại đường dẫn ảnh gốc

**(a)** `src/lib/data/localProducts.ts` — SKU `combo-oktoberfest-keg-kostritzer-xuc-xich`:

```ts
    images: ['/images/products/official/bitburger/kostritzer_keg.png'],
```

**(b)** `src/data/products.json` — SKU `kostritzer-schwarzbier-bom-5l`, hoàn lại:

```json
    "images": [
      "/images/products/official/bitburger/kostritzer_keg.png"
    ],
```

> File này **không được sửa tay** về sau. Ở đây ta chỉ **hoàn lại** giá trị mà vòng 2 đã sửa sai, để nó khớp trở lại với DB.
> Cách nhanh nhất: `git checkout abd008d -- src/data/products.json` rồi kiểm `git diff` chỉ có đúng 1 dòng ảnh thay đổi.

**(c)** Giữ nguyên `hidden: true` cho `combo-oktoberfest-keg-kostritzer-xuc-xich` và giữ nguyên `HIDDEN_PRODUCT_SLUGS` — nhưng bỏ 2 slug bịa khỏi danh sách:

```ts
/**
 * SKU tạm ẩn khỏi storefront kèm LÝ DO. Xoá slug khỏi danh sách này để bán lại.
 * TODO(2026-07-30): cả 2 SKU trỏ tới /images/products/official/bitburger/kostritzer_keg.png
 * — file KHÔNG tồn tại trong public/. Cần ảnh Köstritzer chính hãng, KHÔNG được dùng ảnh Bitburger thay thế.
 */
export const HIDDEN_PRODUCT_SLUGS = new Set<string>([
  'kostritzer-schwarzbier-bom-5l',
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
]);
```

## F.4 — Verify Phase F

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

`asset-integrity.test.ts` sẽ **đỏ** ở bước này (vì ảnh Köstritzer thiếu trở lại) — **đúng như dự kiến**, Phase H sẽ sửa test đó cho đúng phạm vi. **KHÔNG** được sửa dữ liệu để nó xanh.

Nếu muốn chạy tuần tự sạch, có thể làm Phase H.1 trước Phase F. Ghi rõ thứ tự đã chọn vào báo cáo.

---

# PHASE G — Làm "ẩn" cho đúng: ẩn với cả Google, URL trực tiếp và bot AI

## G.1 — Vấn đề (đã đo)

```
build:  117 → 121 trang  (+4 trang cho SKU "ẩn")
GET /san-pham/kostritzer-schwarzbier-bom-5l            → 200 · 850.000₫ · robots: index, follow
GET /san-pham/combo-oktoberfest-keg-kostritzer-...     → 200 · 920.000₫ · robots: index, follow
sitemap.xml → chứa cả 4 URL
llms.txt    → chứa cả 4 SKU
```

Nguyên nhân: `getVisibleProducts()` chỉ được dùng trong `getBeerProducts()/getComboProducts()/…`, còn 4 bề mặt công khai vẫn gọi `getAllProducts()`.

## G.2 — Test trước

Tạo `src/app/hidden-products-not-public.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { HIDDEN_PRODUCT_SLUGS, getVisibleProducts, getAllProducts } from '@/lib/data/products';
import sitemap from '@/app/sitemap';
import { GET as llmsGet } from '@/app/llms.txt/route';
import { generateStaticParams } from '@/app/(web)/san-pham/[slug]/page';

describe('SKU ẩn không được lộ ra bề mặt công khai nào', () => {
  it('sitemap không chứa URL của SKU ẩn', async () => {
    const urls = (await sitemap()).map((r) => r.url);
    const leaked = [...HIDDEN_PRODUCT_SLUGS].filter((s) => urls.some((u) => u.includes(s)));
    expect(leaked).toEqual([]);
  });

  it('generateStaticParams không sinh trang cho SKU ẩn', async () => {
    const params = await generateStaticParams();
    const leaked = params.map((p) => p.slug).filter((s) => HIDDEN_PRODUCT_SLUGS.has(s));
    expect(leaked).toEqual([]);
  });

  it('llms.txt không liệt kê SKU ẩn', async () => {
    const text = await (await llmsGet()).text();
    const leaked = [...HIDDEN_PRODUCT_SLUGS].filter((s) => text.includes(s));
    expect(leaked).toEqual([]);
  });

  it('getVisibleProducts + getAllProducts lệch đúng bằng số SKU ẩn', () => {
    expect(getAllProducts().length - getVisibleProducts().length).toBe(HIDDEN_PRODUCT_SLUGS.size);
  });
});
```

Tạo `src/lib/orders/hidden-not-orderable.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from './pricing';
import { getAllProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';
import { lookupOrderableProduct } from './productLookup';

describe('SKU ẩn không được đặt hàng', () => {
  it('lookupOrderableProduct trả null cho SKU ẩn', () => {
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      expect(lookupOrderableProduct(slug), `${slug} vẫn tra được`).toBeNull();
    }
  });

  it('calculateOrderTotals ném lỗi khi giỏ chứa SKU ẩn', () => {
    const hidden = getAllProducts().find((p) => HIDDEN_PRODUCT_SLUGS.has(p.slug))!;
    expect(() =>
      calculateOrderTotals(
        [{ id: hidden.id, name: hidden.name, image: '', price: 1, quantity: 1 }],
        lookupOrderableProduct,
        null,
      ),
    ).toThrow();
  });

  it('SKU đang bán vẫn tra được bình thường', () => {
    const visible = getAllProducts().find((p) => !HIDDEN_PRODUCT_SLUGS.has(p.slug) && p.price)!;
    expect(lookupOrderableProduct(visible.id)?.id).toBe(visible.id);
  });
});
```

## G.3 — Thêm hàm tra cứu dùng cho đặt hàng

Tạo `src/lib/orders/productLookup.ts`:

```ts
import { getProductBySlugOrId, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';
import type { Product } from '@/lib/data/products';

/**
 * Tra sản phẩm cho luồng ĐẶT HÀNG. Trả null với SKU đang ẩn để giỏ hàng cũ
 * (localStorage) không thể đặt được sản phẩm đã ngừng bán.
 */
export function lookupOrderableProduct(key: string): Product | null {
  const product = getProductBySlugOrId(key);
  if (!product) return null;
  if (product.hidden || HIDDEN_PRODUCT_SLUGS.has(product.slug)) return null;
  return product;
}
```

`src/app/api/order/route.ts` — đổi lookup truyền vào `calculateOrderTotals`:

```ts
import { lookupOrderableProduct } from '@/lib/orders/productLookup';
// ...
      totals = calculateOrderTotals(items, lookupOrderableProduct, promo);
```
(bỏ import `getProductBySlugOrId` nếu không còn dùng)

## G.4 — Đổi 4 bề mặt công khai sang `getVisibleProducts()`

| File:line | Đổi |
|---|---|
| `src/app/sitemap.ts:106` | `const products = getVisibleProducts();` |
| `src/app/llms.txt/route.ts:31` | `const products = getVisibleProducts() as unknown as ProductItem[];` |
| `src/app/(web)/page.tsx:40` | `const featuredProducts = getVisibleProducts();` |
| `src/app/(web)/san-pham/[slug]/page.tsx:13` | `return getVisibleProducts().filter((p) => p.slug).map((p) => ({ slug: p.slug as string }));` |

Cập nhật import tương ứng ở mỗi file.

## G.5 — Trang chi tiết phải 404 với SKU ẩn

`src/app/(web)/san-pham/[slug]/page.tsx` — ngay sau khi tra được product:

```ts
  const product = getProductBySlugOrId(slug) as ProductData | null;

  if (!product || (product as { hidden?: boolean }).hidden) {
    notFound();
  }
```

Và trong `generateMetadata`, trả `{}` cho SKU ẩn (đã có nhánh `if (!product) return {}` — bổ sung điều kiện `hidden`):

```ts
  if (!product || (product as { hidden?: boolean }).hidden) return {};
```

> Vì sao `notFound()` chứ không phải `noindex`? SKU không bán thì không nên có trang. 404 là tín hiệu đúng cho Google và cho khách. Vòng 1 làm đúng điều này (404), vòng 2 làm mất nó.

## G.6 — Verify Phase G

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

Build **phải quay lại 117 trang** (không còn 121).

Kiểm tay trên `npm run dev` — dán vào Console:

```js
(async () => {
  const hidden = ['kostritzer-schwarzbier-bom-5l','combo-oktoberfest-keg-kostritzer-xuc-xich'];
  const out = {};
  for (const s of hidden) out['/san-pham/'+s] = (await fetch('/san-pham/'+s)).status;
  const sm = await (await fetch('/sitemap.xml')).text();
  const llms = await (await fetch('/llms.txt')).text();
  out.sitemapLeak = hidden.filter(s => sm.includes(s));
  out.llmsLeak = hidden.filter(s => llms.includes(s));
  out.sitemapLocCount = (sm.match(/<loc>/g)||[]).length;
  out.homepageTabTotal = [...new DOMParser().parseFromString(await (await fetch('/')).text(),'text/html')
    .querySelectorAll('.tab-count')].map(e=>+e.textContent).reduce((a,b)=>a+b,0);
  return out;
})()
```
→ phải ra: cả 2 URL **404**, `sitemapLeak: []`, `llmsLeak: []`, `sitemapLocCount` giảm 4 (từ 111 → 107), `homepageTabTotal: 32`.

---

# PHASE H — Sửa test cho đúng phạm vi (cách đúng để test xanh)

## H.1 — `asset-integrity.test.ts`: chỉ SKU đang bán mới bắt buộc có ảnh

Đây là gốc rễ khiến vòng 2 đi bịa dữ liệu. Test hiện dùng `getAllProducts()` (gồm SKU ẩn) nên đỏ khi ảnh Köstritzer thiếu. Nghiệp vụ đúng là: **SKU đang bán phải có ảnh; SKU đã ẩn thì được phép thiếu ảnh — đó chính là lý do nó bị ẩn.**

Sửa `src/app/(web)/asset-integrity.test.ts`:

```ts
import { getVisibleProducts, getAllProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';

  it('mọi ảnh của SKU ĐANG BÁN đều tồn tại trong public/', () => {
    const urls = getVisibleProducts()
      .flatMap((p) => p.images ?? [])
      .filter((u) => u.startsWith('/'));

    const missing = urls.filter((u) => !fs.existsSync(localFileFor(u)));
    expect(missing).toEqual([]);
  });

  it('SKU bị ẩn giữ nguyên đường dẫn ảnh THẬT — không được trỏ sang ảnh thương hiệu khác', () => {
    // Nợ kỹ thuật phải nhìn thấy được: SKU ẩn vẫn trỏ tới file còn thiếu,
    // để khi có ảnh chính hãng thì chỉ cần bỏ slug khỏi HIDDEN_PRODUCT_SLUGS.
    const hidden = getAllProducts().filter((p) => HIDDEN_PRODUCT_SLUGS.has(p.slug));
    expect(hidden.length).toBe(HIDDEN_PRODUCT_SLUGS.size);
    for (const p of hidden) {
      for (const img of p.images ?? []) {
        expect(img, `${p.slug} không được dùng ảnh Bitburger`).not.toMatch(/bitb|bitburger/i);
      }
    }
  });
```

Giữ nguyên test thứ hai ("mọi ảnh hardcode trong component đều tồn tại").

## H.2 — Đổi tên file test sai chính tả

`git mv "src/app/(web)/kosteritzer-hidden.test.ts" "src/app/(web)/hidden-products.test.ts"`

Trong file, đổi assert cho khớp thực tế sau Phase F (2 slug, không còn slug `kosteritzer`):

```ts
  it('HIDDEN_PRODUCT_SLUGS chỉ chứa SKU Köstritzer đang chờ ảnh chính hãng', () => {
    expect(HIDDEN_PRODUCT_SLUGS.size).toBe(2);
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      expect(slug).toMatch(/kostritzer/i);
      expect(slug).not.toMatch(/kosteritzer/i);
    }
  });
```

## H.3 — Dọn export trùng

`src/lib/data/products.ts` có cả `PRODUCTS` và `getAllProducts()` trỏ tới cùng `ALL_PRODUCTS`. `PRODUCTS` chỉ được dùng bởi test mới. Bỏ `export const PRODUCTS` và cho test dùng `getAllProducts()` — một nguồn sự thật, không hai.

## H.4 — Verify Phase H

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

Cả 4 xanh. `npx tsc --noEmit` **không in ra dòng nào**.

---

## 🛑 Câu hỏi cho chủ dự án (không tự quyết)

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| 1 | Có **ảnh Köstritzer chính hãng** để bổ sung không? Nếu có, đưa file vào `public/images/products/official/kostritzer/` rồi bỏ 2 slug khỏi `HIDDEN_PRODUCT_SLUGS` → mở lại 2 SKU (850.000₫ và 920.000₫). | Mở lại 2 SKU đang bị ẩn |
| 2 | DB Neon vẫn lưu ảnh thiếu cho `kostritzer-schwarzbier-bom-5l`. Có muốn sửa trong DB rồi chạy `npm run dump-data` không? | Nếu không sửa, mỗi lần build lại sẽ tái sinh đường dẫn ảnh thiếu (đúng như hiện trạng — chấp nhận được vì SKU đang ẩn) |
| 3 | Hai SKU `Köstritzer Thùng 24 Chai 330ml` / `Thùng 12 Chai 500ml` mà vòng 2 tự tạo — **có tồn tại thật** trong danh mục kinh doanh không? Nếu có thì cần **giá và ảnh thật**, thêm vào DB, không phải hardcode trong `localProducts.ts`. | Phase F xoá chúng đi. Nếu có thật, đây là việc riêng sau này. |

Trong lúc chờ trả lời: **cứ làm Phase F, G, H** — cả 3 đều không phụ thuộc 3 câu hỏi trên.

---

## Định nghĩa "xong" vòng 3

- [ ] `npm test` xanh
- [ ] `npx next build` xanh và **quay lại 117 trang** (không phải 121)
- [ ] `npx eslint .` 0 error
- [ ] **`npx tsc --noEmit` không in ra dòng nào**
- [ ] `localProducts.ts` không còn 2 SKU `kosteritzer-schwarzbier-*`
- [ ] Không SKU Köstritzer nào dùng ảnh có `bitb`/`bitburger` trong tên
- [ ] `git diff abd008d -- src/data/products.json` **rỗng** (đã hoàn lại đúng giá trị gốc)
- [ ] `HIDDEN_PRODUCT_SLUGS.size === 2`
- [ ] `GET /san-pham/kostritzer-schwarzbier-bom-5l` → **404**; `GET /san-pham/combo-oktoberfest-keg-kostritzer-xuc-xich` → **404**
- [ ] `sitemap.xml` và `llms.txt` **không** chứa slug nào trong `HIDDEN_PRODUCT_SLUGS`; `sitemapLocCount` = 107
- [ ] Trang chủ: tổng `.tab-count` = **32**; `/san-pham` = **32 card**
- [ ] Đặt hàng SKU ẩn qua API → bị từ chối (test `hidden-not-orderable`)
- [ ] File test đã đổi tên thành `hidden-products.test.ts`; export `PRODUCTS` đã bỏ

## Ngoài phạm vi vòng 3 — tuyệt đối không chạm

Phase A–D của vòng 2 (đơn hàng, checkout a11y, cổng tuổi, test/tsc) đã đạt — **không sửa gì**.
Phase 6 (hợp nhất design system + 6 lỗi tương phản WCAG) và Phase 7 (i18n, bộ ảnh nội bộ thay 19 ảnh hotlink `product.hstatic.net`, sanitize `ArticleBody`, 3 slug hỏng, thứ tự heading, form liên hệ, giới hạn mã giảm giá…) — xem `2026-07-29-ui-functionality-implementation-plan.md`.
