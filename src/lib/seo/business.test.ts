import { describe, expect, it } from 'vitest';
import { BUSINESS, getBrandInfo } from './business';

describe('seo/business', () => {
  it('exposes the canonical NAP', () => {
    expect(BUSINESS.streetAddress).toBe('659A Lạc Long Quân');
    expect(BUSINESS.phoneE164).toBe('+84899191313');
    expect(BUSINESS.phoneDisplay).toBe('0899.191.313');
  });

  it('identifies Bitburger and Köstritzer as their own beer brands', () => {
    expect(getBrandInfo('Bitburger Premium Pils').brand).toBe('Bitburger');
    expect(getBrandInfo('Bitburger Premium Pils').isAwardWinner).toBe(false);
    expect(getBrandInfo('Köstritzer Schwarzbier Bom 5L').brand).toBe('Köstritzer');
    expect(getBrandInfo('Köstritzer Schwarzbier Bom 5L').isBeer).toBe(true);
  });

  it('treats wine as non-beer with its own brand (no Reinheitsgebot/award)', () => {
    const info = getBrandInfo('Vang Trắng Thörle Riesling 750ml', 'vang');
    expect(info.isBeer).toBe(false);
    expect(info.isAwardWinner).toBe(false);
    expect(info.brand).toBe('Thörle');
  });

  it('marks Benediktiner Weissbier Naturtrüb as award winner, Dunkel not', () => {
    expect(getBrandInfo('Benediktiner Naturtrüb — Thùng 12 Chai 500ml').brand).toBe('Benediktiner');
    expect(getBrandInfo('Benediktiner Naturtrüb — Thùng 12 Chai 500ml').isAwardWinner).toBe(true);
    expect(getBrandInfo('Benediktiner Dunkel — Thùng 12 Lon 500ml').isAwardWinner).toBe(false);
  });
});
