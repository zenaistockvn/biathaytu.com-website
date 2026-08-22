import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
import { PRODUCT_IMAGE_PLACEHOLDER } from './productImage';
import { toBrochureMetadataCopy } from '@/lib/seo/metadataCopy';

export const MAX_SHORT_DESCRIPTION_LENGTH = 90;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription?: string;
  imageTodo?: string;
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

export const HIDDEN_PRODUCT_SLUGS = new Set<string>([
  'kostritzer-schwarzbier-bom-5l',
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
]);

export const PRODUCT_IMAGE_TODOS: Readonly<Record<string, string>> = {
  'kostritzer-schwarzbier-bom-5l':
    'TODO: Bổ sung ảnh đúng của Köstritzer Schwarzbier Bom 5L; ảnh Bitburger cũ không được dùng.',
  'combo-bavaria-party-benediktiner-weissbier-xuc-xich':
    'TODO: Bổ sung ảnh đúng của thùng 12 chai Benediktiner Naturtrüb + xúc xích 500g; không dùng ảnh thùng lon Festbier.',
  'combo-oktoberfest-keg-kostritzer-xuc-xich':
    'TODO: Bổ sung ảnh đúng của Köstritzer Schwarzbier Bom 5L + xúc xích Wiener 500g.',
  'thorle-sauvignon-blanc-magnum':
    'TODO: Bổ sung ảnh local đúng của Thörle Sauvignon Blanc Magnum 1,5L.',
  'thorle-riesling-magnum':
    'TODO: Bổ sung ảnh local đúng của Thörle Riesling Magnum 1,5L.',
  'benediktiner-mix-2-v-thng-12-chai-500ml':
    'TODO: Bổ sung ảnh local đúng của thùng Benediktiner Mix 2 Vị 12 chai 500ml.',
  'benediktiner-naturtrub-thung-12-lon-500ml':
    'TODO: Bổ sung ảnh local đúng quy cách thùng 12 lon Benediktiner Naturtrüb 500ml.',
  'benediktiner-dunkel-thung-12-lon-500ml':
    'TODO: Bổ sung ảnh local đúng quy cách thùng 12 lon Benediktiner Dunkel 500ml.',
  'benediktiner-naturtrub-bom-5l':
    'TODO: Bổ sung ảnh local đúng của Benediktiner Naturtrüb Bom 5L.',
  'b-6-cc-benediktiner-chnh-hng-500ml':
    'TODO: Bổ sung ảnh local đúng của bộ 6 cốc Benediktiner 500ml.',
} as const;

const LOCAL_IMAGE_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
  'rappenhof-riesling-auslese-2014': [
    '/images/products/official/rappenhof/riesling_auslese_bottle.png',
  ],
  'thorle-kabinett': ['/images/products/official/thorle/kabinett_bottle.png'],
  'austernkalk-riesling-trocken-magnum': [
    '/images/products/official/thorle/austernkalk_magnum_bottle.jpg',
  ],
  'thorle-riesling': ['/images/products/official/thorle/riesling_750_bottle.png'],
  'rappenhof-riesling-kabinett': [
    '/images/products/official/rappenhof/riesling_kabinett_bottle.png',
  ],
  'thorle-spatburgunder': ['/images/products/official/thorle/spatburgunder_bottle.png'],
  'rappenhof-riesling-trocken': [
    '/images/products/official/rappenhof/riesling_trocken_bottle.png',
  ],
  'benediktiner-naturtrub-thung-12-chai-500ml': [
    '/images/products/official/benediktiner/benediktiner-natutrub-1_d6fbd33c3762488db373ec581fe72a85.png',
  ],
  'benediktiner-dunkel-thung-12-chai-500ml': [
    '/images/products/official/benediktiner/benediktiner-dunkel-1_13c8182e69d04b45942a07a157ccbb09.png',
  ],
  'benediktiner-naturtrub-ket-24-lon-500ml': [
    '/images/products/official/benediktiner/benediktiner-natutrub-lon-1_a69ea226e5394f01aeca3efb96a3cfd9.png',
  ],
  'benediktiner-dunkel-ket-24-lon-500ml': [
    '/images/products/official/benediktiner/113_cbaf0be4ae9d4e8486a5e81de930bc46.png',
  ],
  'm-bia-chnh-hng-benediktiner': [
    '/images/products/official/benediktiner/124_43ed2d310d7b45a6a7c3cd065e139b25.png',
  ],
} as const;

const LEGACY_HARAVAN_IMAGE_HOST = ['product', 'hstatic', 'net'].join('.');
const STOREFRONT_CATEGORIES = new Set(['bia', 'vang', 'phu-kien', 'xuc-xich', 'combo']);

const CATEGORY_SHORT_DESCRIPTION: Record<string, string> = {
  bia: 'Bia Đức tuyển chọn với hương vị cân bằng, phù hợp nhiều cách thưởng thức.',
  vang: 'Vang Đức tuyển chọn với hương vị đặc trưng, phù hợp dùng cùng món ăn.',
  'phu-kien': 'Phụ kiện thưởng thức bia Đức, phù hợp dùng tại nhà hoặc làm quà tặng.',
  'xuc-xich': 'Xúc xích kiểu Đức đậm vị, phù hợp áp chảo, nướng và dùng cùng bia.',
  combo: 'Combo phong cách Đức kết hợp bia và món ăn kèm cho bàn tiệc trọn vị.',
};

function isStorefrontProduct(product: Product): boolean {
  return Boolean(
    product.id &&
      product.name &&
      product.slug &&
      product.category &&
      STOREFRONT_CATEGORIES.has(product.category),
  );
}

function hasPublicRetailPrice(product: Product): boolean {
  return typeof product.price === 'number' && Number.isFinite(product.price) && product.price > 0;
}

function isLegacyHaravanImage(image: string): boolean {
  try {
    return new URL(image).hostname === LEGACY_HARAVAN_IMAGE_HOST;
  } catch {
    return false;
  }
}

function normalizeProductImages(product: Product): string[] {
  const override = LOCAL_IMAGE_OVERRIDES[product.slug];
  if (override) return [...override];

  const images = Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string =>
          typeof image === 'string' && image.length > 0 && !isLegacyHaravanImage(image),
      )
    : [];

  return images.length > 0 ? images : [PRODUCT_IMAGE_PLACEHOLDER];
}

function asCompleteSentence(value: string): string {
  const clean = value.trim().replace(/[,:;\-–—]+$/, '').replace(/[.!?]+$/, '');
  return clean ? `${clean}.` : '';
}

function buildShortDescription(product: Product, description: string | null): string {
  const supplied = asCompleteSentence(product.shortDescription || '');
  if (supplied && supplied.length <= MAX_SHORT_DESCRIPTION_LENGTH) return supplied;

  if (description) {
    const firstSentence = description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
    if (firstSentence && firstSentence.length <= MAX_SHORT_DESCRIPTION_LENGTH) {
      return asCompleteSentence(firstSentence);
    }
  }

  const conciseName = product.name.split(/\s+[—–]\s+|\s+-\s+/)[0].trim();
  const namedCandidate = asCompleteSentence(`${conciseName} là sản phẩm Đức được tuyển chọn cho trải nghiệm thưởng thức`);
  if (namedCandidate.length <= MAX_SHORT_DESCRIPTION_LENGTH) return namedCandidate;

  return CATEGORY_SHORT_DESCRIPTION[product.category || ''] ||
    'Sản phẩm Đức tuyển chọn với thông tin rõ ràng và trải nghiệm thưởng thức chỉn chu.';
}

function mergeStorefrontProducts(primary: Product[], supplemental: Product[]): Product[] {
  const productsBySlug = new Map<string, Product>();

  for (const product of [...primary, ...supplemental]) {
    if (!isStorefrontProduct(product) || productsBySlug.has(product.slug)) continue;

    const normalizedDescription = toBrochureMetadataCopy(product.description) || product.description;
    const imageTodo = PRODUCT_IMAGE_TODOS[product.slug] || product.imageTodo;
    const item: Product = {
      ...product,
      description: normalizedDescription,
      shortDescription: buildShortDescription(product, normalizedDescription),
      images: normalizeProductImages(product),
      ...(imageTodo ? { images: [PRODUCT_IMAGE_PLACEHOLDER], imageTodo } : {}),
    };

    if (HIDDEN_PRODUCT_SLUGS.has(item.slug) || !hasPublicRetailPrice(item)) item.hidden = true;
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

function isBitburger(name: string): boolean {
  return name.toLowerCase().includes('bitburger');
}

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

export function getVisibleProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => !p.hidden && !HIDDEN_PRODUCT_SLUGS.has(p.slug) && hasPublicRetailPrice(p));
}

export function getProductBySlugOrId(key: string): Product | null {
  return ALL_PRODUCTS.find((p) => p.slug === key || p.id === key) ?? null;
}

export function getBeerProducts(opts?: { excludeBitburger?: boolean }): Product[] {
  return getVisibleProducts().filter(
    (p) => p.category === 'bia' && (!opts?.excludeBitburger || !isBitburger(p.name)),
  );
}

export function getAccessories(): Product[] {
  return getVisibleProducts().filter((p) => p.category === 'phu-kien');
}

export function getSausageProducts(): Product[] {
  return getVisibleProducts().filter((p) => p.category === 'xuc-xich');
}

export function getRelatedBeers(excludeId: string, limit = 4): Product[] {
  return getVisibleProducts().filter(
    (p) => p.category === 'bia' && p.id !== excludeId && !isBitburger(p.name),
  ).slice(0, limit);
}

export function getFeaturedBeers(limit = 3): Product[] {
  return getVisibleProducts().filter(
    (p) => p.is_featured && p.category !== 'vang' && !isBitburger(p.name),
  ).slice(0, limit);
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
