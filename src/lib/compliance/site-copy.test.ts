import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPublishedArticles } from '@/lib/data/articles';
import { getVisibleProducts } from '@/lib/data/products';
import { getBrandInfo } from '@/lib/seo/business';
import { getProductSchema } from '@/app/(web)/components/JsonLd';

/**
 * Rà soát tuân thủ 10/2026 (compliance-reviewer): luật 44/2019 và NĐ 24/2020, website không bán online,
 * bảng sự thật thương hiệu. Bài và sản phẩm lấy từ database mỗi lần build, nên kiểm trên bản đã render.
 */
const BANNED: Array<[string, RegExp]> = [
  ['hứa giao hàng', /hỏa tốc|hoả tốc|giao nhanh|ship\s|xe tải lạnh|hỗ trợ phí vận chuyển/i],
  ['kêu gọi đặt mua', /đặt mua|đặt bia|đặt quà|mua online|mua ngay/i],
  ['khuyến khích uống', /muốn uống thêm|thử sẽ ghiền|không say|cạn ly|thả ga/i],
  ['gắn bia với cơ thể', /không gây mệt mỏi|sức lực|bổ dưỡng|tốt cho sức khỏe|giải độc/i],
  ['sai nơi ủ', /thầy tu tu viện|nguyên chai từ Bavaria|nhượng quyền|suối Alps|nước tinh khiết từ dãy Alps|nhà máy bia tu viện|ủ bởi các tu sĩ|ủ từ năm 1609 tại/i],
  ['chê bia khác', /bia đen công nghiệp|pha tạp chất|linh hồn của nó/i],
  ['khẳng định không nguồn', /độc quyền|số 1 nước Đức|bán chạy nhất nước Đức|8 thế hệ|nhiều nhất châu Âu|40 quốc gia/i],
  ['gạch nối dài', /[–—]/],
  // Đợt 2: không có chuỗi lạnh; hãng không công bố men còn sống; không hiện tỷ suất lợi nhuận, không ấn định giá bán lại.
  ['chuỗi lạnh', /container lạnh|kho lạnh|xe tải lạnh/i],
  ['men sống', /men sống|tiếp tục lên men|tế bào men/i],
  ['số liệu lợi nhuận, MAP', /lợi nhuận gộp|\(MAP\)|30% lợi nhuận/i],
  ['chê bia khác (đợt 2)', /bia lager thông thường|muốn nâng cấp|nặng đô như dòng bia đen Stout|bội thực/i],
];

function offenders(texts: Array<[string, string]>) {
  return texts.flatMap(([where, text]) =>
    BANNED.filter(([, re]) => re.test(text)).map(([label, re]) => `${where} [${label}]: ${text.match(re)?.[0]}`),
  );
}

function staticPageSources(dir = join(process.cwd(), 'src/app/(web)')): Array<[string, string]> {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry): Array<[string, string]> => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'xem-truoc-giao-dien' ? [] : staticPageSources(path);
    return entry.name === 'page.tsx' ? [[path, readFileSync(path, 'utf8')]] : [];
  });
}

describe('rà soát tuân thủ 10/2026', () => {
  it('bài Kiến thức đang public không còn câu vi phạm', () => {
    const texts = getPublishedArticles().map((a): [string, string] => [a.slug ?? a.id, `${a.title}\n${a.meta_description}\n${a.content}`]);
    expect(offenders(texts)).toEqual([]);
  });

  it('mô tả sản phẩm đang hiển thị không còn câu vi phạm', () => {
    const texts = getVisibleProducts().map((p): [string, string] => [p.slug, `${p.name}\n${p.description}`]);
    expect(offenders(texts)).toEqual([]);
  });

  it('trang tĩnh không còn câu vi phạm', () => {
    expect(offenders(staticPageSources())).toEqual([]);
  });

  it('JSON-LD ghi đúng bang của từng nhà sản xuất, không gán Bavaria cho mọi hãng', () => {
    expect(getBrandInfo('Bitburger Premium Pils').manufacturerRegion).toBe('Rheinland-Pfalz');
    expect(getBrandInfo('Köstritzer Schwarzbier').manufacturerRegion).toBe('Thüringen');
    const schema = getProductSchema({ name: 'Bitburger Premium Pils', slug: 'bitburger-premium-pils' }) as {
      manufacturer?: { address?: { addressRegion?: string } };
    };
    expect(schema.manufacturer?.address?.addressRegion).toBe('Rheinland-Pfalz');
  });

  it('giải iTQi 2022 chỉ gắn cho Weissbier Naturtrüb', () => {
    expect(getBrandInfo('Benediktiner Naturtrüb, thùng 12 chai 500ml').isAwardWinner).toBe(true);
    expect(getBrandInfo('Benediktiner Weissbier Dunkel').isAwardWinner).toBe(false);
    expect(getBrandInfo('Benediktiner Festbier Bom 5L').isAwardWinner).toBe(false);
  });

  it('bài Bitburger không còn "so-1" trên URL, slug cũ chuyển 301 về slug mới', async () => {
    const slugs = getPublishedArticles().map((a) => a.slug);
    expect(slugs).toContain('bitburger-premium-pils-200-nam-bia-pils-vung-eifel');
    expect(slugs.filter((s) => /so-1|hanh-trinh/.test(s ?? ''))).toEqual([]);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const redirects: Array<{ source: string; destination: string }> = await require('../../../next.config.js').redirects();
    expect(redirects).toContainEqual(
      expect.objectContaining({
        source: '/kien-thuc/bitburger-hanh-trinh-200-nam-bia-draft-so-1',
        destination: '/kien-thuc/bitburger-premium-pils-200-nam-bia-pils-vung-eifel',
      }),
    );
  });

  it('trang phụ kiện không mang thông tin về bia', () => {
    const info = getBrandInfo('Bộ 6 cốc Benediktiner chính hãng 500ml', 'phu-kien');
    expect(info.isBeer).toBe(false);
    expect(info.manufacturer).toBeNull();
  });

  it('llms-full.txt mô tả đúng thùng Mix và không trỏ tới URL mua hàng cũ', () => {
    const llms = readFileSync(join(process.cwd(), 'public/llms-full.txt'), 'utf8');
    expect(llms).not.toContain('pha trái cây');
    expect(llms).not.toContain('/mua-bia-benediktiner-chinh-hang');
    expect(llms).toContain('6 chai Naturtrüb và 6 chai Dunkel');
  });
});
