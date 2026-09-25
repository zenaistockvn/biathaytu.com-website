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
    const css = readProjectFile('src/app/(web)/components/WebHeader.module.css');

    expect(header).toContain('className={`web-nav-mobile-right ${styles.mobileRight}`}');
    expect(header).not.toMatch(/mobileRight[^>]*style=/);
    // Mobile-first: nút menu hiện mặc định, menu desktop ẩn; từ 1024px thì đảo lại.
    expect(css).toMatch(/\.mobileRight\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.desktop\s*\{[^}]*display:\s*none/);
    expect(css).toMatch(/@media\s*\(min-width:\s*1024px\)\s*\{[\s\S]*\.desktop\s*\{[^}]*display:\s*flex[\s\S]*\.mobileRight\s*\{[^}]*display:\s*none/);
  });

  it('keeps header links legible on dark heroes without inline color overrides', () => {
    const header = readProjectFile('src/app/(web)/components/WebHeader.tsx');
    const css = readProjectFile('src/app/(web)/components/WebHeader.module.css');
    const globalCss = readProjectFile('src/app/web.css');

    expect(header).not.toContain('const textColor');
    expect(header).not.toContain('const logoColor');
    expect(header).not.toMatch(/className=\{styles\.(brand|navLink)\}\s+style=/);
    expect(header).toContain("aria-current={isCurrentPath(link.href) ? 'page' : undefined}");
    // Chữ trắng trên hero tối, link kế thừa màu của header.
    expect(css).toMatch(/\.onDark\s*\{[^}]*color:\s*var\(--web-on-ink\)/);
    expect(css).toMatch(/\.navLink\s*\{[^}]*color:\s*inherit/);
    expect(css).toMatch(/\.onDark::before\s*\{[^}]*linear-gradient/);
    expect(globalCss).not.toMatch(/\.web-app\s+a\s*\{[^}]*color:\s*inherit\s*!important/);
  });

  it('defines the web primary color token used by primary CTAs', () => {
    const css = readProjectFile('src/app/web.css');

    expect(css).toMatch(/--web-primary:\s*var\(--web-accent\)/);
  });

  it('lets product gallery height respond through CSS instead of inline fixed pixels', () => {
    const gallery = readProjectFile('src/app/(web)/components/ProductGallery.tsx');
    const css = readProjectFile('src/app/web.css');

    expect(gallery).toContain('product-gallery-main');
    expect(gallery).not.toContain("height: '500px'");
    expect(css).toMatch(/\.web-app\s+\.product-gallery-main\s*\{[^}]*height:\s*clamp\(/);
  });

  it('mounts the consolidated contact launcher on public pages', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');
    const floatingCta = readProjectFile('src/app/(web)/components/FloatingZaloCTA.tsx');
    const css = readProjectFile('src/app/(web)/components/FloatingZaloCTA.module.css');

    expect(layout).toContain("import FloatingZaloCTA from './components/FloatingZaloCTA'");
    expect(layout).toContain('<FloatingZaloCTA />');
    expect(floatingCta).toContain("import styles from './FloatingZaloCTA.module.css'");
    expect(floatingCta).toContain('className={styles.root}');
    expect(floatingCta).toContain('getCompanyZaloUrl');
    expect(floatingCta).toContain('getCompanyTelHref');
    expect(floatingCta).toContain("aria-label={isExpanded ? 'Đóng menu liên hệ' : 'Mở menu liên hệ'}");
    expect(floatingCta).toContain('styles.trigger');
    expect(floatingCta).toContain('styles.panel');
    expect(css).toMatch(/^\.root\s*\{[^}]*position:\s*fixed[^}]*right:\s*calc\([^}]*bottom:\s*calc\(/m);
    expect(css).not.toContain('!important');
  });

  it('mounts a mobile-only bottom navigation with three primary choices plus contact', () => {
    const layout = readProjectFile('src/app/(web)/layout.tsx');
    const bottomNav = readProjectFile('src/app/(web)/components/MobileBottomNav.tsx');
    const css = readProjectFile('src/app/(web)/components/MobileBottomNav.module.css');

    expect(layout).toContain("import MobileBottomNav from './components/MobileBottomNav'");
    expect(layout).toContain('<MobileBottomNav />');
    expect(bottomNav).toContain('className={styles.nav}');
    for (const key of ['home', 'products', 'knowledge']) {
      expect(bottomNav).toContain(`...NAV.${key}`);
    }
    expect(css).toMatch(/^\.nav\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/m);
    // Mục thứ tư mở bảng liên hệ thay cho nút nổi (nút nổi ẩn trên mobile để không đè nội dung).
    expect(bottomNav).toContain('CONTACT_TOGGLE_EVENT');
    expect(readProjectFile('src/app/(web)/components/FloatingZaloCTA.module.css')).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{\s*\.root\s+\.trigger\s*\{\s*display:\s*none/);
    expect(bottomNav).not.toContain("label: 'Giỏ hàng'");
    expect(css).toMatch(/^\.nav\s*\{[^}]*position:\s*fixed[^}]*bottom:\s*0[^}]*display:\s*grid/m);
    expect(css).toMatch(/@media\s*\(min-width:\s*769px\)[\s\S]*\.nav\s*\{[^}]*display:\s*none/);
    expect(css).toContain('--web-mobile-bottom-nav-height');
    expect(css).not.toContain('!important');
  });

  it('khai --web-mobile-bottom-nav-height một lần, 74px, chỉ trong web.css', () => {
    const webCss = readProjectFile('src/app/web.css');
    const decls = [...webCss.matchAll(/--web-mobile-bottom-nav-height\s*:\s*([^;]+);/g)].map((m) => m[1].trim());
    expect(decls).toEqual(['74px']);
    for (const file of ['src/app/mobile-overrides.css', 'src/app/brand-consistency.css']) {
      expect(readProjectFile(file), file).not.toMatch(/--web-mobile-bottom-nav-height\s*:/);
      expect(readProjectFile(file), file).not.toMatch(/\.web-app\s+main\s*\{[^}]*padding-bottom/);
    }
  });

  it('thanh danh mục dính đặt theo token header, không viết cứng px', () => {
    const nav = readProjectFile('src/app/(web)/components/CatalogStickyNav.tsx');
    const css = readProjectFile('src/app/(web)/components/CatalogStickyNav.module.css');
    const brand = readProjectFile('src/app/brand-consistency.css');

    expect(nav).toContain("import styles from './CatalogStickyNav.module.css'");
    expect(css).toMatch(/^\.nav\s*\{[^}]*top:\s*var\(--web-header-h\)/m);
    expect(css).not.toContain('!important');
    expect(brand).toMatch(/scroll-margin-top:\s*calc\(var\(--web-header-h\)\s*\+\s*var\(--web-catalog-nav-h\)/);
    expect(brand).not.toContain('catalog-sticky');
  });

  it('vùng chạm ≥ 44px: tab danh mục, hàng tiện ích header, ảnh thu nhỏ là button', () => {
    const catalogCss = readProjectFile('src/app/(web)/components/CatalogStickyNav.module.css');
    for (const m of catalogCss.matchAll(/\.link\s*\{([^}]*)\}/g)) {
      const minHeight = /min-height:\s*(\d+)px/.exec(m[1])?.[1];
      if (minHeight) expect(Number(minHeight)).toBeGreaterThanOrEqual(44);
    }
    expect(catalogCss).toMatch(/^\.link\s*\{[^}]*min-height:\s*44px/m);

    const headerCss = readProjectFile('src/app/(web)/components/WebHeader.module.css');
    expect(headerCss).toMatch(/\.utilityBox::after[^{]*\{[^}]*inset:\s*-9px/);
    expect(headerCss).toMatch(/\.utilityLink::after/);

    const gallery = readProjectFile('src/app/(web)/components/ProductGallery.tsx');
    expect(gallery).not.toMatch(/<div[^>]*onClick/);
    expect(gallery).toContain('type="button"');
    expect(gallery).toContain('aria-pressed={mainImage === img}');
    expect(gallery).toContain('aria-label={`Ảnh ${index + 1}`}');
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

    expect(hero).toContain("import gsap from 'gsap'");
    expect(hero).toContain("import { useGSAP } from '@gsap/react'");
    expect(hero).toContain('const heroRef = useRef<HTMLElement>(null)');
    expect(hero).toContain('scope: heroRef');
    expect(hero).toContain('gsap.timeline');
    expect(hero).toContain("prefers-reduced-motion: reduce");
    // Các khối chữ hiện dần được đánh dấu qua PhotoHero (reveal) thay cho class CSS cũ.
    expect(hero).toMatch(/<PhotoHero[\s\S]*\breveal\b/);
  });
});
