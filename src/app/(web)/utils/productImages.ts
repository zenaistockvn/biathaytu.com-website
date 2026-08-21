import { PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/data/productImage';

export { PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/data/productImage';

interface ProductImageInput {
  images?: string[] | null;
  category?: string | null;
}

export function getDisplayProductImage({ images }: ProductImageInput) {
  const primaryImage = images?.find((image): image is string => {
    return typeof image === 'string' && image.trim().length > 0;
  })?.trim();

  return primaryImage || PRODUCT_IMAGE_PLACEHOLDER;
}
