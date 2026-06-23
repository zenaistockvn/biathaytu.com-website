import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

describe('mobile-first responsive regressions', () => {
  it('shows the mobile header actions by default and hides them on larger screens', () => {
    const header = readProjectFile('src/app/(web)/components/WebHeader.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(header).toContain('className="web-nav-mobile-right"');
    expect(header).not.toContain("className=\"web-nav-mobile-right\" style={{ display: 'none'");
    expect(css).toMatch(/\.web-app\s+\.web-nav-mobile-right\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/@media\s*\(min-width:\s*769px\)[\s\S]*\.web-app\s+\.web-nav-mobile-right\s*\{[^}]*display:\s*none/);
  });

  it('defines the web primary color token used by commerce CTAs', () => {
    const css = readProjectFile('src/app/web.css');

    expect(css).toMatch(/--web-primary:\s*var\(--web-gold\)/);
  });

  it('lets product gallery height respond through CSS instead of inline fixed pixels', () => {
    const gallery = readProjectFile('src/app/(web)/components/ProductGallery.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(gallery).toContain('product-gallery-main');
    expect(gallery).not.toContain("height: '500px'");
    expect(css).toMatch(/\.web-app\s+\.product-gallery-main\s*\{[^}]*height:\s*clamp\(/);
  });

  it('uses responsive classes for checkout item rows and promo controls', () => {
    const checkout = readProjectFile('src/app/(web)/dat-hang/page.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(checkout).toContain('className="checkout-item-row"');
    expect(checkout).toContain('className="checkout-promo-row"');
    expect(css).toMatch(/\.web-app\s+\.checkout-item-row\s*\{[^}]*display:\s*grid/);
    expect(css).toMatch(/@media\s*\(min-width:\s*560px\)[\s\S]*\.web-app\s+\.checkout-item-row\s*\{[^}]*grid-template-columns/);
  });

  it('mounts fixed floating Zalo and phone CTAs at the bottom right of public pages', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');
    const floatingCta = readProjectFile('src/app/(web)/components/FloatingZaloCTA.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(layout).toContain("import FloatingZaloCTA from './components/FloatingZaloCTA'");
    expect(layout).toContain('<FloatingZaloCTA />');
    expect(floatingCta).toContain('className="floating-contact-stack"');
    expect(floatingCta).toContain('https://zalo.me/0899191313');
    expect(floatingCta).toContain('href="tel:0899191313"');
    expect(floatingCta).toContain('aria-label="Chat Zalo với Bia Thầy Tu"');
    expect(floatingCta).toContain('aria-label="Gọi Bia Thầy Tu"');
    expect(floatingCta).toContain('floating-zalo-cta');
    expect(floatingCta).toContain('floating-phone-cta');
    expect(css).toMatch(/\.web-app\s+\.floating-contact-stack\s*\{[^}]*position:\s*fixed[^}]*right:\s*calc\([^}]*bottom:\s*calc\(/);
    expect(css).toMatch(/\.web-app\s+\.floating-contact-button\s*\{[^}]*width:\s*58px[^}]*height:\s*58px/);
  });

  it('mounts a mobile-only bottom navigation for primary choices', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');
    const bottomNav = readProjectFile('src/app/(web)/components/MobileBottomNav.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(layout).toContain("import MobileBottomNav from './components/MobileBottomNav'");
    expect(layout).toContain('<MobileBottomNav />');
    expect(bottomNav).toContain('className="mobile-bottom-nav"');
    for (const href of ['/', '/san-pham', '/kien-thuc', '/dat-hang', '/lien-he']) {
      expect(bottomNav).toContain(`href: '${href}'`);
    }
    expect(css).toMatch(/\.web-app\s+\.mobile-bottom-nav\s*\{[^}]*position:\s*fixed[^}]*bottom:\s*0[^}]*display:\s*grid/);
    expect(css).toMatch(/@media\s*\(min-width:\s*769px\)[\s\S]*\.web-app\s+\.mobile-bottom-nav\s*\{[^}]*display:\s*none/);
    expect(css).toContain('--web-mobile-bottom-nav-height');
  });

  it('uses GSAP ScrollTrigger for class-based scroll reveal with reduced motion support', () => {
    const reveal = readProjectFile('src/app/(web)/components/ScrollRevealObserver.tsx');

    expect(reveal).toContain("import gsap from 'gsap'");
    expect(reveal).toContain("import { ScrollTrigger } from 'gsap/ScrollTrigger'");
    expect(reveal).toContain("import { useGSAP } from '@gsap/react'");
    expect(reveal).toContain('gsap.registerPlugin(ScrollTrigger)');
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
});
