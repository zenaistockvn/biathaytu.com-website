import { resolveProductImage } from '@/lib/data/productImages';

const DEFAULT_PRODUCT_IMAGE = '/images/products/official/benediktiner/bottle_removebg.png';

// Xúc xích không có ảnh chính hãng: để thẻ sản phẩm hiện trạng thái trống.
const CATEGORY_FALLBACK_IMAGES: Record<string, string | null> = {
  bia: DEFAULT_PRODUCT_IMAGE,
  'phu-kien': '/images/products/official/bitburger/88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.webp',
  vang: '/images/products/official/benediktiner/bottle_removebg.png',
  'xuc-xich': null,
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
    return resolveProductImage(primaryImage);
  }

  const fallback = CATEGORY_FALLBACK_IMAGES[category ?? ''];
  return fallback === undefined ? DEFAULT_PRODUCT_IMAGE : fallback;
}
