import { describe, it, expect } from 'vitest';
import { GET } from '@/app/google-merchant.xml/route';

describe('Google Merchant Feed — google-merchant.xml', () => {
  it('không chứa sản phẩm 0đ và chứa tag <g:identifier_exists>no</g:identifier_exists>', async () => {
    const res = await GET();
    const xml = await res.text();

    expect(xml).not.toContain('<g:price>0 VND</g:price>');
    expect(xml).toContain('<g:identifier_exists>no</g:identifier_exists>');
    expect(xml).toContain('<g:availability>in_stock</g:availability>');
  });
});
