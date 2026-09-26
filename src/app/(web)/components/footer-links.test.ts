import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getProductBySlugOrId } from '@/lib/data/products';
import { KEG_PAGE, NAV, PRODUCT_LINES } from '@/config/navigation';

const ROOT = process.cwd();
const FOOTER = fs.readFileSync(path.join(ROOT, 'src/app/(web)/components/WebFooter.tsx'), 'utf8');

/** Route tĩnh có page.tsx, hoặc /san-pham/<slug> là sản phẩm có thật. */
function routeExists(href: string): boolean {
  const clean = href.split('#')[0];
  const sku = /^\/san-pham\/([^/]+)$/.exec(clean);
  if (sku) return Boolean(getProductBySlugOrId(sku[1]));
  const dir = clean === '/' ? '' : clean;
  return fs.existsSync(path.join(ROOT, 'src/app/(web)', dir, 'page.tsx'));
}

describe('link điều hướng và footer', () => {
  it('mọi đích trong NAV, PRODUCT_LINES, KEG_PAGE đều tồn tại', () => {
    const hrefs = [...Object.values(NAV), ...PRODUCT_LINES, KEG_PAGE].map((i) => i.href);
    expect(hrefs.filter((h) => !routeExists(h))).toEqual([]);
  });

  it('mọi href viết thẳng trong WebFooter (thanh pháp lý) đều tồn tại', () => {
    const hrefs = [...FOOTER.matchAll(/href:\s*['"](\/[^'"]*)['"]/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((h) => !routeExists(h))).toEqual([]);
  });

  it('footer có ba cột Sản phẩm, Tìm hiểu, Mua hàng và giữ thông tin doanh nghiệp (audit A7)', () => {
    for (const title of ["title: 'Sản phẩm'", "title: 'Tìm hiểu'", "title: 'Mua hàng'"]) {
      expect(FOOTER).toContain(title);
    }
    expect(FOOTER).toContain('const productLinks = [...PRODUCT_LINES, KEG_PAGE]');
    expect(FOOTER).toContain('const learnLinks = [NAV.story, NAV.enjoy, NAV.knowledge, NAV.whatIs, NAV.authentic]');
    expect(FOOTER).toContain('const buyLinks = [NAV.priceList, NAV.gifts, NAV.buyingInfo, NAV.certificate, NAV.contact]');
    expect(FOOTER).toContain('Thông tin doanh nghiệp');
    expect(FOOTER).toContain('<AlcoholWarning');
  });

  it('link mở app ngoài ghi rõ "Mở Zalo"', () => {
    expect(FOOTER).toContain('Mở Zalo');
    expect(FOOTER).not.toContain('Chat Zalo');
  });
});
