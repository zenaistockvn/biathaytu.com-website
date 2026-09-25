import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
import { resolveProductImages } from './productImages';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';
import { COMPANY_CONFIG } from '@/config/company';

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
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
]);

const BITBURGER_DIR = '/images/products/official/bitburger';

/**
 * Sửa theo slug khi render, vì `npm run build` đổ lại products.json từ database.
 * - images: ảnh phải khớp quy cách (lon ra lon, chai ra chai, đúng dung tích nếu có ảnh).
 * - sort_order: database để 0 cho vài SKU nên Festbier đứng trước Naturtrüb; xếp lại theo dòng bia.
 */
const PRODUCT_OVERRIDES: Record<string, Partial<Pick<Product, 'images' | 'sort_order'>>> = {
  // Két lon 330ml đang dùng ảnh chai longneck. Chưa có ảnh lon 330ml chính hãng nên tạm dùng ảnh lon.
  'bitburger-premium-pils-ket-24-lon-330ml': { images: [`${BITBURGER_DIR}/90160_Bitburger_05l_Dose_frontal_unbetaut_LG.webp`] },
  // Thùng chai 330ml đang dùng ảnh chai 0,5L; đổi sang chai longneck 330ml.
  'bitburger-premium-pils-thung-12-chai-330ml': {
    images: [`${BITBURGER_DIR}/flasche_longneck_033l_pils_frontal_betaut_V8.webp`],
    sort_order: 10,
  },
  // Mô tả là lon 500ml lẻ nhưng ảnh là chai 0,5L kèm ly.
  'bitburger-premium-pils': { images: [`${BITBURGER_DIR}/90160_Bitburger_05l_Dose_frontal_unbetaut_LG.webp`] },
  'benediktiner-festbier-ket-24-lon-500ml': { sort_order: 9 },
  'benediktiner-festbier-bom-5l': { sort_order: 9.5 },
};

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

function isBenediktinerBeer(product: Product): boolean {
  return product.category === 'bia' && product.name.toLowerCase().includes('benediktiner');
}

function sanitizeProductDescription(description: string | null): string | null {
  if (!description) return description;

  return description
    .replace(
      /Phân phối chính hãng tại Tây Hồ, Hà Nội/gi,
      `Phân phối chính hãng tại ${COMPANY_CONFIG.showroomAddress}`,
    )
    .replace(
      /Đại lý bia nhập khẩu Tây Hồ/gi,
      'Bia Thầy Tu tại Ba Đình, Hà Nội',
    )
    // Showroom đã chuyển về Ba Đình; mô tả cũ còn nhắc Tây Hồ.
    .replace(/tại Tây Hồ, Hà Nội/gi, 'tại Hà Nội');
}

function mergeStorefrontProducts(primary: Product[], supplemental: Product[]): Product[] {
  const productsBySlug = new Map<string, Product>();

  for (const product of [...primary, ...supplemental]) {
    if (!isStorefrontProduct(product) || productsBySlug.has(product.slug)) {
      continue;
    }

    const override = PRODUCT_OVERRIDES[product.slug];
    const item = {
      ...product,
      ...override,
      images: resolveProductImages(override?.images ?? product.images),
      description: sanitizeProductDescription(
        toBrochureMetadataCopy(product.description) || product.description,
      ),
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

const ALL_PRODUCTS: Product[] = mergeStorefrontProducts(
  (productsData as unknown as Product[]).slice(),
  LOCAL_STOREFRONT_PRODUCTS,
);

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

export function getSausageProducts(): Product[] {
  return getVisibleProducts().filter((p) => p.category === 'xuc-xich');
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

export function getComboProducts(): Product[] {
  return getVisibleProducts().filter((p) => p.category === 'combo');
}

export function getRelatedCombo(beerNameOrSlug: string): Product | null {
  const nameLower = beerNameOrSlug.toLowerCase();
  const combos = getComboProducts();

  if (nameLower.includes('bitburger')) {
    return combos.find((combo) => combo.slug.includes('bitburger')) ?? null;
  }

  if (nameLower.includes('benediktiner')) {
    return combos.find((combo) => combo.slug.includes('benediktiner')) ?? null;
  }

  return null;
}
