---
name: Bia Thầy Tu
description: Premium German Beer Retail Platform
colors:
  primary: "#B8860B"
  primary-light: "#D4A843"
  primary-dark: "#8B6914"
  primary-hover: "#9A7209"
  primary-bg: "#FBF5E9"
  text-main: "#1A1A2E"
  text-secondary: "#4A4A5A"
  text-muted: "#7A7A8A"
  bg-main: "#FEFCF8"
  bg-warm: "#FAF7F2"
  bg-section: "#F5F1EB"
  navy: "#0D1B2A"
  navy-light: "#1B2D45"
  wine: "#722F37"
  wine-bg: "#FDF8F4"
  red: "#C12D35"
  border: "#E8E3DA"
  card-bg: "#FFFFFF"
typography:
  sans:
    fontFamily: Inter
  serif:
    fontFamily: Playfair Display
  h1:
    fontFamily: Playfair Display
    fontWeight: 700
  body:
    fontFamily: Inter
    fontWeight: 400
rounded:
  sm: 4px
  md: 8px
  default: 12px
  lg: 20px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 60px
  section-py: 80px
  section-header-mb: 60px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    typography: "{typography.sans}"
  button-outline:
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    typography: "{typography.sans}"
  product-card:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.lg}"
    textColor: "{colors.text-main}"
  glass-card-dark:
    backgroundColor: rgba(10, 22, 40, 0.45)
    rounded: "{rounded.lg}"
    textColor: "#FFFFFF"
  glass-card-light:
    backgroundColor: rgba(253, 251, 247, 0.92)
    rounded: "{rounded.lg}"
    textColor: "{colors.navy}"
---

## Overview

Bia Thầy Tu brand language relies on a premium, highly professional and trustworthy aesthetic. It blends traditional European heritage (Playfair Display, gold tones) with modern digital usability (Inter, spacious layouts, subtle rounded corners).

## Colors

The color system relies heavily on Gold as the primary accent against a set of warm neutrals and a deep Navy.

- **Primary (Gold - #B8860B):** Used for primary buttons, prominent highlights, and borders.
- **Navy (#0D1B2A):** Used for dark sections, high-contrast backgrounds, and strong typographic elements.
- **Backgrounds:** We avoid pure white for main backgrounds, instead opting for a warm `#FEFCF8` to evoke a premium, hospitable feel. Pure white (`#FFFFFF`) is strictly used for elevated card surfaces.

## Typography

- **Headings (Playfair Display):** Conveys heritage, quality, and tradition.
- **Body & UI Elements (Inter):** Ensures legibility, modernity, and a clean interface.

## Layout & Spacing

Generous spacing is a core part of the premium feel.
- Sections always pad `80px` vertically (`var(--web-section-py)`).
- Component gaps default to `24px`, `40px`, or `60px`.

## Elevation & Depth

Shadows are used to create depth for cards and floating elements.
- Base shadow for cards: subtle `0 2px 20px rgba(0, 0, 0, 0.06)`.
- Hover shadow: `0 8px 40px rgba(0, 0, 0, 0.08)` to make interactive elements pop.
- Glassmorphism is utilized in specific premium cards to overlay images without losing readability.

## Shapes

- UI elements like buttons and input fields use an `8px` (`md`) radius.
- Cards, modals, and larger containers use `12px` (`default`) to `20px` (`lg`) for a softer, welcoming appearance.

## Components

### Buttons
Primary buttons use a gold gradient. Outline buttons use a transparent background with a gold border. All buttons use the `Inter` font, `600` weight, and `8px` border radius.

### Cards
Product cards use a white background on the warm layout background to separate content clearly. They have a `20px` border radius and a subtle shadow. 

### Glass Cards
Used for emphasis or overlays on images. Dark glass cards have a dark translucent background with a gold border. Light glass cards have a white translucent background with a white border.

## Do's and Don'ts

- **Do:** Use `Playfair Display` exclusively for headings and major titles.
- **Do:** Ensure text has adequate contrast. Note: White text on the primary Gold (`#B8860B`) background has a contrast ratio of ~3.25:1, which is below the WCAG AA requirement of 4.5:1 for normal text. It is acceptable for large text or buttons if the text is bold and large enough, but consider using a darker Gold or Navy text for smaller functional elements.
- **Don't:** Mix random padding or margin values. Stick to the spacing tokens (`sm`, `md`, `lg`, `xl`).
- **Don't:** Use pure white (`#FFFFFF`) for the page background. Use `bg-main` (`#FEFCF8`) instead.
