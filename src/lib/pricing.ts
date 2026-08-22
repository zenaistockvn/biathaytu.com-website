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

function formatApproximateUnitAmount(value: number): string {
  return formatAmount(Math.round(value / 100) * 100);
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

function getSingleUnit(name: string, category?: string | null): string | null {
  const lowerName = name.toLocaleLowerCase('vi');

  if (/\bchai\b/i.test(name)) return 'chai';
  if (/\blon\b/i.test(name)) return 'lon';
  if (/\bcốc\b/i.test(name)) return 'cốc';
  if (/\bly\b/i.test(name)) return 'ly';
  if (/\bgói\b/i.test(name)) return 'gói';
  if (lowerName.includes('mở bia')) return 'cái';
  if (category === 'vang') return 'chai';
  if (category === 'xuc-xich') return 'gói';
  if (category === 'combo' || lowerName.includes('combo')) return 'combo';
  if (category === 'phu-kien') return 'sản phẩm';
  if (category === 'bia') return 'sản phẩm';

  return null;
}

export function formatUnitPrice(input: UnitPriceInput): string {
  const { price, name, volume, category } = input;
  if (price == null || !Number.isFinite(price) || price <= 0) return '';

  const liters = parseLiters(name, volume);
  if (liters && /\b(bom|keg|fass)\b/i.test(name)) {
    return `≈ ${formatApproximateUnitAmount(price / liters)}₫/lít`;
  }

  const pack = parsePackCount(name);
  if (pack) return `≈ ${formatApproximateUnitAmount(price / pack.count)}₫/${pack.unit}`;

  const unit = getSingleUnit(name, category) || 'sản phẩm';
  return `≈ ${formatApproximateUnitAmount(price)}₫/${unit}`;
}
