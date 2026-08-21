export const RETAIL_PRICE_NOTE = 'Giá niêm yết toàn quốc' as const;

export interface UnitPriceInput {
  price: number | null | undefined;
  name: string;
  volume?: string | null;
  category?: string | null;
}

function formatAmount(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null || !Number.isFinite(price) || price <= 0) return '';
  return `${formatAmount(price)}₫`;
}

function parseLiters(name: string, volume?: string | null): number | null {
  const candidates = [volume || '', name];
  for (const candidate of candidates) {
    const match = candidate.match(/(\d+(?:[.,]\d+)?)\s*l\b/i);
    if (!match) continue;
    const liters = Number(match[1].replace(',', '.'));
    if (Number.isFinite(liters) && liters > 0) return liters;
  }
  return null;
}

function parsePackCount(name: string): { count: number; unit: string } | null {
  const patterns: Array<[RegExp, string]> = [
    [/\b(?:thùng|két|set)\s+(\d+)\s+chai\b/i, 'chai'],
    [/\b(?:thùng|két|set)\s+(\d+)\s+lon\b/i, 'lon'],
    [/\bbộ\s+(\d+)\s+cốc\b/i, 'cốc'],
    [/\bbộ\s+(\d+)\s+ly\b/i, 'ly'],
  ];

  for (const [pattern, unit] of patterns) {
    const match = name.match(pattern);
    if (!match) continue;
    const count = Number(match[1]);
    if (Number.isFinite(count) && count > 0) return { count, unit };
  }

  return null;
}

export function formatUnitPrice(input: UnitPriceInput): string {
  const { price, name, volume, category } = input;
  if (price == null || !Number.isFinite(price) || price <= 0) return '';

  const lowerName = name.toLocaleLowerCase('vi');
  const liters = parseLiters(name, volume);
  if (liters && /\b(bom|keg|fass)\b/i.test(name)) {
    return `≈ ${formatAmount(price / liters)}₫/lít`;
  }

  const pack = parsePackCount(name);
  if (pack) return `≈ ${formatAmount(price / pack.count)}₫/${pack.unit}`;

  if (category === 'vang') return `≈ ${formatAmount(price)}₫/chai`;
  if (category === 'xuc-xich') return `≈ ${formatAmount(price)}₫/gói`;
  if (category === 'combo' || lowerName.includes('combo')) return `≈ ${formatAmount(price)}₫/combo`;
  if (lowerName.includes('mở bia')) return `≈ ${formatAmount(price)}₫/cái`;
  if (category === 'phu-kien') return `≈ ${formatAmount(price)}₫/sản phẩm`;
  if (category === 'bia') return `≈ ${formatAmount(price)}₫/đơn vị`;

  return `≈ ${formatAmount(price)}₫/sản phẩm`;
}
