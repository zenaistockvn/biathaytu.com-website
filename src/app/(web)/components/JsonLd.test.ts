import { describe, expect, it } from 'vitest';
import { getProductSchema } from './JsonLd';

describe('getProductSchema brand + offers', () => {
  it('uses the real brand for Bitburger (not Benediktiner)', () => {
    const s = getProductSchema({ id: 'test-bitburger', name: 'Bitburger Premium Pils', slug: 'bitburger-premium-pils', category: 'bia' });
    expect(s.brand.name).toBe('Bitburger');
    // KHÔNG gắn giải iTQi cho Bitburger
    expect((s as Record<string, unknown>).award).toBeUndefined();
  });

  it('does not apply Reinheitsgebot/award to wine', () => {
    const s = getProductSchema({ id: 'test-wine', name: 'Vang Trắng Thörle Riesling 750ml', slug: 'thorle-riesling', category: 'vang' });
    expect(s.brand.name).toBe('Thörle');
    const props = (s.additionalProperty as Array<{ name: string }>).map((p) => p.name);
    expect(props).not.toContain('Brewing Standard');
  });

  it('emits a single Offer when price is given', () => {
    const s = getProductSchema({ id: 'test-benediktiner-single', name: 'Benediktiner Naturtrüb', slug: 'x', price: 990000, category: 'bia' });
    expect(s.offers?.['@type']).toBe('Offer');
    expect(s.offers?.price).toBe(990000);
    expect((s as Record<string, unknown>).award).toBe('iTQi Superior Taste Award 3 Stars 2022');
  });

  it('emits an AggregateOffer for a product line price range', () => {
    const s = getProductSchema({ id: 'test-benediktiner-agg', name: 'Benediktiner Naturtrüb', slug: 'x', priceFrom: 790000, priceTo: 1550000, offerCount: 4, category: 'bia' });
    expect(s.offers?.['@type']).toBe('AggregateOffer');
    expect(s.offers?.lowPrice).toBe(790000);
    expect(s.offers?.highPrice).toBe(1550000);
  });
});
