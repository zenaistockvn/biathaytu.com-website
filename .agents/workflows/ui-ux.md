---
description: UI/UX Pro Max Design Intelligence — design system generation, industry-specific rules, anti-patterns. Dùng khi build, design, create, improve UI/UX.
---

# UI/UX Pro Max Design Intelligence

AI-powered design intelligence cho UI/UX chuyên nghiệp.

## Khi nào kích hoạt

Khi user yêu cầu: build, design, create, implement, review, fix, improve UI/UX.

## Quy trình

### 1. Phân tích yêu cầu

Xác định:
- **Product type** — SaaS, E-commerce, Portfolio, Dashboard, Landing page, etc.
- **Industry** — Fintech, Healthcare, Education, Beauty, Tech, etc.
- **Target audience** — B2B, B2C, developers, end-users, etc.
- **Tech stack** — React, Next.js, Vue, HTML+CSS, etc.

### 2. Generate Design System

Dựa trên product type và industry, xác định:

#### Landing Page Pattern
- Hero-Centric, Feature-Grid, Social-Proof, Comparison, Storytelling, etc.
- Conversion strategy phù hợp
- Section ordering tối ưu

#### UI Style
Chọn từ các styles phù hợp:

| Style | Best For |
|-------|----------|
| Glassmorphism | Modern SaaS, creative tools |
| Neumorphism | Calculators, music apps |
| Dark Mode Premium | Developer tools, media, gaming |
| Soft UI Evolution | Wellness, beauty, lifestyle |
| Minimalism | Corporate, editorial |
| Bento Grid | Portfolios, dashboards |
| AI-Native UI | AI products, chatbots |
| Brutalism | Creative agencies, art |

#### Color Palette
- Industry-appropriate colors
- Primary, Secondary, CTA, Background, Text
- Đảm bảo contrast ratio ≥ 4.5:1 (WCAG AA)

#### Typography
- Font pairing (heading + body)
- Google Fonts imports
- Mood phù hợp industry

#### Key Effects
- Animations phù hợp (200-300ms transitions)
- Hover states, scroll effects
- `prefers-reduced-motion` respected

### 3. Anti-Patterns checklist

**TUYỆT ĐỐI tránh:**
- ❌ Emojis làm icons (dùng SVG: Lucide, Heroicons)
- ❌ Missing `cursor-pointer` trên clickable elements
- ❌ Missing hover states
- ❌ Neon colors không phù hợp industry
- ❌ Harsh/fast animations
- ❌ Text contrast < 4.5:1
- ❌ Missing focus states cho keyboard nav
- ❌ Missing responsive breakpoints
- ❌ AI purple/pink gradients cho industries không phù hợp (banking, healthcare)

### 4. Pre-Delivery Checklist

Trước khi giao UI:

- [ ] No emojis as icons (dùng SVG: Lucide/Heroicons)
- [ ] `cursor-pointer` trên tất cả clickable elements
- [ ] Hover states với smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible cho keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Loading states cho async operations
- [ ] Error states với actionable messages
- [ ] Empty states với guidance

## Design System Output Format

Khi generate design system, output theo format:

```
PATTERN: [Landing Page Pattern]
  Conversion: [Strategy]
  Sections: [Ordered list]

STYLE: [UI Style Name]
  Keywords: [Style descriptors]
  Best For: [Industry/use cases]

COLORS:
  Primary: [hex] ([name])
  Secondary: [hex] ([name])
  CTA: [hex] ([name])
  Background: [hex] ([name])
  Text: [hex] ([name])

TYPOGRAPHY: [Heading Font] / [Body Font]
  Mood: [Descriptors]
  Google Fonts: [URL]

KEY EFFECTS:
  [List of recommended effects]

AVOID:
  [List of anti-patterns for this industry]
```

## Stack-Specific Guidelines

### React / Next.js
- Component-based architecture
- CSS Modules hoặc styled-components
- Server components cho static content (Next.js)
- `useReducedMotion` hook cho animations

### HTML + CSS (Vanilla)
- Semantic HTML5 elements
- CSS Custom Properties cho design tokens
- CSS Grid + Flexbox cho layout
- `@media (prefers-reduced-motion)` query

### General
- Mobile-first responsive
- Progressive enhancement
- Performance budget: < 3s FCP
- Lazy loading cho images/heavy components

## 161 Industry Rules (Summary)

Mỗi industry rule bao gồm:
- **Recommended Pattern** — cấu trúc landing page
- **Style Priority** — UI styles phù hợp nhất
- **Color Mood** — palette phù hợp industry
- **Typography Mood** — font personality matching
- **Key Effects** — animations và interactions
- **Anti-Patterns** — những gì KHÔNG nên làm

Ví dụ:
- **Banking/Fintech:** Conservative colors, no playful animations, trust-focused
- **Healthcare:** Calming blues/greens, accessibility paramount, clear hierarchy
- **E-commerce:** Bold CTAs, social proof, urgency elements
- **SaaS:** Feature-focused, demo CTAs, comparison patterns
- **Beauty/Wellness:** Soft colors, organic shapes, premium feel
