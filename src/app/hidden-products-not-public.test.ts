import { describe, it, expect } from 'vitest';
import { HIDDEN_PRODUCT_SLUGS, getVisibleProducts, getAllProducts } from '@/lib/data/products';
import sitemap from '@/app/sitemap';
import { GET as llmsGet } from '@/app/llms.txt/route';
import { generateStaticParams } from '@/app/(web)/san-pham/[slug]/page';

describe('SKU ẩn không được lộ ra bề mặt công khai nào', () => {
  it('sitemap không chứa URL của SKU ẩn', async () => {
    const urls = (await sitemap()).map((r) => r.url);
    const leaked = [...HIDDEN_PRODUCT_SLUGS].filter((s) => urls.some((u) => u.includes(s)));
    expect(leaked).toEqual([]);
  });

  it('generateStaticParams không sinh trang cho SKU ẩn', async () => {
    const params = await generateStaticParams();
    const leaked = params.map((p) => p.slug).filter((s) => HIDDEN_PRODUCT_SLUGS.has(s));
    expect(leaked).toEqual([]);
  });

  it('llms.txt không liệt kê SKU ẩn', async () => {
    const text = await (await llmsGet()).text();
    const leaked = [...HIDDEN_PRODUCT_SLUGS].filter((s) => text.includes(s));
    expect(leaked).toEqual([]);
  });

  it('getVisibleProducts + getAllProducts lệch đúng bằng số SKU ẩn', () => {
    expect(getAllProducts().length - getVisibleProducts().length).toBe(HIDDEN_PRODUCT_SLUGS.size);
  });
});
