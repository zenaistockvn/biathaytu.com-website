import productsData from '@/data/products.json';
import { resolveProductImages } from './productImages';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';
import { COMPANY_CONFIG } from '@/config/company';
import renamedProductSlugs from '@/config/renamed-product-slugs.json';
import { getLineForName, type LineId } from '@/config/productLines';

/*
 * Dữ liệu sản phẩm lấy thẳng từ src/data/products.json: file này là nguồn chính (10/2026), không còn đổ lại
 * từ database khi build. Sửa tên, mô tả, ảnh, IBU, thứ tự thì sửa thẳng trong JSON.
 * - Ảnh: chỉ ảnh chính hãng, khớp quy cách (lon ra lon, chai ra chai, đúng dung tích); xem SOURCES.md
 *   trong public/images/products/official/.
 * - IBU: theo cơ sở dữ liệu sản phẩm của Bitburger Braugruppe (bitburger-braugruppe.de/produktdatenbank):
 *   Bitburger Premium Pils 33, Bitburger 0,0% 23, Benediktiner Naturtrüb, Dunkel, Mix 13.
 * - Mô tả: theo rà soát tuân thủ 10/2026 (không hứa giao hàng, Benediktiner ủ tại Lich với men hầm Ettal,
 *   không "số 1" khi chưa có nguồn, không gắn bia với lái xe hay thể thao).
 */

/** Slug cũ bị mất dấu → slug mới; slug cũ chuyển 301 trong next.config.js. */
export const RENAMED_PRODUCT_SLUGS: Readonly<Record<string, string>> = renamedProductSlugs;

/**
 * Kiểu sản phẩm cho phần catalog giới thiệu.
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
  hidden?: boolean;
}

/**
 * SKU tạm ẩn khỏi catalog kèm lý do. Xóa slug khỏi danh sách này khi đủ dữ liệu/ảnh để hiển thị lại.
 */
export const HIDDEN_PRODUCT_SLUGS = new Set<string>([
  'kostritzer-schwarzbier-bom-5l',
]);

// Xúc xích The Wurst và combo tặng xúc xích đã ngừng cung cấp (09/2026); slug cũ chuyển 301 trong next.config.js.
const STOREFRONT_CATEGORIES = new Set(['bia', 'vang', 'phu-kien']);
function isStorefrontProduct(product: Product): boolean {
  return Boolean(
    product.id &&
      product.name &&
      product.slug &&
      product.category &&
      STOREFRONT_CATEGORIES.has(product.category),
  );
}

function isBenediktinerBeer(product: Product): boolean {
  return product.category === 'bia' && product.name.toLowerCase().includes('benediktiner');
}

/** Quy tắc chung, chạy lại vô hại trên mô tả đã sạch: chặn địa chỉ showroom cũ quay lại. */
function sanitizeProductDescription(description: string | null): string | null {
  if (!description) return description;

  return description
    .replace(
      /Phân phối chính hãng tại Tây Hồ, Hà Nội/gi,
      `Phân phối chính hãng tại ${COMPANY_CONFIG.showroomAddress}`,
    )
    .replace(
      /Đại lý bia nhập khẩu Tây Hồ/gi,
      'Bia Thầy Tu tại Ngọc Hà, Hà Nội',
    )
    .replace(/(?:số\s+)?26 Vạn Phúc,\s*Ba Đình,\s*Hà Nội/gi, COMPANY_CONFIG.showroomAddress)
    .replace(/tại Tây Hồ, Hà Nội/gi, 'tại Hà Nội');
}

function mergeStorefrontProducts(products: Product[]): Product[] {
  const productsBySlug = new Map<string, Product>();

  for (const product of products) {
    if (!isStorefrontProduct(product) || productsBySlug.has(product.slug)) {
      continue;
    }

    const slug = RENAMED_PRODUCT_SLUGS[product.slug] ?? product.slug;
    const item = {
      ...product,
      slug,
      images: resolveProductImages(product.images),
      description: sanitizeProductDescription(toBrochureMetadataCopy(product.description) || product.description),
    };
    if (HIDDEN_PRODUCT_SLUGS.has(item.slug)) {
      item.hidden = true;
    }

    productsBySlug.set(item.slug, item);
  }

  return Array.from(productsBySlug.values()).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}

const ALL_PRODUCTS: Product[] = mergeStorefrontProducts(productsData as unknown as Product[]);

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

export function getVisibleProducts(): Product[] {
  return ALL_PRODUCTS.filter(
    (product) =>
      !product.hidden &&
      !HIDDEN_PRODUCT_SLUGS.has(product.slug),
  );
}

export function getProductBySlugOrId(key: string): Product | null {
  return ALL_PRODUCTS.find((product) => product.slug === key || product.id === key) ?? null;
}

/** Các SKU bia đang hiển thị thuộc một dòng bia (audit A2). */
export function getLineProducts(lineId: LineId): Product[] {
  return getBeerProducts().filter((product) => getLineForName(product.name)?.id === lineId);
}

export function getBeerProducts(opts?: { excludeBitburger?: boolean }): Product[] {
  return getVisibleProducts().filter(
    (product) =>
      product.category === 'bia' &&
      (!opts?.excludeBitburger || !product.name.toLowerCase().includes('bitburger')),
  );
}

export function getAccessories(): Product[] {
  return getVisibleProducts().filter((p) => p.category === 'phu-kien');
}

export function getRelatedBeers(excludeId: string, limit = 4): Product[] {
  return getBeerProducts().filter((product) => product.id !== excludeId).slice(0, limit);
}

export function getFeaturedBeers(limit = 3): Product[] {
  return getBeerProducts({ excludeBitburger: true })
    .filter((product) => product.is_featured && isBenediktinerBeer(product))
    .slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return getVisibleProducts().filter((p) => p.category === category);
}
