import productsData from '@/data/products.json';
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
const PRODUCT_OVERRIDES: Record<string, Partial<Pick<Product, 'images' | 'sort_order' | 'volume' | 'description' | 'name'>>> = {
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
 * Mô tả viết lại theo rà soát tuân thủ 10/2026: bỏ hứa giao hàng, "ủ tại tu viện Ettal", "bia Bavaria",
 * "thầy tu nấu", "số 1" không nguồn, câu gắn bia với lái xe, thể thao. Nguồn: bitburger.de,
 * bitburger-international.com (Benediktiner ủ tại Lich với men hầm tu viện Ettal), taste-institute.com.
 * Database vẫn giữ mô tả cũ nên đè lúc render.
 */
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  'bitburger-premium-pils-thung-12-chai-330ml':
    'Bitburger Premium Pils thùng 12 chai thủy tinh 330ml. Pilsner của nhà bia gia đình Bitburger, thành lập năm 1817 tại Bitburg, vùng Eifel, nấu theo Luật Tinh khiết 1516 với hoa bia Siegelhopfen. Màu vàng sáng, bọt mịn, vị đắng hoa bia rõ, hậu vị khô. Phục vụ lạnh 4-6 °C, hợp món chiên, nướng và hải sản.',
  'benediktiner-festbier-ket-24-lon-500ml':
    'Benediktiner Festbier két 24 lon 500ml. Dòng bia mùa lễ hội của Benediktiner, ủ tại Lich (Hessen) theo công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal. Nồng độ 5,8%, màu vàng hổ phách, thân và vị mạch nha đậm hơn Naturtrüb, hoa bia đắng nhẹ. Phục vụ 6-8 °C, hợp món nướng, thịt heo quay, khoai tây.',
  'kostritzer-schwarzbier-bom-5l':
    'Köstritzer Schwarzbier bom 5L. Bia đen của nhà bia Köstritzer ở Bad Köstritz, bang Thüringen. Màu nâu đen, hương mạch nha rang, thân nhẹ, vị khô, không ngọt nặng. Bom có van xả khí và vòi rót sẵn, ướp tủ mát 6-8 tiếng trước khi dùng. Phục vụ 7-9 °C.',
  'benediktiner-festbier-bom-5l':
    'Benediktiner Festbier bom 5L. Dòng bia mùa lễ hội của Benediktiner, nồng độ 5,8%, thân và vị mạch nha đậm hơn Naturtrüb. Bom có van xả khí ở nắp và vòi rót ở chân, không cần máy hay bình CO2; ướp tủ mát 6-8 tiếng trước khi rót. Phục vụ 6-8 °C, hợp món nướng và thịt heo quay.',
  'benediktiner-naturtrub-thung-12-chai-500ml':
    'Benediktiner Weissbier Naturtrüb thùng 12 chai 500ml. Bia lúa mì đục tự nhiên, không lọc nên còn men trong chai, ủ tại Lich (Hessen) theo công thức gốc dòng Biển Đức với men từ hầm tu viện Ettal. Đạt iTQi Superior Taste Award 3 sao năm 2022. Hương chuối chín và đinh hương, bọt dày, thân mềm, nồng độ 5,4%. Phục vụ 7-9 °C trong ly Weizen, hợp hải sản hấp, salad, món ít gia vị.',
  'benediktiner-dunkel-thung-12-chai-500ml':
    'Benediktiner Weissbier Dunkel thùng 12 chai 500ml. Bia lúa mì sẫm màu, ủ tại Lich (Hessen) theo công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal. Màu nâu đồng, hương mạch nha rang, caramel, bánh mì nướng; độ đắng thấp, nồng độ 5,4%. Phục vụ 8-10 °C, hợp thịt nướng, sườn heo, phô mai lâu năm.',
  'benediktiner-mix-2-vi-thung-12-chai-500ml':
    'Thùng 12 chai 500ml gồm 6 chai Benediktiner Weissbier Naturtrüb và 6 chai Benediktiner Weissbier Dunkel. Một bên vàng đục, hương chuối chín và đinh hương; một bên nâu đồng, hương mạch nha rang và caramel. Hợp để nếm cả hai dòng, hoặc làm quà biếu.',
  'benediktiner-naturtrub-thung-12-lon-500ml':
    'Benediktiner Weissbier Naturtrüb thùng 12 lon 500ml. Cùng loại bia lúa mì đục tự nhiên như bản chai, đóng lon nhẹ và gọn hơn khi mang đi. Hương chuối chín và đinh hương, bọt dày, nồng độ 5,4%. Rót gần hết thì lắc nhẹ lon cho tan lớp men dưới đáy rồi rót nốt. Phục vụ 7-9 °C.',
  'benediktiner-dunkel-thung-12-lon-500ml':
    'Benediktiner Weissbier Dunkel thùng 12 lon 500ml. Bia lúa mì sẫm màu đóng lon, hương mạch nha rang và caramel, độ đắng thấp, nồng độ 5,4%. Đừng ướp quá lạnh: 8-10 °C là vừa, lạnh hơn thì mùi caramel mất. Hợp thịt nướng và sườn heo.',
  'benediktiner-naturtrub-bom-5l':
    'Benediktiner Weissbier Naturtrüb bom 5L. Bia lúa mì đục tự nhiên, đạt iTQi Superior Taste Award 3 sao năm 2022. Bom có van xả khí ở nắp và vòi rót ở chân, không cần máy chiết hay bình CO2; ướp tủ mát 6-8 tiếng trước khi dùng. Hương chuối chín và đinh hương, nồng độ 5,4%, phục vụ 7-9 °C.',
  'benediktiner-naturtrub-ket-24-lon-500ml':
    'Benediktiner Weissbier Naturtrüb két 24 lon 500ml, quy cách cho nhà hàng, khách sạn và các buổi tiếp khách đông người. Bia lúa mì đục tự nhiên, hương chuối chín và đinh hương, bọt dày, nồng độ 5,4%. Phục vụ 7-9 °C trong ly Weizen.',
  'benediktiner-dunkel-ket-24-lon-500ml':
    'Benediktiner Weissbier Dunkel két 24 lon 500ml, quy cách cho nhà hàng, khách sạn và tiệc đông người. Bia lúa mì sẫm màu, hương mạch nha rang, caramel và bánh mì nướng, độ đắng thấp, nồng độ 5,4%. Phục vụ 8-10 °C, hợp các món nướng.',
  'bitburger-premium-pils-ket-24-lon-330ml':
    'Bitburger Premium Pils két 24 lon 330ml. Theo nhà sản xuất, đây là Premium Pils được rót nhiều nhất tại các quầy bia ở Đức. Nấu theo Luật Tinh khiết 1516 với hoa bia Siegelhopfen trồng ở vùng Hallertau (Bavaria) và Holsthum (Nam Eifel). Màu vàng sáng, đắng hoa bia rõ, hậu vị khô. Phục vụ 4-6 °C.',
  'bitburger-football-edition-2026':
    'Bitburger Premium Pils két 24 lon 500ml, bao bì Football Edition 2026. Bên trong là Bitburger Premium Pils quen thuộc: vàng sáng, bọt mịn, đắng hoa bia rõ, hậu vị khô. Phục vụ 4-6 °C, hợp món nướng và hải sản.',
  'bitburger-00-alkoholfrei-ket-24-lon-330ml':
    'Bitburger 0,0% Alkoholfrei két 24 lon 330ml. Pilsner không cồn của Bitburger, vị hoa bia đắng thanh và hậu vị khô gần với Bitburger Premium Pils. Phục vụ lạnh 4-6 °C.',
  'bitburger-premium-pils':
    'Bitburger Premium Pils lon 500ml. Pilsner của nhà bia gia đình Bitburger ở Bitburg, vùng Eifel, nấu theo Luật Tinh khiết 1516 với hoa bia Siegelhopfen. Màu vàng sáng, bọt mịn, đắng hoa bia rõ, hậu vị khô. Phục vụ 4-6 °C, hợp món nướng đậm vị.',
  'bitburger-premium-pils-bom-5l':
    'Bitburger Premium Pils bom 5L. Bom có van xả khí và vòi rót sẵn, không cần máy hay bình CO2; ướp tủ mát 6-8 tiếng trước khi rót. Màu vàng sáng, bọt mịn, đắng hoa bia Siegelhopfen rõ, hậu vị khô. Phục vụ 4-6 °C.',
  'thorle-sauvignon-blanc-magnum':
    'Vang trắng Đức: giống nho Sauvignon Blanc, chai Magnum 1,5L. Nhà sản xuất Thörle, vùng Rheinhessen. Hương cỏ tươi, bưởi, lá cây, khoáng. Vị sắc nét, acid tươi sáng, hậu vị sạch. Chai lớn hợp làm quà biếu.',
  'rappenhof-riesling-auslese-2014':
    'Vang trắng Đức: giống nho Riesling, 750ml, nồng độ 7,5%, vintage 2014. Nhà sản xuất Rappenhof. Auslese là cấp Prädikat dành cho nho chín muộn tuyển chọn từng chùm. Hương mật ong, mơ chín, quýt, hoa nhài. Vị ngọt tự nhiên cân bằng với acid, hậu vị kéo dài. Hợp tráng miệng, gan ngỗng, phô mai xanh. Bán lẻ chai.',
  'thorle-kabinett':
    'Vang trắng Đức: giống nho Riesling, 750ml. Nhà sản xuất Thörle, vùng Rheinhessen. Kabinett, vang bán khô nhẹ. Hương táo xanh, lê, hoa cúc, khoáng đá vôi. Vị tươi, ngọt nhẹ tự nhiên, acid cân bằng. Hợp khai vị, hải sản nhẹ, salad, dim sum. Bán lẻ chai.',
  'austernkalk-riesling-trocken-magnum':
    'Vang trắng Đức: giống nho Riesling, chai Magnum 1,5L. Nhà sản xuất Thörle, dòng Austernkalk (đá vôi hóa thạch hàu), khô (Trocken). Đất trồng nhiều hóa thạch hàu cho vị khoáng rõ. Hương chanh, bưởi, đào, đá ướt. Chai lớn hợp tiệc và quà biếu.',
  'rappenhof-riesling-kabinett':
    'Vang trắng Đức: giống nho Riesling, 750ml, nồng độ 11,5%. Nhà sản xuất Rappenhof ở Alsheim (Rheinhessen), gia đình Hirsch-Muth thành lập năm 1604, thành viên VDP từ năm 1971. Hương đào trắng, chanh, khoáng. Vị bán khô, acid tươi kéo dài. Bán lẻ chai.',
  'bo-6-coc-benediktiner-chinh-hang-500ml':
    'Bộ 6 cốc Benediktiner chính hãng, dáng ly Weizen truyền thống, thủy tinh dày, dung tích 500ml, in logo Benediktiner. Có bán lẻ; tùy thời điểm còn là quà tặng kèm khi mua bia theo chương trình của German Taste, liên hệ hotline hoặc Zalo để biết thể lệ.',
  'mo-bia-chinh-hang-benediktiner':
    'Dụng cụ mở bia Benediktiner chính hãng bằng kim loại, in logo Benediktiner. Có bán lẻ; tùy thời điểm còn là quà tặng kèm khi mua bia theo chương trình của German Taste, liên hệ hotline hoặc Zalo để biết thể lệ.',
};

/** Tên hiển thị viết hoa đầu câu (database ghi Hoa Mỗi Chữ). */
const NAME_OVERRIDES: Record<string, string> = {
  'bo-6-coc-benediktiner-chinh-hang-500ml': 'Bộ 6 cốc Benediktiner chính hãng 500ml',
  'mo-bia-chinh-hang-benediktiner': 'Mở bia Benediktiner chính hãng',
};

for (const [slug, description] of Object.entries(DESCRIPTION_OVERRIDES)) {
  PRODUCT_OVERRIDES[slug] = { ...PRODUCT_OVERRIDES[slug], description };
}
for (const [slug, name] of Object.entries(NAME_OVERRIDES)) {
  PRODUCT_OVERRIDES[slug] = { ...PRODUCT_OVERRIDES[slug], name };
}

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
    // Mô tả cũ ghi địa chỉ showroom cũ; mọi nơi đọc COMPANY_CONFIG.showroomAddress.
    .replace(/(?:số\s+)?26 Vạn Phúc,\s*Ba Đình,\s*Hà Nội/gi, COMPANY_CONFIG.showroomAddress)
    // Showroom đã chuyển về Ngọc Hà; mô tả cũ còn nhắc Tây Hồ.
    .replace(/tại Tây Hồ, Hà Nội/gi, 'tại Hà Nội');
}

function mergeStorefrontProducts(products: Product[]): Product[] {
  const productsBySlug = new Map<string, Product>();

  for (const product of products) {
    if (!isStorefrontProduct(product) || productsBySlug.has(product.slug)) {
      continue;
    }

    const slug = RENAMED_PRODUCT_SLUGS[product.slug] ?? product.slug;
    const override = PRODUCT_OVERRIDES[slug];
    const item = {
      ...product,
      slug,
      ...override,
      ibu: product.category === 'bia' ? officialIbu(product.name) ?? product.ibu : product.ibu,
      images: resolveProductImages(override?.images ?? product.images),
      description: sanitizeProductDescription(
        override?.description ?? (toBrochureMetadataCopy(product.description) || product.description),
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
