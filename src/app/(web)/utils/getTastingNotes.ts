/**
 * Returns a curated Vietnamese tasting note for a given product name.
 * Single source of truth — used across landing page and product pages.
 */
export function getTastingNotes(name: string): string {
  const l = name?.toLowerCase() || '';

  // Wine
  if (l.includes('auslese')) return 'Nho chín muộn tuyển chọn — mật ong, mơ chín, phức hợp, hậu vị kéo dài.';
  if (l.includes('spätburgunder') || l.includes('spatburgunder')) return 'Pinot Noir phiên bản Đức — anh đào đen, mận, tannin mềm mại, hậu vị ấm.';
  if (l.includes('austernkalk')) return 'Riesling từ đất hóa thạch hàu triệu năm — vị khoáng đặc trưng không nơi nào có.';
  if (l.includes('sauvignon')) return 'Sauvignon Blanc kiểu Đức — cỏ tươi, bưởi, sắc nét, khác biệt hoàn toàn dòng New World.';
  if (l.includes('trocken')) return 'Riesling khô sắc nét kiểu Đức — chanh vàng, đá phiến, khoáng chất mạnh mẽ.';
  if (l.includes('kabinett')) return 'Vang trắng bán khô, thanh nhã — đào trắng, chanh, acid tươi sáng.';
  if (l.includes('riesling')) return 'Riesling — vua vang trắng Đức, khoáng chất tinh tế, acid tươi.';

  // Beer
  if (l.includes('mix')) return 'Kết hợp hoàn hảo giữa Weissbier & Dunkel — hai hương vị, một trải nghiệm.';
  if (l.includes('dunkel')) return 'Mạch nha rang đậm đà, thoảng vị caramel & chocolate đen.';
  if (l.includes('weissbier') || l.includes('natur')) return 'Hương chuối chín, đinh hương & hậu vị ngọt dịu.';
  if (l.includes('bom') || l.includes('5l')) return 'Bom bia 5 lít — lý tưởng cho tiệc tùng và thưởng thức cùng bạn bè.';
  if (l.includes('pils') || l.includes('lager')) return 'Hoa bia tươi mát, hậu vị đắng thanh sạch.';
  if (l.includes('keller')) return 'Hương vị nguyên bản, đậm đà lúa mạch tảng.';

  // Fallback (wine/other)
  if (l.includes('vang') || l.includes('magnum')) return 'Vang Đức chính gốc — hương vị tinh tế từ vùng Rheinhessen.';

  return 'Tuyệt tác hương vị Đức chuẩn Luật Tinh Khiết 1516.';
}

export function formatPrice(price: number | null): string {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}
