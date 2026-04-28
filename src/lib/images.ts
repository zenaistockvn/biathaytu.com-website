/**
 * AMC × Bia Thầy Tu — Image Mapping System
 * Maps content (product) to official brand images ONLY.
 * ALL AI-generated images have been removed to preserve absolute brand consistency (colors, logos).
 */

// ─── Format Aliases ───────────────────────────────────────────────
// DB content_format → CONTENT_IMAGE_MAP strategy key
const FORMAT_ALIASES: Record<string, string> = {
  lifestyle_moment: 'lifestyle',
  education: 'educational',
  soft_offer: 'promotion',
  social_proof: 'review',
  brand_lifestyle: 'lifestyle',
  occasion_hosting: 'lifestyle',
  occasion_sports: 'engagement',
  occasion_gifting: 'seasonal',
  behind_scenes: 'lifestyle',
};

// ─── Master Official Arrays ───────────────────────────────────────
const BENE_WEISSBIER_IMAGES = [
  '/images/products/official/benediktiner/86480_bottle_nobg.png',
  '/images/products/official/benediktiner/86480_Benediktiner_Weiss_NT_Flasche_05l_betaut.jpg',
  '/images/products/official/benediktiner/89327_Bene_Weissbier_NT_Draufsicht_033l_betaut.jpg',
  '/images/products/official/benediktiner/85981_Bene_Weissbier_NT_Sixpack_033l_Export.jpg',
  '/images/products/official/benediktiner/85981_Bene_Weissbier_NT_Tray_4x6x033l_Export.jpg',
  '/images/products/official/benediktiner/83810_Bene_Weissbier_4x05l_Dose_schraeg.jpg',
  '/images/products/official/benediktiner/87205_Bene_Weissbier_05l_Dose_frontal_Export.jpg',
  '/images/products/official/benediktiner/bottle_removebg.png',
  '/images/products/official/benediktiner/glass_nobg.png',
  '/images/products/official/benediktiner/glass_removebg.png',
];

const BENE_AF_IMAGES = [
  '/images/products/official/benediktiner/86087_Bene_Weissbier_AF_Flasche_Abbildung.jpg',
  '/images/products/official/benediktiner/86087_Bene_Weissbier_AF_Glas_Abbildung.jpg',
  '/images/products/official/benediktiner/89327_Bene_Weissbier_AF_Draufsicht_033l_betaut_001.jpg',
  '/images/products/official/benediktiner/89327_Bene_Weissbier_AF_Frontal_033l_betaut.jpg',
];

const BENE_DUNKEL_IMAGES = [
  '/images/products/official/benediktiner/57425_Benediktiner_Dunklel_VO_E-Hinweis.jpg',
  '/images/products/official/benediktiner/49717_Bene_GL_vO_WB_dunkel.jpg',
  '/images/products/official/benediktiner/86312_Bene_Dunkel_Dosenkarton_4x05l_schraeg_links.jpg',
];

const BENE_HELL_IMAGES = [
  '/images/products/official/benediktiner/Bene_GL_vO_WB_hell.jpg',
];

const BENE_FESTBIER_IMAGES = [
  '/images/products/official/benediktiner/86492_Bene_Festbier_05l_Dose_Frontal.jpg',
  '/images/products/official/benediktiner/86312_Bene_Festbier_Dosenkarton_4x05l_schraeg_links.jpg',
];

const BITBURGER_PILS_IMAGES = [
  '/images/products/official/bitburger/flasche_longneck_033l_pils_frontal_betaut_V8.jpg',
  '/images/products/official/bitburger/flasche_longneck_033l_pils_frontal_V4_dry.jpg',
  '/images/products/official/bitburger/bitburger_flasche_05l_frontal_betaut_V12.jpg',
  '/images/products/official/bitburger/RET_bitburger_flasche_05l_frontal_V06_dry.jpg',
  '/images/products/official/bitburger/90160_Bitburger_05l_Dose_frontal_unbetaut_LG.jpg',
  '/images/products/official/bitburger/60922_Bitb_Pils_Pokal.jpg',
  '/images/products/official/bitburger/80148_Bitb_Pils_Export_4x6x033l_Tray_45x37cm.jpg',
  '/images/products/official/bitburger/91077_Bitb_PremiumPils_WM26_Dose_4erPack_Tray_6x4x05L_Export_Schraeg_Links.jpg',
  '/images/products/official/bitburger/90384_Bitb_PremiumPils_WM26_05l_Dose_frontal_betaut_140x365mm.jpg',
  '/images/products/official/bitburger/88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg',
  '/images/products/official/bitburger/74560_Bitb_Pils_05l_Flasche_Pokal_frontal_betaut_142x291mm.jpg',
  '/images/products/official/bitburger/91364_Bitburger_Export_PP_0568l_Dose_RS_frontal_betaut_3D.jpg',
  '/images/products/official/bitburger/91364_Bitburger_PP_Export_0568l_Dose_frontal_betaut_3D.jpg',
  '/images/products/official/bitburger/Bitburger_Bit-Lounge _Glaeser_2018.jpg',
  '/images/products/official/bitburger/130_c210fb29329145319891b0c9e3a056dd.png',
  '/images/products/official/bitburger/73871_Bitb_Glutenfrei_033_Longneck_draufsicht_betaut_3D.jpg',
  '/images/products/official/bitburger/73871_Bitb_Glutenfrei_033_Longneck_draufsicht_unbetaut_3D.jpg',
  '/images/products/official/bitburger/73871_Bitb_Glutenfrei_033_Longneck_frontal_unbetaut_3D.jpg',
];

const BITBURGER_00_IMAGES = [
  '/images/products/official/bitburger/20201006_bitburger_flasche_033l_export_drive.jpg',
  '/images/products/official/bitburger/76979_Bit_Pils_Drive_Alkoholfrei_Export_Sixpack_6er_6x033l.jpg',
];

// ─── Wine: Rappenhof (Riesling — 400 năm truyền thống) ────────
const RAPPENHOF_KABINETT_IMAGES = [
  '/images/products/official/rappenhof/riesling_kabinett_bottle.png',
  '/images/products/official/rappenhof/riesling_kabinett_label.png',
];

const RAPPENHOF_TROCKEN_IMAGES = [
  '/images/products/official/rappenhof/riesling_trocken_bottle.png',
  '/images/products/official/rappenhof/riesling_trocken_detail.jpg',
];

const RAPPENHOF_AUSLESE_IMAGES = [
  '/images/products/official/rappenhof/riesling_auslese_bottle.png',
  '/images/products/official/rappenhof/riesling_auslese_detail.jpg',
];

// ─── Wine: Thörle (Rheinhessen — hai anh em đam mê) ──────────
const THORLE_SPATBURGUNDER_IMAGES = [
  '/images/products/official/thorle/spatburgunder_bottle.png',
  '/images/products/official/thorle/spatburgunder_detail_1.png',
  '/images/products/official/thorle/spatburgunder_detail_2.png',
];

const THORLE_KABINETT_IMAGES = [
  '/images/products/official/thorle/kabinett_bottle.png',
  '/images/products/official/thorle/kabinett_detail.png',
];

const THORLE_RIESLING_IMAGES = [
  '/images/products/official/thorle/riesling_750_bottle.png',
  '/images/products/official/thorle/riesling_750_detail.png',
];

const THORLE_AUSTERNKALK_IMAGES = [
  '/images/products/official/thorle/austernkalk_magnum_bottle.jpg',
  '/images/products/official/thorle/austernkalk_magnum_detail.jpg',
];

const THORLE_RIESLING_MAGNUM_IMAGES = [
  '/images/products/official/thorle/riesling_magnum_bottle.jpg',
  '/images/products/official/thorle/riesling_magnum_detail.jpg',
];

const THORLE_SAUVIGNON_MAGNUM_IMAGES = [
  '/images/products/official/thorle/sauvignon_magnum_bottle.jpg',
  '/images/products/official/thorle/sauvignon_magnum_detail.jpg',
];

const COMBO_IMAGES = [
  // Lấy những mẫu chai/lon tiêu biểu nhất cho Combo
  BENE_WEISSBIER_IMAGES[0], // Bottle nobg
  BITBURGER_PILS_IMAGES[0], // Flasche longneck
  BENE_DUNKEL_IMAGES[0], // Dunkel bottle
  BITBURGER_00_IMAGES[0], // Drive bottle
];

// ─── Content Image Map ────────────────────────────────────────────
// Note: Since we only use official product shots now, we map all strategies
// to the same dedicated product image array. This guarantees that no matter
// the AI strategy, the image is ALWAYS 100% brand-compliant.
const STRATEGIES = ['product_showcase', 'storytelling', 'food_pairing', 'lifestyle', 'engagement', 'educational', 'review', 'viral', 'seasonal', 'promotion', 'comparison'];

export const CONTENT_IMAGE_MAP: Record<string, string[]> = {};

// Auto-fill CONTENT_IMAGE_MAP for all strategies
STRATEGIES.forEach(strategy => {
  // Beer
  CONTENT_IMAGE_MAP[`benediktiner_weissbier__${strategy}`] = [...BENE_WEISSBIER_IMAGES, ...BENE_AF_IMAGES];
  CONTENT_IMAGE_MAP[`benediktiner_dunkel__${strategy}`] = BENE_DUNKEL_IMAGES;
  CONTENT_IMAGE_MAP[`benediktiner_hell__${strategy}`] = BENE_HELL_IMAGES;
  CONTENT_IMAGE_MAP[`benediktiner_festbier__${strategy}`] = BENE_FESTBIER_IMAGES;
  CONTENT_IMAGE_MAP[`bitburger_pils__${strategy}`] = BITBURGER_PILS_IMAGES;
  CONTENT_IMAGE_MAP[`bitburger_0__${strategy}`] = BITBURGER_00_IMAGES;
  CONTENT_IMAGE_MAP[`combo__${strategy}`] = COMBO_IMAGES;
  // Wine — Rappenhof
  CONTENT_IMAGE_MAP[`rappenhof_kabinett__${strategy}`] = RAPPENHOF_KABINETT_IMAGES;
  CONTENT_IMAGE_MAP[`rappenhof_trocken__${strategy}`] = RAPPENHOF_TROCKEN_IMAGES;
  CONTENT_IMAGE_MAP[`rappenhof_auslese__${strategy}`] = RAPPENHOF_AUSLESE_IMAGES;
  // Wine — Thörle
  CONTENT_IMAGE_MAP[`thorle_spatburgunder__${strategy}`] = THORLE_SPATBURGUNDER_IMAGES;
  CONTENT_IMAGE_MAP[`thorle_kabinett__${strategy}`] = THORLE_KABINETT_IMAGES;
  CONTENT_IMAGE_MAP[`thorle_riesling__${strategy}`] = THORLE_RIESLING_IMAGES;
  CONTENT_IMAGE_MAP[`thorle_austernkalk__${strategy}`] = THORLE_AUSTERNKALK_IMAGES;
  CONTENT_IMAGE_MAP[`thorle_riesling_magnum__${strategy}`] = THORLE_RIESLING_MAGNUM_IMAGES;
  CONTENT_IMAGE_MAP[`thorle_sauvignon__${strategy}`] = THORLE_SAUVIGNON_MAGNUM_IMAGES;
});

// ─── Product Fallback Images ──────────────────────────────────────
export const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  // Beer
  'weissbier': BENE_WEISSBIER_IMAGES[0],
  'naturtr': BENE_WEISSBIER_IMAGES[0],
  'dunkel': BENE_DUNKEL_IMAGES[0],
  'hell': BENE_HELL_IMAGES[0],
  'bitburger': BITBURGER_PILS_IMAGES[0],
  'pils': BITBURGER_PILS_IMAGES[0],
  'festbier': BENE_FESTBIER_IMAGES[0],
  'mix': COMBO_IMAGES[0],
  'bom': BITBURGER_PILS_IMAGES[9], // 5L keg
  'coc': BITBURGER_PILS_IMAGES[5], // Pokal glass
  'mo_bia': BITBURGER_PILS_IMAGES[0],
  'benediktiner': BENE_WEISSBIER_IMAGES[0],
  // Wine — Rappenhof
  'rappenhof': RAPPENHOF_KABINETT_IMAGES[0],
  'kabinett': RAPPENHOF_KABINETT_IMAGES[0],
  'trocken': RAPPENHOF_TROCKEN_IMAGES[0],
  'auslese': RAPPENHOF_AUSLESE_IMAGES[0],
  // Wine — Thörle
  'thorle': THORLE_KABINETT_IMAGES[0],
  'spatburgunder': THORLE_SPATBURGUNDER_IMAGES[0],
  'austernkalk': THORLE_AUSTERNKALK_IMAGES[0],
  'sauvignon': THORLE_SAUVIGNON_MAGNUM_IMAGES[0],
  'riesling': RAPPENHOF_KABINETT_IMAGES[0],
  'magnum': THORLE_RIESLING_MAGNUM_IMAGES[0],
  'vang': RAPPENHOF_KABINETT_IMAGES[0],
};

// ─── Brand Image Pool (for product-only fallback) ──────────────
export const BRAND_IMAGE_POOLS: Record<string, string[]> = {
  benediktiner: [
    ...BENE_WEISSBIER_IMAGES,
    ...BENE_DUNKEL_IMAGES,
    ...BENE_AF_IMAGES,
    ...BENE_FESTBIER_IMAGES,
    ...BENE_HELL_IMAGES,
  ],
  bitburger: [
    ...BITBURGER_PILS_IMAGES,
    ...BITBURGER_00_IMAGES,
  ],
  rappenhof: [
    ...RAPPENHOF_KABINETT_IMAGES,
    ...RAPPENHOF_TROCKEN_IMAGES,
    ...RAPPENHOF_AUSLESE_IMAGES,
  ],
  thorle: [
    ...THORLE_SPATBURGUNDER_IMAGES,
    ...THORLE_KABINETT_IMAGES,
    ...THORLE_RIESLING_IMAGES,
    ...THORLE_AUSTERNKALK_IMAGES,
    ...THORLE_RIESLING_MAGNUM_IMAGES,
    ...THORLE_SAUVIGNON_MAGNUM_IMAGES,
  ],
};

// ─── Product Name → Map Key Resolver ──────────────────────────────
function resolveProductKeyPrefix(normalizedProduct: string): string[] {
  const prefixes: string[] = [];

  // ─── Beer ───
  if (normalizedProduct.includes('dunkel') && normalizedProduct.includes('benediktiner')) {
    prefixes.push('benediktiner_dunkel');
  }
  if (normalizedProduct.includes('weissbier') || normalizedProduct.includes('naturtr')) {
    prefixes.push('benediktiner_weissbier');
  }
  if (normalizedProduct.includes('hell') && normalizedProduct.includes('benediktiner')) {
    pushIfMissing(prefixes, 'benediktiner_hell');
  }
  if (normalizedProduct.includes('festbier')) {
    pushIfMissing(prefixes, 'benediktiner_festbier');
  }
  if (normalizedProduct.includes('bitburger') && (normalizedProduct.includes('0') || normalizedProduct.includes('drive'))) {
    pushIfMissing(prefixes, 'bitburger_0');
  }
  if (normalizedProduct.includes('bitburger') && !normalizedProduct.includes('0') && !normalizedProduct.includes('drive')) {
    pushIfMissing(prefixes, 'bitburger_pils');
  }
  if (normalizedProduct.includes('mix') || normalizedProduct.includes('combo') ||
      normalizedProduct.includes('coc') || normalizedProduct.includes('mo_bia') ||
      normalizedProduct.includes('bom')) {
    pushIfMissing(prefixes, 'combo');
  }

  // ─── Wine — Rappenhof ───
  if (normalizedProduct.includes('rappenhof')) {
    if (normalizedProduct.includes('auslese')) {
      pushIfMissing(prefixes, 'rappenhof_auslese');
    } else if (normalizedProduct.includes('trocken')) {
      pushIfMissing(prefixes, 'rappenhof_trocken');
    } else {
      pushIfMissing(prefixes, 'rappenhof_kabinett');
    }
  }

  // ─── Wine — Thörle ───
  if (normalizedProduct.includes('thorle') || normalizedProduct.includes('th_rle')) {
    if (normalizedProduct.includes('sp_tburgunder') || normalizedProduct.includes('spatburgunder') || normalizedProduct.includes('pinot')) {
      pushIfMissing(prefixes, 'thorle_spatburgunder');
    } else if (normalizedProduct.includes('austernkalk')) {
      pushIfMissing(prefixes, 'thorle_austernkalk');
    } else if (normalizedProduct.includes('sauvignon')) {
      pushIfMissing(prefixes, 'thorle_sauvignon');
    } else if (normalizedProduct.includes('1_5l') || normalizedProduct.includes('magnum')) {
      pushIfMissing(prefixes, 'thorle_riesling_magnum');
    } else if (normalizedProduct.includes('kabinett')) {
      pushIfMissing(prefixes, 'thorle_kabinett');
    } else {
      pushIfMissing(prefixes, 'thorle_riesling');
    }
  }

  // ─── Generic Wine fallback ───
  if (prefixes.length === 0 && (normalizedProduct.includes('vang') || normalizedProduct.includes('riesling'))) {
    prefixes.push('rappenhof_kabinett');
  }

  // Generic Benediktiner fallback
  if (prefixes.length === 0 && normalizedProduct.includes('benediktiner')) {
    prefixes.push('benediktiner_weissbier');
  }

  return prefixes;
}

function pushIfMissing(arr: string[], item: string) {
  if (!arr.includes(item)) arr.push(item);
}

// ─── Main Export ──────────────────────────────────────────────────
export function getAutoImageForContent(
  contentId: string,
  productName: string,
  format: string | null,
): string[] {
  const normalizedProduct = productName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const rawStrategy = format || '';
  const resolvedStrategy = FORMAT_ALIASES[rawStrategy] || rawStrategy;

  let candidateImages: string[] = [];
  const prefixes = resolveProductKeyPrefix(normalizedProduct);

  // Step 1: Exact match
  for (const prefix of prefixes) {
    const key = `${prefix}__${resolvedStrategy}`;
    if (CONTENT_IMAGE_MAP[key]) {
      candidateImages = CONTENT_IMAGE_MAP[key];
      break;
    }
  }

  // Step 2: Broad prefix match
  if (candidateImages.length === 0 && prefixes.length > 0) {
    const allProductImages: string[] = [];
    for (const prefix of prefixes) {
      for (const [key, images] of Object.entries(CONTENT_IMAGE_MAP)) {
        if (key.startsWith(`${prefix}__`)) {
          allProductImages.push(...images);
        }
      }
    }
    if (allProductImages.length > 0) {
      candidateImages = [...new Set(allProductImages)];
    }
  }

  // Step 3: Brand fallback
  if (candidateImages.length === 0) {
    for (const [brand, pool] of Object.entries(BRAND_IMAGE_POOLS)) {
      if (normalizedProduct.includes(brand)) {
        candidateImages = pool;
        break;
      }
    }
  }

  // Step 4: Keyword fallback
  if (candidateImages.length === 0) {
    for (const [keyword, img] of Object.entries(PRODUCT_FALLBACK_IMAGES)) {
      if (normalizedProduct.includes(keyword)) {
        candidateImages = [img];
        break;
      }
    }
  }

  // Step 5: Pick stable pseudo-random images
  if (candidateImages.length > 0) {
    let hash = 0;
    if (contentId) {
      for (let i = 0; i < contentId.length; i++) {
        hash = contentId.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    
    // Determine how many images to pick
    const multiFormatKeys = ['carousel', 'educational', 'review', 'storytelling'];
    const count = multiFormatKeys.includes(resolvedStrategy) ? 3 : 1;
    
    const selected: string[] = [];
    const limit = Math.min(count, candidateImages.length);
    let step = 0;
    
    while (selected.length < limit && step < 50) {
      const index = Math.abs(hash + step) % candidateImages.length;
      const img = candidateImages[index];
      if (!selected.includes(img)) {
        selected.push(img);
      }
      step++;
    }
    
    // If we somehow didn't get enough unique apps, just return whatever we have.
    return selected.length > 0 ? selected : [candidateImages[0]];
  }

  return [];
}
