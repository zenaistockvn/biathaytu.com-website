# GSAP Animation Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a focused GSAP animation layer for the public website hero and scroll reveal system.

**Architecture:** Keep the current class-based authoring model for `.reveal-on-scroll`, but move reveal execution from IntersectionObserver/CSS transitions to GSAP ScrollTrigger. Add a scoped `useGSAP` timeline inside `LandingHero` for premium first-viewport choreography.

**Tech Stack:** Next.js App Router, React client components, TypeScript, GSAP, `@gsap/react`, Vitest file-content regression tests.

---

## File Structure

- Modify: `package.json`
  - Add `gsap` and `@gsap/react` dependencies through `npm install`.
- Modify: `package-lock.json`
  - Let npm update the lockfile.
- Modify: `src/app/(web)/components/ScrollRevealObserver.tsx`
  - Keep the component name and layout import stable.
  - Replace IntersectionObserver logic with GSAP ScrollTrigger.
- Modify: `src/app/(web)/components/LandingHero.tsx`
  - Add a scoped hero timeline using `useGSAP`.
  - Add `ref` to the hero section.
- Modify: `src/app/web.css`
  - Convert `.hero-fade-in` from CSS-driven animation to visible default state so GSAP owns the entrance.
  - Keep CSS-only idle effects where useful.
- Modify: `src/app/(web)/mobile-first-regression.test.ts`
  - Add regression tests for GSAP install and safe animation patterns.

---

### Task 1: Install GSAP Runtime Packages

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install packages**

Run:

```bash
npm install gsap @gsap/react
```

Expected: npm updates `package.json` and `package-lock.json` without dependency resolution errors.

- [ ] **Step 2: Verify dependency entries**

Run:

```bash
rg -n '"gsap"|"@gsap/react"' package.json package-lock.json
```

Expected: both packages appear in `package.json`, and package metadata appears in `package-lock.json`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install gsap runtime"
```

---

### Task 2: Add Regression Tests For GSAP Patterns

**Files:**
- Modify: `src/app/(web)/mobile-first-regression.test.ts`

- [ ] **Step 1: Add the failing tests**

Append these tests inside the existing `describe('mobile-first responsive regressions', () => { ... })` block:

```ts
  it('uses GSAP ScrollTrigger for class-based scroll reveal with reduced motion support', () => {
    const reveal = readProjectFile('src/app/(web)/components/ScrollRevealObserver.tsx');

    expect(reveal).toContain("import gsap from 'gsap'");
    expect(reveal).toContain("import { ScrollTrigger } from 'gsap/ScrollTrigger'");
    expect(reveal).toContain("import { useGSAP } from '@gsap/react'");
    expect(reveal).toContain('gsap.registerPlugin(useGSAP, ScrollTrigger)');
    expect(reveal).toContain("prefers-reduced-motion: reduce");
    expect(reveal).toContain("'.reveal-on-scroll'");
    expect(reveal).toContain('once: true');
  });

  it('uses a scoped GSAP timeline for the landing hero', () => {
    const hero = readProjectFile('src/app/(web)/components/LandingHero.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(hero).toContain("import gsap from 'gsap'");
    expect(hero).toContain("import { useGSAP } from '@gsap/react'");
    expect(hero).toContain('const heroRef = useRef<HTMLElement>(null)');
    expect(hero).toContain('scope: heroRef');
    expect(hero).toContain('gsap.timeline');
    expect(hero).toContain("prefers-reduced-motion: reduce");
    expect(css).toMatch(/\.web-app\s+\.hero-fade-in\s*\{[^}]*opacity:\s*1/);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run test -- src/app/(web)/mobile-first-regression.test.ts
```

Expected: FAIL because GSAP imports and timeline code are not implemented yet.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(web)/mobile-first-regression.test.ts"
git commit -m "test: cover gsap animation patterns"
```

---

### Task 3: Replace Scroll Reveal Observer With GSAP ScrollTrigger

**Files:**
- Modify: `src/app/(web)/components/ScrollRevealObserver.tsx`

- [ ] **Step 1: Replace component implementation**

Replace the file with:

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollRevealObserver() {
  useGSAP(() => {
    const elements = gsap.utils.toArray<HTMLElement>('.reveal-on-scroll');

    if (elements.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      gsap.set(elements, {
        autoAlpha: 1,
        y: 0,
        clearProps: 'willChange',
      });
      return;
    }

    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 28,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once: true,
          },
        }
      );
    });
  }, []);

  return null;
}
```

- [ ] **Step 2: Run the focused test**

Run:

```bash
npm run test -- src/app/(web)/mobile-first-regression.test.ts
```

Expected: The scroll reveal test passes. The hero timeline test still fails.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(web)/components/ScrollRevealObserver.tsx"
git commit -m "feat: animate scroll reveals with gsap"
```

---

### Task 4: Add Scoped GSAP Timeline To Landing Hero

**Files:**
- Modify: `src/app/(web)/components/LandingHero.tsx`

- [ ] **Step 1: Add imports**

Update the import block to include React refs and GSAP:

```tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ZaloCTA from './ZaloCTA';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP);
```

- [ ] **Step 2: Add the hero ref and timeline**

Inside `LandingHero`, immediately after `const { t } = useLanguage();`, add:

```tsx
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selector = gsap.utils.selector(heroRef);
    const introItems = selector('.hero-badge, .hero-title, .hero-desc, .hero-actions, .hero-trust-bar');
    const productItems = selector('.hero-product-bottle, .hero-product-glass');

    if (reduceMotion) {
      gsap.set([...introItems, ...productItems], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    });

    timeline
      .from(introItems, {
        autoAlpha: 0,
        y: 24,
        duration: 0.72,
        stagger: 0.09,
      })
      .from(
        productItems,
        {
          autoAlpha: 0,
          y: 34,
          scale: 0.96,
          duration: 0.86,
          stagger: 0.12,
        },
        '-=0.42'
      );
  }, { scope: heroRef });
```

- [ ] **Step 3: Scope the hero section**

Change:

```tsx
    <section className="hero-dark">
```

to:

```tsx
    <section ref={heroRef} className="hero-dark">
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
npm run test -- src/app/(web)/mobile-first-regression.test.ts
```

Expected: Both new GSAP tests pass.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(web)/components/LandingHero.tsx"
git commit -m "feat: add gsap hero timeline"
```

---

### Task 5: Adjust CSS So GSAP Owns Hero Entrance

**Files:**
- Modify: `src/app/web.css`

- [ ] **Step 1: Update `.hero-fade-in`**

Find the `.web-app .hero-fade-in` block and replace it with:

```css
.web-app .hero-fade-in {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Remove obsolete stagger delay rules**

Remove these CSS rules because GSAP now controls entrance order:

```css
.web-app .hero-fade-in:nth-child(1) { animation-delay: 0.1s; }
.web-app .hero-fade-in:nth-child(2) { animation-delay: 0.25s; }
.web-app .hero-fade-in:nth-child(3) { animation-delay: 0.4s; }
.web-app .hero-fade-in:nth-child(4) { animation-delay: 0.55s; }
.web-app .hero-fade-in:nth-child(5) { animation-delay: 0.7s; }
.web-app .hero-fade-in:nth-child(6) { animation-delay: 0.85s; }
```

- [ ] **Step 3: Keep existing idle keyframes**

Leave `heroFloat` and `heroGlowPulse` in place. They are low-cost idle effects and do not conflict with the entrance timeline after `.hero-fade-in` is made visible by default.

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test -- src/app/(web)/mobile-first-regression.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/web.css"
git commit -m "style: let gsap control hero entrance"
```

---

### Task 6: Full Verification

**Files:**
- No code changes expected unless verification finds an issue.

- [ ] **Step 1: Run all tests**

Run:

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: PASS with no TypeScript, lint, or Next.js build errors.

- [ ] **Step 3: Start local dev server**

Run:

```bash
npm run dev
```

Expected: local server starts. Open the URL shown by Next.js, usually `http://localhost:3000`.

- [ ] **Step 4: Manual visual check**

Check:

- Landing hero content appears immediately and animates once.
- Product bottle and glass do not jump or overlap.
- Scroll sections marked `.reveal-on-scroll` reveal once.
- Zalo floating CTA remains clickable.
- Mobile layout remains stable.

- [ ] **Step 5: Commit verification fixes if needed**

If fixes are needed in the files touched by this plan, stage only those files:

```bash
git add package.json package-lock.json "src/app/(web)/components/ScrollRevealObserver.tsx" "src/app/(web)/components/LandingHero.tsx" "src/app/web.css" "src/app/(web)/mobile-first-regression.test.ts"
git commit -m "fix: polish gsap animation behavior"
```

If no fixes are needed, do not create an empty commit.

---

## Self-Review

- The plan keeps scope limited to GSAP install, scroll reveal, hero timeline, CSS handoff, and verification.
- The existing layout import for `ScrollRevealObserver` remains stable.
- Reduced-motion behavior is explicit in both GSAP components.
- No page-wide markup rewrite is required.
- The plan uses regression tests before implementation and verifies with both tests and production build.
