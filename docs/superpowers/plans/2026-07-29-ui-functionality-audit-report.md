# Báo Cáo Audit Toàn Diện — Giao Diện & Chức Năng · biathaytu.com

> **Ngày audit:** 2026-07-29 · **Branch:** `feature/age-verification-and-compliance` (HEAD `61c549a`, có 18 file dirty)
> **Phạm vi:** toàn bộ `src/` (106 file, 17.200 dòng) + `public/` + config deploy + dữ liệu `src/data/`
> **Phương pháp:** đọc code + `next build` + `vitest` + `eslint` + `tsc` + **chạy thật dev server và đo bằng DOM/computed-style/network** (không suy đoán)
> **Plan thực thi:** `docs/superpowers/plans/2026-07-29-ui-functionality-implementation-plan.md`

---

## 1. Tóm tắt điều hành

Nền kỹ thuật **tốt**: Next.js 16 App Router, build sạch (119 trang), 70/70 test pass, tính tiền server-side chống sửa giá, NAP đã hợp nhất về `src/lib/seo/business.ts`, Facebook Pixel đã gate theo consent, `/blog` đã 301 sang `/kien-thuc`, focus-ring toàn cục đã có.

**Nhưng** với định vị "sản phẩm cao cấp", đang có **6 lỗi P0** mà mỗi lỗi đủ để làm mất khách hoặc gây rủi ro pháp lý — và nghịch lý là **3 trong số đó nằm ngay trong tính năng compliance vừa commit**: cổng xác minh tuổi bị popup quảng cáo bia che và bấm được xuyên qua, checkout hiển thị ghi chú pháp chế thay cho số tài khoản, và API đơn hàng không thực sự kiểm tra checkbox 18+.

| Mức | Nhóm vấn đề | Số mục | Ảnh hưởng |
|-----|-------------|--------|-----------|
| 🔴 **P0** | Chặn doanh thu / rủi ro pháp lý / hỏng ấn tượng đầu | 6 | Ngay lập tức |
| 🟠 **P1** | Mất doanh thu, SEO, khả năng tiếp cận, tính nhất quán thương hiệu | 11 | Trong 1–2 tuần |
| 🟡 **P2** | Chất lượng, nhất quán nội dung, nợ kỹ thuật | 24 | Theo sprint |

**Ba con số đáng chú ý nhất:**
- **18/34 SKU không thể tìm thấy** từ trang `/san-pham` (toàn bộ 9 rượu vang, 6 Bitburger, 3 combo) — trang catalog chỉ render 16 card.
- **9 trang canonical trỏ về trang chủ** (cả 7 trang chính sách + `/chua-du-tuoi` + `/nhan-uu-dai`) → Google sẽ loại chúng khỏi index.
- **34 trang sản phẩm đều phát ra đánh giá bịa** (`aggregateRating` sinh từ hash tên sản phẩm) trong khi website không có một review nào.

---

## 2. 🔴 P0 — Phải sửa trước tiên

### P0.1 — Popup bóng đá **che và vô hiệu hoá** cổng xác minh tuổi

`AgeVerificationGate` và `FootballCampaignPopup` **cùng `z-index: 99999`**, cùng `position: fixed; inset: 0`. Trong `src/app/(web)/layout.tsx`, popup được render **sau** cổng tuổi (dòng 94 vs dòng 84) → theo thứ tự paint, **popup nằm trên**.

Đo thật trên dev server (khách mới, chưa xác minh):

```
centreElement       : IMG.football-popup-img
centreClosestOverlay: "football"        ← popup thắng ở tâm viewport
ctaIsClickable      : true              ← nút "SẴN SÀNG CHO TRẬN TỐI NAY" bấm được
ctaHref             : https://zalo.me/0899191313?text=...Bitburger...1.150.000đ
gatePresent         : true              ← cổng tuổi vẫn tồn tại nhưng bị che hoàn toàn
```

**Hệ quả:** sau 1,5 giây, khách **chưa xác minh tuổi** (có thể dưới 18) nhìn thấy quảng cáo bia toàn màn hình **và đặt được hàng qua Zalo**. Cổng tuổi coi như không tồn tại. Đây là mâu thuẫn trực tiếp với mục đích của commit `61c549a`.

| File:line | Vấn đề |
|-----------|--------|
| `src/app/(web)/layout.tsx:84,94` | popup render sau gate, cùng cấp |
| `src/app/(web)/components/FootballCampaignPopup.tsx:11-21` | tự bật sau 1,5s trên **mọi** trang, không kiểm tra trạng thái tuổi |
| `src/app/web.css` (`.football-popup-overlay`) | `z-index: 99999` trùng gate |

**Ngoài ra popup còn:** không đóng bằng Escape, không đóng khi click nền, không lock scroll (nền vẫn cuộn), `role="dialog" aria-modal="true"` nhưng **không có accessible name**, không có ngày bắt đầu/kết thúc chiến dịch (sẽ hiện mãi), và cả 2 CTA đẩy sang Zalo → **bỏ qua toàn bộ luồng checkbox 18+ ở checkout**.

---

### P0.2 — Checkout hiển thị ghi chú pháp chế thay cho số tài khoản

Chuyển khoản là phương thức **được chọn sẵn**. Nội dung render thật tại `/dat-hang`:

```
Ngân hàng:     [CẦN PHÁP CHẾ XÁC NHẬN - Ngân hàng MB Bank / Techcombank]
Số tài khoản:  [CẦN PHÁP CHẾ XÁC NHẬN - Số tài khoản]
Chủ tài khoản: [CẦN PHÁP CHẾ XÁC NHẬN - Chủ tài khoản]
```

Nguyên nhân: `src/constants/compliance.ts:17-21` dùng chuỗi placeholder làm fallback, và `NEXT_PUBLIC_BANK_NAME` / `NEXT_PUBLIC_BANK_ACCOUNT` / `NEXT_PUBLIC_BANK_HOLDER` **không có trong `.env.local` lẫn `.env.example`** → gần như chắc chắn cũng thiếu khi deploy.

**Hệ quả:** khách đi hết phễu, đến bước trả tiền thì thấy ghi chú nội bộ. Không chỉ mất đơn — nó phá huỷ cảm nhận "cao cấp" ở đúng khoảnh khắc quyết định. Nhãn còn ghi "QR Code" nhưng không có QR nào.

---

### P0.3 — API đơn hàng **không thực sự** kiểm tra xác nhận 18+

`src/lib/orders/validation.ts:26-34` dùng `=== false`:

```ts
if (customer.purchaser_age_confirmed === false) { ... }   // undefined ⇒ ĐI QUA
if (customer.receiver_age_confirmed === false) { ... }    // undefined ⇒ ĐI QUA
if (customer.terms_agreed === false) { ... }              // undefined ⇒ ĐI QUA
```

Kiểm chứng bằng request thật (bỏ hẳn 3 field):

```
POST /api/order  { customer: {name, phone, address}, items: [...] }   ← không có field tuổi
→ 400 {"error":"Sản phẩm x không tồn tại hoặc lỗi giá"}
```

Lỗi trả về là ở **bước tính giá**, tức validation đã cho qua. Với `id` sản phẩm hợp lệ, đơn sẽ được **nhận** — và `src/app/api/order/route.ts:88` ghi cứng `age_verified: true`, `alcohol_delivery_required: true` vào bản ghi.

**Hệ quả:** hồ sơ compliance ghi "đã xác minh tuổi" cho đơn chưa hề xác nhận. Nếu bị kiểm tra, sổ ghi này **không có giá trị chứng minh** — tệ hơn là không có gì, vì nó sai một cách hệ thống.

---

### P0.4 — Bịa đánh giá sao (`aggregateRating`) trên toàn bộ 34 trang sản phẩm

`src/app/(web)/components/JsonLd.tsx:165-175` sinh rating từ **hash tên sản phẩm**:

```ts
const code = hashCode(product.name);
const ratingValue = (4.8 + (code % 3) * 0.1).toFixed(1); // luôn 4.8 / 4.9 / 5.0
const reviewCount = 15 + (code % 16);                     // luôn 15–30
```

Đo trên `/san-pham/kostritzer-schwarzbier-bom-5l`:

```json
"aggregateRating": { "ratingValue": 5, "reviewCount": 28, "bestRating": 5 }
```

Website **không có một review nào** ở bất kỳ đâu.

**Rủi ro kép:**
1. **Google:** vi phạm chính sách Review snippet (dữ liệu đánh giá phải do người dùng thật tạo và phải hiển thị được trên trang) → nguy cơ **manual action cho cả domain**, không chỉ mất rich result.
2. **Pháp lý:** đánh giá bịa là thông tin gây nhầm lẫn cho người tiêu dùng (Luật BVQLNTD 2023). Với thương hiệu cao cấp, đây là loại tin xấu đắt nhất.

Cùng file còn phát placeholder ra public: `hasMap: "…QcZ5nWhx4e164Placeholder"`, `sameAs: ["…@biathaytu-placeholder", "…cid=biathaytu-placeholder"]` (dòng 104, 116-117).

---

### P0.5 — Trang `/chua-du-tuoi` phục vụ quảng cáo bia cho người tự khai dưới 18

Trang tự viết: *"người dưới 18 tuổi không được phép tiếp cận thông tin quảng cáo, mua bán… sản phẩm đồ uống có cồn"* — nhưng vì nằm trong `(web)/layout.tsx`, HTML thực tế của nó chứa:

```
hasHeader: true · hasFooter: true · hasFloatingZalo: true · hasBottomNav: true
productLinks: ["/san-pham", "/san-pham/benediktiner-weissbier-naturtrub-500ml",
               "/san-pham/benediktiner-dunkel-500ml", "/san-pham/benediktiner-mix-2-v-thng-12-chai-500ml",
               "/san-pham/benediktiner-naturtrub-bom-5l", "/san-pham"]
zaloLinks: 3 · telLinks: 2 · footballPopupInHtml: true
```

Tức là: 4 link sản phẩm bia trực tiếp, 3 link đặt hàng Zalo, 2 link gọi điện, nav "Sản phẩm / Giỏ hàng", và cả markup popup quảng cáo. **Trang tự phản bác chính nó.** Thêm nữa nó `index, follow`, canonical về trang chủ và mang luôn `<title>` của trang chủ.

---

### P0.6 — Ảnh vỡ ở màn hình đầu tiên và trên một trang sản phẩm 850.000₫

| Ảnh thiếu | Nơi dùng | Hệ quả đo được |
|-----------|----------|----------------|
| `/images/logo.png` | `AgeVerificationGate.tsx:161` | `naturalWidth: 0` — **logo vỡ ngay ở màn hình đầu tiên mọi khách đều thấy**. Trong `public/` chỉ có `logo.jpg` và `images/logo_stitch.png`. |
| `/images/products/official/bitburger/kostritzer_keg.png` | `localProducts.ts:103` | `/san-pham/kostritzer-schwarzbier-bom-5l` **không có ảnh chính** (`naturalWidth: 0`); `Product` JSON-LD cũng trỏ vào URL 404 → Google Merchant/rich result sẽ loại. |

Thêm một vấn đề dữ liệu: `productImages.ts:10-13` map ảnh Köstritzer thiếu → **ảnh bom Bitburger**. Nghĩa là card combo Köstritzer đang hiển thị **ảnh sản phẩm của hãng khác**. Trên trang chi tiết thì `ProductGallery` không đi qua map này nên ra ảnh vỡ. Hai chỗ, hai hành vi khác nhau, không chỗ nào đúng.

---

## 3. 🟠 P1 — Ưu tiên cao

### P1.1 — **18/34 SKU không thể tìm thấy** từ trang catalog

Đo thật `/san-pham`: `productCards: 16`, `hasWineSection: false`, `hasComboSection: false`.

| Nhóm | SKU | Giá | Trạng thái trên `/san-pham` |
|------|-----|-----|------------------------------|
| Rượu vang Đức | 9 | 595.000 – 2.500.000₫ | ❌ Không có section nào |
| Bitburger | 6 | 620.000 – 1.150.000₫ | ❌ Bị `excludeBitburger: true` loại (`san-pham/page.tsx:52`) |
| Combo | 3 | 920.000 – 2.290.000₫ | ❌ `comboProducts` tính rồi **không render** (eslint: unused, dòng 55) |

Nghịch lý: trang chủ có tab "Rượu Vang Đức (9)", "Bia Bitburger & Khác (6)" và quảng cáo combo qua popup — nhưng khách bấm "Xem Toàn Bộ Sản Phẩm" thì tất cả **biến mất**. Pill nav của catalog cũng không có mục Vang/Bitburger/Combo. Commit `49de77e` ("Restore and complete Beer Sausage Combo feature on products pages") chưa hoàn tất.

### P1.2 — Hai link footer 404 trên **mọi** trang

`WebFooter.tsx:60-61` trỏ tới slug không tồn tại → `notFound()`:

| Link trong footer | Slug thật |
|-------------------|-----------|
| `/san-pham/benediktiner-weissbier-naturtrub-500ml` ❌ | `benediktiner-naturtrub-thung-12-chai-500ml` |
| `/san-pham/benediktiner-dunkel-500ml` ❌ | `benediktiner-dunkel-thung-12-chai-500ml` |

Đây là 2 sản phẩm chủ lực, và footer xuất hiện ở tất cả 119 trang.

### P1.3 — 9 trang canonical trỏ về **trang chủ**

`(web)/layout.tsx:33-38` đặt `alternates.canonical = BASE_URL`; **mọi trang không tự override đều thừa hưởng**. Kết quả kiểm tra 22 trang:

| Trang | canonical thực tế | `<title>` |
|-------|-------------------|-----------|
| `/chinh-sach-bao-mat`, `/chinh-sach-doi-tra`, `/chinh-sach-giao-hang`, `/chinh-sach-kiem-soat-do-tuoi`, `/chinh-sach-thanh-toan`, `/chinh-sach-cookie`, `/dieu-khoan-su-dung` | `https://www.biathaytu.com` ❌ | đúng |
| `/chua-du-tuoi` | `https://www.biathaytu.com` ❌ | **của trang chủ** ❌ |
| `/nhan-uu-dai` | `https://www.biathaytu.com` ❌ | **của trang chủ** ❌ |

Google sẽ hợp nhất 9 URL này vào trang chủ và loại nội dung của chúng. Với site rượu bia, việc **trang chính sách không index được** vừa là lỗ hổng SEO vừa là điểm yếu khi đối tác/cổng thanh toán rà soát. `/nhan-uu-dai` là landing thu lead nhưng không có cả title lẫn description riêng.

### P1.4 — Website đang mang **hai bộ nhận diện** khác nhau

Đo computed style:

| Trang | Background | Accent |
|-------|-----------|--------|
| `/`, `/san-pham` | `rgb(244,241,233)` đá ấm | `rgb(47,93,58)` xanh rừng |
| `/benediktiner-weissbier-naturtrub` | `rgb(7,11,18)` gần đen | `rgb(212,175,55)` vàng kim |
| Age gate, cookie banner | `#0f172a` / `#1e293b` slate | `#fbbf24` / `#d97706` amber |
| Checkout (inline) | `#f8fafc`, `#e2e8f0` slate | `#d97706` amber, `red` |

Định lượng trong `src/app/web.css` (5.744 dòng):
- **39** lần `#d4af37`, **44** literal `rgba()` vàng/navy/wine cũ, **748** `!important`
- **~1.600 dòng** CSS riêng cho từng landing (`.weissbier-landing`, `.bitburger-landing`, `.uudai-landing`) với palette tối+vàng
- Comment đầu file nói scope `.web-app` để chống `globals.css` ghi đè — **`globals.css` không còn tồn tại** trong repo. Toàn bộ chiến lược `!important` đang phòng thủ một file đã bị xoá.

Di chứng cụ thể, dễ thấy bằng mắt:
- `.btn-primary` nền xanh `#2F5D3A` nhưng **hover đổi sang nâu `#5c4a00`**, shadow `rgba(115,92,0,.25)` — nút CTA chính đổi màu hệ khi hover.
- `.icon-circle-gold`: nền gradient vàng `rgba(218,165,32,…)` + **viền xanh** `var(--web-gold)`.
- `.glass-card-dark`: viền vàng `rgba(218,165,32,.3)`, hover vàng.
- Focus ring của input checkout: `rgba(115,92,0,.25)` (ô-liu) trên site xanh.
- `.mobile-bottom-nav` nền `rgba(254,252,248,.96)` (trắng ấm cũ) trong khi trang là `#F4F1E9` → thanh nav trắng hơn nền.

**`DESIGN.md` tự mâu thuẫn:** frontmatter (vừa sửa) ghi `Be Vietnam Pro` + xanh; phần văn bản bên dưới vẫn nói Gold `#B8860B` + Navy `#0D1B2A` + `Playfair Display`; code thực tế nạp **Inter + Playfair**. Không có tài liệu nào là nguồn sự thật. DESIGN.md cũng ghi "DON'T use inline styles" trong khi `dat-hang`, `kien-thuc/[slug]`, `san-pham/[slug]`, `AgeVerificationGate`, `CookieConsent`, `AlcoholWarning` dùng inline style dày đặc.

*(Ghi chú: font **không** lỗi — đã xác minh `--font-serif: "Playfair Display", "Playfair Display Fallback"` và h2 computed đúng `Playfair Display`. Focus-ring toàn cục `.web-app :focus-visible` cũng **đã có**.)*

### P1.5 — SDK Facebook Messenger nạp **bất chấp** khách từ chối cookie tiếp thị

Đặt `cookie_consent_preferences = {essential:true, analytics:false, marketing:false}` rồi tải trang:

```
fbPixelScript : false        ← Pixel gate ĐÚNG ✅
fbSdkScript   : true         ← SDK Messenger vẫn nạp ❌
perfEntries   : ["https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js"]
fbRootPresent : true · fbChatPresent: true
```

`FacebookMessengerChat.tsx` không đọc consent. SDK này đặt cookie Facebook và cho phép theo dõi — đúng thứ mà cookie banner tồn tại để ngăn. Banner đang **hứa một điều mà hệ thống không thực hiện**.

### P1.6 — Checkout không dùng được với trình đọc màn hình, bất tiện trên mobile

| Đo được | Kết quả |
|---------|---------|
| Input text có label liên kết được | **0/7** (không `id`+`htmlFor`, không lồng trong `<label>`, không `aria-label`) |
| Input có `autocomplete` | **0/7** → mất autofill tên/SĐT/địa chỉ |
| Nút tăng/giảm số lượng | **32×32 px** (chuẩn 44) |
| Icon giỏ hàng ở header mobile | **24×24 px** |
| Target < 44px trên viewport 375 | **24/76** |

`DESIGN.md` yêu cầu "Minimum height for touch targets is 44px" — checkout, thanh điều hướng và footer đều không đạt. Vi phạm WCAG 3.3.2 (label) và 2.5.8 (target size).

### P1.7 — Regex số điện thoại sai (cả client và server)

`validation.ts:3` và `dat-hang/page.tsx:117`: `/^(0[3|5|7|8|9])+([0-9]{8})$/`
- `|` trong `[...]` là **ký tự literal**, không phải "hoặc" → `0|` là tiền tố hợp lệ
- `+` cho phép **lặp** cụm đầu → chấp nhận số 12 chữ số

Kiểm chứng qua API thật:

| Số nhập | Kết quả |
|---------|---------|
| `0\|12345678` | ✅ **đi qua** validation (lỗi ở bước sản phẩm) ❌ sai |
| `030312345678` | ✅ **đi qua** validation ❌ sai |
| `0912345678` | ✅ đi qua ✔ đúng |
| `1234567890` | ❌ bị chặn ✔ đúng |

Với ngành giao rượu bia, **SĐT người nhận là đầu mối xác minh tuổi khi giao** — số rác nghĩa là không giao được và không xác minh được.

### P1.8 — Đường ống nhận đơn: một điểm chết, không có dự phòng

- `googleSheets.ts:11-13` **throw** nếu thiếu `SHEETS_WEBHOOK_URL`/`SECRET`; `route.ts:99-110` biến lỗi này thành **502 cho mọi đơn**. Cả hai biến **không có trong `.env.local`** → checkout hiện tại hỏng 100% ở môi trường này; production phụ thuộc hoàn toàn vào biến môi trường trên host.
- **Không ghi DB**, không hàng đợi, không retry, không fallback email. Google Sheets/Apps Script gặp sự cố = mất toàn bộ đơn trong khoảng đó.
- Mã đơn `BTU-YYYYMMDD-<4 số random>` (`route.ts:34-41`): ~100 đơn/ngày ⇒ **~40% khả năng có trùng mã trong cùng ngày**.
- Rate limit lưu in-memory + `setInterval` ở module scope → vô hiệu trên serverless (mỗi instance một bộ đếm); `x-forwarded-for` giả mạo được.
- Không kiểm tra Origin/CSRF trên `POST /api/order`.

### P1.9 — 19/28 ảnh sản phẩm **hotlink từ CDN của bên thứ ba**

`product.hstatic.net/200000919029/...` (CDN Haravan của một shop khác) đang phục vụ ảnh cho:

- **Toàn bộ 8 SKU Benediktiner chủ lực** (thùng/két/lon/bom — sản phẩm bán chính)
- **Cả 9 rượu vang**
- **Cả 2 phụ kiện**

Chỉ 9 ảnh là asset nội bộ. Rủi ro: bên thứ ba đổi/xoá ảnh bất kỳ lúc nào → catalog trắng ảnh; không kiểm soát được chất lượng/khung hình; và về mặt thương hiệu, đây là ảnh marketplace chứ không phải bộ ảnh riêng của một thương hiệu cao cấp.

### P1.10 — Lỗi tương phản đã kiểm chứng (WCAG AA)

| Thành phần | Màu chữ / nền | Tỉ lệ | Cần | Ghi chú |
|-----------|---------------|-------|-----|---------|
| `.footer-links a` (toàn bộ nav footer, cả 7 link chính sách) | `#4A7D55` / `#14241A` | **3.36** | 4.5 | ❌ |
| `.footer-brand` "BIA THẦY TU" | `#4A7D55` / `#14241A` | **3.36** | 4.5 | ❌ 18px/700 |
| `.footer-18-badge` "18" | `#EF4444` / `#14241A` | **4.30** | 4.5 | ❌ chữ chỉ **8px** |
| `.disclaimer-text` (**cảnh báo 18+ bắt buộc**) | `#5D6B61` / `#E9E5D8` | **4.45** | 4.5 | ❌ |
| `.p-body` (body copy mọi `.section-alt`) | `#5D6B61` / `#E9E5D8` | **4.45** | 4.5 | ❌ |
| `.tab-count` | `#5D6B61` / `#E4DFCF` | **4.21** | 4.5 | ❌ |

Đáng chú ý: **cảnh báo pháp lý 18+ và toàn bộ link chính sách là những chữ khó đọc nhất trên site.**

### P1.11 — Cổng tuổi: không bẫy focus + thu thập dữ liệu cá nhân không cần thiết

Đo khi modal đang mở:

```
backgroundFocusableCount: 85     ← 85 phần tử phía sau vẫn focus được
mainInert: false · mainAriaHidden: null
activeAfterFocusBg: true         ← focus vào link phía sau THÀNH CÔNG
```

Escape đã bị chặn, nhưng **Tab thì không** → người dùng bàn phím / trình đọc màn hình đi thẳng qua cổng vào nội dung rượu bia. `aria-modal="true"` chỉ báo cho AT, không chặn Tab.

Về dữ liệu: cổng bắt nhập **họ tên đầy đủ + ngày sinh** để xem website. `ageVerification.ts` cố ý **không lưu** cả hai (đúng) — nghĩa là trường họ tên **không mang lại giá trị xác minh nào**, chỉ tạo ma sát và thu thập dữ liệu cá nhân vượt mức cần thiết (nguyên tắc tối thiểu hoá dữ liệu, Nghị định 13/2023). Với thương hiệu cao cấp, bắt khai tên trước khi được xem gì cả là rào cản chuyển đổi rất nặng.

Cổng còn render `<h1>` riêng → trang có **2 `<h1>`** khi cổng mở.

---

## 4. 🟡 P2 — Chất lượng & nợ kỹ thuật

**Đa ngôn ngữ (nghiêm trọng nhất trong P2)**
- Switcher hứa 3 ngôn ngữ nhưng `LanguageContext.tsx` chỉ có **~25 chuỗi**: nav, hero, trust bar, footer. Toàn bộ nội dung còn lại (sản phẩm, FAQ, chính sách, 47 bài viết, checkout) **vẫn tiếng Việt**. Khách EN/DE đổi ngôn ngữ và thấy… gần như không đổi gì.
- `<html lang="vi">` **không đổi** theo lựa chọn → sai a11y và sai tín hiệu SEO.
- Không có URL riêng (`/en`, `/de`) → không share được, không index được; `alternates.languages` chỉ khai `vi-VN`.
- **Hotline tiếng Đức là số đã bỏ:** `LanguageContext.tsx:116` → `'Hotline: +84 91 531 2166'` (số hiện tại: 0899.191.313).

**SEO / metadata**
- Trùng tên thương hiệu trong `<title>`: `"… — Bia Thầy Tu | Bia Thầy Tu"` — tất cả PDP, `/dat-hang`, `/kien-thuc`, `/thuong-hieu`, `/ve-chung-toi`, `/benediktiner-weissbier-naturtrub`. Có title dài 64–74 ký tự → bị cắt trên SERP.
- Thứ tự heading nhảy bậc: trang chủ **H1→H3** (usp-bar) và **H2→H4** (food pairing); PDP **H1→H4**.
- Breadcrumb JSON-LD ở `san-pham/page.tsx:60-61` dùng `https://biathaytu.com` (không `www`) trong khi canonical dùng `www` → lệch thực thể.
- Hai nguồn sitemap: `app/sitemap.ts` **và** `postbuild → public/sitemap.xml` (119 URL). File tĩnh trong `public/` trùng đường dẫn với route. Cả hai hardcode `lastModified = 2026-06-14` — **chậm 6 tuần** dù nội dung đã đổi trong tháng 7.
- Feed `google-merchant.xml`: chỉ `category === 'bia'` (**17/34 SKU**); thiếu `g:gtin`/`g:mpn`/`identifier_exists`, thiếu `g:shipping` → dễ bị disapprove; SKU không giá xuất `0 VND`; `image_link` có thể là URL hstatic hoặc URL 404.
- Cannibalization: landing `/benediktiner-weissbier-naturtrub`, `/benediktiner-dunkel`, `/bom-bia-5l-benediktiner`, `/bitburger-premium-pils` cạnh tranh trực tiếp với PDP `/san-pham/*` cùng chủ đề, cả hai đều trong sitemap (priority 0.9 vs 0.7).

**Dữ liệu sản phẩm**
- `bitburger-premium-pils` có `price: null` → card không giá, không nút "Mua Ngay" (chỉ Zalo), và trong feed Merchant là `0 VND`.
- 3 slug bị slugify hỏng, mất dấu tiếng Việt: `benediktiner-mix-2-v-thng-12-chai-500ml`, `b-6-cc-benediktiner-chnh-hng-500ml`, `m-bia-chnh-hng-benediktiner`. URL không đọc được trên site cao cấp.
- Tuyên bố tin cậy hardcode cho **mọi** sản phẩm có giá: `"✓ Còn hàng"`, `"⚡ Giao nội thành 24h"` (`ProductCard.tsx:154-158`); JSON-LD luôn `availability: InStock`; `priceValidUntil: '2027-12-31'` cố định. Không có dữ liệu tồn kho nào chống lưng.
- Mâu thuẫn số liệu thương hiệu: `1330` (lập tu viện) vs `1609` (bắt đầu ủ bia) vs khẩu hiệu **"Hơn 400 Năm"** đứng cạnh stat card "1330 — Khởi Nguồn" (1330 → 2026 là ~700 năm). FAQ trang chủ + FAQ schema liệt kê **chỉ 4 dòng sản phẩm** trong khi catalog có Festbier, Bitburger, Köstritzer, vang, xúc xích.

**UI / UX**
- `--web-mobile-bottom-nav-height: 60px` nhưng thanh nav render **75px** → `main { padding-bottom: 60px }` thiếu 15px, nội dung cuối bị che; floating Zalo (`bottom: 60+10`) **đè lên** thanh nav (đo: floating bottom 742 vs nav top 737).
- **3 lần ngắt liên tiếp** với khách mới: cổng tuổi → cookie banner → popup bóng đá. Cookie banner (`z-index 9999`) còn che thanh nav dưới và floating CTA trên mobile.
- **Hai widget chat cùng lúc** ở góc phải dưới: nút Messenger trong `FloatingZaloCTA` **và** bong bóng Facebook Customer Chat plugin.
- `FloatingZaloCTA` vừa dùng class `is-visible/is-hidden` (có transition) vừa set inline `display: none/flex` → **transition không bao giờ chạy**; không có `aria-expanded`; đã mở rồi thì không đóng lại được.
- `Toast` fixed `top:20 right:20` z-9999 → trên mobile **che hamburger và icon giỏ hàng**; không có `aria-live`/`role="status"` nên AT không thông báo "đã thêm vào giỏ"; `setTimeout` không clear → toast mới bị timer cũ tắt sớm.
- `AlcoholWarning`: 5 variant với 5 bộ màu hardcode không liên quan nhau (`#0d1117`/`#f1c40f`, `#fff9e6`/`#d97706`, `rgba(243,156,18)`, `#161b22`/`#e6edf3`); dùng `role="alert"` cho banner **tĩnh** (AT sẽ đọc chen ngang mỗi lần tải trang — nên dùng `role="note"`); `minHeight: '10%'` là CSS vô nghĩa.
- Thumbnail trong `ProductGallery` là `<div onClick>` — không focus/bấm được bằng bàn phím.
- `ProductTabs` có `role="tab"` nhưng thiếu quản lý `tabIndex` và điều hướng mũi tên (chuẩn WAI-ARIA Tabs).
- Header: hamburger dùng ký tự `☰`/`✕`, thiếu `aria-expanded`/`aria-controls`; menu mobile không bẫy focus, không đóng bằng Escape; **không có skip-to-content link**.
- `/lien-he` **không có form liên hệ** và không có bản đồ — chỉ Zalo + điện thoại. Khách B2B (nhà hàng/khách sạn/đại lý) không dùng Zalo, và khách EN/DE, không có đường nào để liên hệ. Trang còn hứa "phản hồi trong vòng 30 phút" không điều kiện.
- `san-pham/[slug]/page.tsx:273,301` dùng `<img>` thay vì `next/image`.

**Kỹ thuật / bảo mật**
- `ArticleBody.tsx:58` render nội dung DB bằng `dangerouslySetInnerHTML` **không sanitize** → vector stored-XSS qua attribute (`onerror=` trên `<img>`). Nội dung do script AI sinh, càng nên chặn.
- `.web-app` lồng trong `.web-app` ở `/kien-thuc/[slug]`, `/benediktiner-dunkel`, `/bom-bia-5l-benediktiner`, `/qua-tang-bia-duc`, `/food-pairing-bia-duc`.
- `Button variant="secondary" | "ghost"` map sang `.btn-secondary`/`.btn-ghost` — **hai class không tồn tại** trong web.css (hiện chưa ai dùng, nhưng là bẫy).
- Mã giảm giá `VIP10` (10%, `min_order_value: 0`, **không hết hạn**) + `FREESHIP` — **cộng dồn** với auto 5% (`pricing.ts:53`) ⇒ 15% cho mọi đơn, không giới hạn số lần dùng, không ghi `used_count`, mã dễ đoán.
- Ảnh nguồn quá nặng: PNG hero/food **2–2,9 MB mỗi file** (~60 MB trong `public/images/products`). Dev optimizer đã **fail** trên `lifestyle_garden_v2.png` (2,78 MB) → ảnh hero vỡ. Nên pre-optimize sang WebP/AVIF đúng kích thước.
- `npx tsc --noEmit` **fail**: `integrations.test.ts:6` thiếu 7 field compliance mới của `OrderRecord` → test tích hợp **không** kiểm payload compliance. (`next build` vẫn pass.)
- `netlify.toml` đặt `publish = ".next"` (Next.js trên Netlify cần runtime plugin, không publish thư mục thô) **và** có cả `vercel.json` → không rõ đích deploy.
- 40 eslint warning; `setState` trong effect ở 4 component; `catch {}` rỗng nhiều nơi (`dat-hang/page.tsx:148,224`).

---

## 5. Những gì đang làm tốt (giữ nguyên)

- Tính tiền **hoàn toàn server-side** từ dữ liệu server (`pricing.ts`) — chống sửa giá đúng cách.
- Facebook **Pixel** gate theo consent chính xác (đã kiểm chứng: không nạp khi `marketing:false`).
- NAP hợp nhất về một nguồn `src/lib/seo/business.ts`; `getBrandInfo` suy brand theo tên/category thay vì hardcode Benediktiner.
- `/blog` → `/kien-thuc` bằng `permanentRedirect` (301) — xử lý duplicate content đúng.
- Focus ring toàn cục `.web-app :focus-visible` + biến thể cho vùng tối.
- `prefers-reduced-motion` được tôn trọng ở `LandingHero` và `ScrollRevealObserver`.
- `robots.ts` mở cho toàn bộ bot AI; `scroll-margin-top: 100px` cho anchor dưới header fixed; tabs nav có `overflow-x: auto`.
- Font Inter + Playfair nạp và áp đúng (đã đo computed style).
- 70/70 test pass, `next build` sạch 119 trang.

---

## 6. Thứ tự đề xuất

| Bước | Nội dung | Vì sao trước |
|------|----------|--------------|
| **1** | P0.1, P0.3, P0.5 | Cổng tuổi phải thực sự chặn. Đây là rủi ro pháp lý, không phải bug UI. |
| **2** | P0.2, P0.6 | Khách không trả được tiền và ảnh vỡ ở màn hình đầu — mất đơn ngay hôm nay. |
| **3** | P0.4 | Mỗi ngày để rating bịa là thêm rủi ro manual action cho cả domain. |
| **4** | P1.1, P1.2 | Mở lại 18 SKU + sửa 2 link 404 — tác động doanh thu lớn nhất, công sức nhỏ. |
| **5** | P1.3, P1.5, P1.7, P1.8 | SEO/consent/dữ liệu đơn hàng — sửa nền móng trước khi đẩy traffic. |
| **6** | P1.4, P1.6, P1.10, P1.11 | Hợp nhất design system + a11y — việc "cao cấp" thật sự, cần thời gian. |
| **7** | P2 | Theo sprint. Ưu tiên i18n và bộ ảnh nội bộ. |

Chi tiết từng bước (test trước, code sau, lệnh verify) → `docs/superpowers/plans/2026-07-29-ui-functionality-implementation-plan.md`
