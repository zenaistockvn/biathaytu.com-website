import promoData from '@/data/promo_codes.json';

export interface PromoCode {
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  min_order_value?: number;
  is_active: boolean;
  expires_at?: string | null;
}

export function getActivePromoByCode(code: string): PromoCode | null {
  const normalized = code.trim().toUpperCase();
  return (
    (promoData as unknown as PromoCode[]).find(
      (p) => p.code.toUpperCase() === normalized && p.is_active,
    ) ?? null
  );
}
