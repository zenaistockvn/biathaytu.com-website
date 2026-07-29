import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getProductBySlugOrId } from '@/lib/data/products';

describe('link sản phẩm trong footer', () => {
  it('mọi /san-pham/<slug> trong WebFooter đều tồn tại', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/WebFooter.tsx'), 'utf8');
    const slugs = [...src.matchAll(/href="\/san-pham\/([^"]+)"/g)].map((m) => m[1]);
    expect(slugs.length).toBeGreaterThan(0);
    const broken = slugs.filter((s) => !getProductBySlugOrId(s));
    expect(broken).toEqual([]);
  });
});
