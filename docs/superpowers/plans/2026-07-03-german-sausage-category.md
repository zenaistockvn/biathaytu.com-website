# German Sausage Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Xuc Xich Duc" product section to the existing `/san-pham` page using The Wurst product information and images from the local source folder.

**Architecture:** Keep the existing product card, cart, and product-detail routes. Add The Wurst products as a local storefront supplement in `src/lib/data/localProducts.ts` because `scripts/dump_data.js` regenerates `src/data/products.json` during build. Merge database-dumped products with local products in the product data helper, then render a dedicated sausage section on the current product listing page.

**Tech Stack:** Next.js App Router, React, TypeScript, JSON/static product data, Vitest, PowerShell asset copy.

---

## File Structure

- Create: `src/lib/data/localProducts.ts`
  - Owns local storefront products that must survive `src/data/products.json` regeneration.
- Modify: `src/lib/data/products.ts`
  - Adds `xuc-xich` to storefront categories.
  - Merges dumped JSON products with local products.
  - Exports `getSausageProducts()`.
- Modify: `src/lib/data/products.test.ts`
  - Covers The Wurst category filtering, product fields, and storefront category allow-list.
- Modify: `scripts/dump_data.js`
  - Adds `xuc-xich` to the database dump category allow-list so database-backed sausage rows are not excluded later.
- Modify: `src/app/(web)/product-data-regression.test.ts`
  - Adds source-level regressions for dump categories, image fallback, listing section, and food-safe detail copy.
- Modify: `src/app/(web)/utils/productImages.ts`
  - Adds a The Wurst fallback image for `xuc-xich` products with missing image data.
- Modify: `src/app/(web)/san-pham/page.tsx`
  - Renders the new sausage section on the current product listing page.
- Modify: `src/app/(web)/san-pham/[slug]/page.tsx`
  - Uses food-specific spec label and guarantee copy for `xuc-xich`.
- Modify: `src/app/(web)/components/ProductDetailsAccordion.tsx`
  - Uses food-specific story, storage, and serving guidance for `xuc-xich`.
- Create directory: `public/images/products/the-wurst/`
  - Stores web-safe copied product images.
- Create image: `public/images/products/the-wurst/wiener-hun-khoi.png`
- Create image: `public/images/products/the-wurst/thuringer-bratwurst.png`
- Create image: `public/images/products/the-wurst/combo-cold-cut.png`

---

### Task 1: Product Data, Category Filter, And Assets

**Files:**
- Create: `src/lib/data/localProducts.ts`
- Modify: `src/lib/data/products.ts`
- Modify: `src/lib/data/products.test.ts`
- Modify: `scripts/dump_data.js`
- Modify: `src/app/(web)/product-data-regression.test.ts`
- Create: `public/images/products/the-wurst/wiener-hun-khoi.png`
- Create: `public/images/products/the-wurst/thuringer-bratwurst.png`
- Create: `public/images/products/the-wurst/combo-cold-cut.png`

- [ ] **Step 1: Write the failing product data test**

Modify `src/lib/data/products.test.ts` so the import includes `getSausageProducts`:

```ts
import {
  getAllProducts,
  getProductBySlugOrId,
  getBeerProducts,
  getAccessories,
  getRelatedBeers,
  getProductsByCategory,
  getSausageProducts,
} from './products';
```

Inside `describe('data/products', () => {`, add this constant before the first test:

```ts
  const storefrontCategories = ['bia', 'vang', 'phu-kien', 'xuc-xich'];
```

In the existing `returns only storefront-ready products sorted by sort_order ascending` test, replace the inline category list:

```ts
          ['bia', 'vang', 'phu-kien'].includes(product.category ?? ''),
```

with:

```ts
          storefrontCategories.includes(product.category ?? ''),
```

Add this test after the `getBeerProducts can exclude Bitburger` test:

```ts
  it('returns The Wurst sausage products from the xuc-xich category', () => {
    const sausages = getSausageProducts();

    expect(sausages.map((product) => product.slug)).toEqual([
      'the-wurst-wiener-hun-khoi-500g',
      'the-wurst-thuringer-bratwurst-500g',
      'the-wurst-combo-cold-cut-150g',
    ]);
    expect(sausages.every((product) => product.category === 'xuc-xich')).toBe(true);
    expect(sausages.every((product) => product.price === 139000)).toBe(true);
    expect(sausages.map((product) => product.volume)).toEqual([
      '500g/gói',
      '500g/gói',
      '150g/combo',
    ]);
    expect(
      sausages.every((product) =>
        product.images?.[0]?.startsWith('/images/products/the-wurst/'),
      ),
    ).toBe(true);
  });
```

- [ ] **Step 2: Write the failing dump allow-list regression**

Add this test to `src/app/(web)/product-data-regression.test.ts` inside `describe('public product data regressions', () => {`:

```ts
  it('keeps sausage products in the database dump allow-list', () => {
    const dumpScript = readProjectFile('scripts/dump_data.js');

    expect(dumpScript).toContain("['bia', 'vang', 'phu-kien', 'xuc-xich']");
  });
```

- [ ] **Step 3: Run the targeted tests and verify they fail**

Run:

```powershell
npm test -- src/lib/data/products.test.ts src/app/(web)/product-data-regression.test.ts
```

Expected result:

- `src/lib/data/products.test.ts` fails because `getSausageProducts` is not exported.
- `src/app/(web)/product-data-regression.test.ts` fails because `scripts/dump_data.js` does not contain `xuc-xich`.

- [ ] **Step 4: Copy The Wurst images into the public folder**

Run:

```powershell
New-Item -ItemType Directory -Force -LiteralPath 'public\images\products\the-wurst'
Copy-Item -LiteralPath 'C:\Users\QuangTran\Downloads\Giay phep xuc xic\ChatGPT Image 10_52_33 3 thg 7, 2026.png' -Destination 'public\images\products\the-wurst\wiener-hun-khoi.png'
Copy-Item -LiteralPath 'C:\Users\QuangTran\Downloads\Giay phep xuc xic\ChatGPT Image 15_14_45 24 thg 6, 2026 (2).png' -Destination 'public\images\products\the-wurst\thuringer-bratwurst.png'
Copy-Item -LiteralPath 'C:\Users\QuangTran\Downloads\Giay phep xuc xic\ChatGPT Image 15_17_02 24 thg 6, 2026.png' -Destination 'public\images\products\the-wurst\combo-cold-cut.png'
```

Expected result:

- The three copied files exist under `public/images/products/the-wurst/`.

- [ ] **Step 5: Add local The Wurst product data**

Create `src/lib/data/localProducts.ts` with this full content:

```ts
import type { Product } from './products';

export const LOCAL_STOREFRONT_PRODUCTS: Product[] = [
  {
    id: '7a71bc9a-9b7e-4c5e-9f2f-6848aa4ef001',
    name: 'The Wurst Wiener - Xúc xích hun khói 500g',
    slug: 'the-wurst-wiener-hun-khoi-500g',
    description:
      'Xúc xích hun khói kiểu Đức vị nhẹ, thơm khói, dễ ăn và làm nóng nhanh. Phù hợp bữa gia đình, bữa phụ hoặc dùng kèm bia Đức.',
    abv: null,
    ibu: null,
    volume: '500g/gói',
    images: ['/images/products/the-wurst/wiener-hun-khoi.png'],
    price: 139000,
    haravan_url: null,
    category: 'xuc-xich',
    sort_order: 150,
    is_featured: false,
    origin: 'Việt Nam - kiểu Đức',
    updated_at: '2026-07-03T00:00:00.000Z',
  },
  {
    id: '7a71bc9a-9b7e-4c5e-9f2f-6848aa4ef002',
    name: 'The Wurst Thüringer Bratwurst 500g',
    slug: 'the-wurst-thuringer-bratwurst-500g',
    description:
      'Xúc xích nướng kiểu Thüringen, hợp áp chảo hoặc nướng để dậy mùi thơm. Rất hợp bàn bia, BBQ, xem bóng đá và tiệc cuối tuần.',
    abv: null,
    ibu: null,
    volume: '500g/gói',
    images: ['/images/products/the-wurst/thuringer-bratwurst.png'],
    price: 139000,
    haravan_url: null,
    category: 'xuc-xich',
    sort_order: 151,
    is_featured: false,
    origin: 'Việt Nam - kiểu Đức',
    updated_at: '2026-07-03T00:00:00.000Z',
  },
  {
    id: '7a71bc9a-9b7e-4c5e-9f2f-6848aa4ef003',
    name: 'The Wurst Combo Cold Cut 150g',
    slug: 'the-wurst-combo-cold-cut-150g',
    description:
      'Combo thịt nguội thủ công kiểu Đức, ăn liền và bày lạnh rất tiện. Hợp bánh mì, phô mai, olive, dưa chuột muối, bia Đức hoặc vang.',
    abv: null,
    ibu: null,
    volume: '150g/combo',
    images: ['/images/products/the-wurst/combo-cold-cut.png'],
    price: 139000,
    haravan_url: null,
    category: 'xuc-xich',
    sort_order: 152,
    is_featured: false,
    origin: 'Việt Nam - kiểu Đức',
    updated_at: '2026-07-03T00:00:00.000Z',
  },
];
```

- [ ] **Step 6: Merge local products in the product data helper**

Modify `src/lib/data/products.ts`.

Add this import below the existing JSON import:

```ts
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
```

Replace:

```ts
const STOREFRONT_CATEGORIES = new Set(['bia', 'vang', 'phu-kien']);
```

with:

```ts
const STOREFRONT_CATEGORIES = new Set(['bia', 'vang', 'phu-kien', 'xuc-xich']);
```

Replace the current `ALL_PRODUCTS` block:

```ts
const ALL_PRODUCTS: Product[] = (productsData as unknown as Product[])
  .slice()
  .filter(isStorefrontProduct)
  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
```

with:

```ts
function mergeStorefrontProducts(primary: Product[], supplemental: Product[]): Product[] {
  const productsBySlug = new Map<string, Product>();

  for (const product of [...primary, ...supplemental]) {
    if (!isStorefrontProduct(product) || productsBySlug.has(product.slug)) {
      continue;
    }

    productsBySlug.set(product.slug, product);
  }

  return Array.from(productsBySlug.values()).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}

const ALL_PRODUCTS: Product[] = mergeStorefrontProducts(
  (productsData as unknown as Product[]).slice(),
  LOCAL_STOREFRONT_PRODUCTS,
);
```

Add this function after `getAccessories()`:

```ts
export function getSausageProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === 'xuc-xich');
}
```

- [ ] **Step 7: Allow sausage rows in the dump script**

In `scripts/dump_data.js`, replace:

```js
const VALID_PRODUCT_CATEGORIES = ['bia', 'vang', 'phu-kien'];
```

with:

```js
const VALID_PRODUCT_CATEGORIES = ['bia', 'vang', 'phu-kien', 'xuc-xich'];
```

- [ ] **Step 8: Run targeted tests and verify they pass**

Run:

```powershell
npm test -- src/lib/data/products.test.ts src/app/(web)/product-data-regression.test.ts
```

Expected result:

- Both test files pass.

- [ ] **Step 9: Commit data and asset changes**

Run:

```powershell
git add src/lib/data/products.ts src/lib/data/localProducts.ts src/lib/data/products.test.ts src/app/(web)/product-data-regression.test.ts scripts/dump_data.js public/images/products/the-wurst
git commit -m "feat: add The Wurst sausage product data"
```

---

### Task 2: Sausage Image Fallback

**Files:**
- Modify: `src/app/(web)/utils/productImages.ts`
- Modify: `src/app/(web)/product-data-regression.test.ts`

- [ ] **Step 1: Write the failing image fallback regression**

Add this test to `src/app/(web)/product-data-regression.test.ts` inside `describe('public product data regressions', () => {`:

```ts
  it('uses a The Wurst fallback image for sausage products with no image', () => {
    const image = getDisplayProductImage({
      images: null,
      category: 'xuc-xich',
    });

    expect(image).toBe('/images/products/the-wurst/wiener-hun-khoi.png');
    expect(existsSync(join(root, 'public', image.slice(1)))).toBe(true);
  });
```

- [ ] **Step 2: Run the regression test and verify it fails**

Run:

```powershell
npm test -- src/app/(web)/product-data-regression.test.ts
```

Expected result:

- The new fallback test fails because `xuc-xich` still falls back to the default beer image.

- [ ] **Step 3: Add the sausage category fallback**

In `src/app/(web)/utils/productImages.ts`, replace:

```ts
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  bia: DEFAULT_PRODUCT_IMAGE,
  'phu-kien': '/images/products/official/bitburger/88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg',
  vang: '/images/products/official/benediktiner/bottle_removebg.png',
};
```

with:

```ts
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  bia: DEFAULT_PRODUCT_IMAGE,
  'phu-kien': '/images/products/official/bitburger/88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg',
  vang: '/images/products/official/benediktiner/bottle_removebg.png',
  'xuc-xich': '/images/products/the-wurst/wiener-hun-khoi.png',
};
```

- [ ] **Step 4: Run the regression test and verify it passes**

Run:

```powershell
npm test -- src/app/(web)/product-data-regression.test.ts
```

Expected result:

- The product image regression test file passes.

- [ ] **Step 5: Commit fallback changes**

Run:

```powershell
git add src/app/(web)/utils/productImages.ts src/app/(web)/product-data-regression.test.ts
git commit -m "fix: add sausage product image fallback"
```

---

### Task 3: Product Listing Sausage Section

**Files:**
- Modify: `src/app/(web)/san-pham/page.tsx`
- Modify: `src/app/(web)/product-data-regression.test.ts`

- [ ] **Step 1: Write the failing product listing regression**

Add this test to `src/app/(web)/product-data-regression.test.ts` inside `describe('public product data regressions', () => {`:

```ts
  it('renders a German sausage section on the product listing page', () => {
    const productsPage = readProjectFile('src/app/(web)/san-pham/page.tsx');

    expect(productsPage).toContain('getSausageProducts');
    expect(productsPage).toContain('sausageProducts');
    expect(productsPage).toContain('Món Ăn Kèm Bia');
    expect(productsPage).toContain('Xúc Xích Đức');
  });
```

- [ ] **Step 2: Run the regression test and verify it fails**

Run:

```powershell
npm test -- src/app/(web)/product-data-regression.test.ts
```

Expected result:

- The new listing regression fails because the product page does not import or render sausage products.

- [ ] **Step 3: Render sausage products on `/san-pham`**

In `src/app/(web)/san-pham/page.tsx`, replace:

```ts
import { getBeerProducts, getAccessories } from '@/lib/data/products';
```

with:

```ts
import { getBeerProducts, getAccessories, getSausageProducts } from '@/lib/data/products';
```

Inside `ProductsPage()`, after:

```ts
  const beerProducts = getBeerProducts({ excludeBitburger: true });
  const accessories = getAccessories();
```

add:

```ts
  const sausageProducts = getSausageProducts();
```

After the beer products section and before the accessories section, add:

```tsx
      {/* SAUSAGE PRODUCTS */}
      {sausageProducts && sausageProducts.length > 0 && (
        <section className="container mt-100" aria-label="Xúc xích Đức">
          <div className="section-header-center mb-48">
            <span className="section-label">Món Ăn Kèm Bia</span>
            <h2 className="section-title">Xúc Xích Đức</h2>
            <p className="page-subtitle">
              Xúc xích và thịt nguội thủ công kiểu Đức, hợp dùng cùng bia, vang,
              bữa gia đình hoặc bàn tiệc gọn tại nhà.
            </p>
          </div>

          <div className="grid-featured-products">
            {(sausageProducts as Product[] | null)?.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description?.substring(0, 110)}
                showCTA={true}
              />
            ))}
          </div>
        </section>
      )}
```

- [ ] **Step 4: Run the product listing regression and verify it passes**

Run:

```powershell
npm test -- src/app/(web)/product-data-regression.test.ts
```

Expected result:

- The listing regression test passes.

- [ ] **Step 5: Commit product listing changes**

Run:

```powershell
git add src/app/(web)/san-pham/page.tsx src/app/(web)/product-data-regression.test.ts
git commit -m "feat: show sausage section on product page"
```

---

### Task 4: Food-Safe Product Detail Copy

**Files:**
- Modify: `src/app/(web)/san-pham/[slug]/page.tsx`
- Modify: `src/app/(web)/components/ProductDetailsAccordion.tsx`
- Modify: `src/app/(web)/product-data-regression.test.ts`

- [ ] **Step 1: Write the failing product detail regression**

Add this test to `src/app/(web)/product-data-regression.test.ts` inside `describe('public product data regressions', () => {`:

```ts
  it('uses food-specific product detail copy for sausage products', () => {
    const productDetailPage = readProjectFile('src/app/(web)/san-pham/[slug]/page.tsx');
    const productDetailsAccordion = readProjectFile(
      'src/app/(web)/components/ProductDetailsAccordion.tsx',
    );

    expect(productDetailPage).toContain("product.category === 'xuc-xich'");
    expect(productDetailPage).toContain('Cam Kết Thực Phẩm Lạnh');
    expect(productDetailPage).toContain('Quy cách');
    expect(productDetailPage).toContain('category={product.category}');
    expect(productDetailsAccordion).toContain("category === 'xuc-xich'");
    expect(productDetailsAccordion).toContain('bảo quản lạnh');
    expect(productDetailsAccordion).toContain('áp chảo');
  });
```

- [ ] **Step 2: Run the regression test and verify it fails**

Run:

```powershell
npm test -- src/app/(web)/product-data-regression.test.ts
```

Expected result:

- The new detail-copy regression fails because the product detail page and accordion still use beer-only copy.

- [ ] **Step 3: Add category-specific detail copy**

In `src/app/(web)/san-pham/[slug]/page.tsx`, inside `ProductDetailPage`, after:

```ts
  const product = getProductBySlugOrId(slug) as ProductData | null;
```

keep the existing `if (!product) { notFound(); }`, then add:

```ts
  const isSausage = product.category === 'xuc-xich';
  const guaranteeTitle = isSausage ? 'Cam Kết Thực Phẩm Lạnh' : 'Cam Kết Chất Lượng';
  const guaranteeItems = isSausage
    ? [
        'Sản phẩm The Wurst kiểu Đức, bảo quản lạnh theo hướng dẫn trên bao bì.',
        'Tư vấn cách làm nóng, áp chảo, nướng hoặc bày lạnh theo từng dòng sản phẩm.',
        'Giao hàng linh hoạt và nhắc khách cho sản phẩm vào tủ lạnh ngay khi nhận.',
        'Hỗ trợ kiểm tra thông tin lô hàng và hạn sử dụng trên bao bì khi cần.',
      ]
    : [
        '100% Sản phẩm nhập khẩu nguyên chai từ nhà máy Đức.',
        'Bảo quản đạt chuẩn nhiệt độ chuyên dụng.',
        'Chính sách giao hàng linh hoạt, hỏa tốc khu vực nội thành.',
        'Hỗ trợ xử lý sự cố đổ vỡ trong quá trình vận chuyển.',
      ];
```

In the volume spec block, replace:

```tsx
                  <div className="product-spec-label">Dung tích</div>
```

with:

```tsx
                  <div className="product-spec-label">{isSausage ? 'Quy cách' : 'Dung tích'}</div>
```

Replace the current `.product-guarantee` content:

```tsx
            <div className="product-guarantee">
               <h4>
                 <span>🛡️</span> Cam Kết Chất Lượng
               </h4>
               <ul>
                 <li>100% Sản phẩm nhập khẩu nguyên chai từ nhà máy Đức.</li>
                 <li>Bảo quản đạt chuẩn nhiệt độ chuyên dụng.</li>
                 <li>Chính sách giao hàng linh hoạt, hỏa tốc khu vực nội thành.</li>
                 <li>Hỗ trợ xử lý sự cố đổ vỡ trong quá trình vận chuyển.</li>
               </ul>
            </div>
```

with:

```tsx
            <div className="product-guarantee">
               <h4>
                 <span>🛡️</span> {guaranteeTitle}
               </h4>
               <ul>
                 {guaranteeItems.map((item) => (
                   <li key={item}>{item}</li>
                 ))}
               </ul>
            </div>
```

Replace:

```tsx
            <ProductDetailsAccordion productName={product.name} />
```

with:

```tsx
            <ProductDetailsAccordion productName={product.name} category={product.category} />
```

- [ ] **Step 4: Make the accordion food-aware**

In `src/app/(web)/components/ProductDetailsAccordion.tsx`, replace:

```ts
interface ProductDetailsAccordionProps {
  productName: string;
}

export default function ProductDetailsAccordion({ productName }: ProductDetailsAccordionProps) {
```

with:

```ts
interface ProductDetailsAccordionProps {
  productName: string;
  category?: string | null;
}

export default function ProductDetailsAccordion({
  productName,
  category,
}: ProductDetailsAccordionProps) {
```

After the `useState` line, add:

```ts
  const isSausage = category === 'xuc-xich';
```

At the top of `getStory`, add this branch:

```ts
    if (isSausage) {
      return "The Wurst là dòng xúc xích và thịt nguội thủ công kiểu Đức, phù hợp để làm món ăn kèm bia, vang, bữa gia đình hoặc bàn tiệc gọn tại nhà. Wiener dễ ăn và thơm khói, Thüringer hợp áp chảo hoặc nướng, còn Cold Cut tiện bày lạnh cùng bánh mì, phô mai và dưa chuột muối.";
    }
```

Before the `return (` statement, add:

```ts
  const storageItems = isSausage
    ? [
        'Bảo quản lạnh theo hướng dẫn trên bao bì ngay sau khi nhận hàng.',
        'Không để sản phẩm lâu ngoài nhiệt độ phòng, đặc biệt trước khi chế biến hoặc bày tiệc.',
        'Nếu sản phẩm đã để đông, rã đông trong ngăn mát trước khi áp chảo hoặc nướng.',
      ]
    : [
        'Bảo quản ở nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với ánh nắng mặt trời.',
        'Nên giữ lạnh ở nhiệt độ 5 - 8 độ C (ngăn mát tủ lạnh) trước khi uống tối thiểu 24 giờ để bia đạt độ ngon tuyệt đối.',
        'Tuyệt đối tránh để bia bị sốc nhiệt (chuyển đột ngột từ nóng sang lạnh hoặc ngược lại) hay đóng băng trong ngăn đá.',
      ];

  const servingTitle = isSausage ? 'Cách dùng ngon nhất' : 'Cách thưởng thức ngon nhất';
  const servingItems = isSausage
    ? [
        'Wiener: làm nóng nhanh bằng áp chảo, nướng nhẹ hoặc làm nóng theo hướng dẫn trên bao bì.',
        'Thüringer Bratwurst: áp chảo hoặc nướng để dậy mùi thơm, hợp dùng cùng bia Đức, bánh mì, khoai tây và mù tạt.',
        'Combo Cold Cut: bày lạnh trực tiếp cùng bánh mì, phô mai, olive hoặc dưa chuột muối.',
      ]
    : [
        'Nhiệt độ lý tưởng: ướp lạnh bia từ 5 - 8 độ C.',
        'Tuyệt đối không dùng đá: Tránh uống cùng với đá lạnh để giữ nguyên độ tinh khiết và cấu trúc bọt nguyên bản của bia Đức.',
        'Sử dụng ly phù hợp: Nên dùng ly thủy tinh đã được làm lạnh. Ly phải sạch hoàn toàn, không có vết dầu mỡ để bọt bia có thể giữ được lâu.',
        'Nghệ thuật rót (Với dòng Weissbier/Lúa mì): Rót nghiêng ly 45 độ. Khi còn khoảng 2-3cm bia cuối chai, hãy lắc nhẹ chai theo vòng tròn để lớp men (Naturtrüb) chìm dưới đáy hòa quyện đều rồi mới rót nốt phần còn lại lên đỉnh ly để tạo lớp bọt vương miện tuyệt đẹp.',
      ];
```

In the storage accordion panel, replace the hard-coded `<ul>` contents with:

```tsx
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {storageItems.map((item) => (
                <li key={item} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
```

In the serving accordion button, replace the hard-coded title text with:

```tsx
          <span>🍻 {servingTitle}</span>
```

In the serving accordion panel, replace the hard-coded `<ul>` contents with:

```tsx
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {servingItems.map((item) => (
                <li key={item} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
```

- [ ] **Step 5: Run the detail-copy regression and verify it passes**

Run:

```powershell
npm test -- src/app/(web)/product-data-regression.test.ts
```

Expected result:

- The product data regression test file passes.

- [ ] **Step 6: Commit detail-copy changes**

Run:

```powershell
git add src/app/(web)/san-pham/[slug]/page.tsx src/app/(web)/components/ProductDetailsAccordion.tsx src/app/(web)/product-data-regression.test.ts
git commit -m "fix: use food-specific copy for sausage details"
```

---

### Task 5: Full Verification

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run the full test suite**

Run:

```powershell
npm test
```

Expected result:

- Vitest exits with code `0`.
- No failed test files.

- [ ] **Step 2: Run the production build**

Run:

```powershell
npm run build
```

Expected result:

- Build exits with code `0`.
- If the build fails because local `DATABASE_URL` is unavailable, report that exact failure and run this compile check instead:

```powershell
npx next build
```

Expected compile-check result:

- Next.js exits with code `0`.

- [ ] **Step 3: Inspect the final diff**

Run:

```powershell
git status --short
git diff --stat
```

Expected result:

- Only sausage-category implementation files are changed since the last task commit.
- No unrelated generated data is staged or committed.

- [ ] **Step 4: Start the local dev server**

Run:

```powershell
npm run dev
```

Expected result:

- The dev server starts and prints a local URL such as `http://localhost:3000`.

- [ ] **Step 5: Manually check the product page**

Open:

```text
http://localhost:3000/san-pham
```

Expected result:

- The page shows the existing beer section.
- The page shows a new `Xúc Xích Đức` section below beer and above accessories.
- The section has three cards: Wiener, Thüringer Bratwurst, and Combo Cold Cut.
- Each card shows a product image, `139.000₫`, volume metadata, cart button, and `Mua Ngay`.

- [ ] **Step 6: Manually check a sausage detail page**

Open:

```text
http://localhost:3000/san-pham/the-wurst-wiener-hun-khoi-500g
```

Expected result:

- The detail page loads.
- The price is `139.000₫`.
- The product spec label uses `Quy cách`.
- The guarantee section says `Cam Kết Thực Phẩm Lạnh`.
- The accordion includes food-specific storage and serving guidance.

---

## Self-Review

- Spec coverage:
  - Three The Wurst products are covered in Task 1.
  - Images from `C:\Users\QuangTran\Downloads\Giay phep xuc xic` are copied in Task 1.
  - Dedicated `/san-pham` section is covered in Task 3.
  - Existing card and cart flow are preserved by using `ProductCard` in Task 3.
  - Product detail route behavior is covered in Task 4 and Task 5.
  - Tests and build verification are covered in Tasks 1 through 5.
- Placeholder scan:
  - No placeholder markers or undefined function names are present.
  - Each code-changing step includes the exact code or command to use.
- Type consistency:
  - `getSausageProducts()` is introduced in Task 1 and used in Task 3.
  - `category?: string | null` is introduced in `ProductDetailsAccordionProps` before it is passed from the detail page.
  - `xuc-xich` is consistently used as the category key across data, helpers, tests, fallback image logic, and page rendering.
