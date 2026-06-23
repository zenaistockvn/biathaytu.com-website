# Báo Cáo Audit SEO & GEO — biathaytu.com (Bia Thầy Tu)

> **Ngày audit:** 2026-06-16 · **Phạm vi:** toàn bộ `src/app/` (Next.js 16 App Router) + `src/data/` + `src/lib/seo/`
> **Mục tiêu của chủ dự án:** Xuất hiện & được trích dẫn trên Google AI Overview, ChatGPT Search, Perplexity, Gemini, Claude.
> **Tài liệu liên quan:** Plan thực thi → `docs/superpowers/plans/2026-06-16-seo-geo-implementation-plan.md`

---

## 1. Tóm tắt điều hành (TL;DR)

Nền móng kỹ thuật **tốt hơn trung bình ngành**: đã có khung structured data, canonical đầy đủ mọi trang, `robots.txt` mở cho **tất cả** bot AI, 31 bài viết chất lượng. **Nhưng** đang tồn tại một nhóm lỗi **sai sự thật & mâu thuẫn nội bộ** trực tiếp phá hoại mục tiêu GEO — vì các engine AI 2026 **kiểm chứng tính chính xác *trước khi* trích dẫn**, và mâu thuẫn nội bộ là tín hiệu "đừng tin nguồn này".

**Phát hiện quan trọng nhất:** Plan `docs/superpowers/plans/2026-06-14-seo-geo-fixes.md` đã được viết nhưng **CHƯA được thực thi** — `src/lib/seo/business.ts` và `src/lib/seo/productPricing.ts` không tồn tại; mọi lỗi mà plan đó nhắm tới vẫn còn nguyên trong code.

| Mức | Nhóm vấn đề | Số mục |
|-----|-------------|--------|
| 🔴 **P0** | Sai sự thật & mâu thuẫn (AI mất tin tưởng + rủi ro chính sách Google) | 3 |
| 🟠 **P1** | SEO kỹ thuật nền tảng (ảnh hưởng rank top 10 → nền cho AI citation) | 7 |
| 🟡 **P2** | Tối ưu nâng cao & GEO/E-E-A-T | 9 |

**Số liệu đã xác minh từ dữ liệu thật:**
- `src/data/products.json`: **28 sản phẩm** = 17 bia (gồm ~6 biến thể Bitburger + 1 Köstritzer) + **9 rượu vang** + 2 phụ kiện.
- `src/data/articles.json`: **34 bài** = 31 published + 3 draft.
- **21 trang tĩnh** + 2 route động (`san-pham/[slug]`, `kien-thuc/[slug]`) + `dat-hang` (noindex) + `blog` (301 → `kien-thuc`).

---

## 2. Bối cảnh GEO 2026 (định hình thứ tự ưu tiên)

Ba sự thật mới nhất đã **đảo lại** một vài giả định phổ biến:

1. **`llms.txt` thực tế KHÔNG được AI nào dùng trong production.** Google (Mueller/Illyes 2025) xác nhận không đọc, ví như thẻ keywords lỗi thời; OpenAI/Anthropic/Meta cũng chưa dùng trong retrieval (tính đến Q1/2026). Ahrefs phân tích 137.000 site: **97% file `llms.txt` không bao giờ được đọc**. → Dự án đang duy trì **3 nguồn** `llms.txt` mâu thuẫn nhau (route động + 2 file tĩnh). Đây **không phải đòn bẩy** — chỉ cần dọn mâu thuẫn, **đừng đầu tư thêm** công sức.
2. **74% trích dẫn của Google AI Overview đến từ top 10 organic.** → SEO kỹ thuật truyền thống (P1) vẫn là *điều kiện cần* để được AI trích dẫn. Không có chuyện "bỏ SEO để làm GEO".
3. **AI kiểm chứng sự thật trước khi trích dẫn** và ưu tiên đoạn văn 134–167 từ tự đủ nghĩa. → Sửa P0 (nhất quán & đúng dữ liệu) chính là việc GEO **quan trọng nhất**.

Nguồn: [Search Engine Land — AI Overviews](https://searchengineland.com/guide/how-to-optimize-for-ai-overviews) · [Ahrefs — 97% llms.txt never read](https://ahrefs.com/blog/llmstxt-study/) · [Search Engine Roundtable — Google không endorse llms.txt](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html) · [Stridec — AI Overview ranking factors 2026](https://www.stridec.com/blog/google-ai-overview-ranking-factors/) · [Pixelmojo — GEO playbook ChatGPT/Perplexity](https://www.pixelmojo.io/blogs/geo-playbook-get-cited-chatgpt-perplexity-claude)

---

## 3. 🔴 P0 — Sai sự thật & mâu thuẫn (sửa trước tiên)

### P0.1 — Mâu thuẫn địa chỉ (NAP): "218 Đội Cấn" vs "659A Lạc Long Quân"
Địa chỉ chuẩn (chủ shop xác nhận) là **659A Lạc Long Quân, Phường Tây Hồ, Hà Nội**. Địa chỉ cũ **"218 Đội Cấn, Ba Đình"** vẫn còn ở **8 vị trí**, gồm những nơi AI/Google đọc đầu tiên:

| File:line | Ngữ cảnh |
|-----------|----------|
| `src/app/(web)/components/JsonLd.tsx:44` | **Organization schema** `streetAddress` ❗ |
| `src/app/(web)/components/JsonLd.tsx:177` | **FAQPage schema** (câu trả lời "mua ở đâu") ❗ |
| `src/app/(web)/page.tsx:343` | FAQ hiển thị trang chủ |
| `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx:58, 112` | nội dung + CTA |
| `src/app/(web)/ve-chung-toi/page.tsx:75, 95` | showroom + cơ sở |
| `src/app/(web)/lien-he/page.tsx:64` | body (metadata trang này lại đúng 659A) |
| `src/app/(web)/bia-thay-tu-la-gi/page.tsx:102` | mua hàng |

Trong khi `llms.txt` và metadata `/lien-he` ghi 659A. **Đây là mâu thuẫn thực thể nghiêm trọng nhất** — Google Business Profile + schema + nội dung phải khớp tuyệt đối thì AI mới dám đề xuất địa điểm.

### P0.2 — Số điện thoại cũ "+84-915-312-166"
Hotline đúng: **0899.191.313**. Số cũ còn ở:
- `src/app/(web)/components/JsonLd.tsx:51` — `contactPoint.telephone` của Organization schema ❗ (AI đọc đây làm số chính thức)
- `src/app/llms.txt/route.ts:41` — `0899.191.313 / +84 915 312 166`

> ⚠️ **Lỗ hổng test:** `src/app/seo-regression.test.ts:101` *tưởng* đang chặn số cũ, nhưng regex `/091\.531\.2166|0915312166/` **không khớp** định dạng thật `+84-915-312-166` / `+84 915 312 166`, và test chỉ quét `page.tsx` + `lien-he/page.tsx` (bỏ sót `JsonLd.tsx`, `llms.txt/route.ts`). Lỗi này lọt lưới.

### P0.3 — Product schema sai brand/giải thưởng/tiêu chuẩn cho >50% danh mục
`src/app/(web)/components/JsonLd.tsx:97-148` **hardcode cho MỌI sản phẩm**: `brand: "Benediktiner"`, `award: "iTQi Superior Taste Award 3 Stars 2022"`, `additionalProperty: "Reinheitsgebot 1516 (German Purity Law)"`.

Nhưng danh mục có ~16/28 sản phẩm **không phải** Benediktiner:
- **9 chai rượu vang** (Riesling, Spätburgunder, Thörle, Rappenhof, Austernkalk…) → bị gán "luật tinh khiết **bia**" + "giải **bia** iTQi" → **sai trắng trợn**, rủi ro vi phạm chính sách structured data của Google (có thể bị manual action / mất rich result toàn site).
- **~6 biến thể Bitburger** (Pilsner, kể cả bản 0.0% không cồn) + **1 Köstritzer** → gán nhầm brand và giải thưởng không thuộc về chúng.

`google-merchant.xml/route.ts:58-63` xử lý brand tốt hơn (nhận diện Bitburger/Köstritzer) nhưng JSON-LD trên trang sản phẩm thì không.

---

## 4. 🟠 P1 — SEO kỹ thuật nền tảng

| # | Vấn đề | Vị trí | Tác động |
|---|--------|--------|----------|
| P1.1 | **Product schema thiếu giá ở trang landing** — dùng `Offer` đơn, landing không truyền giá; nên dùng `AggregateOffer` (từ…đến…) cho dòng nhiều SKU | `JsonLd.tsx:114` + 4 landing sản phẩm | Mất rich result giá → giảm CTR & độ tin AI |
| P1.2 | **Freshness giả**: `lastModified: new Date()` cho 5 base route + 15 landing → đổi mỗi lần build | `sitemap.ts:25-79` | Tín hiệu "tươi" nhiễu |
| P1.3 | **8 title > 60 ký tự** bị cắt trên SERP — homepage **95**, `bia-thay-tu-la-gi` 77, `ve-chung-toi` 76, `thuong-hieu` 75, `horeca` 68, `bang-gia-si` 65, `bia-benediktiner-chinh-hang` 65, `bia-duc-nhap-khau` 61 | metadata các trang | Giảm CTR; mất từ khóa đuôi |
| P1.4 | **Cannibalization title**: `bia-benediktiner-chinh-hang` & `mua-bia-benediktiner-chinh-hang` cùng chứa "Bia Benediktiner Chính Hãng" | 2 trang | Cạnh tranh cùng truy vấn |
| P1.5 | **Meta description trùng cụm** ("chính hãng / nhập khẩu / iTQi 3 Sao 2022") lặp 10+ trang | metadata | Tín hiệu nội dung trùng |
| P1.6 | **3 nguồn `llms.txt` mâu thuẫn**: route động `/llms.txt` + `public/llms.txt` + `public/llms-full.txt` (priority URLs, sản phẩm, số ĐT khác nhau) | `llms.txt/route.ts`, `public/llms.txt` | Mâu thuẫn dữ liệu |
| P1.7 | **Root layout sai ngữ cảnh + thiếu `metadataBase`**: title "AMC × Bia Thầy Tu — **AI Marketing Center**", description về "hệ thống content marketing" | `src/app/layout.tsx:16-19` | `(web)` đã override nên user thường không thấy; **nhưng** đây là default cho `not-found` toàn cục & mọi route tương lai ngoài `(web)`; `metadataBase` chỉ có ở `(web)/layout`, không có ở root |

---

## 5. 🟡 P2 — Tối ưu nâng cao & GEO/E-E-A-T

| # | Vấn đề | Ghi chú |
|---|--------|---------|
| P2.1 | **Thiếu `LocalBusiness`/`Store` schema** — có showroom vật lý thật, chỉ mới khai `Organization`. Thêm `LocalBusiness` + `geo` + `openingHours` + `priceRange` → rất mạnh cho local + AI "mua bia đức ở Hà Nội ở đâu" | Ưu tiên cao trong P2 |
| P2.2 | **Thiếu `aggregateRating`/`Review` schema** — có 6 testimonial hiển thị ở homepage nhưng chưa gắn schema. **Chỉ gắn nếu review thật & hiển thị trên trang** (tránh manual action) | Thận trọng |
| P2.3 | **Mở rộng `FAQPage` schema** sang `bia-thay-tu-la-gi`, `food-pairing-bia-duc`, `huong-dan-rot-bia-lua-mi` — hiện chỉ homepage có. Đòn bẩy AI Overview / "People Also Ask" trực tiếp | |
| P2.4 | **OG image dùng chung** `sanh_bia_duc_cover.png` cho 17/21 trang (4 trang đã có riêng) | Giảm CTR khi share |
| P2.5 | **Trang mỏng + mồ côi**: `qua-tang-bia-duc`, `bang-gia-si-dai-ly`, `bia-duc-cho-nha-hang-khach-san` ít liên kết nội bộ trỏ tới + nội dung ngắn; landing không cross-link tới bài `kien-thuc` liên quan | Khó rank + thiếu topical cluster |
| P2.6 | **9 sản phẩm vang thiếu `abv` + `volume`** (null) → schema/feed thiếu thông tin | Data quality |
| P2.7 | **Merchant feed** thiếu `g:gtin`/`g:mpn`/`g:identifier_exists`/`g:product_type`; vang & phụ kiện không có feed; 1 sản phẩm `price=null` → `out_of_stock` | |
| P2.8 | **Chưa cấu hình Google Search Console verification** (đang comment ở `(web)/layout.tsx:66`) | Cần để theo dõi + submit sitemap |
| P2.9 | **E-E-A-T tác giả yếu** (`getArticleSchema` author mặc định Person "Bia Thầy Tu"); **không có hreflang/bản tiếng Anh thật** (LanguageSwitcher đổi client-side → AI hỏi tiếng Anh chỉ thấy bản tiếng Việt) | Đầu tư lớn, giai đoạn sau |

---

## 6. ✅ Điểm mạnh đã có (giữ nguyên — đừng phá)

- **`robots.ts` mở cho mọi bot AI** (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `cohere-bot`) — `robots.ts:17-33`. Nền tảng GEO mà nhiều site bỏ quên — dự án làm đúng.
- **Canonical riêng cho mọi trang**, nhất quán `www.` (đã kiểm 21 trang).
- **`(web)/layout.tsx`** chuẩn: `metadataBase`, title template `%s | Bia Thầy Tu`, OG, twitter, keywords, robots, `inLanguage: vi-VN`.
- **H1 đúng 1/trang**, hierarchy H2/H3 sạch trên mọi landing.
- **`/blog` → 301 `permanentRedirect`** sang `/kien-thuc` (có test regression bảo vệ) — không trùng lặp.
- **`/dat-hang`** đặt `index: false, follow: false` + canonical riêng — đúng (checkout không nên index).
- **Homepage có FAQ hiển thị (`<details>`) + FAQ schema khớp nhau** — chỉ cần sửa địa chỉ bên trong.
- **31 bài viết published nội dung thực chất** (~800 từ) — nền content tốt cho GEO.
- Sitemap / llms / merchant feed đọc từ data layer chung (`src/lib/data/`).

---

## 7. 🤖 Đòn bẩy GEO (để được AI Overview / ChatGPT / Perplexity trích dẫn)

Theo thứ tự ROI:

1. **Sửa P0 (đúng sự thật + nhất quán)** — việc GEO #1. AI verify rồi mới cite.
2. **Rank top 10 organic** (74% citation AI Overview từ đó) → P1 + nội dung sâu.
3. **Cấu trúc Q&A tự đủ nghĩa** — mỗi câu hỏi có đoạn trả lời 130–170 từ; mở rộng FAQPage schema (P2.3). Định dạng AI "bê nguyên" vào câu trả lời.
4. **Freshness thật** — cập nhật bài viết, hiển thị ngày publish/updated; cân nhắc gắn "2026" vào title bài kiến thức (Perplexity +~30% citation; nội dung <30 ngày được cite 82%).
5. **E-E-A-T** — tác giả thật có hồ sơ, trích dẫn nguồn (link iTQi sẵn có là tốt), chứng nhận nhập khẩu.
6. **Off-page (ngoài code, nhưng quyết định ChatGPT)**: ChatGPT dùng link graph làm "thước đo sự thật" và **Wikipedia chiếm ~48% citation**. → Tạo thực thể **Wikidata**, tối ưu **Google Business Profile** (review thật), backlink báo chí/blog ẩm thực. **ROI cao nhất** cho mục tiêu "xuất hiện trên ChatGPT".

---

## 8. Lộ trình đề xuất

- **Giai đoạn 1 (P0):** nguồn NAP duy nhất + brand động + bỏ số cũ + sửa schema vang/Bitburger. Phần lớn code đã có trong plan `2026-06-14-seo-geo-fixes.md` (Task 1–8).
- **Giai đoạn 2 (P1):** giá AggregateOffer, freshness sitemap, rút gọn title, phân hóa cannibalization, gộp llms.txt, sửa root layout.
- **Giai đoạn 3 (P2/GEO):** LocalBusiness schema, mở rộng FAQ schema, GSC, internal linking, off-page/Wikidata.

→ **Chi tiết task + prompt cho Antigravity:** `docs/superpowers/plans/2026-06-16-seo-geo-implementation-plan.md`
