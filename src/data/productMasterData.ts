export interface ProductMasterData {
  id: string;
  slug: string;
  sku: string;
  gtin?: string;
  name: string;
  shortName?: string;

  brand: string;
  productLine?: string;
  beerStyle: string;

  originCountry: string;
  productionLocation?: string;
  manufacturer?: string;
  licenseOwner?: string;

  volumeMl?: number;
  packageType: string;
  packageQuantity: number;

  abv: number;
  ibu?: number;

  ingredients?: string[];
  tastingNotes?: string[];
  servingTemperature?: string;
  recommendedGlass?: string;
  foodPairings?: string[];

  price: number;
  currency: "VND";
  availability: "InStock" | "OutOfStock" | "PreOrder";

  storageInstructions?: string;
  expirationInformation?: string;

  importer?: string;
  distributor?: string;
  seller?: string;

  images: string[];
  thumbnail?: string;

  metaTitle: string;
  metaDescription: string;

  verifiedSources?: {
    name: string;
    url?: string;
    note?: string;
  }[];

  lastVerifiedAt?: string;
}

export const PRODUCT_MASTER_DATA: Record<string, ProductMasterData> = {
  "benediktiner-weissbier-naturtrub-500ml": {
    id: "71a6ca18-6106-4021-af83-136daa88ffe4",
    slug: "benediktiner-naturtrub-thung-12-chai-500ml",
    sku: "BENE-WEISS-NAT-500-C12",
    name: "Benediktiner Weissbier Naturtrüb — Thùng 12 Chai 500ml",
    shortName: "Benediktiner Weissbier Naturtrüb",
    brand: "Benediktiner",
    beerStyle: "Bia lúa mì Đức (Weissbier)",
    originCountry: "Đức",
    productionLocation: "Lich, Đức",
    manufacturer: "Lich Brauerei",
    licenseOwner: "Benediktiner Weissbräu GmbH Ettal",
    volumeMl: 500,
    packageType: "Chai thủy tinh",
    packageQuantity: 12,
    abv: 5.4,
    ibu: 13,
    ingredients: ["Nước", "Mạch nha lúa mì", "Mạch nha đại mạch", "Hoa bia", "Men bia"],
    tastingNotes: [
      "Màu vàng hổ phách đục mờ quyến rũ, lớp bọt kem dày mịn như tuyết",
      "Hương trái cây chuối chín ngọt ngào, đinh hương cay nhẹ thanh tao và lúa mì nướng ấm áp",
      "Cảm giác êm dịu, mượt mà và tròn trịa trong khoang miệng, không có vị đắng gắt",
      "Hậu vị ngọt thanh nhẹ của mạch nha kéo dài sảng khoái"
    ],
    servingTemperature: "6 - 8°C",
    recommendedGlass: "Ly Weizenglas chuyên dụng cao dáng phình miệng",
    foodPairings: ["Xúc xích trắng Münchner", "Hải sản hấp sả/nướng", "Gà quay mật ong", "Phô mai mềm"],
    price: 1090000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp, bảo quản lạnh tối ưu từ 6 - 10°C",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["https://product.hstatic.net/200000919029/product/benediktiner-natutrub-1_d6fbd33c3762488db373ec581fe72a85.png"],
    metaTitle: "Bia Benediktiner Weissbier Naturtrüb 500ml - Thùng 12 Chai | Bia Thầy Tu",
    metaDescription: "Mua bia Benediktiner Weissbier Naturtrüb 500ml thùng 12 chai nhập khẩu chính hãng Đức. Nồng độ cồn 5,4%, men sống không lọc. Ship hỏa tốc tại Hà Nội.",
    lastVerifiedAt: "2026-07-11"
  },
  "benediktiner-naturtrub-lon-500ml": {
    id: "7762cae3-0392-4a0e-bd27-c21cbfd23e9e",
    slug: "benediktiner-naturtrub-ket-24-lon-500ml",
    sku: "BENE-WEISS-NAT-500-L24",
    name: "Benediktiner Weissbier Naturtrüb — Két 24 Lon 500ml",
    shortName: "Benediktiner Weissbier Naturtrüb Lon",
    brand: "Benediktiner",
    beerStyle: "Bia lúa mì Đức (Weissbier)",
    originCountry: "Đức",
    productionLocation: "Lich, Đức",
    manufacturer: "Lich Brauerei",
    licenseOwner: "Benediktiner Weissbräu GmbH Ettal",
    volumeMl: 500,
    packageType: "Lon nhôm",
    packageQuantity: 24,
    abv: 5.4,
    ibu: 13,
    ingredients: ["Nước", "Mạch nha lúa mì", "Mạch nha đại mạch", "Hoa bia", "Men bia"],
    tastingNotes: [
      "Màu vàng hổ phách đục mờ quyến rũ, lớp bọt kem dày mịn như tuyết",
      "Hương chuối chín, đinh hương cay và mạch nha lúa mì nướng thơm ngon",
      "Vị béo ngậy, mịn màng của men sống không lọc tự nhiên",
      "Hậu vị ngọt thanh, sảng khoái dễ uống"
    ],
    servingTemperature: "6 - 8°C",
    recommendedGlass: "Ly Weizenglas chuyên dụng cao dáng phình miệng",
    foodPairings: ["Xúc xích Đức", "Hải sản tươi sống", "Bánh Pretzel", "Gà nướng"],
    price: 1550000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Bảo quản lạnh trước khi uống, ngon nhất từ 6 - 8°C",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["https://product.hstatic.net/200000919029/product/benediktiner-natutrub-lon-1_a69ea226e5394f01aeca3efb96a3cfd9.png"],
    metaTitle: "Bia Benediktiner Weissbier Naturtrüb 500ml - Két 24 Lon | Bia Thầy Tu",
    metaDescription: "Mua bia Benediktiner Weissbier Naturtrüb lon 500ml két 24 lon nhập khẩu Đức. Nồng độ cồn 5,4% ABV. Ủ theo công thức tu viện Ettal trứ danh. Giao nhanh 2h.",
    lastVerifiedAt: "2026-07-11"
  },
  "benediktiner-dunkel-500ml": {
    id: "4a850bc2-a011-4b20-aaad-cc08cce234f1",
    slug: "benediktiner-dunkel-thung-12-chai-500ml",
    sku: "BENE-WEISS-DUN-500-C12",
    name: "Benediktiner Dunkel — Thùng 12 Chai 500ml",
    shortName: "Benediktiner Dunkel",
    brand: "Benediktiner",
    beerStyle: "Bia đen lúa mì Đức (Dunkelweizen)",
    originCountry: "Đức",
    productionLocation: "Lich, Đức",
    manufacturer: "Lich Brauerei",
    licenseOwner: "Benediktiner Weissbräu GmbH Ettal",
    volumeMl: 500,
    packageType: "Chai thủy tinh",
    packageQuantity: 12,
    abv: 5.4,
    ibu: 13,
    ingredients: ["Nước", "Mạch nha lúa mì", "Mạch nha đại mạch (rang caramel)", "Hoa bia", "Men bia"],
    tastingNotes: [
      "Màu nâu cánh gián/hạt dẻ đậm đà đục tự nhiên, lớp bọt kem mịn màng lâu tan",
      "Hương thơm của mạch nha rang, chocolate đen, kẹo bơ cứng (toffee) và chuối nướng",
      "Vị ngọt mượt của caramel và mật ong, cân bằng với vị đắng nhẹ của hoa bia",
      "Hậu vị ấm áp, mượt mà sạch sẽ và kéo dài vị béo ngậy lúa mì"
    ],
    servingTemperature: "8 - 10°C",
    recommendedGlass: "Ly Weizenglas cao chuyên dụng",
    foodPairings: ["Sườn heo nướng BBQ", "Bò bít tết", "Phô mai Gouda/phô mai xanh", "Chocolate đen"],
    price: 1090000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Bảo quản nơi khô ráo, thoáng mát, ướp lạnh ở nhiệt độ 8 - 10°C trước khi thưởng thức",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["https://product.hstatic.net/200000919029/product/benediktiner-dunkel-1_13c8182e69d04b45942a07a157ccbb09.png"],
    metaTitle: "Bia Benediktiner Dunkel 500ml - Thùng 12 Chai | Bia Thầy Tu",
    metaDescription: "Mua bia đen lúa mì Đức Benediktiner Dunkel 500ml thùng 12 chai chính hãng. Nồng độ cồn 5,4% ABV. Đậm đà vị mạch nha rang caramel và chocolate. Ship hỏa tốc.",
    lastVerifiedAt: "2026-07-11"
  },
  "benediktiner-festbier-lon-500ml": {
    id: "0c72481f-a9a5-4724-94f5-3c20dc57b9f7",
    slug: "benediktiner-festbier-ket-24-lon-500ml",
    sku: "BENE-FEST-500-L24",
    name: "Benediktiner Festbier — Két 24 Lon 500ml",
    shortName: "Benediktiner Festbier Lon",
    brand: "Benediktiner",
    beerStyle: "Bia lễ hội Đức (Festbier / Märzen Style)",
    originCountry: "Đức",
    productionLocation: "Lich, Đức",
    manufacturer: "Lich Brauerei",
    licenseOwner: "Benediktiner Weissbräu GmbH Ettal",
    volumeMl: 500,
    packageType: "Lon nhôm",
    packageQuantity: 24,
    abv: 5.8,
    ibu: 20,
    ingredients: ["Nước", "Mạch nha đại mạch", "Hoa bia", "Men bia"],
    tastingNotes: [
      "Màu vàng hổ phách óng ả sang trọng, lớp bọt trắng mịn dày dặn lâu tan",
      "Hương mật ong rừng, bánh mì nướng thơm giòn và mạch nha chín nồng nàn",
      "Vị ngọt dịu của mạch nha đầu lưỡi, cấu trúc bia đầy đặn tròn vị",
      "Hậu vị khô ráo, đắng nhẹ nhàng thanh khiết từ hoa bia quý tộc Hallertau"
    ],
    servingTemperature: "7 - 9°C",
    recommendedGlass: "Ly Quai lớn kiểu lễ hội (Willi Becher hoặc Stein)",
    foodPairings: ["Xúc xích Đức nướng", "Thịt lợn quay giòn bì kiểu Bavaria", "Gà nướng thảo mộc", "Bánh Pretzel giòn"],
    price: 1490000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Bảo quản nơi thoáng mát, bảo quản lạnh ngon nhất từ 7 - 9°C",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["/images/products/official/benediktiner/86312_Bene_Festbier_Dosenkarton_4x05l_schraeg_links.jpg"],
    metaTitle: "Bia Benediktiner Festbier 500ml - Két 24 Lon | Bia Thầy Tu",
    metaDescription: "Mua bia lễ hội Đức Benediktiner Festbier 500ml két 24 lon nhập khẩu chính hãng. Nồng độ cồn 5,8%, sắc vàng hổ phách, vị đậm đà thơm mạch nha chín. Ship hỏa tốc.",
    lastVerifiedAt: "2026-07-11"
  },
  "benediktiner-festbier-bom-5l": {
    id: "67bd4a3a-bee6-4e4e-8227-40fde05cae58",
    slug: "benediktiner-festbier-bom-5l",
    sku: "BENE-FEST-5L-KEG",
    name: "Benediktiner Festbier Bom 5L",
    shortName: "Benediktiner Festbier Bom 5L",
    brand: "Benediktiner",
    beerStyle: "Bia lễ hội Đức (Festbier / Märzen Style)",
    originCountry: "Đức",
    productionLocation: "Lich, Đức",
    manufacturer: "Lich Brauerei",
    licenseOwner: "Benediktiner Weissbräu GmbH Ettal",
    volumeMl: 5000,
    packageType: "Bom bia (Keg)",
    packageQuantity: 1,
    abv: 5.8,
    ibu: 20,
    ingredients: ["Nước", "Mạch nha đại mạch", "Hoa bia", "Men bia"],
    tastingNotes: [
      "Màu vàng hổ phách ấm áp rực rỡ, lớp bọt dầy đặc lâu tan gạt tại vòi",
      "Hương mạch nha chín ngọt dịu, mật ong rừng và đinh hương tinh tế",
      "Cấu trúc bia đậm vị, êm mượt và tròn trịa từ kỹ thuật ủ chậm",
      "Hậu vị đắng dịu thanh khiết, sảng khoái đặc trưng dòng Festbier"
    ],
    servingTemperature: "7 - 9°C",
    recommendedGlass: "Ly Quai lớn kiểu lễ hội (Willi Becher hoặc Stein)",
    foodPairings: ["Xúc xích Đức nướng", "Heo quay giòn da", "Thịt cừu nướng", "Gà quay lu"],
    price: 950000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Ủ lạnh sâu bom bia trước khi mở vòi gạt tối thiểu 6 - 8 tiếng",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.jpg"],
    metaTitle: "Bom Bia Lễ Hội Đức Benediktiner Festbier 5L | Bia Thầy Tu",
    metaDescription: "Đặt mua bom bia Benediktiner Festbier 5L chính hãng Đức. Nồng độ cồn 5,8% ABV. Thiết kế bom gạt vòi tiện lợi thích hợp cho bữa tiệc liên hoan, làm quà tặng.",
    lastVerifiedAt: "2026-07-11"
  },
  "bitburger-premium-pils-330ml": {
    id: "ecd0f2c4-190f-42b2-8046-e0da747e6318",
    slug: "bitburger-premium-pils-thung-12-chai-330ml",
    sku: "BIT-PILS-330-C12",
    name: "Bitburger Premium Pils — Thùng 12 Chai 330ml",
    shortName: "Bitburger Premium Pils",
    brand: "Bitburger",
    beerStyle: "Bia đắng Đức (Pilsner)",
    originCountry: "Đức",
    productionLocation: "Bitburg, Đức",
    manufacturer: "Bitburger Braugruppe GmbH",
    volumeMl: 330,
    packageType: "Chai thủy tinh",
    packageQuantity: 12,
    abv: 4.8,
    ibu: 38,
    ingredients: ["Nước", "Mạch nha đại mạch", "Hoa bia Siegelhopfen", "Men bia"],
    tastingNotes: [
      "Màu vàng hoàng kim rực rỡ, trong suốt tuyệt đẹp với lớp bọt trắng mịn bám ly",
      "Hương hoa bia khô ráo sắc sảo, hương thảo mộc đan xen mạch nha thanh nhẹ",
      "Vị đắng đằm (hoàn hảo) lan tỏa ngay sau ngụm đầu, cực kỳ sắc nét và sảng khoái",
      "Hậu vị sạch sẽ, đắng thanh thoát kéo dài"
    ],
    servingTemperature: "5 - 7°C",
    recommendedGlass: "Ly Flute dáng thon dài chuyên dụng pilsner",
    foodPairings: ["BBQ hải sản", "Gà nướng muối ớt", "Phô mai Cheddar", "Da heo chiên giòn"],
    price: 620000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Bảo quản lạnh và uống sâu mát lạnh từ 5 - 7°C",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["/images/products/official/bitburger/bitburger_flasche_05l_frontal_betaut_V12.jpg"],
    metaTitle: "Bia Bitburger Premium Pils 330ml - Thùng 12 Chai | Bia Thầy Tu",
    metaDescription: "Mua bia đắng số 1 nước Đức Bitburger Premium Pils 330ml thùng 12 chai nhập khẩu nguyên chai. Vị đắng hoa bia Siegelhopfen sắc nét sảng khoái. Ship hỏa tốc.",
    lastVerifiedAt: "2026-07-11"
  },
  "kostritzer-schwarzbier-bom-5l": {
    id: "b9188276-8858-448f-892c-f77a1e29dd7c",
    slug: "kostritzer-schwarzbier-bom-5l",
    sku: "KOS-SCHW-5L-KEG",
    name: "Köstritzer Schwarzbier Bom 5L",
    shortName: "Köstritzer Schwarzbier Bom 5L",
    brand: "Köstritzer",
    beerStyle: "Bia đen Đức (Schwarzbier)",
    originCountry: "Đức",
    productionLocation: "Bad Köstritz, Đức",
    manufacturer: "Köstritzer Schwarzbierbrauerei (Bitburger Group)",
    volumeMl: 5000,
    packageType: "Bom bia (Keg)",
    packageQuantity: 1,
    abv: 4.8,
    ibu: 22,
    ingredients: ["Nước", "Mạch nha đại mạch (rang đen)", "Hoa bia", "Men bia"],
    tastingNotes: [
      "Màu đen tuyền quyến rũ, lớp bọt kem màu nâu nhạt dày mịn lâu tan gạt tại vòi",
      "Hương thơm đậm đà của cà phê, hạt phỉ nướng và socola đắng",
      "Vị ngọt dịu từ mạch nha rang, kết cấu bia êm dịu, mượt mà và sảng khoái",
      "Hậu vị sạch sẽ, thoang thoảng đắng nhẹ của mạch nha nướng kéo dài dễ chịu"
    ],
    servingTemperature: "8 - 10°C",
    recommendedGlass: "Ly Mug lớn có quai cầm dáng tròn",
    foodPairings: ["Thịt bò bít tết", "Xúc xích hun khói", "Phô mai Gouda lâu năm", "Bánh tráng miệng cacao"],
    price: 850000,
    currency: "VND",
    availability: "InStock",
    storageInstructions: "Giữ lạnh bom bia tối thiểu 8 tiếng trong tủ mát hoặc thùng đá trước khi khui",
    importer: "Công ty TNHH Euro Choice Việt Nam",
    distributor: "Bia Thầy Tu",
    seller: "Bia Thầy Tu",
    images: ["/images/products/official/bitburger/kostritzer_keg.png"],
    metaTitle: "Bom Bia Đen Đức Köstritzer Schwarzbier 5L | Bia Thầy Tu",
    metaDescription: "Mua bom bia đen lâu đời nhất nước Đức Köstritzer Schwarzbier 5L chính hãng. Thiết kế bom có vòi gạt tự động, hương vị cà phê và cacao rang hảo hạng. Ship nhanh.",
    lastVerifiedAt: "2026-07-11"
  }
};
