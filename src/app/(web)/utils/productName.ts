/**
 * Tên sản phẩm trong database gộp dòng bia và quy cách ("Bitburger Premium Pils: Két 24 Lon 330ml").
 * Thẻ và trang chi tiết tách thành hai dòng: tên dòng bia, rồi quy cách viết thường kiểu tiếng Việt.
 */
const PACK_PATTERN = /^(.+?)(?:\s*[:,]\s*|\s+)((?:thùng|két|bom|lốc|hộp)\s+[\d.,]+.*)$/i;

export function splitProductName(name: string): { title: string; pack: string | null } {
  const match = name.trim().match(PACK_PATTERN);
  if (!match) return { title: name.trim(), pack: null };

  const pack = match[2]
    .replace(/(^|\s)(Lon|Chai|Lít)(?=\s|$)/g, (_, space: string, word: string) => space + word.toLowerCase())
    .replace(/^./, (first) => first.toUpperCase());
  return { title: match[1].trim(), pack };
}

/** Quy cách không kèm dung tích ("Két 24 lon"), dùng khi dung tích đã có dòng riêng. */
export function packWithoutVolume(pack: string | null): string | null {
  if (!pack) return null;
  return pack.replace(/\s*[\d.,]+\s*(?:ml|l)$/i, '').trim() || null;
}

/** Nồng độ cồn theo cách viết số của tiếng Việt: 4,8% (giá đã dùng dấu chấm phân cách hàng nghìn). */
export function formatAbv(abv: string | number | null | undefined): string | null {
  if (abv === null || abv === undefined || abv === '') return null;
  return `${String(abv).replace('.', ',')}%`;
}
