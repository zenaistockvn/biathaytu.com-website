import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function cssModules(): string[] {
  const out: string[] = [];
  (function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.module.css')) out.push(p);
    }
  })(path.join(ROOT, 'src/app/(web)'));
  return out;
}

describe('nhịp khoảng trống giữa các section', () => {
  it('--web-section-py theo DESIGN.md: tối đa 80px desktop, nhỏ hơn trên mobile', () => {
    expect(read('src/app/web.css')).toMatch(/--web-section-py:\s*clamp\(56px,\s*6vw,\s*80px\);/);
  });

  it('module không tự viết padding section kiểu cũ (96/104/112px) thay cho token', () => {
    const offenders = cssModules().flatMap((file) => {
      const src = fs.readFileSync(file, 'utf8');
      return [...src.matchAll(/padding[a-z-]*:\s*[^;]*clamp\(\d+px,\s*\d+vw,\s*(96|104|112)px\)[^;]*;/g)]
        .map((m) => `${path.relative(ROOT, file)}: ${m[0]}`);
    });
    expect(offenders).toEqual([]);
  });

  it('main không có padding-bottom: footer tự chừa chỗ cho thanh điều hướng dưới', () => {
    for (const file of ['src/app/web.css', 'src/app/brand-consistency.css']) {
      expect(read(file), file).not.toMatch(/\.web-app\s+main\s*\{[^}]*padding-bottom/);
    }
    expect(read('src/app/(web)/components/WebFooter.module.css')).toMatch(/\.bar\s*\{[^}]*--web-mobile-bottom-nav-height/);
  });

  it('/san-pham không có dải trắng giữa dải xanh cuối trang và footer', () => {
    expect(read('src/app/web.css')).toMatch(/\.products-page-container\s*\{[^}]*padding-top:\s*var\(--web-header-h\);[^}]*padding-bottom:\s*0;/);
  });

  it('trang không có hero đặt khoảng đệm trên theo token header, không viết cứng px', () => {
    const css = read('src/app/web.css');
    expect(css).toMatch(/\.subpage-wrap\s*\{[^}]*padding-top:\s*calc\(var\(--web-header-h\)/);
    expect(css).not.toMatch(/\.toast-container\s*\{[^}]*top:\s*\d+px/);
  });
});
