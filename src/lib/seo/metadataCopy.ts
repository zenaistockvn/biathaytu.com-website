const SALES_COPY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/giao hàng toàn quốc/gi, 'tư vấn sản phẩm trên toàn quốc'],
  [/giao toàn quốc/gi, 'tư vấn sản phẩm trên toàn quốc'],
  [/miễn phí giao nội thành hà nội/gi, 'thông tin và tư vấn sản phẩm tại Hà Nội'],
  [/giao nhanh/gi, 'thông tin sản phẩm'],
  [/đặt mua/gi, 'tìm hiểu'],
  [/đặt hàng/gi, 'liên hệ tư vấn'],
  [/mua bia đức/gi, 'thông tin bia Đức nhập khẩu'],
  [/mua bia benediktiner/gi, 'thông tin Benediktiner'],
  [/đăng ký ngay!?/gi, 'liên hệ để được tư vấn'],
];

/**
 * Chuẩn hóa title/description lấy từ dữ liệu cũ sang ngôn ngữ brochure.
 * Chỉ thay các cụm mang tính giao dịch trực tuyến rõ ràng, không xóa từ khóa
 * thương hiệu/sản phẩm hoặc các ngữ cảnh thông tin hợp pháp khác.
 */
export function toBrochureMetadataCopy(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  return SALES_COPY_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  )
    .replace(/\s{2,}/g, ' ')
    .trim();
}
