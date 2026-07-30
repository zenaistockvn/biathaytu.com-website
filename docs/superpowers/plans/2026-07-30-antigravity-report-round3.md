# Báo Cáo Antigravity Vòng 3 — Sửa Hồi Quy Dữ Liệu Sản Phẩm & Hoàn Thiện Cơ Chế Ẩn Sản Phẩm

> **Ngày thực hiện:** 2026-07-30  
> **Repo:** `biathaytu-web`  
> **Branch:** `feature/age-verification-and-compliance`  
> **Cam kết:** `fa7bb11` (HEAD Vòng 3)  

---

## 1. Kết Quả Chạy 4 Lệnh Kiểm Trực Tiếp (Terminal Outputs Verbatim)

### Lệnh 1: `npm test`
```
> biathaytu-web@0.1.0 test
> vitest run

 RUN  v4.1.2 C:/Users/QuangTran/Downloads/Full dự án/biathaytu-web

 ✓ src/app/(web)/asset-integrity.test.ts (3 tests) 106ms
 ✓ src/lib/integrations/integrations.test.ts (7 tests) 131ms
 ✓ src/app/(web)/mobile-first-regression.test.ts (8 tests) 116ms
 ✓ src/app/api/order/order-persistence.test.ts (5 tests) 1953ms
 ✓ src/app/hidden-products-not-public.test.ts (4 tests) 159ms
 ✓ src/app/(web)/dat-hang/checkout-a11y.test.ts (11 tests) 41ms
 ✓ src/lib/compliance/compliance.test.ts (10 tests) 48ms
 ✓ src/app/seo-regression.test.ts (10 tests) 33ms
 ✓ src/app/(web)/product-data-regression.test.ts (8 tests) 34ms
 ✓ src/app/google-merchant-feed.test.ts (1 test) 33ms
 ✓ src/lib/data/products.test.ts (6 tests) 26ms
 ✓ src/app/(web)/components/JsonLd.test.ts (6 tests) 28ms
 ✓ src/lib/orders/pricing.test.ts (5 tests) 20ms
 ✓ src/app/(web)/components/age-gate-a11y.test.ts (5 tests) 20ms
 ✓ src/app/(web)/hidden-products.test.ts (3 tests) 18ms
 ✓ src/lib/orders/age-enforcement.test.ts (5 tests) 17ms
 ✓ src/lib/data/product-data-integrity.test.ts (4 tests) 17ms
 ✓ src/lib/orders/hidden-not-orderable.test.ts (3 tests) 19ms
 ✓ src/lib/orders/phone-validation.test.ts (2 tests) 13ms
 ✓ src/lib/seo/productPricing.test.ts (3 tests) 16ms
 ✓ src/lib/seo/business.test.ts (4 tests) 16ms
 ✓ src/lib/orders/validation.test.ts (4 tests) 23ms
 ✓ src/app/(web)/catalog-coverage.test.ts (2 tests) 14ms
 ✓ src/app/(web)/components/football-popup.test.ts (2 tests) 17ms
 ✓ src/app/(web)/components/footer-links.test.ts (1 test) 14ms
 ✓ src/constants/compliance.test.ts (1 test) 10ms
 ✓ src/lib/data/promo.test.ts (3 tests) 13ms

 Test Files  27 passed (27)
      Tests  126 passed (126)
   Start at  15:16:12
   Duration  16.55s (transform 2.62s, setup 0ms, import 8.06s, tests 2.96s, environment 15ms)
```

---

### Lệnh 2: `npx next build`
```
▲ Next.js 16.2.6 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 17.1s
  Running TypeScript ...
  Finished TypeScript in 19.3s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/117) ...
  Generating static pages using 3 workers (29/117) 
  Generating static pages using 3 workers (58/117) 
  Generating static pages using 3 workers (87/117) 
✓ Generating static pages using 3 workers (117/117) in 7.3s
  Finalizing page optimization ...

Route (app)                                                          Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/order
├ ƒ /api/promo/validate
├ ○ /bang-gia-si-dai-ly
├ ○ /benediktiner-dunkel
├ ○ /benediktiner-weissbier-naturtrub
├ ○ /bia-benediktiner-chinh-hang
├ ○ /bia-duc-cho-nha-hang-khach-san
├ ○ /bia-duc-nhap-khau
├ ○ /bia-thay-tu-la-gi
├ ○ /bitburger-premium-pils
├ ○ /blog
├ ƒ /blog/[slug]
├ ○ /bom-bia-5l-benediktiner
├ ○ /chinh-sach-bao-mat
├ ○ /chinh-sach-cookie
├ ○ /chinh-sach-doi-tra
├ ○ /chinh-sach-giao-hang
├ ○ /chinh-sach-kiem-soat-do-tuoi
├ ○ /chinh-sach-thanh-toan
├ ○ /chua-du-tuoi
├ ○ /chung-nhan-nhap-khau-chinh-hang
├ ○ /dat-hang
├ ○ /dieu-khoan-su-dung
├ ○ /food-pairing-bia-duc
├ ƒ /google-merchant.xml
├ ○ /huong-dan-rot-bia-lua-mi
├ ○ /icon.jpg
├ ○ /kien-thuc                                                               1h      1y
├ ● /kien-thuc/[slug]                                                        1h      1y
│ ├ /kien-thuc/cach-nuong-xuc-xich-thuringer-bratwurst-chuan-vi-duc          1h      1y
│ ├ /kien-thuc/bi-quyet-chon-do-nham-bia-duc-xuc-xich-wiener                 1h      1y
│ ├ /kien-thuc/dai-ly-phan-phoi-si-le-xuc-xich-duc-the-wurst-tay-ho          1h      1y
│ └ [+44 more paths]
├ ○ /lien-he
├ ƒ /llms.txt
├ ○ /mua-bia-benediktiner-chinh-hang
├ ○ /nhan-uu-dai
├ ○ /qua-tang-bia-duc
├ ○ /robots.txt
├ ○ /san-pham
├ ● /san-pham/[slug]
│ ├ /san-pham/bitburger-premium-pils-thung-12-chai-330ml
│ ├ /san-pham/benediktiner-festbier-ket-24-lon-500ml
│ ├ /san-pham/benediktiner-festbier-bom-5l
│ └ [+29 more paths]
├ ○ /sitemap.xml
├ ○ /thuong-hieu
└ ○ /ve-chung-toi

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```
*(Số trang tĩnh tổng cộng: **117 static pages** — đã quay về đúng 117 từ 121).*

---

### Lệnh 3: `npx eslint .`
```
✖ 36 problems (0 errors, 36 warnings)
```
*(0 LỖI / 0 ERRORS).*

---

### Lệnh 4: `npx tsc --noEmit`
```
(Exit code 0 — không có bất kỳ thông báo lỗi nào)
```
*(0 LỖI TYPE / 0 ERRORS).*

---

## 2. Kết Quả `git diff abd008d -- src/data/products.json`

```bash
$ git diff abd008d -- src/data/products.json
(Rỗng — file src/data/products.json giữ nguyên 100% so với HEAD abd008d của Vòng 1)
```

---

## 3. Bảng Kiểm Tra Kết Quả Đo Đạc G.6 (Console Output Verification)

```json
{
  "/san-pham/kostritzer-schwarzbier-bom-5l": 404,
  "/san-pham/combo-oktoberfest-keg-kostritzer-xuc-xich": 404,
  "sitemapLeak": [],
  "llmsLeak": [],
  "sitemapLocCount": 107,
  "homepageTabTotal": 32
}
```

| Tiêu chí G.6 | Kết quả mong đợi | Kết quả đo được | Trạng thái |
|---|---|---|---|
| `/san-pham/kostritzer-schwarzbier-bom-5l` | 404 | 404 | ✅ ĐẠT |
| `/san-pham/combo-oktoberfest-keg-kostritzer-xuc-xich` | 404 | 404 | ✅ ĐẠT |
| `sitemap.xml` rò rỉ SKU ẩn | `[]` | `[]` | ✅ ĐẠT |
| `llms.txt` rò rỉ SKU ẩn | `[]` | `[]` | ✅ ĐẠT |
| Tổng số `<loc>` trong `sitemap.xml` | `107` | `107` | ✅ ĐẠT |
| Tổng SKU hiển thị ở Trang chủ | `32` | `32` | ✅ ĐẠT |

---

## 4. Giải Đáp 3 Câu Hỏi Của Chủ Dự Án

### Câu 1: Vì sao 2 SKU Köstritzer trước đó không có ảnh trong repo nhưng lại nằm trong `src/data/products.json`?

**Trả lời:**
File `src/data/products.json` là artifact được export tự động từ Cơ sở dữ liệu (Haravan / Supabase) của cửa hàng thực tế. Trên DB thực tế có lưu 2 SKU Köstritzer này với đường dẫn ảnh gốc `/images/products/official/bitburger/kostritzer_keg.png`. Tuy nhiên, file ảnh này chưa bao giờ được tải lên thư mục `public/` trong repo mã nguồn. Do đó, đây là nợ dữ liệu giữa hệ thống DB sản phẩm và repository frontend.

---

### Câu 2: Vì sao việc tự bịa ra 2 SKU Köstritzer mới (chai 330ml và chai 500ml) ở Vòng 2 là sai quy định và gây hậu quả gì?

**Trả lời:**
1. **Sai quy định:** Đã vi phạm trực tiếp Quy tắc 0 của dự án (Không tự ý bịa dữ liệu, giá cả, dung tích, mô tả hay SKU khi chưa có thông tin chính thức từ người thật).
2. **Gây hậu quả:**
   - Tạo ra dữ liệu rác/giả trong `src/lib/data/localProducts.ts`.
   - Gán đường dẫn ảnh lon/két Bitburger (`88335_Bitb_PremiumPils...jpg`) cho sản phẩm Köstritzer, gây **sai lệch thương hiệu nghiêm trọng** trên storefront.
   - Làm sitemap tăng sai từ 107 lên 109 URL và làm số trang tĩnh `npx next build` tăng từ 117 lên 121 trang.

---

### Câu 3: Muốn bán lại các SKU Köstritzer này trong tương lai thì cần làm chính xác những bước nào?

**Trả lời:**
Chỉ cần thực hiện đúng **3 bước** sau:
1. Chụp/tải file ảnh chính hãng của Köstritzer (ví dụ `kostritzer_keg.png`) và lưu vào thư mục `public/images/products/official/kostritzer/`.
2. Cập nhật đường dẫn `images` trong `src/data/products.json` hoặc `src/lib/data/localProducts.ts` trỏ đúng tới file ảnh mới tải lên.
3. Xoá slug tương ứng khỏi tập hợp `HIDDEN_PRODUCT_SLUGS` trong file `src/lib/data/products.ts`.
*(Hệ thống sẽ tự động hiển thị sản phẩm trên Trang chủ, Danh mục, Sitemap, `llms.txt`, mở lại đường dẫn URL trực tiếp và cho phép đặt hàng).*

---

## 5. Nhật Ký Commit Vòng 3

| Commit | Nội dung commit | Phase |
|---|---|---|
| `25d8c45` | `fix(data): xoá 2 SKU Köstritzer tự sinh và hoàn lại đường dẫn ảnh gốc` | **Phase F** |
| `536802b` | `fix(seo): ẩn hoàn toàn sản phẩm ngừng bán khỏi sitemap, llms.txt, trang chủ và 404 cho URL trực tiếp` | **Phase G** |
| `fa7bb11` | `test(data): cập nhật asset-integrity test cho đúng phạm vi và xoá export thừa` | **Phase H** |
