# Báo Cáo Nghiệm Thu: Sửa Lỗi Dữ Liệu & Audit Nội Dung 42 Bài Viết (/kien-thuc)

- **Dự án:** biathaytu-web
- **Mục tiêu:** Chuyển đổi toàn diện nội dung từ định hướng thương mại điện tử / bán hàng sang website brochure giới thiệu thương hiệu Bia Thầy Tu cao cấp (Benediktiner, Bitburger); tuân thủ pháp luật quảng cáo rượu bia; xử lý link hỏng, bài trùng lặp từ khóa, tài liệu nội bộ lộ trong public; và cung cấp script đồng bộ database độc lập.
- **Thời gian hoàn tất:** 24/09/2026
- **Trạng thái:** HOÀN TẤT TOÀN DIỆN (Phases 0, A, B, C, D, E, F, G)

---

## 1. Bảng So Sánh Trước / Sau Cho Từng Phase

### Phase A — Link sản phẩm hỏng trong bài viết
- **Phát hiện:** 95 link hỏng trỏ tới mã 404 nằm rải rác trên 40/42 bài viết (các slug cũ: `benediktiner-weissbier-naturtrub-500ml`, `bitburger-premium-pils-330ml`, `benediktiner-dunkel-500ml`, `bom-5l-benediktiner-weissbier`, và SKU tạm ẩn `kostritzer-schwarzbier-bom-5l`).
- **Xử lý:**
  - Viết lại toàn bộ link trỏ về các SKU hiện diện trong catalog mới (`benediktiner-naturtrub-thung-12-chai-500ml`, `bitburger-premium-pils-thung-12-chai-330ml`, `benediktiner-dunkel-thung-12-chai-500ml`, `benediktiner-naturtrub-bom-5l`).
  - Gỡ thẻ `<a>` và Markdown link trỏ tới sản phẩm đang ẩn (`kostritzer-schwarzbier-bom-5l`), giữ nguyên phần text.
  - Cấu hình 4 rule 301 redirect cho các route sản phẩm cũ trong `next.config.js`.
- **Kết quả:**
  - Số link sản phẩm hỏng trước: **95 link**
  - Số link sản phẩm hỏng sau: **0 link** (100% link nội bộ hợp lệ, kiểm chứng tự động qua `src/lib/data/article-links.test.ts`).

---

### Phase B & E — Tinh gọn danh mục bài viết (Gỡ bài lệch định vị & Gộp bài trùng từ khóa)
- **Phase B (Gỡ 3 bài lệch định vị thương hiệu & xung đột):**
  1. `thu-vien-bia-tu-vien-ettal-cong-thuc-tram-nam` → 301 về `/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal`
  2. `bo-suu-tap-bia-thay-tu-monk-beer-collection` → 301 về `/san-pham`
  3. `bia-thay-tu-chimay-xanh-red-white` → 301 về `/kien-thuc/bia-thay-tu-la-gi`
- **Phase E (Gộp 16 bài viết trùng lặp từ khóa / ăn thịt từ khóa):**
  1. `top-5-loai-bia-thay-tu-nhap-khau-ngon-nhat` → `/kien-thuc/benediktiner-weissbier-400-nam-bia-tu-vien`
  2. `danh-gia-bia-thay-tu-benediktiner-co-ngon-khong` → `/kien-thuc/benediktiner-weissbier-400-nam-bia-tu-vien`
  3. `review-bia-benediktiner-weissbier-duc-co-ngon-khong` → `/kien-thuc/benediktiner-weissbier-400-nam-bia-tu-vien`
  4. `benediktiner-weissbier-bia-thay-tu-chinh-hang-duc` → `/kien-thuc/benediktiner-weissbier-400-nam-bia-tu-vien`
  5. `bia-thay-tu-benediktiner-chinh-hang-mua-o-dau` → `/kien-thuc/benediktiner-weissbier-400-nam-bia-tu-vien`
  6. `top-5-loai-bia-duc-nhap-khau-ngon-nhat-the-gioi` → `/kien-thuc/kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam`
  7. `kham-pha-cac-dong-bia-duc-nhap-khau-noi-tieng` → `/kien-thuc/kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam`
  8. `huong-dan-thuong-thuc-bia-duc-dung-chuan-chuyen-gia` → `/kien-thuc/huong-dan-chon-bia-duc-cho-nguoi-moi`
  9. `thuong-thuc-bia-duc-ngon-dung-dieu` → `/kien-thuc/huong-dan-chon-bia-duc-cho-nguoi-moi`
  10. `tai-sao-bia-duc-duoc-menh-danh-la-tinh-hoa-the-gioi` → `/` (Trang chủ)
  11. `lich-su-bia-duc-hon-500-nam-di-san` → `/kien-thuc/lich-su-bia-duc-va-tu-vien`
  12. `cac-loai-bia-thay-tu-duc-bi-ha-lan` → `/kien-thuc/lich-su-bia-duc-va-tu-vien`
  13. `nguon-goc-bia-thay-tu-trappist-abbey-beer` → `/kien-thuc/bia-thay-tu-la-gi`
  14. `trappist-abbey-beer-la-gi` → `/kien-thuc/bia-thay-tu-la-gi`
  15. `phan-biet-bia-trappist-va-abbey-beer` → `/kien-thuc/bia-thay-tu-la-gi`
  16. `so-sanh-bia-thay-tu-trappist-va-abbey-beer` → `/kien-thuc/bia-thay-tu-la-gi`
- **Thống kê số lượng bài viết và rules redirect:**
  - Số bài viết public ban đầu: **42 bài**
  - Số bài viết sau Phase B: **39 bài**
  - Số bài viết sau Phase E: **23 bài** (gộp thành công 19 bài viết)
  - Số static pages build bởi Next.js: **108 trang** (Baseline) → **105 trang** (sau Phase B/C/D) → **89 trang** (sau Phase E/F/G, đúng $108 - 19 = 89$)
  - Tổng số 301 redirects cấu hình trong `next.config.js`: **23 rules** (19 bài viết + 4 link sản phẩm cũ). Không có bất kỳ redirect loop nào.

---

### Phase C — Dọn dẹp thân bài, xóa claim sức khỏe và ngôn ngữ mua hàng
- **Bước C.2.1:** Khắc phục lỗi hiển thị xuống dòng literal `\n` thành ký tự xuống dòng thực tế.
- **Bước C.2.2:** Xóa triệt để khối geo-footer `<p>...ship hoả tốc...</p>` tại **39/39** bài viết.
- **Bước C.2.3:** Áp dụng bảng vá Phụ lục 1 cho các vi phạm về:
  - Khẳng định sức khỏe, "bánh mì lỏng", vitamin B, bổ dưỡng, giải nhiệt tức thì.
  - Cắt bỏ khối "Men Sống: Vitamin Bia Từ Thiên Nhiên" trong bài `su-that-ve-lop-men-van-duc-naturtrub`.
  - Giá bán cụ thể (`936.000đ`, `1.200.000đ`, `39.000đ/lon`), giao hàng COD, đặt mua online.
  - Lời kêu gọi "Inbox" kiểu mạng xã hội không phù hợp website.
- **Bước C.2.4:** Dọn dẹp các thẻ HTML rỗng `<p></p>`, `<p><em></em></p>`, `<li></li>` và các dòng trống thừa.
- **Kiểm soát xóa lố (Retention Rate):**
  - Mọi bài viết đều giữ lại $\ge 75\%$ độ dài nội dung (sau khi trừ đoạn footer).
  - Tỷ lệ giữ lại thấp nhất ghi nhận ở bài `su-that-ve-lop-men-van-duc-naturtrub` là **78.2%** (do cắt bỏ phần Men Sống không hợp lệ theo quy định). Tất cả các bài khác đều đạt mức retention **90% - 99.8%**.
- **Số câu bị xóa theo C.3:** **0 câu** (toàn bộ các vi phạm đã được giải quyết trọn vẹn và chính xác thông qua bảng vá Phụ lục 1, không cần xóa thêm bất kỳ câu nào ngoài danh mục).

---

### Phase D — Chuẩn hóa Template trang bài viết và Word Count
- **D.1 CTA cuối trang:**
  - *Trước:* CTA định hướng e-commerce ("Cửa Hàng", "Sẵn sàng để thưởng thức ngay hôm nay", "Giao hàng hỏa tốc").
  - *Sau:* CTA định hướng brochure ("Tìm hiểu thêm về các dòng bia", "Thông tin chi tiết về các dòng bia Đức nhập khẩu chính hãng do Bia Thầy Tu phân phối.", nút bấm "Xem các dòng bia" dẫn đến `/san-pham`).
- **D.2 Word Count:**
  - *Trước:* `word_count` được đọc trực tiếp từ database thô (chứa cả HTML tags, footer rác, ký tự literal `\n`).
  - *Sau:* `word_count` được tính toán lại sau khi nội dung đã được làm sạch hoàn toàn (sanitize).
  - *Ví dụ:* Bài `bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia`: từ 670 từ (dữ liệu thô) giảm xuống **550 từ** (nội dung thực tế, < 600 từ theo đúng kết quả kiểm thử).
- **D.3 Open Graph Fallback Image:**
  - Không gán cố định `width: 1200` và `height: 630` khi bài viết phải dùng ảnh fallback `/logo.jpg`, tránh trường hợp hiển thị méo tỷ lệ trên mạng xã hội.

---

### Phase F — Di dời tài liệu nội bộ khỏi thư mục public
- **Phát hiện:** Hai tài liệu marketing/chiến lược nội bộ bị đặt nhầm trong `public/`, có nguy cơ bị lộ khi crawl hoặc truy cập trực tiếp qua URL:
  - `public/fb_growth_playbook.md`
  - `public/Ke_hoach_content_30_ngay_storyselling_bia_duc_premium (1).docx`
- **Xử lý:**
  - Di dời an toàn bằng `git mv` sang thư mục tài liệu nội bộ:
    - `docs/references/fb_growth_playbook.md`
    - `docs/references/Ke_hoach_content_30_ngay_storyselling_bia_duc_premium (1).docx`
  - Bổ sung test tự động trong `src/lib/data/article-template.test.ts` để ngăn chặn việc đưa tài liệu nội bộ trở lại thư mục public.

---

### Phase G — Script chuẩn hóa nội dung trực tiếp trong Database Postgres
- **Tập tin:** `scripts/fix_article_content_2026_09.js`
- **Kiến trúc & Thiết kế:**
  - Viết bằng CommonJS để có thể chạy độc lập với Node.js runtime mà không phụ thuộc vào TypeScript/ESM transpile toolchain của Next.js (lý do đã được ghi chú chi tiết trong comment đầu file).
  - Tự động phát hiện biến môi trường `DATABASE_URL` hoặc nạp từ `.env.local`.
  - **Mặc định chạy Dry-Run:** Quét toàn bộ bảng `seo_articles`, đối chiếu và tính toán độ chênh lệch ký tự, in chi tiết diff trước → sau của từng bài viết mà KHÔNG ghi bất kỳ thay đổi nào vào DB.
  - **Chế độ `--apply` an toàn:** Bọc toàn bộ câu lệnh `UPDATE seo_articles SET content = $1 WHERE id = $2` trong một Transaction duy nhất (`BEGIN ... COMMIT`). Tự động `ROLLBACK` toàn bộ nếu có bất kỳ lỗi nào xảy ra.
  - **Gợi ý SQL chuyển trạng thái:** In sẵn cú pháp SQL `UPDATE seo_articles SET status = 'archived' WHERE slug IN (...)` cho 19 bài viết đã nghỉ/gộp ở Phase B và E để chủ dự án sử dụng khi cần thiết.
- **Trạng thái thực thi trong phiên làm việc:**
  - Đã kiểm tra cú pháp thành công (`node -c scripts/fix_article_content_2026_09.js` thoát mã 0).
  - **TUYỆT ĐỐI TUÂN THỦ NGUYÊN TẮC: Không chạy với cờ `--apply`** trong phiên làm việc này, giữ nguyên vẹn cơ sở dữ liệu cho chủ dự án chủ động kiểm duyệt.

---

## 2. Output Thật Của 4 Lệnh Kiểm Tra Sau Phase G

### 2.1. Kiểm tra Unit Test (`npm test`)
```
> biathaytu-web@0.1.0 test
> vitest run

 RUN  v4.1.2 C:/Users/win/Downloads/Dự án/BTT/biathaytu.com-website

 ✓ src/app/legacy-palette.test.ts (4 tests) 50ms
 ✓ src/app/(web)/mobile-first-regression.test.ts (8 tests) 67ms
 ✓ src/app/design-tokens.test.ts (5 tests) 306ms
 ✓ src/app/api/consultation/route.test.ts (4 tests) 185ms
 ✓ src/app/seo-regression.test.ts (10 tests) 151ms
 ✓ src/app/(web)/asset-integrity.test.ts (4 tests) 152ms
 ✓ src/lib/integrations/consultation.test.ts (6 tests) 97ms
 ✓ src/lib/data/article-links.test.ts (2 tests) 72ms
 ✓ src/lib/compliance/compliance.test.ts (10 tests) 50ms
 ✓ src/app/premium-brand-guard.test.ts (16 tests) 887ms
 ✓ src/lib/consultation/validation.test.ts (8 tests) 41ms
 ✓ src/lib/data/article-content.test.ts (6 tests) 69ms
 ✓ src/lib/data/retired-articles.test.ts (3 tests) 117ms
 ✓ src/app/contrast.test.ts (10 tests) 58ms
 ✓ src/app/(web)/product-data-regression.test.ts (8 tests) 41ms
 ✓ src/lib/data/product-image-cutouts.test.ts (5 tests) 43ms
 ✓ src/lib/data/article-template.test.ts (4 tests) 43ms
 ✓ src/app/(web)/components/age-gate-a11y.test.ts (5 tests) 29ms
 ✓ src/lib/data/products.test.ts (6 tests) 42ms
 ✓ src/app/hidden-products-not-public.test.ts (4 tests) 46ms
 ✓ src/app/(web)/components/JsonLd.test.ts (6 tests) 56ms
 ✓ src/app/google-merchant-feed.test.ts (1 test) 37ms
 ✓ src/lib/data/product-data-integrity.test.ts (4 tests) 34ms
 ✓ src/app/(web)/hidden-products.test.ts (3 tests) 29ms
 ✓ src/app/oversized-images.test.ts (2 tests) 41ms
 ✓ src/app/(web)/catalog-coverage.test.ts (2 tests) 22ms
 ✓ src/lib/seo/business.test.ts (4 tests) 28ms
 ✓ src/constants/compliance.test.ts (1 test) 12ms
 ✓ src/app/(web)/components/football-popup.test.ts (2 tests) 16ms
 ✓ src/lib/seo/productPricing.test.ts (3 tests) 14ms
 ✓ src/app/(web)/components/footer-links.test.ts (1 test) 14ms

 Test Files  31 passed (31)
      Tests  157 passed (157)
   Start at  02:18:25
   Duration  9.64s (transform 5.86s, setup 0ms, import 18.07s, tests 2.85s, environment 23ms)
```

### 2.2. Kiểm tra Next.js Build (`npx next build`)
```
▲ Next.js 16.2.6 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 11.3s
  Running TypeScript ...
  Finished TypeScript in 13.1s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/89) ...
  Generating static pages using 7 workers (22/89) 
  Generating static pages using 7 workers (44/89) 
  Generating static pages using 7 workers (66/89) 
✓ Generating static pages using 7 workers (89/89) in 18.9s
  Finalizing page optimization ...

Route (app)                                                          Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/consultation
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
├ ○ /chinh-sach-kiem-soat-do-tuoi
├ ○ /chua-du-tuoi
├ ○ /chung-nhan-nhap-khau-chinh-hang
├ ○ /dieu-khoan-su-dung
├ ○ /food-pairing-bia-duc
├ ƒ /google-merchant.xml
├ ○ /huong-dan-rot-bia-lua-mi
├ ○ /icon.png
├ ○ /kien-thuc                                                               1h      1y
├ ● /kien-thuc/[slug]                                                        1h      1y
│ ├ /kien-thuc/cach-nuong-xuc-xich-thuringer-bratwurst-chuan-vi-duc          1h      1y
│ ├ /kien-thuc/bi-quyet-chon-do-nham-bia-duc-xuc-xich-wiener                 1h      1y
│ ├ /kien-thuc/top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia                  1h      1y
│ └ [+20 more paths]
├ ○ /lien-he
├ ƒ /llms.txt
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
├ ○ /thong-tin-mua-hang
├ ○ /thuong-hieu
└ ○ /ve-chung-toi

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

### 2.3. Kiểm tra ESLint (`npx eslint .`)
```
C:\Users\win\Downloads\Dự án\BTT\biathaytu.com-website\src\app\(web)\components\AgeVerificationGate.tsx
  34:5  warning  Error: Calling setState synchronously within an effect can trigger cascading renders  react-hooks/set-state-in-effect

C:\Users\win\Downloads\Dự án\BTT\biathaytu.com-website\src\app\(web)\components\CookieConsent.tsx
  33:5  warning  Error: Calling setState synchronously within an effect can trigger cascading renders  react-hooks/set-state-in-effect

C:\Users\win\Downloads\Dự án\BTT\biathaytu.com-website\src\app\(web)\components\FacebookPixel.tsx
  73:9  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

C:\Users\win\Downloads\Dự án\BTT\biathaytu.com-website\src\app\(web)\components\FloatingZaloCTA.tsx
  24:5  warning  Error: Calling setState synchronously within an effect can trigger cascading renders  react-hooks/set-state-in-effect

C:\Users\win\Downloads\Dự án\BTT\biathaytu.com-website\src\lib\compliance\compliance.test.ts
   3:3   warning  'calculateAge' is defined but never used  @typescript-eslint/no-unused-vars
  17:31  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  50:31  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 7 problems (0 errors, 7 warnings)
```

### 2.4. Kiểm tra TypeScript (`npx tsc --noEmit`)
```
(Exit code 0 — Không có lỗi biên dịch kiểu dữ liệu)
```

---

## 3. Danh Mục 8 Việc "🛑 CHỜ CHỦ DỰ ÁN" (Chép Nguyên Văn)

Dưới đây là 8 hạng mục tồn đọng cần quyết định chiến lược từ chủ dự án, tuyệt đối không được tự ý xử lý:

1. **Claim cần bằng chứng:** giải iTQi 3 sao 2022 cho Benediktiner Weissbier Naturtrüb (xuất hiện ở 3 bài); “Bitburger — bia Draft số 1 nước Đức”; các từ “số 1 / duy nhất / tốt nhất / hàng đầu” (18 bài). Cần tài liệu chứng minh hoặc câu thay thế đã được pháp chế duyệt.
2. **Câu xuất xứ chuẩn cho Benediktiner:** (bia do tu viện Ettal nấu hay được sản xuất theo giấy phép tại nhà máy khác). Hiện mỗi bài nói một kiểu.
3. **Sai lệch lịch sử cần đối chiếu:** “Năm 1817, gia đình Simon nhận lại nhà máy” (bài bitburger-hanh-trinh-200-nam-bia-draft-so-1); “Weissbier tuân thủ Luật Tinh khiết 1516” (bản 1516 chỉ cho lúa mạch).
4. **Biên tập gộp nội dung:** chuyển đoạn giá trị từ 16 bài bị gộp sang bài đích; mở rộng 3 bài trụ (`bia-lua-mi-duc-weissbier-la-gi`, `bia-khong-con-bitburger-0-0-lua-chon-dang-cap`, `giai-thuong-itqi-3-sao-benediktiner-weissbier`).
5. **Title > 65 ký tự (12 bài) và meta description ngoài 110–165 ký tự (6 bài):** Cần viết lại trong DB.
6. **Ảnh bìa cho 38 bài không có thumbnail_url:** Không tự tạo, tự sinh AI hay gán ảnh sản phẩm làm ảnh bìa.
7. **18 bài vang Đức (tenant vangducnhapkhau) không hiển thị:** trong khi 9 SKU vang vẫn có trong catalog: đưa vào `/kien-thuc` hay bỏ vang khỏi catalog?
8. **Chạy `scripts/fix_article_content_2026_09.js --apply` và archive các bài đã gỡ/gộp trong DB.**
