import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
import { resolveProductImages } from './productImages';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';
import { COMPANY_CONFIG } from '@/config/company';
import renamedProductSlugs from '@/config/renamed-product-slugs.json';
import { getLineForName, type LineId } from '@/config/productLines';

/** Slug database bị mất dấu → slug hiển thị; slug cũ chuyển 301 trong next.config.js. */
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
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
]);

const BITBURGER_DIR = '/images/products/official/bitburger';
const BENEDIKTINER_DIR = '/images/products/official/benediktiner';

// Ảnh sản phẩm chụp riêng, nền trong suốt, một đơn vị đúng quy cách (xem SOURCES.md cùng thư mục).
const PACKSHOT = {
  bitPils330Can: `${BITBURGER_DIR}/490201_Bitb_Pils_033l_Can_front_Europe.webp`,
  bitPils500Can: `${BITBURGER_DIR}/90160_Bitburger_05l_Dose_frontal_unbetaut_LG.webp`,
  bitPils330Bottle: `${BITBURGER_DIR}/flasche_longneck_033l_pils_frontal_betaut_V8.webp`,
  bitAlcoholFree330Can: `${BITBURGER_DIR}/387930_Bitb_00_Pils_033l_Can_front_Europe.webp`,
  naturtrubBottle: `${BENEDIKTINER_DIR}/86480_Benediktiner_Weiss_NT_Flasche_05l_betaut.webp`,
  naturtrubCan: `${BENEDIKTINER_DIR}/87205_Bene_Weissbier_05l_Dose_frontal_Export.webp`,
  naturtrubKeg: `${BENEDIKTINER_DIR}/438775_Bene_Weissbier_NT_5l_Keg_front.webp`,
  dunkelBottle: `${BENEDIKTINER_DIR}/57425_Benediktiner_Dunklel_VO_E-Hinweis.webp`,
  dunkelCan: `${BENEDIKTINER_DIR}/439144_Bene_Weissbier_Dunkel_05l_Can_front.webp`,
  mixBottles: `${BENEDIKTINER_DIR}/mix_naturtrub_dunkel_chai_05l.webp`,
};

/**
 * Sửa theo slug khi render, vì `npm run build` đổ lại products.json từ database.
 * - images: ảnh phải khớp quy cách (lon ra lon, chai ra chai, đúng dung tích). Ảnh banner Haravan
 *   (chữ, ruy băng, bàn gỗ) được thay bằng ảnh chụp riêng sản phẩm để lưới thẻ đồng bộ.
 * - sort_order: database để 0 cho vài SKU nên Festbier đứng trước Naturtrüb; xếp lại theo dòng bia.
 */
const PRODUCT_OVERRIDES: Record<string, Partial<Pick<Product, 'images' | 'sort_order' | 'volume'>>> = {
  'benediktiner-naturtrub-thung-12-chai-500ml': { images: [PACKSHOT.naturtrubBottle] },
  'benediktiner-dunkel-thung-12-chai-500ml': { images: [PACKSHOT.dunkelBottle] },
  // Banner cũ ghi "12 chai Natutrub & 12 chai Dunkel" trong khi thùng chỉ có 6 + 6 chai.
  'benediktiner-mix-2-vi-thung-12-chai-500ml': { images: [PACKSHOT.mixBottles] },
  'benediktiner-naturtrub-thung-12-lon-500ml': { images: [PACKSHOT.naturtrubCan] },
  'benediktiner-dunkel-thung-12-lon-500ml': { images: [PACKSHOT.dunkelCan] },
  'benediktiner-naturtrub-bom-5l': { images: [PACKSHOT.naturtrubKeg] },
  'benediktiner-naturtrub-ket-24-lon-500ml': { images: [PACKSHOT.naturtrubCan] },
  'benediktiner-dunkel-ket-24-lon-500ml': { images: [PACKSHOT.dunkelCan] },
  'benediktiner-festbier-ket-24-lon-500ml': { sort_order: 9 },
  'benediktiner-festbier-bom-5l': { sort_order: 9.5 },
  // Thùng chai 330ml đang dùng ảnh chai 0,5L; két lon 330ml đang dùng ảnh chai.
  'bitburger-premium-pils-thung-12-chai-330ml': { images: [PACKSHOT.bitPils330Bottle], sort_order: 10 },
  'bitburger-premium-pils-ket-24-lon-330ml': { images: [PACKSHOT.bitPils330Can] },
  'bitburger-00-alkoholfrei-ket-24-lon-330ml': { images: [PACKSHOT.bitAlcoholFree330Can] },
  // Mô tả là lon 500ml lẻ nhưng ảnh là chai 0,5L kèm ly.
  'bitburger-premium-pils': { images: [PACKSHOT.bitPils500Can] },
  // Đồ mở bia không có dung tích (database ghi "500ml / 330ml / 5L").
  'mo-bia-chinh-hang-benediktiner': { volume: null },
};

/**
 * Độ đắng theo cơ sở dữ liệu sản phẩm của Bitburger Braugruppe (bitburger-braugruppe.de/produktdatenbank).
 * Database của site ghi lệch (Bitburger Pils 25, 0.0% là 20) và để trống ở nhiều quy cách Naturtrüb.
 * Festbier không có trong cơ sở dữ liệu đó nên giữ nguyên.
 */
function officialIbu(name: string): number | null {
  const n = name.toLowerCase();
  if (/bitburger 0[.,]0/.test(n)) return 23;
  if (/bitburger premium pils|bitburger football/.test(n)) return 33;
  if (/benediktiner (weissbier )?(naturtrüb|dunkel|mix)/.test(n)) return 13;
  return null;
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

    const slug = RENAMED_PRODUCT_SLUGS[product.slug] ?? product.slug;
    const override = PRODUCT_OVERRIDES[slug];
    const item = {
      ...product,
      slug,
      ...override,
      ibu: product.category === 'bia' || product.category === 'combo' ? officialIbu(product.name) ?? product.ibu : product.ibu,
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
