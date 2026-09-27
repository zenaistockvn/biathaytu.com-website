import { describe, expect, it } from 'vitest';
import legacy from './legacy-haravan-products.json';
import { getVisibleProducts } from '@/lib/data/products';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require('../../next.config.js');

describe('đường dẫn cửa hàng Haravan cũ', () => {
  it('mỗi /products/<handle> cũ trỏ về một trang SKU đang hiển thị', () => {
    const visible = new Set(getVisibleProducts().map((p) => `/san-pham/${p.slug}`));
    const broken = Object.entries(legacy as Record<string, string>).filter(([, dest]) => !visible.has(dest));
    expect(broken).toEqual([]);
  });

  it('redirect riêng cho từng sản phẩm đứng trước redirect gom /products/:path*', async () => {
    const redirects: Array<{ source: string; destination: string }> = await nextConfig.redirects();
    const sources = redirects.map((r) => r.source);
    const catchAll = sources.indexOf('/products/:path*');
    expect(catchAll).toBeGreaterThan(-1);
    for (const handle of Object.keys(legacy)) {
      const i = sources.indexOf(`/products/${handle}`);
      expect(i, handle).toBeGreaterThan(-1);
      expect(i, handle).toBeLessThan(catchAll);
    }
    expect(sources).toContain('/collections/:path*');
  });
});
