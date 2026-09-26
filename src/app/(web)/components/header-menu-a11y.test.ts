import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(
  path.join(process.cwd(), 'src/app/(web)/components/WebHeader.tsx'),
  'utf8',
);

describe('WebHeader — menu mobile là hộp thoại', () => {
  it('khai role="dialog", aria-modal và id được nút menu trỏ tới qua aria-controls', () => {
    expect(SRC).toContain('role="dialog"');
    expect(SRC).toContain('aria-modal="true"');
    expect(SRC).toContain('id={MOBILE_MENU_ID}');
    expect(SRC).toContain('aria-controls={MOBILE_MENU_ID}');
    expect(SRC).toMatch(/const MOBILE_MENU_ID = ['"][\w-]+['"]/);
  });

  it('đóng bằng Escape', () => {
    expect(SRC).toMatch(/\w+\.key === ['"]Escape['"]/);
    expect(SRC).toMatch(/Escape[\s\S]{0,120}setMenuOpenPath\(null\)/);
  });

  it('vòng phím Tab trong menu (bẫy focus)', () => {
    expect(SRC).toMatch(/\w+\.key !?== ['"]Tab['"]/);
    expect(SRC).toContain('shiftKey');
    expect(SRC).toMatch(/last\.focus\(\)/);
    expect(SRC).toMatch(/first\.focus\(\)/);
  });

  it('trả focus về nút menu khi đóng', () => {
    expect(SRC).toContain('ref={menuButtonRef}');
    expect(SRC).toMatch(/return \(\) => \{[\s\S]*?toggle\?\.focus\(\)/);
  });

  it('menu mobile theo D4: chip dòng bia, nhóm Liên hệ hai nút, dòng nhỏ cuối', () => {
    expect(SRC).toMatch(/PRODUCT_LINES\.map\(\(line\) => \([\s\S]*?className=\{styles\.chip\}/);
    expect(SRC).toContain('Gọi hotline');
    expect(SRC).toContain('Mở Zalo');
    expect(SRC).toContain('COMPANY_CONFIG.showroomAddress');
    expect(SRC).toContain('const MOBILE_SMALL_LINKS = [NAV.priceList, NAV.gifts, NAV.buyingInfo]');
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/WebHeader.module.css'), 'utf8');
    expect(css).toMatch(/\.chip\s*\{[^}]*min-height:\s*44px/);
  });

  it('nav mobile có nhãn riêng, không trùng "Điều hướng chính" của nav desktop', () => {
    expect(SRC).toContain('<nav aria-label="Menu di động">');
    expect(SRC.match(/aria-label="Điều hướng chính"/g)).toHaveLength(1);
  });
});

describe('WebHeader — menu desktop (audit A1, D2, A5)', () => {
  it('một mục "Sản phẩm" thay hai anchor danh mục; sáng cho danh mục, SKU và trang dòng bia', () => {
    expect(SRC).not.toContain("'/san-pham#benediktiner'");
    expect(SRC).not.toContain("'/san-pham#bia-duc-khac'");
    expect(SRC).toContain("aria-current={productsActive ? 'page' : undefined}");
    expect(SRC).toContain('const CONTENT_LINKS = [NAV.story, NAV.enjoy, NAV.knowledge, NAV.horeca]');
  });

  it('panel Sản phẩm mở bằng chuột và bàn phím, đóng bằng Escape, trả focus về mục', () => {
    expect(SRC).toContain('onMouseEnter={openProducts}');
    expect(SRC).toContain('onFocus={handleProductsFocus}');
    expect(SRC).toContain('onBlur={handleProductsBlur}');
    expect(SRC).toMatch(/event\.key !== 'Escape' \|\| !productsOpen/);
    expect(SRC).toContain('productsLinkRef.current?.focus()');
    expect(SRC).toContain('aria-expanded={productsOpen}');
    expect(SRC).toContain('aria-controls={PRODUCTS_PANEL_ID}');
    expect(SRC).toContain('beer-garden-closeup.jpg');
  });

  it('panel phẳng: viền 1px, không bóng', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/WebHeader.module.css'), 'utf8');
    expect(css).toMatch(/\.panel\s*\{[^}]*border:\s*1px solid var\(--web-border\)[^}]*box-shadow:\s*none/);
  });

  it('hàng tiện ích: hotline · Liên hệ (mở bảng kênh) · ngôn ngữ; bỏ Showroom và Liên hệ tư vấn', () => {
    expect(SRC).toMatch(/<button type="button" className=\{styles\.utilityBox\} data-contact-toggle onClick=\{openContactPanel\}>\s*Liên hệ/);
    expect(SRC).not.toContain("t('nav.consult')");
    expect(SRC).not.toMatch(/className=\{styles\.utilityBox\}[^>]*href=/);
  });
});
