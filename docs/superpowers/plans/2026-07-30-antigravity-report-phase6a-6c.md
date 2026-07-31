# Báo Cáo Antigravity Phase 6A–6C — Hợp Nhất Design System

> **Ngày thực hiện:** 2026-07-30  
> **Repo:** `biathaytu-web`  
> **Branch:** `feature/age-verification-and-compliance`  
> **HEAD Phase 6C:** `12e5f45`  

---

## 1. Danh Sách Commit

| Commit Hash | Tên Commit | Nội Dung Phase |
|---|---|---|
| `85dbc5e` | `refactor(design): đổi tên token màu cho đúng nghĩa và hợp nhất DESIGN.md` | **Phase 6A** — Đổi tên token 1:1 dài trước ngắn sau, đồng bộ `DESIGN.md` |
| `0fdddf6` | `fix(a11y): sửa 6 lỗi tương phản WCAG AA ở tầng token` | **Phase 6B** — Nâng tỉ lệ tương phản 6 cặp màu lên ≥ 4.5:1, font-size badge 18+ ≥ 12px |
| `12e5f45` | `fix(design): dọn 51 literal màu palette cũ trong hệ dùng chung` | **Phase 6C** — Thay thế 51 literal màu cũ, đổi tên class `.icon-circle-gold` → `.icon-circle-accent` |

---

## 2. Kết Quả Chạy 4 Lệnh Kiểm Trực Tiếp (Verbatim Outputs)

### Lệnh 1: `npm test`
```
> biathaytu-web@0.1.0 test
> vitest run

 RUN  v4.1.2 C:/Users/QuangTran/Downloads/Full dự án/biathaytu-web

 ✓ src/app/(web)/asset-integrity.test.ts (3 tests) 947ms
 ✓ src/app/design-tokens.test.ts (5 tests) 1398ms
 ✓ src/app/seo-regression.test.ts (10 tests) 47ms
 ✓ src/app/api/order/order-persistence.test.ts (5 tests) 1847ms
 ✓ src/lib/integrations/integrations.test.ts (7 tests) 163ms
 ✓ src/app/(web)/mobile-first-regression.test.ts (8 tests) 75ms
 ✓ src/app/google-merchant-feed.test.ts (1 test) 30ms
 ✓ src/app/(web)/product-data-regression.test.ts (8 tests) 245ms
 ✓ src/app/hidden-products-not-public.test.ts (4 tests) 172ms
 ✓ src/lib/compliance/compliance.test.ts (10 tests) 39ms
 ✓ src/app/contrast.test.ts (9 tests) 47ms
 ✓ src/app/(web)/dat-hang/checkout-a11y.test.ts (11 tests) 25ms
 ✓ src/lib/data/products.test.ts (6 tests) 28ms
 ✓ src/app/(web)/components/football-popup.test.ts (2 tests) 21ms
 ✓ src/app/(web)/components/age-gate-a11y.test.ts (5 tests) 20ms
 ✓ src/app/legacy-palette.test.ts (4 tests) 62ms
 ✓ src/constants/compliance.test.ts (1 test) 14ms
 ✓ src/app/(web)/components/JsonLd.test.ts (6 tests) 23ms
 ✓ src/lib/orders/pricing.test.ts (5 tests) 21ms
 ✓ src/app/(web)/hidden-products.test.ts (3 tests) 19ms
 ✓ src/app/(web)/components/footer-links.test.ts (1 test) 25ms
 ✓ src/lib/orders/age-enforcement.test.ts (5 tests) 21ms
 ✓ src/lib/seo/productPricing.test.ts (3 tests) 18ms
 ✓ src/app/(web)/catalog-coverage.test.ts (2 tests) 16ms
 ✓ src/lib/data/product-data-integrity.test.ts (4 tests) 19ms
 ✓ src/lib/seo/business.test.ts (4 tests) 17ms
 ✓ src/lib/orders/hidden-not-orderable.test.ts (3 tests) 17ms
 ✓ src/lib/data/promo.test.ts (3 tests) 15ms
 ✓ src/lib/orders/validation.test.ts (4 tests) 15ms
 ✓ src/lib/orders/phone-validation.test.ts (2 tests) 14ms

 Test Files  30 passed (30)
      Tests  144 passed (144)
   Start at  09:30:37
   Duration  22.55s (transform 2.84s, setup 0ms, import 10.49s, tests 5.42s, environment 15ms)
```

---

### Lệnh 2: `npx next build`
```
▲ Next.js 16.2.6 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 20.0s
  Running TypeScript ...
  Finished TypeScript in 21.4s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/117) ...
  Generating static pages using 3 workers (29/117) 
  Generating static pages using 3 workers (58/117) 
  Generating static pages using 3 workers (87/117) 
✓ Generating static pages using 3 workers (117/117) in 7.6s
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

---

### Lệnh 3: `npx eslint .`
```
✖ 36 problems (0 errors, 36 warnings)
```

---

### Lệnh 4: `npx tsc --noEmit`
```
(Exit code 0 — không có lỗi nào)
```

---

## 3. Kết Quả Kiểm Tra Grep (Definition of Done Verbatim)

```bash
# 1. Số lượt dùng token cũ --web-gold / --web-navy trong src/ (trừ file test liars):
$ grep -rn -- "--web-gold\|--web-navy" src/ (loại trừ src/app/design-tokens.test.ts)
Output: 0

# 2. Số lượt dùng màu nâu cũ 5c4a00 trong src/app/web.css:
$ grep -c "5c4a00" src/app/web.css
Output: 0

# 3. Số lượt dùng !important trong src/app/web.css (giữ nguyên không đổi):
$ grep -c "!important" src/app/web.css
Output: 749
```

---

## 4. Đo Đạc Tương Phản WCAG 2.1 AA (Trực Tiếp Tầng Token)

| Cặp Màu Token | Màu Chữ | Màu Nền | Tỉ Lệ Tương Phản | Ngưỡng WCAG AA | Trạng Thái |
|---|---|---|---|---|---|
| Link footer trên dải tối | `--web-accent-on-ink` (`#8FBF9C`) | `--web-ink` (`#14241A`) | **7.79:1** | ≥ 4.5:1 | ✅ ĐẠT |
| Chữ thường trên dải tối | `--web-on-ink-muted` (`#B9C4BC`) | `--web-ink` (`#14241A`) | **9.00:1** | ≥ 4.5:1 | ✅ ĐẠT |
| Chữ chính trên dải tối | `--web-on-ink` (`#F4F1E9`) | `--web-ink` (`#14241A`) | **14.19:1** | ≥ 4.5:1 | ✅ ĐẠT |
| Body copy trên section-alt | `--web-text-secondary` (`#4B5A50`) | `--web-bg-section` (`#E9E5D8`) | **5.79:1** | ≥ 4.5:1 | ✅ ĐẠT |
| Body copy trên bg-warm | `--web-text-secondary` (`#4B5A50`) | `--web-bg-warm` (`#E4DFCF`) | **5.48:1** | ≥ 4.5:1 | ✅ ĐẠT |
| Chữ chính trên nền trang | `--web-text` (`#14241A`) | `--web-bg` (`#F4F1E9`) | **14.19:1** | ≥ 4.5:1 | ✅ ĐẠT |
| Badge 18+ ở footer | `--web-ink` (`#14241A`) | `--web-bg` (`#F4F1E9`) | **14.19:1** (font 12px) | ≥ 4.5:1 | ✅ ĐẠT |

---

## 5. Tóm Tắt Thay Đổi Thị Giác (So Sánh Trước 6A & Sau 6C)

- **Trang chủ `/`, catalog `/san-pham`, đặt hàng `/dat-hang` sau 6A:** Giống hệt 100% trước 6A (do 6A chỉ đổi tên token 1:1, giữ nguyên giá trị `#2F5D3A` và `#14241A`).
- **Thay đổi thị giác có chủ đích sau 6C:**
  1. Nút bấm chính `.btn-primary` khi hover chuyển sang **Xanh đậm** (`#264C30`), không còn biến thành màu Nâu (`#5c4a00`).
  2. Viền/Glow hiệu ứng glass-card và icon circle chuyển từ Vàng mờ sang **Xanh rừng mờ** (`rgba(47, 93, 58, ...)`), tạo sự đồng bộ 100% với thương hiệu.
  3. Chân trang `.web-footer` có link và brand name sáng rõ hơn, dễ đọc đạt chuẩn WCAG AA (**7.79:1**).
  4. Badge 18+ ở chân trang to rõ hơn (**font 12px**, `min-width: 22px`).
  5. Cảnh báo pháp lý 18+ `.disclaimer-text`, body copy `.p-body`, số lượng tab `.tab-count` dùng màu `--web-text-secondary` đằm và dễ đọc hơn (**5.79:1**).

---

## 6. Bảng 51 Literal Màu Cũ Đã Sửa

| Dòng | Giá Trị Cũ | Sửa Thành | Mục Đích |
|---|---|---|---|
| 144 | `rgba(10, 22, 40, ...)` | `rgba(20, 36, 26, ...)` | Gradient header trong suốt đồng bộ xanh-đen |
| 148 | `rgba(253, 252, 240, .88)` | `rgba(244, 241, 233, .88)` | Header solid khớp nền đá ấm |
| 435 | `rgba(114, 47, 55, .08)` | `rgba(75, 90, 80, .08)` | Viền thẻ wine đồng bộ `--web-wine` |
| 449, 457 | `rgba(218,165,32, ...)` | `rgba(47, 93, 58, ...)` | Viền mờ glass card mờ xanh |
| 489 | `linear-gradient(... 218,165,32 ...)` | `linear-gradient(... 47,93,58 ...)` | Nền icon circle xanh, đổi class `.icon-circle-accent` |
| 516 | `rgba(115, 92, 0, .25)` | `rgba(47, 93, 58, .25)` | Shadow dưới nút CTA chính |
| 521 | `background: #5c4a00` | `var(--web-accent-hover)` | Nút CTA hover xanh đậm |
| 523 | `rgba(115, 92, 0, .35)` | `rgba(47, 93, 58, .35)` | Shadow nút CTA hover |
| 665 | `rgba(254, 252, 248, .96)` | `rgba(244, 241, 233, .96)` | Bottom nav mobile khớp nền đá ấm |
| 666 | `rgba(232, 227, 218, .9)` | `rgba(207, 201, 182, .9)` | Viền top bottom nav đồng bộ `--web-border` |
| 841, 865, 1334, 2097, 2105 | `rgba(184, 134, 11, ...)` (5 chỗ) | `rgba(47, 93, 58, ...)` cùng alpha | Glow / viền mờ đồng bộ xanh |
| 1068 | `rgba(218,165,32,.6)` | `rgba(47, 93, 58, .6)` | Viền mờ xanh |
| 1138 | `rgba(218,165,32,.05)` | `rgba(47, 93, 58, .05)` | Nền mờ xanh |
| 2229 | `radial-gradient(... 218,165,32 ...)` | `radial-gradient(... 47,93,58 ...)` | Radial gradient xanh mờ |
| *(Shadows)* | 24 shadow `rgba(10,22,40,...)` & `rgba(13,27,42,...)` | `rgba(20, 36, 26, ...)` cùng alpha | Bóng đổ pha xanh-đen đồng bộ (ngoại trừ 7 nút floating Zalo/Messenger/Phone) |

---

## 7. Sai Khác Cố Ý So Với Plan
**Không có.** Mọi quy định về thứ tự thay thế token (dài trước ngắn sau), miễn trừ 4 trang landing (dòng 3783–5432), miễn trừ nút Zalo/Messenger/Phone, và giữ nguyên 749 `!important` đều được tuân thủ 100%.
