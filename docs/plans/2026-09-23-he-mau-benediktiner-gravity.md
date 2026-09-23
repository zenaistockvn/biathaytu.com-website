# Kế hoạch: hoàn thiện hệ màu Benediktiner cho biathaytu.com

Người thực hiện: agent (Gravity). Người duyệt: chủ website.
Nhánh làm việc: `claude/compassionate-goodall-dizuq0` (hoặc `main` nếu nhánh này đã được merge).

---

## 0. Bối cảnh: đọc hết trước khi sửa

Website bán bia Đức cao cấp, thương hiệu chính là **Benediktiner**. Giao diện vừa được chuyển sang nhận diện chính hãng của Benediktiner (commit `05cca4b`, `8138148`). **Bảng màu đã chốt, không được đổi.** Việc còn lại là làm cho toàn bộ giao diện thực sự chạy bằng hệ token đó, và làm đồng nhất các bề mặt, header, trạng thái.

Nguồn sự thật, theo thứ tự ưu tiên:
1. `DESIGN.md`: quy tắc màu, chữ, ảnh, hiệu ứng.
2. Khối token `.web-app { ... }` ở đầu `src/app/web.css`: nơi **duy nhất** được phép viết giá trị màu.
3. `public/images/brand/*/SOURCES.md`: nguồn gốc màu và ảnh (ảnh chiến dịch "So close to heaven", logo, nhãn chai).

### Bảng màu (không đổi giá trị)

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--web-bg` | `#F4F1E9` | Nền trang (kem nhãn chai) |
| `--web-bg-section` | `#E9E5D8` | Section xen kẽ |
| `--web-bg-warm` | `#E4DFCF` | Khối nhấn nhẹ trên nền kem (hộp giá, thông số) |
| `--web-card-bg` | `#FFFFFF` | Thẻ trên nền sáng |
| `--web-text` / `--web-ink` | `#1C3157` | Chữ chính; nền dải tối phẳng |
| `--web-ink-deep` | `#152645` | Thẻ nằm trên dải tối |
| `--web-ink-soft` | `#2A4470` | Viền, phân cách trên dải tối |
| `--web-sky` | gradient `#1C3157 → #193D71 → #0A4A86` | Hero và dải tối đầu trang |
| `--web-text-secondary` | `#464E66` | Chữ phụ trên nền sáng |
| `--web-text-muted` | `#596077` | Chữ mờ trên nền sáng |
| `--web-accent` | `#004787` | Nút chính, link trên nền sáng |
| `--web-accent-hover` | `#003A6E` | Hover của nút chính |
| `--web-accent-soft` | `#2F6DB0` | Chỉ dùng cho viền và trang trí; **không dùng làm màu chữ trên nền tối** (2.4:1) |
| `--web-accent-bg` | `#E3EAF3` | Nền pill, nhãn trên nền sáng |
| `--web-on-ink` | `#FFFFFF` | Chữ chính trên dải tối |
| `--web-on-ink-muted` | `#C9D3E3` | Chữ phụ trên dải tối |
| `--web-accent-on-ink` | `#D6BD79` | Nhấn trên dải tối (vàng nhãn): link, nút chính, eyebrow |
| `--web-accent-on-ink-soft` | `#EFE3BC` | Hover của vàng nhãn |
| `--web-heritage` | `#7A6230` | Badge giải thưởng trên nền sáng |
| `--web-red` | `#C8202A` | Giảm giá, sắp hết hàng, lỗi, cảnh báo pháp lý |
| `--web-border` | `#CFC9B6` | Viền trên nền sáng |

**Quy tắc nhấn duy nhất:** nền sáng thì nhấn bằng `--web-accent`; nền xanh (`--web-ink`, `--web-sky`, `--web-ink-deep`) thì nhấn bằng `--web-accent-on-ink`. Không bao giờ đặt chữ `--web-ink` lên nền `--web-accent` (lỗi này từng xảy ra ở 16 chỗ).

### Trạng thái hiện tại (đo ngày 23/09/2026)

| Chỉ số | Giá trị | Lệnh đo |
| --- | --- | --- |
| Chữ dưới chuẩn WCAG AA trên trang render thật | **0** / 5.534 dòng chữ, 29 trang × 2 kích thước | `npm run audit:contrast` |
| Chữ tràn ngang | **0** ở 360/390/768/1024/1440 px | `npm run audit:overflow` |
| Test | 137 pass | `npm test` |
| **Màu viết cứng ngoài khối token** | **768** (CSS 582, inline TSX 181, `<style>` trong TSX 5) | `npm run audit:colors` |

Nghĩa là: màu đúng, chữ đọc được, nhưng **768 chỗ vẫn viết giá trị màu trực tiếp**. Lần đổi màu sau sẽ lại phải sửa tay từng chỗ và dễ lặp lại lỗi chữ tối trên nền tối. Kế hoạch này xử lý phần đó, cộng thêm 4 vấn đề thị giác còn lại:

1. **Header xám ngả tím.** `.web-header--solid` là kem trong suốt 88% cộng `saturate(180%)`. `DARK_HERO_PATHS` trong `WebHeader.tsx` chỉ có `/` và `/kien-thuc`, nên mọi landing page có hero xanh đều bị header kem trong suốt nằm đè lên màu xanh.
2. **Lớp phủ không thống nhất:** 4 sắc navy khác nhau cho cùng một việc: `rgba(28,49,87,a)`, `rgba(21,38,69,a)`, `rgba(17,32,62,a)`, `rgba(12,24,48,a)`.
3. **`.web-app a:hover { opacity: 0.85 }`** làm giảm tương phản của mọi link khi hover.
4. **Dải tối trên landing page** trộn gradient chéo 135° và màu phẳng một cách ngẫu nhiên.

---

## 1. Định nghĩa "xong"

Tất cả các điều sau phải đúng trên commit cuối cùng:

- [ ] `npm run audit:colors -- --strict` exit 0: **0 màu viết cứng** ngoài khối token (màu bên thứ ba đã được miễn trừ sẵn trong script).
- [ ] `npm run audit:contrast` exit 0: 0 chữ dưới AA.
- [ ] `npm run audit:overflow` exit 0.
- [ ] `npm test` pass, `npx tsc --noEmit` sạch, `npx eslint src` không thêm cảnh báo mới (hiện có 7 cảnh báo cũ, 0 lỗi).
- [ ] `npm run build` thành công.
- [ ] Header không còn dải xám trên bất kỳ trang nào có hero xanh.
- [ ] Test chặn tái phát (Phase 6) đã được thêm.
- [ ] `DESIGN.md` mô tả đúng hệ token mới (token kênh màu, bề mặt, header, trạng thái).
- [ ] Ảnh chụp trước và sau cho từng trang; mọi khác biệt thị giác đều có chủ đích và được liệt kê trong báo cáo cuối.

---

## 2. Quy tắc bắt buộc

**Không được làm:**
- Đổi giá trị hex của bất kỳ token nào ở bảng trên. Chúng lấy từ tài liệu chính hãng.
- Thêm sắc màu (hue) mới. Không dùng xanh lá: ở Việt Nam, bia màu xanh lá gợi đến Heineken. Nếu cần một mức trong suốt, dẫn xuất từ token có sẵn (Phase 1).
- Đụng vào màu thương hiệu bên thứ ba: nút Zalo (`#0068FF`, `#2EA3FF`, `#004BC1`), gọi điện (`#35D86A`, `#16A34A`, `#087C34`), Messenger (`#00C6FF`, `#0072FF`, `#9026FF`).
- Thêm chữ gradient, glow, shimmer, animation lặp vô hạn, nút gradient, thẻ kính mờ, emoji, mũi tên `→`, gạch ngang dài `—`, ảnh do AI tạo. `src/app/premium-brand-guard.test.ts` sẽ chặn.
- Sửa tay `src/data/articles.json` hoặc `src/data/products.json`. Chúng được sinh từ database qua `scripts/dump_data.js`.
- Chạy `scripts/dump_data.js` hoặc `npm run build` đầy đủ (lệnh này gọi dump_data và cần `DATABASE_URL` production). **Chỉ dùng `npx next build`.**
- Force push, rebase hoặc sửa lịch sử của nhánh đã push.

**Phải làm:**
- Đặt tên token và class theo **vai trò**, không theo màu (`--web-accent`, không phải `--web-blue`). Test `design-tokens.test.ts` cấm tên `--web-gold*`, `--web-navy*`.
- Mỗi phase là một commit riêng. Message tiếng Việt, tiền tố conventional (`refactor:`, `fix:`, `test:`, `docs:`).
- Sau mỗi file lớn: `npx next build && npm run audit:contrast`. Chữ phải đạt AA ngay lập tức, không để dồn tới cuối.
- Khi không chắc một màu nằm trên nền sáng hay tối: mở trang, xem bằng trình duyệt, đừng đoán.

---

## 3. Phase 0: chuẩn bị và lấy mốc

```bash
git fetch origin
git checkout claude/compassionate-goodall-dizuq0
git pull
npm ci
npx playwright install chromium
npx next build
npm test
mkdir -p .audit && npm run audit:colors > .audit/colors-before.txt
AUDIT_SHOTS=before npm run audit:contrast
npm run audit:overflow
```

Ghi lại 4 con số mốc (màu viết cứng, dòng chữ đo được, lỗi tương phản, số test). Ảnh chụp "trước" nằm ở `.audit/shots/before/` (thư mục `.audit/` đã bị gitignore).

Không commit gì ở phase này.

---

## 4. Phase 1: token kênh màu cho độ trong suốt

**Vấn đề:** CSS không thể viết `rgba(var(--web-ink), 0.5)` với token hex. Vì vậy có 339 giá trị `rgba()` viết cứng.

**Giải pháp:** thêm token kênh màu (các kênh RGB cách nhau bằng khoảng trắng) vào khối token trong `src/app/web.css`, ngay sau các token màu tương ứng:

```css
  /* Kênh RGB cho màu trong suốt: rgb(var(--web-ink-rgb) / 0.6). Luôn khớp với token hex cùng tên. */
  --web-ink-rgb: 28 49 87;               /* #1C3157 */
  --web-ink-deep-rgb: 21 38 69;          /* #152645 */
  --web-accent-rgb: 0 71 135;            /* #004787 */
  --web-accent-on-ink-rgb: 214 189 121;  /* #D6BD79 */
  --web-on-ink-rgb: 255 255 255;         /* #FFFFFF */
  --web-bg-rgb: 244 241 233;             /* #F4F1E9 */
  --web-border-rgb: 207 201 182;         /* #CFC9B6 */
  --web-red-rgb: 200 32 42;              /* #C8202A */
```

Thêm vào `src/app/contrast.test.ts` (hoặc `premium-brand-guard.test.ts`) một test kiểm tra mỗi token `-rgb` khớp đúng token hex cùng tên, để hai giá trị không bao giờ lệch nhau.

Viết lại các token bóng đổ để ngả navy thay vì đen (bóng tinh tế hơn):

```css
  --web-shadow: 0 2px 20px rgb(var(--web-ink-rgb) / 0.06);
  --web-shadow-md: 0 10px 40px -20px rgb(var(--web-ink-rgb) / 0.08);
  --web-shadow-lg: 0 8px 40px rgb(var(--web-ink-rgb) / 0.1);
  --web-shadow-xl: 0 25px 50px -12px rgb(var(--web-ink-rgb) / 0.25);
```

Lưu ý: `contrast.test.ts` và `design-tokens.test.ts` đọc khối token từ `.web-app {` tới dấu `}` đầu tiên. **Không được đặt dấu `}` trong comment** của khối token.

Commit: `refactor: thêm token kênh màu cho độ trong suốt và bóng ngả navy`

---

## 5. Phase 2: chuyển màu viết cứng trong CSS sang token

Thứ tự file (theo `npm run audit:colors`): `src/app/web.css` (398), `src/app/(web)/HomeBrand.module.css` (107), `src/app/brand-consistency.css` (41), `src/app/(web)/components/WebFooter.module.css` (17), `src/app/editorial-pages.css` (15), `src/app/mobile-overrides.css` (4).

`web.css` dài khoảng 6.000 dòng. Làm theo từng khối chú thích `/* ─── ... ─── */`, build và đo sau mỗi khoảng 1.000 dòng.

### 5.1 Bảng chuyển đổi: màu trong suốt

| Giá trị hiện tại | Thay bằng |
| --- | --- |
| `rgba(28, 49, 87, a)` | `rgb(var(--web-ink-rgb) / a)` |
| `rgba(21, 38, 69, a)`, `rgba(17, 32, 62, a)`, `rgba(12, 24, 48, a)`, `rgba(11, 17, 30, a)`, `rgba(36, 64, 110, a)` | `rgb(var(--web-ink-deep-rgb) / a)`: **gộp 5 sắc navy về 1** |
| `rgba(0, 71, 135, a)`, `rgba(21, 62, 117, a)` | `rgb(var(--web-accent-rgb) / a)` |
| `rgba(214, 189, 121, a)` | `rgb(var(--web-accent-on-ink-rgb) / a)` |
| `rgba(255, 255, 255, a)` làm **nền, viền, bóng** | `rgb(var(--web-on-ink-rgb) / a)` |
| `rgba(255, 255, 255, a)` làm **màu chữ** | **không dùng alpha**: `a ≥ 0.85` thành `var(--web-on-ink)`, còn lại thành `var(--web-on-ink-muted)` |
| `rgba(244, 241, 233, a)` | `rgb(var(--web-bg-rgb) / a)`; nếu là màu chữ thì áp quy tắc chữ như dòng trên |
| `rgba(207, 201, 182, a)`, `rgba(196, 198, 204, a)` | `rgb(var(--web-border-rgb) / a)` |
| `rgba(200, 32, 42, a)` | `rgb(var(--web-red-rgb) / a)` |
| `rgba(70, 78, 102, a)` | `rgb(var(--web-ink-rgb) / a)` |
| `rgba(0, 0, 0, a)` trong `box-shadow`, `text-shadow` | `rgb(var(--web-ink-rgb) / a)` hoặc token `--web-shadow*` nếu trùng giá trị |
| `rgba(0, 0, 0, a)` làm nền phủ (overlay, modal) | `rgb(var(--web-ink-deep-rgb) / a)` |

### 5.2 Bảng chuyển đổi: màu đặc

Quyết định theo **thuộc tính CSS** và **bề mặt phía sau**:

| Giá trị | `color:` | `background:` | `border:` |
| --- | --- | --- | --- |
| `#FFF`, `#FFFFFF` | trên dải tối: `var(--web-on-ink)` | `var(--web-card-bg)` | trên dải tối: `rgb(var(--web-on-ink-rgb) / a)`; trên nền sáng: `var(--web-card-bg)` |
| `#1C3157` | `var(--web-text)` | `var(--web-ink)` | `var(--web-ink)` |
| `#152645`, `#162A44`, `#142847` | | `var(--web-ink-deep)` | |
| `#24406E` | | `var(--web-ink-soft)` | `var(--web-ink-soft)` |
| `#004787` | `var(--web-accent)` | `var(--web-accent)` | `var(--web-accent)` |
| `#596077` | `var(--web-text-muted)` | | |
| `#C9D3E3` | `var(--web-on-ink-muted)` | | |
| `#C8202A` | `var(--web-red)` | `var(--web-red)` | |
| `#7A6230` | `var(--web-heritage)` | | `var(--web-heritage)` |
| `#F4F1E9`, `#F2EFE6`, `#F2EEE3`, `#F8F3E8`, `#F9F9F9` | | `var(--web-bg)` | |
| `#E9E5D8` | | `var(--web-bg-section)` | |
| `#E4DFCF`, `#E3DED0`, `#E7E2D2`, `#E5DFCF`, `#DED8C6` | | `var(--web-bg-warm)` | |
| `#CFC9B6`, `#D8D2C1` | | | `var(--web-border)` |
| `#000` | chữ trên nền vàng (badge 18+): `var(--web-ink)` | | |

Gộp các sắc kem gần giống nhau về token có thể làm màu lệch 1–3%. Chấp nhận được, nhưng phải kiểm tra bằng ảnh chụp.

Nếu gặp một giá trị **không có trong hai bảng**: dừng lại, xem nó hiển thị ở đâu, chọn token gần nhất theo vai trò, và ghi vào báo cáo cuối. **Không tạo token mới** nếu chưa hỏi.

### 5.3 Làm đồng nhất dải tối

Thay các gradient chéo 135° kiểu `linear-gradient(135deg, #152645 0%, #1c3157 100%)` trên landing page theo quy tắc sau:
- Section đầu tiên (hero) của mỗi trang: `background: var(--web-sky)`.
- Các dải tối tiếp theo: `background: var(--web-ink)` (phẳng).
- Thẻ nằm trên dải tối: `background: var(--web-ink-deep)`, viền `rgb(var(--web-on-ink-rgb) / 0.12)`.

Mỗi section tối phải có `data-surface="ink"` hoặc nằm trong danh sách selector ở đầu `web.css` (`.web-app .hero-dark, .web-app .usp-bar, ...`), để heading tự đổi sang `--web-on-ink`.

Commit theo file, ví dụ: `refactor: chuyển màu viết cứng trong web.css sang token (phần landing)`.

---

## 6. Phase 3: màu inline trong TSX

181 thuộc tính màu inline viết cứng trong 27 file, cộng 5 giá trị trong khối `<style>` của `GeoLocalCTA.tsx`. Thứ tự theo số lượng:

`AgeVerificationGate.tsx` (22), `AlcoholWarning.tsx` (18), `nhan-uu-dai/page.tsx` (18), `(bare)/chua-du-tuoi/page.tsx` (12), `food-pairing-bia-duc` (12), `huong-dan-rot-bia-lua-mi` (10), `thong-tin-mua-hang` (9), `dieu-khoan-su-dung` (8), `chinh-sach-kiem-soat-do-tuoi` (7), `chinh-sach-cookie/page.tsx` (6), `CookieConsent.tsx` (6), còn lại mỗi file 1–5.

Quy tắc:
1. **Tối thiểu:** thay giá trị viết cứng bằng `var(--web-*)` theo bảng ở Phase 2. Trang `(bare)/chua-du-tuoi` nằm trong `<div className="web-app">` (xem `src/app/(bare)/layout.tsx`), nên dùng được token.
2. **Nên làm:** mẫu lặp lại ở 12 trang biên tập (khung giới thiệu nền xanh và nút "Xem chi tiết") nên chuyển thành class dùng chung trong `src/app/editorial-pages.css`, ví dụ `.editorial-callout`, `.editorial-cta`. Đây là nơi lỗi chữ tối trên nền tối từng xảy ra 15 lần. Các file: `food-pairing-bia-duc`, `ve-chung-toi`, `chung-nhan-nhap-khau-chinh-hang`, `bom-bia-5l-benediktiner`, `bang-gia-si-dai-ly`, `qua-tang-bia-duc`, `bia-benediktiner-chinh-hang`, `bia-thay-tu-la-gi`, `huong-dan-rot-bia-lua-mi`, `bia-duc-cho-nha-hang-khach-san`, `san-pham/[slug]/page.tsx`.
3. Component `Heading`/`Text` đã có prop màu theo vai trò (`ink`, `accent`, `on-ink`, `on-ink-accent`). Dùng prop thay vì `style={{ color }}` khi có thể.

Commit: `refactor: chuyển màu inline trong TSX sang token`, và nếu làm bước 2: `refactor: gom khung giới thiệu và nút của trang biên tập thành class dùng chung`.

---

## 7. Phase 4: header, thanh điều hướng mobile, bề mặt

### 7.1 Header
File: `src/app/(web)/components/WebHeader.tsx`, `src/app/web.css` (`.web-header--solid`, `.web-header--transparent`).

1. `.web-header--solid`: nền **đặc** `var(--web-bg)`, bỏ `saturate(180%)`, viền dưới `var(--web-border)`. Có thể giữ `backdrop-filter: blur()` nhưng nền phải đặc tối thiểu 96%.
2. Mở rộng `DARK_HERO_PATHS` cho mọi trang có section đầu là dải xanh, để header ở trạng thái trong suốt tối khi đang ở đầu trang (giống trang chủ). Ứng viên cần kiểm tra từng trang bằng ảnh chụp: `/benediktiner-weissbier-naturtrub`, `/bitburger-premium-pils`, `/bia-duc-nhap-khau`, `/nhan-uu-dai`, `/benediktiner-dunkel`, `/bang-gia-si-dai-ly`, `/qua-tang-bia-duc`, `/thuong-hieu`, `/san-pham`, các trang `/kien-thuc/[slug]`, và các trang biên tập. Với route động (`/kien-thuc/...`), dùng `pathname.startsWith`.
3. Kiểm tra: ở đầu trang, logo và link header phải là `--web-on-ink` trên nền xanh. Khi cuộn xuống, header chuyển sang nền kem đặc với chữ `--web-ink`.

### 7.2 Thanh điều hướng dưới đáy (mobile) và nút "Liên hệ"
`.mobile-bottom-nav`: nền đặc `var(--web-bg)` thay vì kem trong suốt, để nội dung không lộ qua (hiện chữ của trang nhìn xuyên qua thanh này).

### 7.3 Trạng thái
- `.web-app a:hover { opacity: 0.85 }`: **bỏ opacity**. Thay bằng: link trong đoạn văn gạch chân (`text-decoration: underline; text-underline-offset: 3px`); link dạng nút giữ màu, chỉ đổi nền theo hover của nút.
- Nút chính trên nền sáng: `--web-accent` → hover `--web-accent-hover`. Nút chính trên dải tối: `--web-accent-on-ink` (chữ `--web-ink`) → hover `--web-accent-on-ink-soft`.
- Focus: `*:focus-visible` dùng outline 2px `--web-accent` trên nền sáng, `--web-accent-on-ink` trên dải tối (quy tắc đã có ở khoảng dòng 2080 của `web.css`; kiểm tra lại mọi section tối đều nằm trong danh sách selector).
- Form: viền input `--web-border`; focus viền `--web-accent`; lỗi dùng `--web-red`. **Không dùng xanh lá cho trạng thái thành công**; dùng `--web-accent` kèm chữ.
- Nút bị vô hiệu hoá: `opacity: 0.5` **chỉ** cho nút disabled, kèm `cursor: not-allowed`.

Commit: `fix: header đặc màu và trong suốt đúng trên hero xanh, trạng thái hover không làm giảm tương phản`

---

## 8. Phase 5: chạy lại và sửa phát sinh

```bash
npx next build
npm run audit:colors
npm run audit:contrast
npm run audit:overflow
npm test
```

Sửa mọi lỗi trước khi sang Phase 6. Nếu `audit:contrast` báo lỗi, file `.audit/contrast-report.json` có selector, màu chữ, màu nền và tỉ lệ của từng chỗ.

---

## 9. Phase 6: test chặn tái phát

Thêm vào `src/app/premium-brand-guard.test.ts`:

1. **Không màu viết cứng:** gọi `scan()` từ `scripts/audit/color-literals.cjs` (qua `createRequire`, giống cách file test đang gọi `editorial-clean.cjs`) và kỳ vọng mảng rỗng.
2. **Token kênh khớp token hex** (nếu chưa làm ở Phase 1).
3. **Mở rộng test "chữ ink trên nền accent":** hiện chỉ quét style inline trên cùng một dòng, nên đã bỏ sót lỗi trong khối `<style>` của `GeoLocalCTA.tsx`. Viết lại để quét cả CSS và khối `<style>`: mọi khối quy tắc có `background` là `var(--web-accent*)` thì `color` không được là `var(--web-ink)` hoặc `var(--web-text)`.
4. **`--web-accent-soft` không dùng làm `color:`** trên selector thuộc dải tối (hoặc đơn giản hơn: không dùng làm `color:` ở bất kỳ đâu).
5. **Không `opacity` trong `a:hover`.**

Tuỳ chọn, cần chủ website đồng ý: thêm `npm test` và `npx next build` vào CI (`.github/workflows/`, hiện chỉ có `tmp-build-check.yml`).

Commit: `test: chặn màu viết cứng, chữ ink trên nền accent và hover làm giảm tương phản`

---

## 10. Phase 7: tài liệu, ảnh chụp và báo cáo

1. Cập nhật `DESIGN.md`: token kênh màu và cách dùng `rgb(var(--x-rgb) / a)`, quy tắc bề mặt (Phase 2.3), header (Phase 4.1), trạng thái (Phase 4.3).
2. `AUDIT_SHOTS=after npm run audit:contrast`, rồi so từng cặp ảnh trong `.audit/shots/before/` và `.audit/shots/after/`.
3. Commit `docs: cập nhật DESIGN.md theo hệ token hoàn chỉnh`, rồi push.
4. Báo cáo lại cho chủ website bằng tiếng Việt:
   - Bảng số liệu trước và sau: màu viết cứng, lỗi tương phản, lỗi tràn chữ, số test.
   - Danh sách khác biệt thị giác có chủ đích, mỗi mục kèm trang và ảnh.
   - Những giá trị không nằm trong bảng chuyển đổi và cách đã xử lý.
   - Những gì chưa làm được và lý do.

---

## Phụ lục: lệnh hữu ích

```bash
npm run audit:colors                               # còn bao nhiêu màu viết cứng, ở file nào
npm run audit:colors -- --strict                   # exit 1 nếu còn
AUDIT_PAGES=/,/san-pham npm run audit:contrast     # đo nhanh vài trang
AUDIT_SHOTS=after npm run audit:contrast           # đo và lưu ảnh chụp
npx vitest run src/app/premium-brand-guard.test.ts # chỉ chạy test bảo vệ thương hiệu
```

Các script đo tự chạy `next start` ở cổng 3100 nếu chưa có server, và tự tắt khi xong. Nếu đang chạy `next dev` ở cổng khác: `AUDIT_BASE_URL=http://localhost:3000 npm run audit:contrast`. Lưu ý: kết quả đo trên `next dev` có thể khác bản build; điều kiện "xong" luôn đo trên bản build.
