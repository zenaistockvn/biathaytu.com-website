---
name: Bia Thầy Tu Design System
description: Premium German Beer Retail Platform Design System
colors:
  primary: "#B8860B"      # Gold
  primary-light: "#D4A843"
  primary-dark: "#8B6914"
  secondary: "#0D1B2A"    # Deep Navy
  accent: "#722F37"       # Wine Red
  success: "#10b981"      
  warning: "#F59E0B"      
  danger: "#C12D35"       # Red
  background: "#FEFCF8"   # Warm White
  surface: "#FFFFFF"
  border: "#E8E3DA"
  text-main: "#1A1A2E"
  text-secondary: "#4A4A5A"
  text-muted: "#7A7A8A"
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
  md: "0 8px 40px rgba(0, 0, 0, 0.08)"
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
This design system establishes the visual and structural language for the **Bia Thầy Tu** platform. The design ethos is Premium, Authentic, and Trustworthy, reflecting the heritage of a 400-year-old German beer brand.

## Brand Personality
- **Premium & Heritage:** Uses Gold and Deep Navy to evoke luxury, tradition, and high quality.
- **Warm & Inviting:** Warm white backgrounds (`#FEFCF8`) instead of stark white to create a welcoming, organic feel.
- **Elegant:** Utilizes `Playfair Display` for headings to bring a touch of classic elegance.

## Color Usage
- **Backgrounds:** Primary background is `#FEFCF8` (Warm White). Sections can alternate with `#F5F1EB` to create rhythm.
- **Primary:** Gold (`#B8860B`) is used for primary CTAs, active states, and decorative elements (like dividers).
- **Secondary:** Deep Navy (`#0D1B2A`) is used for dark sections, footers, and secondary CTAs.
- **Accents:** Wine Red (`#722F37`) is reserved for specific wine-related products or special highlights.

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
  - Primary actions (Buy Now, Add to Cart) use Gold background.
  - Borders have an `8px` radius (`md`).
  - Minimum height for touch targets is `44px`.
- **Cards:** White surfaces (`#FFFFFF`) with a `12px` border-radius (`lg`), and a soft shadow (`0 2px 20px rgba(0,0,0,0.06)`).
- **Meta Tags:** Product meta information (ABV, IBU) should use small pill badges with subtle backgrounds.

## Accessibility Rules
- **Focus States:** ALL interactive elements MUST have a visible focus ring (e.g., Gold outline).
- **Contrast:** Gold text on white background can sometimes fail contrast checks; use darker Gold (`#8B6914`) for text elements if needed.

## Do / Don’t
- **DO:** Use `Playfair Display` exclusively for headings to maintain the premium feel.
- **DO:** Use Gold gradients subtly for decorative borders or dividers.
- **DON'T:** Use harsh pure black (`#000000`) or pure white (`#FFFFFF`) for large background areas. Use the defined Navy and Warm White.
- **DON'T:** Mix too many font families.
- **DON'T:** Use inline styles `style={{...}}`. Always use system tokens via CSS classes.
