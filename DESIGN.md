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
  display: "Montserrat, sans-serif"      # thay cho Copperplate Bold (tiêu đề chiến dịch)
  sans: "Barlow, sans-serif"             # thay cho Trade Gothic (nội dung)
  condensed: "Barlow Condensed, sans-serif" # thay cho Trade Gothic Condensed (nhãn, nút, menu)
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
| Font tiêu đề, font nội dung | Font nhúng trong PDF chiến dịch: Copperplate Bold, Trade Gothic LT Std Condensed |

Copperplate và Trade Gothic là font thương mại, không có dấu tiếng Việt. Montserrat và Barlow là bản gần nhất trên Google Fonts có đủ dấu tiếng Việt.

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

## Chữ

- **Tiêu đề `h1`, `h2` và logo chữ:** Montserrat 700, IN HOA, giãn `0.03em`, line-height tối thiểu 1.2 để dấu chồng của chữ hoa tiếng Việt không chạm dòng trên.
- **Tiêu đề dạng câu dài** (bài viết, thẻ bài viết, `h2` trong nội dung bài): chữ thường.
- **`h3`–`h6`:** Montserrat 700, chữ thường.
- **Nội dung:** Barlow 400, 16px, line-height 1.6.
- **Nhãn, nút, menu:** Barlow Condensed, giãn `0.04em`.
- Độ đậm tối đa 700. Không dùng 800/900.

## Hình ảnh

- Chỉ dùng ảnh chính hãng: `public/images/products/official/`, `public/images/brand/benediktiner-official/`, `public/images/brand/bitburger-official/`. Mỗi thư mục có `SOURCES.md`.
- **Không dùng ảnh do AI tạo.** Ảnh AI vẽ sai nhãn chai (chữ vô nghĩa, sai tên hãng, sai khuôn mặt thầy tu trên huy hiệu).
- Ảnh sản phẩm tách nền đặt trên `--web-sky`, `object-fit: contain`, không cắt nhãn.

## Nội dung

Không dùng emoji, mũi tên `→` hay gạch ngang dài `—` trong nội dung hiển thị. Bài viết và sản phẩm lấy từ database được làm sạch tự động trong `scripts/dump_data.js` (xem `scripts/lib/editorial-clean.cjs`).

## Hiệu ứng

Không dùng: chữ gradient, quầng sáng (glow), vệt sáng quét (shimmer), animation lặp vô hạn (lơ lửng, nhấp nháy), thẻ kính mờ. Hiệu ứng mờ nền chỉ giữ cho header, menu mobile và nền popup.

## Bố cục

- **Container:** tối đa 1200px, lề 20px trên mobile.
- **Khoảng cách section:** 80px trên desktop, giảm dần trên mobile.
- **Nút:** bo góc 8px, chiều cao tối thiểu 44px.

## Khả năng truy cập

- Mọi phần tử tương tác phải có focus ring nhìn thấy được.
- Chữ đạt WCAG 2.1 AA (4.5:1, chữ lớn 3:1) trên mọi nền, kể cả điểm sáng nhất của gradient.
