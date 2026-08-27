# Audit toàn diện UI/UX — biathaytu.com

**Ngày:** 27/08/2026
**Phạm vi:** 104 route (toàn bộ sitemap), 2 viewport (390×844 mobile, 1440×900 desktop)
**Phương pháp:** `next build` + `next start` (production build), crawl bằng Chromium/Playwright — đo contrast thực tế từ computed style, tap target, thứ tự heading, focus ring, tab order, page weight, và đối chiếu code với `DESIGN.md`.

---

## 0. Tóm tắt điều hành

Nền tảng thị giác của site là **tốt**: bảng màu rừng/kem, cặp font Playfair + Inter, hero trang chủ có sức thuyết phục, cấu trúc SEO/schema đầy đủ, có age gate và cảnh báo cồn đúng quy định. Vấn đề **không nằm ở gu thẩm mỹ mà ở tầng thực thi**: một quy tắc CSS toàn cục đang âm thầm ghi đè màu chữ do component khai báo, khiến **tiêu đề biến mất hoàn toàn trên nền tối ở hàng chục trang** — bao gồm cả `<h1>` của 2 landing page B2B và khối CTA showroom trên toàn bộ 47 bài kiến thức.

Ba con số đáng chú ý nhất:

| Chỉ số | Kết quả đo |
|---|---|
| Node chữ không đạt contrast WCAG AA | **809 node / 104 trang** (104/104 trang có lỗi) |
| Dung lượng ảnh tải về trên mobile (`/san-pham`) | **10,7 MB** (7,5 MB PNG + 2,8 MB JPEG) |
| Ảnh 404 / thiếu | 4 ảnh bài viết + 3 ảnh dùng chung trên **47 trang kiến thức** |

Toàn bộ phát hiện dưới đây đều có bằng chứng đo được (giá trị computed style, tỉ lệ contrast, kích thước px, screenshot), không phải nhận định cảm tính.

---

## 1. P0 — Nghiêm trọng (hỏng hiển thị, cần sửa ngay)

### P0-1. Tiêu đề vô hình trên nền tối — 1:1 contrast

**Nguyên nhân gốc (quan trọng nhất của cả bản audit):**

```css
/* src/app/web.css:104-110 */
.web-app h1, .web-app h2, .web-app h3,
.web-app h4, .web-app h5, .web-app h6 {
  color: var(--web-text);   /* #14241A — specificity (0,1,1) */
}
```

Quy tắc này có specificity `(0,1,1)`, **thắng mọi class component đơn** `(0,1,0)`. Vì vậy mọi nỗ lực đổi màu heading bằng một class đều thất bại trong im lặng:

```css
/* GeoLocalCTA.tsx:46 — lập trình viên viết #ffffff nhưng KHÔNG có tác dụng */
.geo-cta-title { color: #ffffff; }   /* (0,1,0) — thua */
```

Kết quả: `<h3>` màu ink `#14241A` nằm trên card nền ink `#14241A` → **contrast 1:1, chữ biến mất hoàn toàn**.

**Các vị trí đã xác nhận bằng screenshot:**

| Vị trí | Phần tử | Số trang |
|---|---|---|
| `.geo-cta-title` "Ghé Thăm Showroom Bia Thầy Tu" | `h3` | **47** |
| `<h1>` landing tối (`/bang-gia-si-dai-ly`, `/bia-duc-cho-nha-hang-khach-san`, `/bia-benediktiner-chinh-hang`, `/qua-tang-bia-duc`, `/food-pairing-bia-duc`, `/bia-thay-tu-la-gi`…) | `h1` | **8** |
| `<h3>` "Sẵn sàng trải nghiệm?", "Yên tâm thưởng thức" | `h3` | 3 |
| `.b2b-card-title`, `.weissbier-section-title`, `.bitburger-section-title` | `h2/h3` | 4 |

Trên `/bang-gia-si-dai-ly` và `/bia-duc-cho-nha-hang-khach-san`, người dùng nhìn thấy **một khoảng đen trống ~200px** ở vị trí lẽ ra là tiêu đề chính của trang.

**Đề xuất sửa (1 dòng CSS, xử lý gốc):**

```css
/* web.css — thay color: var(--web-text) bằng biến kế thừa được */
.web-app h1, .web-app h2, .web-app h3,
.web-app h4, .web-app h5, .web-app h6 {
  color: var(--heading-color, var(--web-text));
}

/* Mọi vùng tối chỉ cần khai báo 1 lần, heading tự động theo: */
.web-app .hero-dark,
.web-app .b2b-section,
.web-app .usp-bar,
.web-app .geo-cta-card,
.web-app .product-guarantee,
.web-app .knowledge-hero,
.web-app .web-footer,
.web-app [data-surface="ink"] {
  --heading-color: var(--web-on-ink);
  color: var(--web-on-ink);
}
```

Sau đó xoá `color: #ffffff` trong `.geo-cta-title` và bỏ `color="white"` rải rác trong các page — màu sẽ đến từ ngữ cảnh bề mặt thay vì từng lời gọi.

**Kiểm thử chặn hồi quy:** bổ sung vào `contrast.test.ts` một assertion: mọi heading nằm trong vùng `data-surface="ink"` phải có contrast ≥ 3:1.

---

### P0-2. Logo và menu điều hướng vô hình trên hero tối (`/` và `/kien-thuc`)

`WebHeader.tsx` đặt màu qua inline style:

```tsx
const logoColor  = headerOnDark ? '#fff' : 'var(--web-ink)';
const textColor  = headerOnDark ? 'rgba(255,255,255,0.88)' : 'var(--web-text-secondary)';
<Link href="/" className="header-logo" style={{ color: logoColor }}>
```

Nhưng `web.css:118` có:

```css
.web-app a { color: inherit !important; }
```

**`!important` trong stylesheet thắng inline style không có `!important`.** Giá trị đo thực tế:

| Phần tử | Ý định | Thực tế render |
|---|---|---|
| `.header-logo` | `#fff` | `rgb(20, 36, 26)` — ink |
| `.nav-desktop-link` ×4 | `rgba(255,255,255,.88)` | `rgb(20, 36, 26)` — ink |
| `.web-nav-hamburger` (là `<button>`, không dính rule) | `#fff` | `rgb(255,255,255)` ✔ |

Chữ ink đặt trên ảnh hero tán lá xanh sẫm → wordmark "Bia Thầy Tu" và cả 4 mục menu gần như không đọc được, **đúng trên 2 trang quan trọng nhất**. Đây cũng là lý do duy nhất nút hamburger vẫn trắng bình thường — nó không phải thẻ `<a>`.

**Đề xuất sửa:**

```css
/* Bỏ !important, chỉ reset màu mặc định */
.web-app a { color: inherit; }

/* Header dark-hero điều khiển bằng class thay vì inline style */
.web-header--transparent .header-logo,
.web-header--transparent .nav-desktop-link { color: #fff; }
.web-header--transparent .nav-desktop-link { color: rgba(255,255,255,.88); }
```

và xoá `style={{ color: ... }}` trong `WebHeader.tsx`.

Kèm theo: header trong suốt đặt trên ảnh chụp **cần một lớp scrim** để đảm bảo contrast bất kể ảnh nền:

```css
.web-header--transparent::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(20,36,26,.55), transparent);
  pointer-events: none;
}
```

---

### P0-3. Ảnh 404 trên toàn bộ khu vực Kiến thức

Ba file được tham chiếu ở `/kien-thuc` và **47 trang bài viết** trả về 404 do tên file chứa dấu cách, dấu phẩy, ngoặc đơn và tiếng Việt:

```
/images/products/the-wurst/general/ChatGPT Image 21_59_22 5 thg 7, 2026.png
/images/products/the-wurst/general/ChatGPT Image 21_59_35 5 thg 7, 2026.png
/images/products/the-wurst/cold_cut_150g/ChatGPT Image 22_04_22 5 thg 7, 2026 (1).png
```

File **có tồn tại trên đĩa** nhưng URL bị mã hoá không khớp khi đi qua `/_next/image`. Ngoài ra 4 ảnh hero bài viết thiếu hẳn file:

```
/images/articles/top-5-dong-bia-bi.png
/images/articles/gia-bia-chimay-chinh-hang.png
/images/articles/so-sanh-bia-duc-bia-bi.png
/images/articles/hop-qua-tang-bia.png
```

**Đề xuất:** đổi tên toàn bộ asset sang slug ASCII (`the-wurst-grill-01.webp`), thêm bước kiểm tra trong CI (`asset-integrity.test.ts` mở rộng: mọi `src` cục bộ phải tồn tại và khớp `^[a-z0-9/_.-]+$`), và bổ sung 4 ảnh còn thiếu.

---

### P0-4. 68% catalog phụ thuộc CDN bên thứ ba

**19/28 sản phẩm** lấy ảnh từ `product.hstatic.net` (CDN của nền tảng Haravan). Trong môi trường audit, toàn bộ 19 URL này không tải được và card rơi về placeholder **"Đang cập nhật hình"** — 19 ô trên `/san-pham`, 8 ô trên trang chủ.

> *Lưu ý trung thực:* môi trường audit chặn outbound tới hstatic nên **không kết luận được các URL này có 404 trên production hay không**. Cần kiểm tra lại trên môi trường thật. Tuy nhiên bản thân sự phụ thuộc đã là rủi ro: ảnh sản phẩm — tài sản thương hiệu cốt lõi của một site bia cao cấp — nằm ngoài quyền kiểm soát, và một thay đổi chính sách phía CDN sẽ làm trống 2/3 catalog.

**Đề xuất:** tải toàn bộ ảnh về `public/images/products/`, phục vụ qua `next/image`; giữ hstatic chỉ như nguồn dự phòng trong quá trình di trú.

---

## 2. P1 — Cao (ảnh hưởng chuyển đổi và độ tin cậy)

### P1-1. Thông tin liên hệ mâu thuẫn giữa các trang (NAP)

| Nguồn | Địa chỉ | Hotline |
|---|---|---|
| `config/company.ts` → footer, header "Tư Vấn", nút liên hệ nổi | 26 Vạn Phúc, Ba Đình | **0915 31 21 66** |
| `GeoLocalCTA.tsx` (47 trang), `/lien-he`, `llms.txt` | 659A Lạc Long Quân, Tây Hồ | **0899 19 13 13** |
| `ProductOrderActions.tsx`, `ProductConsultationForm.tsx`, banner `/san-pham` | — | **0899 191 313** (hardcode) |

Ngay cả định dạng địa chỉ cũng lệch nhau: *"Phường Xuân La, Quận Tây Hồ"* (GeoLocalCTA) vs *"Phường Tây Hồ"* (`/lien-he`).

Đây không chỉ là lỗi nội dung: khách đọc bài viết sẽ gọi số này, khách xem footer gọi số kia — **lead rơi vào hai tài khoản Zalo khác nhau**. Với local SEO, NAP không nhất quán trực tiếp làm giảm tin cậy của Google Business Profile.

Chính test trong repo đang tố cáo điều này:

```
FAIL src/lib/seo/business.test.ts > exposes the canonical NAP
  expected '26 Vạn Phúc, Ba Đình, Hà Nội' to be '659A Lạc Long Quân'
```

**Đề xuất:** chọn một NAP chính thức duy nhất, đưa hết về `COMPANY_CONFIG`, xoá mọi số hardcode, và giữ test này xanh như một hàng rào.

---

### P1-2. Dung lượng ảnh vượt ngưỡng chấp nhận được trên mobile

Đo trên viewport 390px, production build:

| Trang | Tổng tải | PNG | JPEG |
|---|---|---|---|
| `/san-pham` | **10 688 KB** | 7 470 KB | 2 835 KB |
| `/san-pham/[slug]` | **8 249 KB** | 7 470 KB | 400 KB |
| `/` | **3 166 KB** | 2 716 KB | — |
| `/kien-thuc/[slug]` | 214 KB | — | — |

Thư mục `public/images` nặng **516 MB**. Các file cực đoan:

- `benediktiner/glass_nobg.png` — **18,6 MB**
- `86480_bottle_nobg.png` — 4,9 MB
- `public/logo.png` — **3,8 MB**, được render ở kích thước **48×48px** trong header

Với người dùng 4G tại Việt Nam, một trang danh mục 10 MB là rào cản chuyển đổi lớn hơn bất kỳ vấn đề thẩm mỹ nào trong báo cáo này.

**Đề xuất:**
1. Chuyển toàn bộ sang AVIF/WebP, đặt trần 300 KB/ảnh sản phẩm, 150 KB/ảnh bài viết.
2. `logo.png` → SVG hoặc PNG 96×96 (< 10 KB).
3. Khai báo `sizes` chính xác cho mọi `next/image` trong grid (`sizes="(max-width:768px) 50vw, 33vw"`).
4. Thêm ngưỡng dung lượng vào CI để chặn ảnh > 500 KB lọt vào repo.

---

### P1-3. Contrast — 809 node lỗi trên 104/104 trang

Các cụm lỗi lớn nhất, sau khi đã loại bỏ phần tử ẩn:

| Tổ hợp màu | Tỉ lệ | Chuẩn | Số node | Ví dụ |
|---|---|---|---|---|
| `#2F5D3A` trên `#14241A` | **2,12:1** | 4,5 | 94 + 47 + 32 + 11 | "TRẢI NGHIỆM TRỰC TIẾP", "B2B DOANH NGHIỆP & HORECA", giá `2.290.000₫` |
| `#4A7D55` trên `#14241A` | **3,36:1** | 4,5 | 94 + 64 | "Showroom Hà Nội:", "Cam Kết Chất Lượng" |
| `#5D6B61` trên `#E4DFCF` | **4,21:1** | 4,5 | 64 + 48 + 32 | mô tả form tư vấn, "(không bắt buộc)", "Giá tham khảo…" |
| `#14241A` trên `#2F5D3A` | **2,12:1** | 4,5 | 12 | "Tóm tắt:", "Benediktiner Weissbier" |

Điều đáng nói: **`DESIGN.md` đã quy định đúng cách xử lý** — chữ trên nền ink phải dùng `--web-on-ink` (14,2:1), phụ đề `--web-on-ink-muted` (9,0:1), link `--web-accent-on-ink` (7,8:1). Code lại dùng `--web-accent` (#2F5D3A) làm chữ trên ink ở khắp nơi. Đây là lỗi *tuân thủ*, không phải lỗi *thiết kế*.

**Đề xuất:** thêm lint rule/test chặn `color: var(--web-accent)` trong mọi khối có `background: var(--web-ink)`, và nâng `--web-text-muted` từ `#5D6B61` lên `#4B5A50` để đạt 4,5:1 trên nền `--web-bg-warm`.

---

### P1-4. Tap target dưới 44px — vi phạm chính quy định của dự án

`DESIGN.md`: *"Minimum height for touch targets is 44px."* Thực tế đo được **58 phần tử vi phạm**:

| Phần tử | Kích thước |
|---|---|
| Link footer (chính sách, sản phẩm) | 358 × **20** px (72 lần) |
| Link "Chính sách Cookie" | 115 × **16** px |
| Nút cookie "Tùy chỉnh" / "Từ chối" / "Chấp nhận" | 88–139 × **31–33** px |
| `nav-desktop-link` ×4 | 53–89 × **22** px |
| Nút "Tư Vấn" (`btn-sm`) trên header | 79 × **37** px |
| Language switcher | 82 × **33** px |
| Nút Zalo/Gọi/Email trong footer | 58–91 × **42** px |

**Đề xuất:** đặt `min-height: 44px; display: inline-flex; align-items: center;` cho `.btn-sm`, link footer, nút cookie; hoặc dùng vùng chạm ảo bằng `::after { inset: -12px }` cho link trong danh sách dày.

---

### P1-5. Banner cookie phá vỡ hệ thống thương hiệu và chặn nội dung

`CookieConsent.tsx` dùng bảng màu **slate/amber của Tailwind**, không liên quan gì đến brand:

```
#0f172a  #1e293b  #334155  #475569  #94a3b8  #cbd5e1  #f8fafc  #fbbf24  #d97706
```

Hệ quả trực quan: một hộp thoại **xanh navy với nút cam** đặt giữa màn hình, trên một site có bảng màu rừng/kem. Trên mobile nó chiếm 245px của 844px (**29% viewport**), đè lên cả `mobile-bottom-nav` (z 46) và nút liên hệ nổi (z 45) vì đặt `z-index: 9999`.

Ngoài ra người dùng lần đầu phải vượt **hai lớp chặn liên tiếp**: age gate → banner cookie.

**Đề xuất:**
1. Chuyển sang token brand (`--web-ink`, `--web-on-ink`, `--web-accent`), bỏ hoàn toàn 9 mã hex Tailwind.
2. Đổi từ modal giữa màn hình sang **bottom sheet** không che nội dung; chừa chỗ cho bottom nav (`bottom: calc(var(--web-mobile-bottom-nav-height) + env(safe-area-inset-bottom))`).
3. Trì hoãn banner cookie đến sau khi age gate được vượt qua (~800ms) thay vì hiện chồng.
4. Nút ≥ 44px, thứ tự nút nhất quán (từ chối trái — chấp nhận phải), không xuống dòng lệch trên mobile.

---

### P1-6. Trang sản phẩm — CTA nằm dưới màn hình đầu tiên

- **Mobile 390×844:** khung ảnh trắng chiếm ~830px. Toàn bộ màn hình đầu tiên chỉ có breadcrumb + một chai bia nhỏ ở giữa khung trắng. Tên sản phẩm, giá và mọi nút hành động đều nằm dưới fold.
- **Desktop 1440×900:** cột phải hiển thị H1, giá, bảng thông số, ghi chú hương vị — **không có nút hành động nào trong màn hình đầu**.
- Bảng thông số bị vỡ nhịp: "Thùng 12 Chai 330ml" xuống 3 dòng trong khi các ô khác 1 dòng.
- Breadcrumb thiếu khoảng trắng trước dấu phân cách: `Trang chủ› Sản phẩm› Bitburger…`
- Dòng "Giá tham khảo — vui lòng liên hệ để được báo giá" đặt ở **10px** (dưới ngưỡng tối thiểu 12px) và mâu thuẫn với việc hiển thị giá chính xác `620.000₫` ngay bên trên.

**Đề xuất:** giảm chiều cao khung ảnh mobile xuống `max-height: 52vh`, đưa cụm `[Giá] + [Gọi ngay] + [Chat Zalo]` lên ngay dưới H1, dùng `grid-template-columns: repeat(auto-fit, minmax(120px,1fr))` cho bảng thông số, và làm rõ mô hình giá (giá niêm yết lẻ vs. giá sỉ liên hệ).

---

### P1-7. Form tư vấn không gửi đi đâu cả

```tsx
const handleSubmit = (event) => {
  event.preventDefault();
  window.open(`https://zalo.me/0899191313?text=${...}`, '_blank');
};
```

Người dùng điền 4 trường (họ tên, SĐT, email, nội dung) rồi… một tab mới mở ra. **Không có state thành công, không có thông báo lỗi, không có fallback.** Nếu trình duyệt chặn popup, hoặc máy không cài Zalo, hoặc người dùng đang ở desktop — lead mất trắng và người dùng không hề biết.

Tương tự, `/lien-he` **không có form nào** — chỉ có các nút deep-link Zalo.

**Đề xuất:** POST về endpoint đã có sẵn trong `.env.example` (`SHEETS_WEBHOOK_URL` / Telegram bot), hiển thị trạng thái `đang gửi → thành công → lỗi` ngay trong trang, và giữ Zalo như kênh phụ. Đánh dấu trường bắt buộc bằng `*`, dùng `aria-describedby` cho thông báo lỗi tiếng Việt.

---

### P1-8. Menu mobile thiếu hành vi cơ bản của một dialog

| Kiểm tra | Kết quả |
|---|---|
| `Escape` đóng menu | ❌ không |
| Bẫy focus (focus trap) | ❌ tab thứ 7 đã thoát ra trang nền |
| `role="dialog"` / `aria-modal` | ❌ không có |
| `aria-controls` trên hamburger | ❌ không có |
| Overlay phủ hết viewport | ❌ chỉ ~55% chiều cao, lộ trang nền phía dưới |
| Đánh dấu trang hiện tại (`aria-current`) | ❌ không có ở cả header desktop lẫn menu mobile |

Trớ trêu là `FootballCampaignPopup.tsx` — **component không được mount ở đâu cả** (183 dòng code chết) — lại có sẵn focus trap + Escape đúng chuẩn. Có thể bê nguyên logic đó sang.

---

### P1-9. Không có trang 404 / error / loading

Không tồn tại `not-found.tsx`, `error.tsx` hay `loading.tsx` trong toàn bộ `src/app`. URL sai hiển thị màn hình mặc định của Next.js với dòng chữ **tiếng Anh** *"This page could not be found."*, không có điều hướng quay lại, đặt lọt thỏm giữa header và footer thương hiệu.

**Đề xuất:** thêm `not-found.tsx` tiếng Việt có link về trang chủ / danh mục / hotline, `error.tsx` với nút thử lại, và skeleton cho `/san-pham`, `/kien-thuc`.

---

## 3. P2 — Trung bình (nợ kỹ thuật & tính nhất quán)

### P2-1. UI Kit chưa thực sự là design system

`Heading`, `Text`, `Section` **sinh ra inline style** thay vì class:

```tsx
if (color === 'gold')  inlineStyle.color = 'var(--web-accent)';   // "gold" → xanh lá?
if (color === 'navy')  inlineStyle.color = 'var(--web-ink)';      // "navy" → ink?
if (size === 'fluid')  inlineStyle.fontSize = 'clamp(28px, 5vw, 48px)';
```

Ba hệ quả:
1. **Không thể responsive theo ngữ cảnh** — media query không chạm được vào inline style.
2. **Tên prop nói dối** — `gold` trả về xanh rừng, `navy` trả về ink. Lập trình viên chọn `color="gold"` vì tưởng là vàng di sản và nhận về màu khác.
3. `Section variant="dark"` đặt `color: '#ffffff'` trong khi `DESIGN.md` yêu cầu `--web-on-ink` (`#F4F1E9`).

Ngoài ra `Button` khai báo `variant="secondary"` và `variant="ghost"` nhưng **`.btn-secondary` và `.btn-ghost` không tồn tại trong CSS** — variant chết trong API (hiện chưa dùng, nên chưa gây lỗi).

**Đề xuất:** đổi `Heading`/`Text` sang class (`.h-xl`, `.text-muted`…), đổi tên prop theo ngữ nghĩa (`primary` / `on-ink` / `muted` / `heritage`), và bỏ hai variant không có CSS.

### P2-2. Quy mô nợ kỹ thuật CSS

| Chỉ số | Số lượng |
|---|---|
| `style={{...}}` trong TSX | **761** |
| `!important` trong 4 file CSS | **861** (web.css 751, brand-consistency 46, editorial-pages 44, mobile-overrides 20) |
| Mã hex ngoài bảng màu trong TSX | **32 giá trị / 101 lần xuất hiện** |
| `web.css` | 5 818 dòng |

`legacy-palette.test.ts` chỉ quét `web.css`, nên toàn bộ màu lạc trong inline style TSX (`#0f172a` ×33, `#d4af37` ×5, `#f39c12` ×4…) lọt qua hàng rào.

### P2-3. Link không phân biệt được với chữ thường

```css
.web-app a { color: inherit !important; text-decoration: none !important; }
```

Link trong nội dung không khác chữ thường về **cả màu lẫn gạch chân** → vi phạm WCAG 1.4.1 (Use of Color). Ví dụ "Xem Chính sách kiểm soát độ tuổi" ở age gate, "Chính sách Cookie" trong banner.
**Đề xuất:** `.web-app main a:not([class]) { color: var(--web-accent); text-decoration: underline; text-underline-offset: 3px; }`

### P2-4. Thẻ `<h5>` rỗng trong footer desktop

`quickLinksBlock` được render 2 lần (desktop + accordion mobile). Ở desktop, tiêu đề nhóm bị ẩn nhưng thẻ `<h5>` vẫn chiếm **358×19px** → tạo khoảng trống lạ giữa "Quà tặng bia Đức" và "Kiểm soát độ tuổi", đồng thời để lại heading rỗng cho screen reader.

### P2-5. Test suite đang đỏ

```
Test Files  5 failed | 16 passed (21)
Tests       5 failed | 92 passed (97)
```

| Test | Ý nghĩa |
|---|---|
| `business.test.ts` | NAP mâu thuẫn (P1-1) |
| `age-gate-a11y.test.ts` | Focus trap của age gate đã bị gỡ khỏi source |
| `footer-links.test.ts` | Footer không còn link `/san-pham/<slug>` nào |
| `mobile-first-regression.test.ts` | `floating-contact-stack` đã đổi thành `brand-contact-root` |
| `product-data-regression.test.ts` | Nhãn ưu đãi Combo Cold Cut đã bị gỡ |

Ba test cuối là *test lỗi thời*, hai test đầu là *lỗi thật*. Cả hai loại đều cần xử lý trước khi CI có thể tin được.

### P2-6. Các điểm nhỏ hơn

- `GeoLocalCTA` **tiêm `<style>` toàn cục qua `dangerouslySetInnerHTML`** trên 47 trang — CSS không scope, lặp lại, không được Next tối ưu.
- **Emoji làm icon UI:** 🛡️ 🎁 💰 🍪 trong heading sản phẩm, 🇻🇳 trong language switcher (không render trên Windows), `☰`/`✕` làm nút menu — không tương xứng định vị "cao cấp".
- **`z-index` tuỳ hứng:** 0, 1, 2, 3, 10, 39, 45, 46, 49, 50, 9000, 9998, 9999, 100000. Cần thang token (`--z-header: 50`, `--z-overlay: 900`, `--z-modal: 1000`).
- **`--web-mobile-bottom-nav-height` khai báo hai giá trị** khác nhau: 60px (`web.css:64`) và 74px (`mobile-overrides.css:4`).
- **`transition: all`** trên `.btn-primary` và `.product-card-v2` khiến focus ring mất 300–400ms mới hiện — người dùng bàn phím thấy trễ.
- **Bề rộng dòng bài viết ~95 ký tự** ở 1440px (lý tưởng 60–75); chưa có mục lục, chưa có thanh tiến độ đọc.
- **Trang danh mục:** 590px chrome trước sản phẩm đầu tiên; không có bộ lọc/sắp xếp/đếm kết quả.
- **`min-height: 100vh`** (`web.css:79`) nên đổi sang `100dvh` để tránh nhảy layout khi thanh địa chỉ mobile ẩn/hiện.
- **`FootballCampaignPopup`** (183 dòng) + CSS + test đi kèm là code chết — nên xoá hoặc mount.

---

## 4. Lộ trình đề xuất

| Đợt | Nội dung | Ước lượng | Tác động |
|---|---|---|---|
| **Sprint 1 — Sửa hỏng** | P0-1 (biến `--heading-color`), P0-2 (bỏ `!important` trên `a`, thêm scrim), P0-3 (đổi tên asset + bổ sung 4 ảnh), P1-1 (thống nhất NAP) | 2–3 ngày | Khôi phục hiển thị trên ~60 trang |
| **Sprint 2 — Hiệu năng & chuyển đổi** | P0-4 (nội địa hoá ảnh), P1-2 (nén ảnh, `sizes`), P1-6 (CTA trên fold), P1-7 (form gửi thật) | 4–5 ngày | Giảm ~85% dung lượng, tăng tỉ lệ liên hệ |
| **Sprint 3 — Tiếp cận & tin cậy** | P1-3 (contrast), P1-4 (tap target), P1-5 (cookie theo brand), P1-8 (dialog menu), P1-9 (404/error/loading) | 4–5 ngày | Đạt WCAG 2.1 AA |
| **Sprint 4 — Nền tảng** | P2-1 (UI kit dùng class), P2-2 (gỡ inline style theo module), P2-5 (test xanh), P2-6 (dọn dẹp) | 1–2 tuần | Chặn tái phát |

**Hàng rào chống tái phát (nên làm cùng Sprint 1):**
1. Mở rộng `contrast.test.ts` sang crawl thật, ngưỡng AA, chạy trong CI.
2. Mở rộng `legacy-palette.test.ts` quét cả `*.tsx`.
3. Thêm `asset-integrity.test.ts`: mọi `src` cục bộ tồn tại + tên file ASCII.
4. Thêm ngưỡng dung lượng ảnh trong CI (500 KB).

---

*Báo cáo dựa trên production build tại commit `d7c7b20`, đo bằng Chromium 1194 qua Playwright trên 104 route.*
