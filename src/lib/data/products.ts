import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';

/**
 * Kiểu sản phẩm cho phần web bán lẻ.
 * Khai báo `abv: string | null` để khớp ProductCard/ProductTabs (runtime có thể là số,
 * render `{abv}%` vẫn đúng). JSON được ép kiểu qua `unknown` một lần tại đây.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  abv: string | null;
  ibu: number | null;
  volume: string | null;
  images: string[] | null;
  price: number | null;
  haravan_url: string | null;
  category: string | null;
  sort_order: number;
  is_featured: boolean;
  origin: string | null;
  updated_at: string | null;
}

const STOREFRONT_CATEGORIES = new Set(['bia', 'vang', 'phu-kien', 'xuc-xich', 'combo']);

function isStorefrontProduct(product: Product): boolean {
  return Boolean(
    product.id &&
      product.name &&
      product.slug &&
      product.category &&
      STOREFRONT_CATEGORIES.has(product.category),
  );
}

function mergeStorefrontProducts(primary: Product[], supplemental: Product[]): Product[] {
  const productsBySlug = new Map<string, Product>();

  for (const product of [...primary, ...supplemental]) {
    if (!isStorefrontProduct(product) || productsBySlug.has(product.slug)) {
      continue;
    }

    productsBySlug.set(product.slug, product);
  }

  return Array.from(productsBySlug.values()).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}

const ALL_PRODUCTS: Product[] = mergeStorefrontProducts(
  (productsData as unknown as Product[]).slice(),
  LOCAL_STOREFRONT_PRODUCTS,
);

function isBitburger(name: string): boolean {
  return name.toLowerCase().includes('bitburger');
}

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

export function getProductBySlugOrId(key: string): Product | null {
  return ALL_PRODUCTS.find((p) => p.slug === key || p.id === key) ?? null;
}

export function getBeerProducts(opts?: { excludeBitburger?: boolean }): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.category === 'bia' && (!opts?.excludeBitburger || !isBitburger(p.name)),
  );
}

export function getAccessories(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === 'phu-kien');
}

export function getSausageProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === 'xuc-xich');
}

export function getRelatedBeers(excludeId: string, limit = 4): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.category === 'bia' && p.id !== excludeId && !isBitburger(p.name),
  ).slice(0, limit);
}

export function getFeaturedBeers(limit = 3): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.is_featured && p.category !== 'vang' && !isBitburger(p.name),
  ).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}

export function getComboProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === 'combo');
}

export function getRelatedCombo(beerNameOrSlug: string): Product | null {
  const nameLower = beerNameOrSlug.toLowerCase();
  const combos = getComboProducts();
  if (nameLower.includes('bitburger')) {
    return combos.find((c) => c.slug.includes('bitburger')) ?? combos[0] ?? null;
  }
  if (nameLower.includes('benediktiner')) {
    return combos.find((c) => c.slug.includes('benediktiner')) ?? combos[0] ?? null;
  }
  if (nameLower.includes('kostritzer') || nameLower.includes('schwarzbier') || nameLower.includes('keg') || nameLower.includes('bom')) {
    return combos.find((c) => c.slug.includes('kostritzer')) ?? combos[0] ?? null;
  }
  return combos[0] ?? null;
}
