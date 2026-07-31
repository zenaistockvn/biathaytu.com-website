---
name: Bia Thầy Tu Design System
description: Premium German Beer Retail Platform Design System
colors:
  primary: "#2F5D3A"      # Forest/Moss Green Accent
  primary-light: "#4A7D55"
  primary-dark: "#2F5D3A"
  secondary: "#14241A"    # Deep Moss / Ink
  accent: "#2F5D3A"       # Forest Accent
  success: "#10b981"      
  warning: "#F59E0B"      
  danger: "#ba1a1a"       # Red
  background: "#F4F1E9"   # Warm Light Stone
  surface: "#FFFFFF"
  border: "#CFC9B6"
  text-main: "#14241A"
  text-secondary: "#4B5A50"
  text-muted: "#5D6B61"
typography:
  sans: "Inter, -apple-system, sans-serif"
  serif: "Playfair Display, serif"
  heading-font: "Playfair Display, serif"
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
shadows:
  sm: "0 2px 20px rgba(0, 0, 0, 0.06)"
  md: "0 8px 40px rgba(0, 0, 0, 0.05)"
  lg: "0 25px 50px -12px rgba(10, 22, 40, 0.25)"
components:
  button:
    primary:
      bg: "{colors.primary}"
      text: "#FFFFFF"
      radius: "{rounded.md}"
    secondary:
      bg: "{colors.secondary}"
      text: "#FFFFFF"
      radius: "{rounded.md}"
    outline:
      border: "1px solid {colors.primary}"
      text: "{colors.primary}"
  card:
    bg: "{colors.surface}"
    border: "1px solid {colors.border}"
    radius: "{rounded.lg}"
    shadow: "{shadows.sm}"
  input:
    border: "1px solid {colors.border}"
    radius: "{rounded.md}"
    focus: "0 0 0 2px {colors.primary}"
---

## Overview
This design system establishes the visual and structural language for the **Bia Thầy Tu** platform. The design ethos is Premium, Authentic, and Trustworthy, reflecting the heritage of Ettal Abbey and traditional German beer craftsmanship.

## Brand Personality
- **Premium & Natural:** Uses Forest Green (`#2F5D3A`) and Ink (`#14241A`) to evoke nature, Ettal Abbey heritage, and Reinheitsgebot purity.
- **Warm & Organic:** Warm light stone backgrounds (`#F4F1E9`) create a welcoming, organic feel.
- **Elegant Typography:** Utilizes `Playfair Display` for headings and `Inter` for clean body text.

## Color Usage
- **Primary Background:** Warm Light Stone (`#F4F1E9`, `--web-bg`). Section background uses `#E9E5D8` (`--web-bg-section`).
- **Primary Accent:** Forest Green (`#2F5D3A`, `--web-accent`) is used for primary CTAs, active states, and focus rings.
- **Secondary / Ink:** Ink (`#14241A`, `--web-ink`) is used for dark sections, footers, and primary body text.
- **Heritage Accent:** Heritage Gold (`#8B6914`, `--web-heritage`) is reserved exclusively for iTQi award badges and historic year markers (e.g. 1330).

## Dải tối dùng có chủ đích
Hệ màu sáng (`#F4F1E9` + `#2F5D3A`) là chuẩn duy nhất của storefront. Dải tối (`--web-ink`) được sử dụng có chủ đích như nhịp điệu thị giác tại **6 khu vực**:
1. `.hero-dark` (Phần Hero chính)
2. `.usp-bar` (Thanh cam kết USP)
3. `.b2b-section` (Khối hợp tác nhà hàng/đại lý)
4. `.product-guarantee` (Khối cam kết chất lượng)
5. `.knowledge-hero` (Hero trang kiến thức)
6. `.web-footer` (Chân trang)

**Quy tắc phối chữ/link trên dải tối (`--web-ink`):**
- Chữ chính: `--web-on-ink` (`#F4F1E9` — tương phản 14.2:1)
- Phụ đề / mô tả: `--web-on-ink-muted` (`#B9C4BC` — tương phản 9.0:1)
- Liên kết / Link: `--web-accent-on-ink` (`#8FBF9C` — tương phản 7.8:1)

## Typography Rules
- **Headings (H1-H6):** Always use `Playfair Display, serif`. Font weight is typically bold (700).
- **Body Text:** Use `Inter, sans-serif` for high readability in paragraphs and UI elements.
- **Hierarchy:** 
  - Section Titles (H2): 28px - 32px, Font Weight 700, Color: `text-main`.
  - Body Text: 16px, Font Weight 400, Color: `text-secondary`, line-height: 1.6.

## Layout Rules
- **Container Max-Width:** 1200px with 20px padding on mobile.
- **Spacing:** Use standardized spacing tokens (`xs` to `2xl`). Section padding is typically 80px (top/bottom) on desktop, scaling down on mobile.

## Component Rules
- **Buttons:** 
  - Primary actions (Buy Now, Add to Cart) use Forest Green background (`--web-accent`).
  - Borders have an `8px` radius (`md`).
  - Minimum height for touch targets is `44px`.
- **Cards:** White surfaces (`#FFFFFF`) or Warm Stone (`#F4F1E9`) with a `12px` border-radius (`lg`), and a soft shadow.
- **Meta Tags:** Product meta information (ABV, IBU) should use small pill badges with subtle backgrounds.

## Accessibility Rules
- **Focus States:** ALL interactive elements MUST have a visible focus ring (e.g., Forest Green outline).
- **Contrast:** Text on all surfaces must meet WCAG 2.1 AA threshold (minimum 4.5:1 ratio).

## Do / Don’t
- **DO:** Use `Playfair Display` exclusively for headings to maintain the premium feel.
- **DO:** Use Forest Green accents for active states and primary buttons.
- **DON'T:** Use harsh pure black (`#000000`) for large background areas.
- **DON'T:** Mix too many font families.
- **DON'T:** Use inline styles `style={{...}}`. Always use system tokens via CSS classes.
