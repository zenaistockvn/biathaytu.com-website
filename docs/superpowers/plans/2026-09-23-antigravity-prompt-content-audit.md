# Prompt cho Antigravity — Sửa lỗi nội dung bài viết /kien-thuc (audit 23/09/2026)

> Copy toàn bộ khối dưới đường kẻ, dán vào Antigravity ở thư mục gốc repo `biathaytu-web` (nhánh `main` mới nhất).
>
> **Trước khi dán, chủ dự án tick ô dưới đây nếu đồng ý gộp 16 bài (Phase E):**
>
> - [ ] Tôi duyệt Phase E — gộp 16 bài trùng chủ đề theo bảng E.1

---

Bạn đang làm việc trong repo `biathaytu-web`, website giới thiệu bia Đức nhập khẩu Bia Thầy Tu (Next.js 16 App Router, TypeScript, Vitest; **không** Tailwind). Website đã chuyển từ bán hàng online sang **brochure**: `/dat-hang` đã 301 về `/lien-he`, không còn giỏ hàng. Nội dung bài viết phải phù hợp với định hướng đó và với quy định quảng cáo rượu bia.

## Nhiệm vụ

Sửa các lỗi của **42 bài viết đang public** tại `/kien-thuc/[slug]` mà đợt audit ngày 23/09/2026 tìm ra. Làm lần lượt **Phase A → G** bên dưới. Phase E chỉ làm khi ô duyệt ở đầu file này **đã được tick**; nếu chưa tick, bỏ qua Phase E và ghi vào báo cáo.

## Kiến trúc dữ liệu — đọc kỹ, đây là chỗ dễ sai nhất

- Nguồn gốc của bài viết là bảng `seo_articles` trong Postgres (Neon). `npm run build` chạy `scripts/dump_data.js`, script này **ghi đè** `src/data/articles.json` và `src/data/products.json` từ DB.
- ⇒ **Sửa `src/data/*.json` là sửa vào chỗ không bền.** Mọi thay đổi nội dung trong phạm vi này phải làm ở **tầng code**, cụ thể là trong `src/lib/data/articles.ts`, hàm `sanitizeArticleContent()` và danh sách `PUBLISHED_ARTICLES`. Như vậy nội dung render luôn đúng, kể cả khi DB chưa được sửa.
- `getPublishedArticles()` là nguồn duy nhất cho trang chi tiết, trang danh mục, `sitemap.ts` và `llms.txt/route.ts`. Lọc hoặc sửa ở đó là đủ phủ mọi bề mặt.
- Link sản phẩm hợp lệ = slug nằm trong `getVisibleProducts()` (`src/lib/data/products.ts`). `/san-pham/[slug]` gọi `notFound()` với slug lạ.
- Redirect nằm trong `next.config.js` (CommonJS). Đã có sẵn `RETIRED_BEER_ARTICLE_SLUGS` cho 5 bài bia Bỉ: **giữ nguyên, không đụng**.

## Năm điều tuyệt đối không được làm

1. **Không sửa `src/data/articles.json`, `src/data/products.json`** hay bất kỳ file nào trong `src/data/`.
2. **Không viết nội dung mới, không thêm câu, số liệu, giải thưởng, năm, giá, ảnh** ngoài đúng các chuỗi thay thế được cho sẵn trong file này. Cần câu khác = **dừng và ghi vào báo cáo**.
3. **Không ghi vào database.** Phase G chỉ tạo script chạy thử (dry-run). **Không** chạy `--apply`, **không** chạy `npm run sync-db`, `inject-*`, `optimize-seo`.
4. **Không nới lỏng, xóa hay `skip` test** để có màu xanh. Test đỏ vì dữ liệu = sửa code sanitizer cho đúng, **không** sửa dữ liệu cho khớp test.
5. **Không tự quyết các mục 🛑 CHỜ CHỦ DỰ ÁN** ở cuối file (lần trước đã vi phạm hai vòng liên tiếp).

## Quy tắc thực thi

1. **Test trước, code sau.** Viết test → `npm test` → **xác nhận đỏ đúng như mô tả** → mới sửa. Test xanh ngay từ đầu = hiểu sai vấn đề → dừng lại và ghi báo cáo.
2. **Test kiểm hành vi**: gọi `getPublishedArticles()` / `redirects()` / `sitemap()` rồi assert. Không dùng `expect(source).toContain(...)` để kiểm logic. Ngoại lệ duy nhất: Phase D được đọc file `.tsx` để kiểm câu chữ tĩnh.
3. Sau **mỗi** Phase chạy đủ 4 lệnh, tất cả phải xanh:
   ```bash
   npm test && npx next build && npx eslint . && npx tsc --noEmit
   ```
   Dùng `npx next build`, **không** dùng `npm run build` (nó chạy dump DB). Ghi lại **số trang** mà `next build` in ra ở bước baseline và sau mỗi Phase.
4. Chỉ chạm các file được nêu tên trong từng Phase. **Không refactor** thêm (không chuyển `ArticleBody` sang server component, không đổi CSS, không đổi `ProductCard`).
5. **Commit riêng từng Phase**, message tiếng Việt, ví dụ: `fix(kien-thuc): sửa 95 link sản phẩm hỏng trong bài viết`.
6. Kết thúc bằng **báo cáo** tại `docs/superpowers/plans/2026-09-23-antigravity-report-content-audit.md`, dán **output thật** của các lệnh (không tóm tắt “đã pass”).

---

## Phase 0 — Baseline

Chạy 4 lệnh ở trên trên `main` chưa sửa. Ghi vào báo cáo: số test pass, số trang build, số bài `getPublishedArticles().length` (kỳ vọng **42**).

---

## Phase A — 95 link sản phẩm trỏ tới 404 (40/42 bài)

**Bằng chứng:** bài viết link tới các slug không có trong catalog:

| Slug sai trong bài | Số lần | Slug đúng |
|---|---:|---|
| `benediktiner-weissbier-naturtrub-500ml` | 54 | `benediktiner-naturtrub-thung-12-chai-500ml` |
| `bitburger-premium-pils-330ml` | 29 | `bitburger-premium-pils-thung-12-chai-330ml` |
| `benediktiner-dunkel-500ml` | 10 | `benediktiner-dunkel-thung-12-chai-500ml` |
| `bom-5l-benediktiner-weissbier` | 1 | `benediktiner-naturtrub-bom-5l` |
| `kostritzer-schwarzbier-bom-5l` | 1 | *(SKU đang ẩn)* bỏ thẻ `<a>`, giữ chữ |

**A.1 Test** — tạo `src/lib/data/article-links.test.ts`:
- Với mỗi bài trong `getPublishedArticles()`, trích mọi link nội bộ từ `content`: `href="..."` (HTML) và `](...)` (Markdown). Chuẩn hóa: bỏ tiền tố `https://biathaytu.com`, `https://www.biathaytu.com`, bỏ `?query`, `#hash` và dấu `/` cuối. Bỏ qua link ngoài, `mailto:`, `tel:`, `#`.
- Một link hợp lệ khi thỏa **một** trong ba điều kiện:
  - (a) là route tĩnh: tập route lấy bằng cách duyệt `src/app/(web)` và `src/app/(bare)` tìm `page.tsx`, bỏ các thư mục group `(...)` và bỏ route động `[...]`;
  - (b) `/san-pham/<slug>` với slug thuộc `getVisibleProducts()`;
  - (c) `/kien-thuc/<slug>` hoặc `/blog/<slug>` với slug thuộc `getPublishedArticles()`.
- Assert: danh sách link hỏng rỗng. In ra `slug bài → link` khi fail.
- Kỳ vọng **đỏ**: ~95 link trong 40 bài. Ghi con số thật vào báo cáo.

**A.2 Sửa** trong `src/lib/data/articles.ts` (bên trong `sanitizeArticleContent`):
- Thêm hằng `LEGACY_PRODUCT_SLUG_MAP` gồm đúng 4 dòng của bảng trên. Viết lại mọi `href` (HTML) và `](...)` (Markdown) trỏ tới `/san-pham/<slug cũ>`, kể cả dạng URL tuyệt đối, sang slug đúng.
- Sau bước đó, mọi thẻ `<a ... href="/san-pham/X">chữ</a>` mà `X` **không** thuộc `getVisibleProducts()` → thay bằng `chữ` (bỏ thẻ, giữ nội dung). Với Markdown `[chữ](/san-pham/X)` → `chữ`.

**A.3 Sửa** `next.config.js`: thêm 4 redirect 301 `/san-pham/<slug cũ>` → `/san-pham/<slug đúng>` (cho backlink bên ngoài). Thêm vào `src/lib/data/article-links.test.ts` một test gọi `nextConfig.redirects()` và assert có đủ 4 cặp này.

---

## Phase B — Gỡ 3 bài đi ngược định hướng

| Slug | Redirect 301 tới | Lý do |
|---|---|---|
| `phan-biet-bia-thay-tu-trappist-va-bia-tu-vien` | `/bia-thay-tu-la-gi` | Định nghĩa “Bia Thầy Tu = Trappist (Chimay, La Trappe)”, gọi Benediktiner là bia nấu ở nhà máy thương mại; bảng `<td>` vẫn nêu Chimay/La Trappe/Rochefort/Leffe vì sanitizer không lọc `td`; một mục bị cắt còn câu mồ côi “Trong khi đó…”; ghi “phân phối… từ Đức và Bỉ”. |
| `dai-ly-phan-phoi-si-le-xuc-xich-duc-the-wurst-tay-ho` | `/bang-gia-si-dai-ly` | Bài bán sỉ thuần, “giá sỉ tốt nhất thị trường”, tiêu đề ghi “Tây Hồ” (địa chỉ cũ). |
| `mua-xuc-xich-duc-chinh-hang-o-dau-ha-noi-ship-hoa-toc` | `/san-pham` | Bài bán hàng thuần, H2 “Dịch Vụ Giao Hàng Hoả Tốc 2 Giờ”. |

**B.1 Test** — tạo `src/lib/data/retired-articles.test.ts`:
- Mỗi slug trong bảng: `getArticleBySlugOrId(slug)` trả `null`; không xuất hiện trong URL của `sitemap()`; không xuất hiện trong text của `GET` từ `src/app/llms.txt/route.ts`; `nextConfig.redirects()` có redirect `/kien-thuc/<slug>` → đích đúng, `statusCode: 301`.
- Kỳ vọng **đỏ** trước khi sửa.

**B.2 Sửa:**
- Tạo `src/config/retired-articles.json` dạng `{ "<slug>": "<đích>" }` với 3 dòng trên.
- `next.config.js`: `require('./src/config/retired-articles.json')` rồi sinh redirect `/kien-thuc/<slug>` → đích, `statusCode: 301`. Giữ nguyên khối `RETIRED_BEER_ARTICLE_SLUGS`.
- `src/lib/data/articles.ts`: import JSON này, loại các slug đó khỏi `PUBLISHED_ARTICLES`. Trong `sanitizeArticleContent`, viết lại mọi link `/kien-thuc/<slug đã gỡ>` (và `/blog/<slug>`) sang đích tương ứng, để test Phase A vẫn xanh.
- Kỳ vọng `getPublishedArticles().length === 39`. Số trang build giảm đúng 3.

---

## Phase C — Dọn thân bài

**Bằng chứng:**
- (1) **Cả 39 bài còn lại** đều có đoạn `<p style="... #faf7f2 ...">` do `scripts/inject_geo_footer.js` chèn vào, nội dung: “…giá tốt… **ship hoả tốc ngay lập tức trong vòng 2 giờ tại nội thành Hà Nội (HN) và TP.HCM**… phục vụ nhanh nhất!”. Đoạn này trái định hướng brochure, trùng với khối `GeoLocalCTA` ngay bên dưới, và dùng màu cũ.
- (2) Bài `so-sanh-weissbier-vs-pilsner` hiển thị nguyên văn **24 chuỗi `\n`** (ký tự `\` + `n` thật trong dữ liệu).
- (3) Claim sức khỏe/dinh dưỡng cho bia (vitamin B, axit amin, khoáng chất, “bổ dưỡng”, “giải nhiệt”), giá bán cụ thể, và lời kêu gọi mua hàng/“Inbox” trong thân bài.

**C.1 Test** — tạo `src/lib/data/article-content.test.ts`. Với mỗi bài trong `getPublishedArticles()`, bỏ thẻ HTML khỏi `content` rồi assert **không** khớp các mẫu sau (không phân biệt hoa thường):
- `/ship\s*(?:hoả|hỏa|hoa)\s*tốc/` và `/giao hàng\s*(?:hoả|hỏa)\s*tốc/`
- chuỗi hai ký tự `\n` (backslash + n)
- `/vitamin|khoáng chất|axit amin|bổ dưỡng|dinh dưỡng|giải nhiệt|bánh mì lỏng|thức ăn lỏng|flüssiges brot/`
- `/\d{1,3}(?:\.\d{3})+\s*(?:đ|₫|vnđ)/`
- `/\binbox\b|\bCOD\b|đặt mua/`

Thêm **test chống xóa lố**: với mỗi bài, độ dài text sau sanitize ≥ **75%** độ dài text gốc tương ứng trong `articles.json`, sau khi đã trừ riêng đoạn footer (1). Bài bị cắt nhiều nhất theo Phụ lục 1 là `su-that-ve-lop-men-van-duc-naturtrub`, còn khoảng 78%. Nếu bài nào dưới 75% nghĩa là regex đang xóa quá tay: sửa regex, **không** hạ ngưỡng.

Kỳ vọng **đỏ** ở nhiều bài. Ghi danh sách vào báo cáo.

**C.2 Sửa** trong `sanitizeArticleContent`, theo đúng thứ tự:
1. Thay mọi chuỗi `\` + `n` (literal) bằng ký tự xuống dòng thật.
2. Xóa **nguyên** thẻ `<p ...>…</p>` nào chứa `ship hoả tốc` / `ship hỏa tốc` (chỉ đoạn footer đó, không đụng thẻ khác).
3. Áp dụng **bảng vá ở Phụ lục 1** (thay thế chuỗi chính xác, theo từng slug). Mỗi dòng vá chỉ áp dụng khi chuỗi `find` còn tồn tại (để khi DB đã sửa thì không lỗi). Khai báo bảng này thành hằng `ARTICLE_TEXT_PATCHES: Record<slug, Array<{ find: string; replace: string }>>`, dùng `split(find).join(replace)`, **không** dùng regex cho bảng vá.
4. Sau khi vá, xóa các khối rỗng còn lại: `<p>\s*</p>`, `<p><em>\s*</em></p>`, `<li>\s*</li>`, và dòng trống lặp ≥ 3 trong Markdown.

**C.3** — Nếu sau C.2 test còn đỏ ở câu nào **không có trong Phụ lục 1**: **không tự viết câu thay thế.** Chỉ được xóa trọn câu đó (từ dấu câu trước tới dấu câu sau), ghi nguyên văn câu đã xóa vào báo cáo để chủ dự án duyệt.

---

## Phase D — Template trang bài viết

File: `src/app/(web)/kien-thuc/[slug]/page.tsx` và `src/lib/data/articles.ts`.

**D.1 CTA cuối bài** (khoảng dòng 165–210). Hiện tại là “Sẵn sàng để thưởng thức?” + “Trải nghiệm hương vị hoàng gia Đức **ngay hôm nay**…” + nút “Xem Toàn Bộ **Cửa Hàng**”: vừa mang tính khuyến khích uống, vừa sai định hướng brochure. Thay đúng 3 chuỗi:
- Tiêu đề → `Tìm hiểu thêm về các dòng bia`
- Đoạn mô tả → `Thông tin chi tiết về các dòng bia Đức nhập khẩu chính hãng do Bia Thầy Tu phân phối.`
- Nút → `Xem các dòng bia` (giữ `href="/san-pham"`, giữ style)

Test (được đọc file, là ngoại lệ ở quy tắc 2): file không còn chứa `Cửa Hàng`, `ngay hôm nay`, `Sẵn sàng để thưởng thức`.

**D.2 Thời gian đọc sai.** `word_count` trong DB bị thổi lên (ví dụ `bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia` lưu 800 nhưng thực tế ~383 từ), nên trang ghi “4 phút đọc” cho bài 2 phút. Trong phần `.map()` tạo `PUBLISHED_ARTICLES`, **tính lại** `word_count` từ `content` đã sanitize: bỏ thẻ HTML và ký hiệu Markdown `#*_>|` rồi đếm từ theo khoảng trắng. Không sửa các trang dùng `word_count`, vì chúng tự đúng theo.
Test: với 1 bài bất kỳ, `word_count` bằng số từ đếm lại từ `content`; và `bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia` (nếu còn public) có `word_count < 600`.

**D.3 OG image fallback.** Khi bài không có `thumbnail_url` (38/42 bài), `generateMetadata` dùng `/logo.jpg` (thực tế 2048×2048) nhưng khai báo `width: 1200, height: 630`. Sửa: **chỉ** khai báo `width`/`height` khi có `thumbnail_url`. **Không** tạo hay gán ảnh mới.

---

## Phase E — Gộp 16 bài trùng chủ đề *(CHỈ làm nếu ô duyệt ở đầu file đã tick)*

**Bằng chứng:** 25 bài nằm trong 11 cụm cùng ý định tìm kiếm, tự cạnh tranh từ khóa với nhau và với các landing page. Phần lớn bài bị gộp chỉ có 370–540 từ.

**E.1** Thêm 16 dòng sau vào `src/config/retired-articles.json` (cơ chế giống hệt Phase B, không cần code mới):

| Slug bị gộp | Đích 301 |
|---|---|
| `kham-pha-bia-thay-tu-benediktiner-weissbier-men-song-ettal` | `/kien-thuc/benediktiner-weissbier-400-nam-bia-tu-vien` |
| `giai-ma-vi-dang-thanh-bitburger-premium-pilsner-duc` | `/bitburger-premium-pils` |
| `bitburger-premium-pils-bia-draft-so-1-nuoc-duc` | `/bitburger-premium-pils` |
| `so-sanh-bia-lua-mi-benediktiner-va-pilsner-bitburger` | `/kien-thuc/so-sanh-weissbier-vs-pilsner` |
| `dao-luat-tinh-khiet-1516-tuyen-ngon-dang-cap-bia-duc` | `/kien-thuc/dao-luat-tinh-khiet-1516-reinheitsgebot` |
| `luat-tinh-khiet-1516-reinheitsgebot` | `/kien-thuc/dao-luat-tinh-khiet-1516-reinheitsgebot` |
| `nhiet-do-thuong-thuc-bia-duc-ly-tuong-nhat` | `/kien-thuc/nhiet-do-vang-thuong-thuc-bia-la-bao-nhieu` |
| `tang-qua-doi-tac-bia-duc-nhap-khau-cao-cap` | `/qua-tang-bia-duc` |
| `bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia` | `/kien-thuc/nghe-thuat-rot-bia-lua-mi-weizen-dung-chuan` |
| `nghe-thuat-rot-bia-lua-mi-benediktiner` | `/kien-thuc/nghe-thuat-rot-bia-lua-mi-weizen-dung-chuan` |
| `kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam` | `/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal` |
| `bia-thay-tu-la-gi-giai-dap-thac-mac` | `/bia-thay-tu-la-gi` |
| `su-khac-biet-giua-bia-den-dunkel-va-bia-vang-naturtrub` | `/kien-thuc/phan-biet-weissbier-dunkel-festbier` |
| `nghe-thuat-food-pairing-cung-bia-duc` | `/kien-thuc/food-pairing-bia-thay-tu-va-am-thuc` |
| `ket-hop-bia-duc-va-am-thuc-duong-dai` | `/kien-thuc/food-pairing-bia-thay-tu-va-am-thuc` |
| `nghe-thuat-chon-bia-nguoi-truong-thanh` | `/kien-thuc/huong-dan-chon-bia-duc-cho-nguoi-moi` |

**E.2 Test:** mở rộng `retired-articles.test.ts` để lặp qua **toàn bộ** JSON (19 dòng), không hardcode 3 slug. Thêm assert: mọi đích dạng `/kien-thuc/<slug>` phải là bài **vẫn public** (không trỏ vào bài đã gỡ, không tạo chuỗi redirect).
Kỳ vọng `getPublishedArticles().length === 23`.

**Không** chuyển nội dung từ bài bị gộp sang bài đích (đó là việc biên tập, xem 🛑 mục 4).

---

## Phase F — Tài liệu nội bộ đang công khai trong `public/`

`public/fb_growth_playbook.md` (chiến lược 7 fanpage) và `public/Ke_hoach_content_30_ngay_storyselling_bia_duc_premium (1).docx` đang được phục vụ công khai tại domain. Dùng `git mv` chuyển cả hai sang `docs/references/`. Trước khi chuyển, grep toàn repo để chắc không có code tham chiếu tới hai file này. **Không** đụng `public/biathaytu2026.txt`, `llms-full.txt`, `qr-*`.

Test: `existsSync('public/fb_growth_playbook.md') === false` và file docx tương tự.

---

## Phase G — Script làm bền thay đổi vào DB (chỉ tạo, KHÔNG chạy ghi)

Tạo `scripts/fix_article_content_2026_09.js` (CommonJS, đọc `DATABASE_URL` theo cùng cách `scripts/dump_data.js` đang làm):
- Mặc định **dry-run**: đọc `seo_articles`, áp dụng **đúng** các biến đổi của Phase A (map slug), C.2 bước 1–4 và bảng vá Phụ lục 1, in ra với mỗi bài `slug: số ký tự trước → sau` và 1 dòng diff tóm tắt. **Không ghi.**
- Chỉ khi có cờ `--apply` mới `UPDATE seo_articles SET content = $1 WHERE id = $2` trong một transaction.
- Các slug gỡ/gộp (Phase B/E) **không** xóa khỏi DB. Script chỉ in gợi ý `UPDATE ... SET status = 'archived'`, không thực thi.
- Tách phần biến đổi thành module dùng chung để `articles.ts` và script cùng gọi. Nếu không làm được do khác biệt ESM/CJS thì chấp nhận lặp code, ghi lý do vào báo cáo.

**Không chạy script với DB thật**, kể cả dry-run, nếu `.env.local` không có sẵn. Ghi vào báo cáo.

---

## 🛑 CHỜ CHỦ DỰ ÁN — KHÔNG được tự làm, chỉ liệt kê lại trong báo cáo

1. **Claim cần bằng chứng:** giải iTQi 3 sao 2022 cho Benediktiner Weissbier Naturtrüb (xuất hiện ở 3 bài); “Bitburger — bia Draft số 1 nước Đức”; các từ “số 1 / duy nhất / tốt nhất / hàng đầu” (18 bài). Cần tài liệu chứng minh hoặc câu thay thế đã được pháp chế duyệt.
2. **Câu xuất xứ chuẩn cho Benediktiner** (bia do tu viện Ettal nấu hay được sản xuất theo giấy phép tại nhà máy khác). Hiện mỗi bài nói một kiểu.
3. **Sai lệch lịch sử cần đối chiếu:** “Năm 1817, gia đình Simon nhận lại nhà máy” (bài `bitburger-hanh-trinh-200-nam-bia-draft-so-1`); “Weissbier tuân thủ Luật Tinh khiết 1516” (bản 1516 chỉ cho lúa mạch).
4. **Biên tập gộp nội dung:** chuyển đoạn giá trị từ 16 bài bị gộp sang bài đích; mở rộng 3 bài trụ (`bia-lua-mi-duc-weissbier-la-gi`, `bia-khong-con-bitburger-0-0-lua-chon-dang-cap`, `giai-thuong-itqi-3-sao-benediktiner-weissbier`).
5. **Title > 65 ký tự (12 bài) và meta description ngoài 110–165 ký tự (6 bài).** Cần viết lại trong DB.
6. **Ảnh bìa** cho 38 bài không có `thumbnail_url`. **Không** tự tạo, tự sinh AI hay gán ảnh sản phẩm làm ảnh bìa.
7. **18 bài vang Đức** (tenant `vangducnhapkhau`) không hiển thị, trong khi 9 SKU vang vẫn có trong catalog: đưa vào /kien-thuc hay bỏ vang khỏi catalog?
8. **Chạy `scripts/fix_article_content_2026_09.js --apply`** và archive các bài đã gỡ/gộp trong DB.

## Định nghĩa “xong”

- [ ] `npm test` xanh, gồm 4 file test mới: `article-links`, `retired-articles`, `article-content`, và test Phase D/F
- [ ] `npx next build` xanh; số trang = baseline − 3 (hoặc − 19 nếu làm Phase E)
- [ ] `npx eslint .` 0 error; `npx tsc --noEmit` không in dòng nào
- [ ] `getPublishedArticles().length` = 39 (hoặc 23 nếu làm Phase E)
- [ ] 0 link nội bộ hỏng trong bài public
- [ ] 0 bài chứa “ship hoả tốc”, `\n` literal, vitamin/khoáng chất/bổ dưỡng/giải nhiệt, giá “…đ”, “Inbox”, “COD”, “đặt mua”
- [ ] Không bài nào mất quá 25% độ dài text (ngoài đoạn footer)
- [ ] `git diff main -- src/data/` **rỗng**
- [ ] Không có commit nào chạm file ngoài: `src/lib/data/articles.ts`, `src/config/retired-articles.json`, `next.config.js`, `src/app/(web)/kien-thuc/[slug]/page.tsx`, các file test mới, `scripts/fix_article_content_2026_09.js` (và module dùng chung nếu có), 2 file dời khỏi `public/`, file báo cáo
- [ ] Báo cáo có output thật + danh sách câu đã xóa ở C.3 (nếu có) + 8 mục 🛑

---

## Phụ lục 1 — Bảng vá văn bản (`ARTICLE_TEXT_PATCHES`)

Chuỗi `find` được copy **nguyên văn** từ `articles.json` (commit `c68483d`), kể cả dấu cách đầu dòng, thẻ HTML và dấu ngoặc kép thẳng `"`. `replace` rỗng nghĩa là xóa. Mỗi `find` hiện xuất hiện đúng 1 lần trong bài tương ứng.

### Claim sức khỏe / dinh dưỡng

| Slug | find | replace |
|---|---|---|
| `so-sanh-weissbier-vs-pilsner` | `lưu giữ toàn bộ vitamin B và những tinh tuý` | `lưu giữ những tinh tuý` |
| `kham-pha-bia-thay-tu-benediktiner-weissbier-men-song-ettal` | `giúp giữ trọn vitamin B, axit amin và hương vị trái cây nguyên bản` | `giúp giữ trọn hương vị trái cây nguyên bản` |
| `so-sanh-bia-lua-mi-benediktiner-va-pilsner-bitburger` | ` và mang lại cảm giác giải nhiệt tức thì` | *(rỗng)* |
| `bia-thay-tu-la-gi-giai-dap-thac-mac` | ` Bia được gọi là "bánh mì lỏng" (<em>flüssiges Brot</em>) — nguồn dinh dưỡng thiết yếu trong những tháng chay tịnh khi tu sĩ không ăn thức ăn rắn.` | *(rỗng)* |
| `bia-thay-tu-la-gi-giai-dap-thac-mac` | ` và cung cấp vitamin B tự nhiên` | *(rỗng)* |
| `huong-dan-chon-bia-duc-cho-nguoi-moi` | `Lớp men này cực kỳ giàu dinh dưỡng, vitamin nhóm B và là nguồn gốc tạo nên` | `Lớp men này là nguồn gốc tạo nên` |
| `nguon-goc-bia-thay-tu-tu-vien-ettal` | ` Lý do? Trong suốt thời Trung Cổ, bia lúa mì được coi là "bánh mì lỏng" — <em>flüssiges Brot</em> — nguồn dinh dưỡng quan trọng trong những ngày chay tịnh.` | *(rỗng)* |
| `nguon-goc-bia-thay-tu-tu-vien-ettal` | `, bảo tồn vitamin B và hương vị nguyên bản` | `, giữ trọn hương vị nguyên bản` |
| `benediktiner-weissbier-400-nam-bia-tu-vien` | ` Trong truyền thống Công giáo thời Trung Cổ, bia lúa mì được gọi là "bánh mì lỏng" — flüssiges Brot — thức uống bổ dưỡng dùng trong những ngày nhịn ăn chay tịnh.` | *(rỗng)* |
| `benediktiner-weissbier-400-nam-bia-tu-vien` | `lớp men sống chứa vitamin B tự nhiên và tạo nên vị béo mượt đặc trưng` | `lớp men sống tạo nên vị béo mượt đặc trưng` |
| `top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia` | ` và dinh dưỡng tự nhiên` | *(rỗng)* |
| `top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia` | ` làm suy giảm chất lượng dinh dưỡng` | *(rỗng)* |
| `su-that-ve-lop-men-van-duc-naturtrub` | `— mất đi phần lớn hương vị và dinh dưỡng.` | `— mất đi phần lớn hương vị.` |
| `su-that-ve-lop-men-van-duc-naturtrub` | `\| Dinh dưỡng \| Ít hơn (men đã bị loại) \| Nhiều vitamin B, axit amin \|` + ký tự xuống dòng | *(rỗng)* (xóa cả dòng của bảng Markdown) |
| `su-that-ve-lop-men-van-duc-naturtrub` | Toàn bộ đoạn **từ** `### Men Sống — "Vitamin Bia" Từ Thiên Nhiên` **đến ngay trước** `### Bia Lọc vs. Bia Không Lọc` | *(rỗng)*. Đoạn gồm: heading, câu dẫn “Men sống trong bia Naturtrüb…”, 3 dòng **Vitamin B / Axit amin / Khoáng chất**, và dòng trích dẫn “> Bavaria có câu nói…”. Làm bằng `indexOf` hai mốc rồi cắt; nếu thiếu một trong hai mốc thì không làm gì. |

### Giá bán và ngôn ngữ mua hàng

| Slug | find | replace |
|---|---|---|
| `giai-ma-vi-dang-thanh-bitburger-premium-pilsner-duc` | `<h3>Giá bán một két bia Bitburger Premium Pils chính hãng là bao nhiêu?</h3>\n<p>Tại biathaytu.com, một két 24 lon Bitburger Premium Pils 330ml có giá chính xác là 936.000đ và két 24 lon 500ml có giá là 1.200.000đ. Đơn hàng được miễn phí giao nhanh nội thành Hà Nội.</p>` (`\n` ở đây là ký tự xuống dòng thật) | *(rỗng)* |
| `bitburger-premium-pils-bia-draft-so-1-nuoc-duc` | `**Két 24 lon 330ml: 936.000đ** — trung bình chỉ 39.000đ/lon cho một dòng bia Pils #1 nước Đức.` + 2 ký tự xuống dòng | *(rỗng)* |
| `kham-pha-bia-thay-tu-benediktiner-weissbier-men-song-ettal` | `Bạn có thể đặt mua tại website biathaytu.com` | `Bạn có thể xem thông tin sản phẩm tại website biathaytu.com` |
| `dao-luat-tinh-khiet-1516-tuyen-ngon-dang-cap-bia-duc` | ` Đặt mua tại biathaytu.com để luôn an tâm nhận sản phẩm nhập khẩu nguyên đai nguyên kiện chính hãng.` | *(rỗng)* |
| `bia-thay-tu-la-gi-giai-dap-thac-mac` | `Bạn có thể đặt mua tại:` | `Bạn có thể tìm hiểu và liên hệ tư vấn qua:` |
| `bia-thay-tu-la-gi-giai-dap-thac-mac` | `<p>Giao hàng toàn quốc, ship COD mọi tỉnh thành.</p>` | *(rỗng)* |
| `bitburger-hanh-trinh-200-nam-bia-draft-so-1` | `→ Đặt mua Bitburger Premium Pils chính hãng` | `→ Xem thông tin Bitburger Premium Pils` |
| `huong-dan-chon-bia-duc-cho-nguoi-moi` | `Mua một <a href="/san-pham">Combo Mix 2 vị</a>` | `Bắt đầu với <a href="/san-pham">Combo Mix 2 vị</a>` |
| `cach-nuong-xuc-xich-thuringer-bratwurst-chuan-vi-duc` | `để đặt mua những khay xúc xích` | `để được tư vấn về những khay xúc xích` |
| `bi-quyet-chon-do-nham-bia-duc-xuc-xich-wiener` | `Chúng tôi cung cấp sỉ lẻ xúc xích fresh chất lượng cao và giao hàng hỏa tốc trong vòng 2 giờ tại nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM). ` | *(rỗng)* |
| `bi-quyet-chon-do-nham-bia-duc-xuc-xich-wiener` | ` để được hỗ trợ ship nhanh chóng nhất và nhận những ưu đãi hấp dẫn!` | ` để được tư vấn.` |

### Câu “Inbox” (lời kêu gọi kiểu Facebook, vô nghĩa trên website) — xóa trọn câu

| Slug | find | replace |
|---|---|---|
| `nhiet-do-thuong-thuc-bia-duc-ly-tuong-nhat` | `Inbox cho Bia Thầy Tu để nhận thêm nhiều tip hay về nghệ thuật thưởng thức bia nhập khẩu.` | *(rỗng)* |
| `bia-khong-con-bitburger-0-0-lua-chon-dang-cap` | `Inbox ngay cho chúng tôi để bổ sung Bitburger 0.0% vào danh sách đồ uống cho tủ lạnh nhà bạn.` | *(rỗng)* |
| `kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam` | `Inbox "THỬ" — team Bia Thầy Tu sẽ gửi báo giá set trải nghiệm lần đầu.` | *(rỗng)* |
| `su-khac-biet-giua-bia-den-dunkel-va-bia-vang-naturtrub` | `Inbox kèm mô tả gu của bạn — mình sẽ tư vấn cá nhân ngay.` | *(rỗng)* |
| `giai-thuong-itqi-3-sao-benediktiner-weissbier` | `Inbox ngay để Bia Thầy Tu mang tận tay bạn trải nghiệm hương vị 3 sao quốc tế này.` | *(rỗng)* |
| `luat-tinh-khiet-1516-reinheitsgebot` | `Inbox ngay cho Bia Thầy Tu để nhận gợi ý dòng bia phù hợp nhất với phong cách tiếp khách của bạn.` | *(rỗng)* |

Sau khi xóa câu “Inbox”, nếu thẻ bao ngoài (`<p><em>…</em></p>`) còn chữ phía trước thì giữ nguyên; nếu rỗng thì bước C.2.4 sẽ dọn.
