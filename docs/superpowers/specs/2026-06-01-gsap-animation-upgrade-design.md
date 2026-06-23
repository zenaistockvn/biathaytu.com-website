# GSAP Animation Upgrade Design

## Goal

Upgrade the public Bia Thay Tu website animation system with GSAP in a focused way: richer hero motion, smoother scroll reveal, and a small number of premium product/story moments, while preserving load speed, SEO, accessibility, and the existing visual identity.

## Current State

The project is a Next.js App Router site using React client components where needed. The public web layout mounts `ScrollRevealObserver` once, and pages mark sections with `.reveal-on-scroll`. The CSS file currently owns most animation behavior, including hero fade-in, product float, glow pulse, scroll reveal transitions, and shimmer effects.

`gsap` and `@gsap/react` are not currently installed. The `greensock/gsap-skills` repository should be treated as an agent guidance package, not as runtime code for the website.

## Recommended Scope

Implement a balanced GSAP layer:

1. Install the GSAP runtime packages in the app.
2. Keep the existing `.reveal-on-scroll` authoring pattern so page markup does not need broad edits.
3. Replace the IntersectionObserver reveal behavior with GSAP + ScrollTrigger.
4. Add a scoped GSAP timeline to the landing hero.
5. Add regression tests that check the project uses GSAP patterns safely.
6. Keep small CSS-only effects that do not need GSAP, such as simple hover/shimmer transitions.

## Non-Goals

Do not convert every transition to GSAP. Do not animate long SEO text blocks heavily. Do not add page transitions, 3D, pinned scroll scenes, or animation-heavy product configurators in this pass. Do not rewrite page structure unless required by the GSAP integration.

## Architecture

`ScrollRevealObserver` remains mounted in the public web layout so existing pages continue to work. Internally it changes from manual IntersectionObserver class toggling to GSAP ScrollTrigger animations. This keeps the public API as a CSS class, which is already spread across the landing page.

`LandingHero` gets a local `ref` and a scoped `useGSAP` timeline. The timeline only targets elements inside the hero. Reduced-motion users see the same content without movement.

CSS remains responsible for layout, colors, spacing, hover states, and simple decorative effects. GSAP owns entrance choreography and scroll-triggered reveal where sequencing and cleanup matter.

## Accessibility and Performance

All GSAP code must check `prefers-reduced-motion: reduce`. Reduced-motion mode should set elements to visible states and skip movement. ScrollTrigger usage must be `once: true` for general section reveals to avoid repeated animation work. Hero animation must be scoped to its component and cleaned up by `useGSAP`.

No animation should block primary commerce actions, Zalo CTA, navigation, or checkout flows. The change should pass production build.

## Files Expected To Change

- `package.json`
- `package-lock.json`
- `src/app/(web)/components/ScrollRevealObserver.tsx`
- `src/app/(web)/components/LandingHero.tsx`
- `src/app/web.css`
- `src/app/(web)/mobile-first-regression.test.ts`

## Success Criteria

- `npm run test` passes.
- `npm run build` passes.
- Existing `.reveal-on-scroll` sections still reveal on scroll.
- Hero entrance feels premium but not distracting.
- Reduced-motion mode shows all content without movement.
- No broad page markup churn is required.
