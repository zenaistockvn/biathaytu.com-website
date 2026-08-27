# Prompt giao việc Sprint 1 — dán nguyên khối cho ChatGPT/Codex

---

Bạn là senior frontend engineer. Hãy sửa 4 lỗi trong repo GitHub `zenaistockvn/biathaytu.com-website`.

**Cách làm việc:**
- Tạo branch mới `fix/sprint1-critical-ui` từ `main`.
- Commit theo từng nhóm lỗi (4 commit riêng biệt, đừng gộp).
- Mở 1 pull request khi xong.
- Stack: Next.js 16 App Router + React 19, CSS thuần (không Tailwind), test bằng Vitest.
- Chạy `npm run build` và `npx vitest run` trước khi commit. **Không được để build đỏ.**

Bối cảnh: đây là website giới thiệu bia Đức cao cấp (tiếng Việt). Hệ màu định nghĩa trong `DESIGN.md` và biến CSS trong `src/app/web.css`. Nền tối dùng `--web-ink: #14241A`, chữ trên nền tối phải dùng `--web-on-ink: #F4F1E9`.

---

## LỖI 1 — Tiêu đề vô hình trên nền tối (55 trang)

### Nguyên nhân
`src/app/web.css` dòng 104–110 có:

```css
.web-app h1, .web-app h2, .web-app h3,
.web-app h4, .web-app h5, .web-app h6 {
  font-family: 'Playfair Display', serif !important;
  font-weight: 700;
  margin: 0;
  color: var(--web-text);   /* ← #14241A, specificity (0,1,1) */
  text-wrap: balance;
}
```

Selector này có specificity `(0,1,1)`, **thắng mọi class component đơn** `(0,1,0)`. Nên mọi nỗ lực đổi màu heading bằng một class đều thất bại trong im lặng. Ví dụ trong `src/app/(web)/components/GeoLocalCTA.tsx` dòng 46:

```css
.geo-cta-title { color: #ffffff; }   /* (0,1,0) — THUA, không có tác dụng */
```

Kết quả: `<h3>` màu ink `#14241A` nằm trên card nền ink `#14241A` → contrast **1:1**, chữ biến mất hoàn toàn. Trên `/bang-gia-si-dai-ly` người dùng thấy một khoảng đen trống ~200px ở đúng vị trí `<h1>`.

### Yêu cầu sửa

**Bước 1.** Trong `src/app/web.css`, đổi dòng `color: var(--web-text);` trong khối heading thành:

```css
color: var(--heading-color, var(--web-text));
```

**Bước 2.** Thêm khối mới ngay sau đó — khai báo màu heading **một lần cho mỗi vùng tối**:

```css
/* Vùng nền tối: heading và chữ tự động đảo màu */
.web-app .hero-dark,
.web-app .usp-bar,
.web-app .b2b-section,
.web-app .product-guarantee,
.web-app .knowledge-hero,
.web-app .web-footer,
.web-app .glass-card-dark,
.web-app .geo-cta-card,
.web-app [data-surface="ink"] {
  --heading-color: var(--web-on-ink);
}
```

**Bước 3.** Có **13 file** đặt nền ink bằng inline style (`background: 'var(--web-ink)'`) hoặc `<Section variant="dark">` — những chỗ này không có class nên selector trên không bắt được. Thêm thuộc tính `data-surface="ink"` vào thẻ `<section>` / `<Section>` tương ứng. Tìm bằng:

```bash
grep -rn "var(--web-ink)'" src/app --include=*.tsx
grep -rn 'variant="dark"' src/app --include=*.tsx
```

Với component `src/app/(web)/components/ui/Section.tsx`: khi `variant === 'dark'`, thêm luôn `data-surface="ink"` vào thẻ `<section>` để mọi lần dùng đều tự có.

**Bước 4.** Dọn các workaround không còn cần:
- `src/app/(web)/components/GeoLocalCTA.tsx`: xoá `color: #ffffff;` khỏi `.geo-cta-title`.
- Xoá các prop `color="white"` trên `<Heading>` nằm trong `<Section variant="dark">` (nay đã thừa).
- Trong `src/app/(web)/components/ui/Section.tsx`, đổi `inlineStyle.color = '#ffffff'` thành `'var(--web-on-ink)'` cho đúng `DESIGN.md`.

**Bước 5.** Sửa luôn màu chữ phụ trên nền tối. Nhiều chỗ đang dùng `var(--web-accent)` (`#2F5D3A`) làm chữ trên nền ink → contrast **2,12:1** (chuẩn AA cần 4,5:1). Trên nền ink phải đổi sang `var(--web-accent-on-ink)` (`#8FBF9C`, 7,8:1). Các vị trí đã xác định:
- `GeoLocalCTA.tsx`: `.geo-cta-badge { color: var(--web-accent) }` → `var(--web-accent-on-ink)`
- `GeoLocalCTA.tsx`: `.geo-cta-info-text strong` (đang `#4A7D55`, 3,36:1) → `var(--web-accent-on-ink)`
- `src/app/(web)/bia-duc-cho-nha-hang-khach-san/page.tsx` dòng 39: eyebrow `color: 'var(--web-accent)'` trên nền ink
- Quét thêm: `grep -rn "web-accent" src/app --include=*.tsx | grep -i "ink\|dark"`

### Nghiệm thu
Không còn heading nào có `color` trùng `background` của tổ tiên gần nhất. Kiểm tra thủ công 3 trang: `/bang-gia-si-dai-ly`, `/bia-duc-cho-nha-hang-khach-san`, và một bài bất kỳ trong `/kien-thuc/` (khối "Ghé Thăm Showroom Bia Thầy Tu" phải đọc được).

---

## LỖI 2 — Logo và menu vô hình trên hero tối (`/` và `/kien-thuc`)

### Nguyên nhân
`src/app/(web)/components/WebHeader.tsx` đặt màu qua inline style:

```tsx
const logoColor = headerOnDark ? '#fff' : 'var(--web-ink)';
const textColor = headerOnDark ? 'rgba(255,255,255,0.88)' : 'var(--web-text-secondary)';
<Link href="/" className="header-logo" style={{ color: logoColor }}>
<Link ... className="nav-desktop-link" style={{ color: textColor }}>
```

Nhưng `src/app/web.css` dòng 118 có `.web-app a { color: inherit !important; }`.

**`!important` trong stylesheet thắng inline style không có `!important`.** Giá trị đo thực tế bằng `getComputedStyle`:

| Phần tử | Ý định | Thực tế render |
|---|---|---|
| `.header-logo` | `#fff` | `rgb(20, 36, 26)` ← ink |
| `.nav-desktop-link` ×4 | `rgba(255,255,255,.88)` | `rgb(20, 36, 26)` ← ink |
| `.web-nav-hamburger` (là `<button>`) | `#fff` | `rgb(255,255,255)` ✔ |

Chữ ink trên ảnh hero tán lá sẫm → wordmark "Bia Thầy Tu" và cả 4 mục menu gần như không đọc được. Nút hamburger vẫn trắng bình thường **chỉ vì nó không phải thẻ `<a>`** — đó là dấu vân tay xác nhận nguyên nhân.

### Yêu cầu sửa

**Bước 1.** Trong `web.css` dòng 118, bỏ `!important`:

```css
.web-app a { color: inherit; }
```

**Bước 2.** Chuyển màu header sang class:

```css
.web-header--transparent .header-logo { color: #fff; }
.web-header--transparent .nav-desktop-link { color: rgba(255,255,255,.88); }
.web-header--solid .header-logo { color: var(--web-ink); }
.web-header--solid .nav-desktop-link { color: var(--web-text-secondary); }
```

**Bước 3.** Trong `WebHeader.tsx`, xoá `style={{ color: logoColor }}`, `style={{ color: textColor }}` và cả hai biến `logoColor` / `textColor`. Xoá luôn `style={{ color: ... }}` trên nút hamburger (đã có class xử lý).

**Bước 4.** Header trong suốt nằm trên ảnh chụp cần lớp scrim để đảm bảo contrast bất kể ảnh nền:

```css
.web-header--transparent { position: relative; }
.web-header--transparent::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: -1;
  background: linear-gradient(to bottom, rgba(20,36,26,.55), transparent);
}
```

### ⚠️ Cảnh báo hồi quy
Bỏ `!important` ở dòng 118 ảnh hưởng **toàn bộ thẻ `<a>` trên site**. Sau khi sửa, bắt buộc chạy lại `npm run build` và kiểm tra bằng mắt ít nhất: trang chủ, `/san-pham`, `/kien-thuc`, footer, và menu mobile. Nếu có link nào đổi màu ngoài ý muốn, sửa bằng cách thêm rule class cụ thể — **không được thêm `!important` trở lại**.

**Tiện thể:** thêm `aria-current="page"` cho mục menu đang active (hiện cả header desktop lẫn menu mobile đều không đánh dấu trang hiện tại).

---

## LỖI 3 — Ảnh 404 trên 47 trang Kiến thức

### Nguyên nhân
Tên file chứa dấu cách, dấu phẩy, ngoặc đơn và tiếng Việt → URL mã hoá không khớp khi đi qua `/_next/image`. File **có tồn tại trên đĩa** nhưng vẫn trả về 404.

### Yêu cầu sửa

**Bước 1.** Đổi tên (dùng `git mv` để giữ history):

| Từ | Thành |
|---|---|
| `public/images/products/the-wurst/general/ChatGPT Image 21_59_22 5 thg 7, 2026.png` | `.../general/the-wurst-bratwurst-01.png` |
| `public/images/products/the-wurst/general/ChatGPT Image 21_59_35 5 thg 7, 2026.png` | `.../general/the-wurst-wiener-01.png` |
| `public/images/products/the-wurst/cold_cut_150g/ChatGPT Image 22_04_22 5 thg 7, 2026 (1).png` | `.../cold_cut_150g/the-wurst-cold-cut-01.png` |

Trong `public/images/products/the-wurst/cold_cut_150g/` còn 4 file `ChatGPT Image … (2)…(5).png` chưa được tham chiếu ở đâu — đổi tên tiếp thành `the-wurst-cold-cut-02…05.png`.

**Bước 2.** Cập nhật mọi tham chiếu trong `src/data/articles.json` (các khoá `thumbnail_url` và các thẻ `<img>` nhúng trong `content`). Tìm bằng `grep -n "ChatGPT Image" src/data/articles.json`.

**Bước 3.** Bốn ảnh sau **thiếu hẳn file** trên đĩa, đang được tham chiếu trong `articles.json`:

```
/images/articles/top-5-dong-bia-bi.png
/images/articles/gia-bia-chimay-chinh-hang.png
/images/articles/so-sanh-bia-duc-bia-bi.png
/images/articles/hop-qua-tang-bia.png
```

Bạn không tạo ảnh được. Xử lý: **xoá khoá `thumbnail_url` của 4 bài đó** để card rơi về trạng thái không-ảnh một cách sạch sẽ, thay vì hiện icon ảnh vỡ. Liệt kê 4 bài này trong mô tả PR để team nội dung bổ sung sau.

**Bước 4.** Thêm hàng rào vào `src/app/(web)/asset-integrity.test.ts`: mọi đường dẫn ảnh cục bộ trong `src/data/*.json` phải (a) tồn tại trong `public/`, và (b) khớp regex `^\/[a-z0-9\/_.-]+$` (chỉ ASCII thường, không dấu cách).

---

## LỖI 4 — Thống nhất thông tin liên hệ (NAP)

### Nguyên nhân
Site đang có **2 địa chỉ và 3 số điện thoại** khác nhau. Khách đọc bài viết gọi số này, khách xem footer gọi số kia → lead rơi vào hai tài khoản Zalo khác nhau. Local SEO cũng bị ảnh hưởng vì NAP không nhất quán.

### Giá trị chuẩn — chủ site đã chốt

```
Showroom: 26 Vạn Phúc, Ba Đình, Hà Nội
Hotline:  0915 31 21 66
Zalo:     https://zalo.me/0915312166
```

Đây **đúng bằng giá trị đang có** trong `src/config/company.ts` — **không sửa file này**. Việc cần làm là bắt phần còn lại của codebase dùng theo nó.

### Yêu cầu sửa

**Bước 1.** Thay mọi giá trị hardcode. Có **20 file** chứa `0899` và **10 file** chứa `659A`:

```bash
grep -rln "0899" src --include=*.tsx --include=*.ts | grep -v test
grep -rln "659A" src --include=*.tsx --include=*.ts | grep -v test
```

Dùng helper có sẵn trong `src/config/company.ts`:

```tsx
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';

COMPANY_CONFIG.hotline          // '0915 31 21 66'  — hiển thị
COMPANY_CONFIG.showroomAddress  // '26 Vạn Phúc, Ba Đình, Hà Nội'
getCompanyTelHref()             // 'tel:0915312166' — có thể trả null
getCompanyZaloUrl()             // 'https://zalo.me/0915312166' — có thể trả null
```

Lưu ý `getCompanyTelHref()` và `getCompanyZaloUrl()` **có thể trả `null`** — xử lý nhánh null như `WebHeader.tsx` đang làm (fallback về `/lien-he`).

Các file cần sửa gồm (không giới hạn): `llms.txt/route.ts`, `GeoLocalCTA.tsx`, `ZaloCTA.tsx`, `ProductOrderActions.tsx`, `ProductConsultationForm.tsx`, `lien-he/page.tsx`, `ve-chung-toi/page.tsx`, `san-pham/page.tsx`, `bang-gia-si-dai-ly/page.tsx`, `qua-tang-bia-duc/page.tsx`, `bia-duc-cho-nha-hang-khach-san/page.tsx`, `bia-thay-tu-la-gi/page.tsx`, `bia-benediktiner-chinh-hang/page.tsx`, `bia-duc-nhap-khau/page.tsx`, `benediktiner-weissbier-naturtrub/page.tsx`, `bitburger-premium-pils/page.tsx`, `nhan-uu-dai/page.tsx`, `chung-nhan-nhap-khau-chinh-hang/page.tsx`, `FootballCampaignPopup.tsx`.

Nhớ sửa cả **metadata SEO** (`description`, `openGraph`, `twitter`) trong `lien-he/page.tsx` — có 3 chỗ nhắc số cũ.

**Bước 2.** `src/app/(web)/components/GeoLocalCTA.tsx` dòng 8 có `mapEmbedUrl` trỏ tới toạ độ 659A Lạc Long Quân. Cập nhật URL nhúng Google Maps sang địa chỉ 26 Vạn Phúc, Ba Đình, Hà Nội.

**Bước 3.** Sửa test đang đỏ. `src/lib/seo/business.test.ts` dòng 6 và 8 đang kỳ vọng giá trị **cũ**:

```ts
expect(BUSINESS.streetAddress).toBe('659A Lạc Long Quân');   // ← sai, sửa thành '26 Vạn Phúc, Ba Đình, Hà Nội'
expect(BUSINESS.phoneDisplay).toBe('0899.191.313');          // ← sai, sửa thành '0915 31 21 66'
```

`src/lib/seo/business.ts` đã dẫn xuất đúng từ `COMPANY_CONFIG` rồi — chỉ cần sửa kỳ vọng của test.

### ⚠️ Điều kiện tiên quyết (báo lại nếu chưa có)
Sau khi đổi, toàn bộ nút Zalo sẽ trỏ tới `zalo.me/0915312166`. **Tài khoản Zalo của số này phải đang hoạt động và có người trực.** Nếu bạn không xác nhận được, cứ làm tiếp và ghi rõ cảnh báo này trong mô tả PR.

---

## Ngoài phạm vi — đừng làm trong PR này

Repo hiện có **5 test đỏ**. Bạn chỉ sửa `business.test.ts` (lỗi thật, thuộc Lỗi 4). **Bốn test còn lại là test lỗi thời, để nguyên** — sẽ xử lý ở PR khác:

- `age-gate-a11y.test.ts` — focus trap của age gate đã bị gỡ khỏi source
- `footer-links.test.ts` — footer không còn link `/san-pham/<slug>`
- `mobile-first-regression.test.ts` — `floating-contact-stack` đã đổi tên thành `brand-contact-root`
- `product-data-regression.test.ts` — nhãn ưu đãi Combo Cold Cut đã bị gỡ

Cũng **không** đụng tới trong PR này: tối ưu dung lượng ảnh, banner cookie, layout trang sản phẩm, refactor UI kit, trang 404.

---

## Kiểm tra trước khi mở PR

```bash
npm ci
npm run build          # phải xanh
npx vitest run         # business.test.ts phải xanh; 4 test kia vẫn đỏ như cũ — đúng dự kiến
```

Chạy `npm start` rồi kiểm tra bằng mắt:

| Trang | Cần thấy |
|---|---|
| `/` | Wordmark "Bia Thầy Tu" và 4 mục menu **đọc rõ** trên hero tối |
| `/bang-gia-si-dai-ly` | `<h1>` "Chính Sách Đại Lý & Báo Giá Sỉ Bia Đức" **hiện ra** (trước đây là khoảng đen trống) |
| `/bia-duc-cho-nha-hang-khach-san` | `<h1>` hiện ra |
| `/kien-thuc/cach-nuong-xuc-xich-thuringer-bratwurst-chuan-vi-duc` | Tiêu đề "Ghé Thăm Showroom Bia Thầy Tu" đọc được; ảnh trong bài **không vỡ** |
| Footer mọi trang | Hotline hiển thị `0915 31 21 66`, địa chỉ `26 Vạn Phúc, Ba Đình` |

Xác nhận cuối: `grep -rn "0899\|659A" src --include=*.tsx --include=*.ts | grep -v test` phải **không trả về kết quả nào**.

## Mô tả PR cần ghi rõ

1. Bốn bài viết đã bị gỡ `thumbnail_url` (liệt kê tên bài) để team nội dung bổ sung ảnh.
2. Cảnh báo cần xác nhận tài khoản Zalo `0915312166` đang hoạt động.
3. Bốn test lỗi thời vẫn đỏ — cố ý, ngoài phạm vi PR này.
