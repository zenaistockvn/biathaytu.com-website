---
name: Bia Thầy Tu Design System
description: Premium German Beer, theo nhận diện chính hãng Benediktiner
colors:
  primary: "#004787"      # Xanh trời Benediktiner (ảnh hero benediktiner-weissbier.de)
  primary-light: "#2F6DB0"
  primary-dark: "#003A6E"
  secondary: "#1C3157"    # Xanh đêm: đỉnh trời trong ảnh chiến dịch "So close to heaven"
  accent-on-dark: "#D6BD79" # Vàng nhãn chai, chỉ đặt trên nền xanh
  heritage: "#7A6230"     # Vàng đồng cho badge giải thưởng trên nền sáng
  danger: "#C8202A"       # Đỏ chữ "Weissbier" trên nhãn
  background: "#F4F1E9"   # Kem nhãn chai
  surface: "#FFFFFF"
  border: "#CFC9B6"
  text-main: "#1C3157"
  text-secondary: "#464E66"
  text-muted: "#596077"
typography:
  display: "Cormorant Garamond, serif"      # Tiêu đề di sản tu viện sang trọng (phong cách Chimay)
  sans: "Plus Jakarta Sans, sans-serif"     # Nội dung và UI thanh lịch, ấm áp, tối ưu tiếng Việt
  condensed: "Plus Jakarta Sans, sans-serif" # Đồng bộ nhãn, nút, menu thanh lịch
  base-size: "16px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "60px"
  2xl: "80px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "20px"
  full: "9999px"
components:
  button:
    primary:
      bg: "{colors.primary}"
      text: "#FFFFFF"
      radius: "{rounded.md}"
    on-dark:
      bg: "{colors.accent-on-dark}"
      text: "{colors.secondary}"
  card:
    bg: "{colors.surface}"
    border: "1px solid {colors.border}"
    radius: "{rounded.lg}"
---

## Nguồn gốc

Hệ thiết kế bám theo tài liệu chính hãng có trong repo, không tự phát minh:

| Yếu tố | Nguồn |
| --- | --- |
| Xanh đêm `#1C3157`, dải trời `--web-sky` | Ảnh chiến dịch `Bene_Weissbier_Kampagnenmotiv_EN_210x297_3.pdf` |
| Xanh trời `#004787` | Ảnh hero `brand/benediktiner-official/home-hero.jpg` (benediktiner-weissbier.de) |
| Vàng nhãn `#D6BD79`, đỏ `#C8202A` | Logo và nhãn chai Benediktiner |
| Font tiêu đề, font nội dung | Di sản tu viện châu Âu (chuẩn phong cách Chimay): Cormorant Garamond (tiêu đề trang nhã, quý tộc) và Plus Jakarta Sans (nội dung & nút bấm thanh lịch, tối ưu tiếng Việt) |

Cormorant Garamond kế thừa tinh thần di sản tu viện châu Âu cổ kính và nghệ thuật thủ công, trong khi Plus Jakarta Sans mang lại trải nghiệm đọc ấm áp, trong trẻo và hỗ trợ hoàn hảo hệ dấu tiếng Việt.

## Màu

- **Nền trang:** kem `#F4F1E9` (`--web-bg`), section xen kẽ `#E9E5D8` (`--web-bg-section`).
- **Hành động chính:** xanh trời `#004787` (`--web-accent`), chữ trắng.
- **Dải tối:** gradient trời `--web-sky` (xanh đêm `#1C3157` xuống `#0A4A86`), như bầu trời trong ảnh chiến dịch. Dùng cho hero, USP, B2B, kiến thức, footer, landing page.
- **Quy tắc duy nhất về điểm nhấn:** nền sáng nhấn bằng xanh trời; nền xanh nhấn bằng vàng nhãn (`--web-accent-on-ink`). Đúng như cách logo tự phối màu.
- **Đỏ** `#C8202A` chỉ dành cho giảm giá, sắp hết hàng và cảnh báo pháp lý.

**Chữ trên dải tối:** chỉ dùng ba token, không dùng trắng trong suốt tuỳ ý.
- Chữ chính: `--web-on-ink` (`#FFFFFF`)
- Chữ phụ: `--web-on-ink-muted` (`#C9D3E3`, tối thiểu 6.0:1 kể cả ở đáy gradient)
- Link, điểm nhấn: `--web-accent-on-ink` (`#D6BD79`, tối thiểu 4.9:1)

**Đặt tên token và prop theo vai trò, không theo màu.** Component `Heading`/`Text` nhận `ink`, `accent`, `on-ink`, `on-ink-accent`. Palette đổi thì chỗ gọi vẫn đúng. (Lần đổi palette trước, prop `color="gold"` và khối "nền accent, chữ ink" viết inline đã thành chữ tối trên nền tối ở 15 chỗ.)

### Token kênh màu và độ trong suốt

Khi cần độ trong suốt (alpha), toàn bộ hệ thống sử dụng cú pháp CSS hiện đại `rgb(var(--token-rgb) / alpha)`, không viết cứng `rgba(r, g, b, a)`. Các kênh trong token ngăn bằng **dấu cách** (`28 49 87`); viết dấu phẩy hoặc dùng `rgba(var(--token-rgb), a)` là CSS không hợp lệ, trình duyệt sẽ âm thầm bỏ qua.

| Token kênh màu | Giá trị RGB | Token hex tương ứng | Ứng dụng chính |
| --- | --- | --- | --- |
| `--web-ink-rgb` | `28 49 87` | `--web-ink` (`#1C3157`) | Bóng đổ (`box-shadow`, `text-shadow`) ngả navy tự nhiên, lớp phủ nhẹ |
| `--web-ink-deep-rgb` | `21 38 69` | `--web-ink-deep` (`#152645`) | Nền phủ modal/overlay, gradient che chắn phía trên header trong suốt |
| `--web-accent-rgb` | `0 71 135` | `--web-accent` (`#004787`) | Quầng sáng nút, viền focus ring, nền phụ bán trong suốt |
| `--web-accent-on-ink-rgb` | `214 189 121` | `--web-accent-on-ink` (`#D6BD79`) | Điểm nhấn viền hoặc nền nhẹ trên bề mặt tối |
| `--web-on-ink-rgb` | `255 255 255` | `--web-on-ink` (`#FFFFFF`) | Viền thẻ trên dải tối, nền thẻ bán trong suốt |
| `--web-bg-rgb` | `244 241 233` | `--web-bg` (`#F4F1E9`) | Nền kem bán trong suốt khi cần pha trộn |
| `--web-border-rgb` | `207 201 182` | `--web-border` (`#CFC9B6`) | Đường phân cách, viền bán trong suốt |
| `--web-red-rgb` | `200 32 42` | `--web-red` (`#C8202A`) | Nền thông báo lỗi/cảnh báo pháp lý bán trong suốt |

**Quy tắc bóng đổ:** Bóng đổ không dùng màu đen trung tính `rgba(0,0,0, a)`, mà sử dụng kênh navy `--web-ink-rgb` (`rgb(var(--web-ink-rgb) / a)`). Điều này tạo bóng đổ có chiều sâu và ấm áp, hòa hợp hoàn hảo với phong cách cao cấp của tu viện Benedictine.

### Quy tắc bề mặt (Surfaces)

Để website có nhịp điệu thị giác nhất quán và không bị loãng:
1. **Section đầu tiên (Hero):** Dùng `background: var(--web-sky)` (dải trời xanh chuyển từ xanh đêm `#1C3157` xuống `#0A4A86`).
2. **Các dải tối tiếp theo trên trang:** Dùng `background: var(--web-ink)` (xanh đêm phẳng `#1C3157`), không lặp lại gradient dải trời.
3. **Thẻ nằm trên dải tối:** Dùng `background: var(--web-ink-deep)` (`#152645`), viền `rgb(var(--web-on-ink-rgb) / 0.12)`.
4. **Khai báo ngữ cảnh bề mặt:** Mọi dải tối phải có thuộc tính `data-surface="ink"` hoặc nằm trong selector tối để các component con (Heading, Text, Button, Form) tự động áp dụng token chữ và focus tương ứng (`--web-on-ink`, `--web-accent-on-ink`).

### Header và thanh điều hướng

1. **Header cuộn (`.web-header--solid`):**
   - Nền **đặc** hoàn toàn `var(--web-bg)` (bỏ `saturate(180%)`), viền dưới `var(--web-border)`.
   - Khi người dùng cuộn trang, header giữ nền kem đặc với chữ `--web-ink` để nội dung trang cuộn bên dưới không bao giờ bị lẫn vào thanh điều hướng.
2. **Header trong suốt (`.web-header--transparent`):**
   - Chỉ kích hoạt khi đang ở đầu trang tại các route có hero tối trong `DARK_HERO_PATHS` hoặc route kiến thức (`/kien-thuc/*`).
   - Logo và link điều hướng hiển thị `--web-on-ink` (trắng).
   - Tích hợp gradient bảo vệ ở đỉnh (`rgb(var(--web-ink-deep-rgb) / 0.85)` xuống trong suốt) đảm bảo tỷ lệ tương phản chữ luôn đạt chuẩn WCAG AA ngay cả với ảnh hero nhiều chi tiết.
3. **Thanh điều hướng dưới đáy mobile (`.mobile-bottom-nav`):**
   - Nền đặc `var(--web-bg)`, viền trên `var(--web-border)`. Không dùng nền mờ/trong suốt để chữ của trang không bị nhìn xuyên qua.

### Trạng thái tương tác (Interaction States)

1. **Liên kết (Links):**
   - Không giảm `opacity` khi hover trên `.web-app a:hover` (tránh làm giảm tỷ lệ tương phản xuống dưới 4.5:1).
   - Link trong đoạn văn xuôi (`p a`, `li a`, `.prose a`) sử dụng gạch chân `text-decoration: underline; text-underline-offset: 3px`.
   - Link dạng nút hoặc card giữ nguyên màu chữ, chỉ chuyển đổi trạng thái nền.
2. **Nút chính (Primary Buttons):**
   - Trên nền sáng: nền `--web-accent` (`#004787`), chữ `--web-on-ink` (`#FFFFFF`) → hover sang `--web-accent-hover` (`#003A6E`).
   - Trên dải tối: nền `--web-accent-on-ink` (`#D6BD79`), chữ `--web-ink` (`#1C3157`) → hover sang `--web-accent-on-ink-soft` (`#E5D3A1`). Tương phản luôn > 6.0:1.
3. **Trạng thái Focus (`*:focus-visible`):**
   - Trên nền sáng: outline 2px solid `var(--web-accent)`, offset 2px.
   - Trên dải tối: outline 2px solid `var(--web-accent-on-ink)`, offset 2px.
4. **Form và ô nhập liệu:**
   - Viền mặc định: `var(--web-border)`.
   - Khi focus: viền `var(--web-accent)` và vòng hào quang nhẹ `rgb(var(--web-accent-rgb) / 0.2)`.
   - Khi lỗi: viền `var(--web-red)`.
   - Trạng thái thành công: **Tuyệt đối không dùng màu xanh lá**. Sử dụng nền nhẹ `var(--web-accent-bg)`, chữ `var(--web-accent)` kèm biểu tượng/thông báo rõ ràng.
5. **Nút bị vô hiệu hóa (Disabled):**
   - Áp dụng `opacity: 0.5` và `cursor: not-allowed`, `pointer-events: none` **chỉ** khi phần tử có thuộc tính `:disabled` hoặc `[aria-disabled="true"]`.

## Chữ

- **Tiêu đề `h1`, `h2` và logo chữ:** Cormorant Garamond 600–700, viết theo Title Case / Sentence Case tự nhiên, sang trọng, thanh thoát. Line-height 1.25–1.35 để các ký tự tiếng Việt có dấu bay bổng, không chạm dòng trên.
- **Tiêu đề dạng câu dài** (bài viết, thẻ bài viết, `h2` trong nội dung bài): chữ thường, mềm mại và dễ đọc.
- **`h3`–`h6`:** Cormorant Garamond 600, chữ thường.
- **Nội dung:** Plus Jakarta Sans 400, 16px, line-height 1.65.
- **Nhãn, nút, menu:** Plus Jakarta Sans 600, giãn nhẹ `0.02em - 0.05em`.
- Độ đậm tối đa 700. Không dùng 800/900.

## Hình ảnh

- Chỉ dùng ảnh chính hãng: `public/images/products/official/`, `public/images/brand/benediktiner-official/`, `public/images/brand/bitburger-official/`. Mỗi thư mục có `SOURCES.md`.
- **Không dùng ảnh do AI tạo.** Ảnh AI vẽ sai nhãn chai (chữ vô nghĩa, sai tên hãng, sai khuôn mặt thầy tu trên huy hiệu).
- Ảnh sản phẩm tách nền đặt trên `--web-sky`, `object-fit: contain`, không cắt nhãn.

## Nội dung

Không dùng emoji, mũi tên `→` hay gạch ngang dài `—` trong nội dung hiển thị. Bài viết và sản phẩm lấy từ database được làm sạch tự động trong `scripts/dump_data.js` (xem `scripts/lib/editorial-clean.cjs`).

## Hiệu ứng

Không dùng: chữ gradient, quầng sáng (glow), vệt sáng quét (shimmer), animation lặp vô hạn (lơ lửng, nhấp nháy), thẻ kính mờ. Hiệu ứng mờ nền chỉ giữ cho menu mobile và nền popup.

## Bố cục

- **Container:** tối đa 1200px, lề 20px trên mobile.
- **Khoảng cách section:** 80px trên desktop, giảm dần trên mobile.
- **Nút:** bo góc 8px, chiều cao tối thiểu 44px.

## Khả năng truy cập

- Mọi phần tử tương tác phải có focus ring nhìn thấy được (`--web-accent` trên nền sáng, `--web-accent-on-ink` trên dải tối).
- Chữ đạt WCAG 2.1 AA (4.5:1, chữ lớn 3:1) trên mọi nền, kể cả điểm sáng nhất của gradient.
- 0 lỗi tràn ngang trên toàn bộ các kích thước màn hình (360px, 390px, 768px, 1024px, 1440px).
