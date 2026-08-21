import { describe, it, expect } from 'vitest';
import { GET } from '@/app/google-merchant.xml/route';

describe('Google Merchant Feed — google-merchant.xml', () => {
  it('returns 410 and no product offers for the brochure website', async () => {
    const res = await GET();
    const xml = await res.text();

    expect(res.status).toBe(410);
    expect(xml).not.toContain('<g:price>');
    expect(xml).not.toContain('<g:availability>');
    expect(xml).toContain('brochure website');
  });
});
