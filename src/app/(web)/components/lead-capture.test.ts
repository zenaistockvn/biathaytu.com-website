import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

const layout = read('src/app/(web)/layout.tsx');
const ageGate = read('src/app/(web)/components/AgeVerificationGate.tsx');
const productForm = read('src/app/(web)/components/ProductConsultationForm.tsx');
const footer = read('src/app/(web)/components/WebFooter.tsx');
const leadRoute = read('src/app/api/leads/route.ts');
const tracking = read('src/lib/leadClient.ts');

describe('Age gate 18+', () => {
  it('không ẩn nội dung SSR bằng prepaint', () => {
    expect(layout).not.toContain('AGE_GATE_PREPAINT_SCRIPT');
    expect(layout).not.toContain('visibility:hidden');
    expect(layout).toContain('<main id="main-content">{children}</main>');
  });

  it('có đúng hai lựa chọn và chuyển người chưa đủ tuổi ra ngoài', () => {
    expect(ageGate).toContain('Bạn đã đủ 18 tuổi chưa?');
    expect(ageGate).toContain('Tôi đã đủ 18 tuổi');
    expect(ageGate).toContain('Chưa đủ 18 tuổi');
    expect(ageGate).toContain('window.location.replace(UNDERAGE_EXIT_URL)');
  });
});

describe('Lead capture', () => {
  it('form sản phẩm có đủ trường và 4 nhóm nhu cầu', () => {
    expect(productForm).toContain('Họ tên');
    expect(productForm).toContain('Số điện thoại');
    expect(productForm).toContain('Nhu cầu');
    expect(productForm).toContain('Ghi chú');
    expect(productForm).toContain("value: 'mua lẻ'");
    expect(productForm).toContain("value: 'mua biếu tặng'");
    expect(productForm).toContain("value: 'nhà hàng quán bia'");
    expect(productForm).toContain("value: 'sự kiện'");
  });

  it('footer có form ngắn dùng chung toàn site', () => {
    expect(footer).toContain('FooterLeadForm');
  });

  it('API lưu nguồn, sản phẩm, thời gian và UTM', () => {
    for (const key of [
      'submitted_at',
      'page_path',
      'product_slug',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ]) {
      expect(leadRoute).toContain(key);
    }
  });

  it('tracking có đúng ba event yêu cầu', () => {
    expect(tracking).toContain('contact_zalo_click');
    expect(tracking).toContain('contact_phone_click');
    expect(tracking).toContain('lead_form_submit');
    expect(tracking).toContain('page_path');
    expect(tracking).toContain('product_slug');
  });
});
