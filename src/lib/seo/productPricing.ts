import productsData from '@/data/products.json';

interface RawProduct {
  name: string;
  slug: string | null;
  price: number | null;
  category: string | null;
}

export interface PriceRange {
  lowPrice: number;
  highPrice: number;
  offerCount: number;
}

/**
 * Tính khoảng giá của một dòng sản phẩm (nhiều SKU) từ products.json.
 * Bỏ qua sản phẩm không có giá số dương. Trả null nếu không có SKU nào hợp lệ.
 */
export function getPriceRange(
  predicate: (p: { name: string; category: string | null }) => boolean,
): PriceRange | null {
  const prices = (productsData as unknown as RawProduct[])
    .filter((p) => predicate({ name: p.name || '', category: p.category }))
    .map((p) => p.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  if (prices.length === 0) return null;
  return { lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length };
}
