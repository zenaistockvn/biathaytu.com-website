/**
 * Format Vietnamese currency (VND)
 * Shared utility — use everywhere instead of local definitions.
 */
export function formatPrice(price: number | null): string {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}
