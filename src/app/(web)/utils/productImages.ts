const DEFAULT_PRODUCT_IMAGE = '/images/products/official/benediktiner/bottle_removebg.png';

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  bia: DEFAULT_PRODUCT_IMAGE,
  'phu-kien': '/images/products/official/bitburger/88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.webp',
  vang: '/images/products/official/benediktiner/bottle_removebg.png',
  'xuc-xich': '/images/products/the-wurst/wiener-hun-khoi.png',
};

interface ProductImageInput {
  images?: string[] | null;
  category?: string | null;
}

export function getDisplayProductImage({ images, category }: ProductImageInput) {
  const primaryImage = images?.find((image): image is string => {
    return typeof image === 'string' && image.trim().length > 0;
  })?.trim();

  if (primaryImage) {
    return primaryImage;
  }

  return CATEGORY_FALLBACK_IMAGES[category ?? ''] ?? DEFAULT_PRODUCT_IMAGE;
}
