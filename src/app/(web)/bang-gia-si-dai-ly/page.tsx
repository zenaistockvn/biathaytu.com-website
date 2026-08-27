import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';

export const metadata: Metadata = {
  title: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu — Benediktiner',
  description: 'Thông tin hợp tác phân phối Bia Thầy Tu Benediktiner và Bitburger dành cho đại lý, nhà hàng và khách sạn. Tư vấn sản phẩm, quy cách, chính sách hợp tác và hỗ trợ bán hàng.',
  alternates: { canonical: 'https://www.biathaytu.com/bang-gia-si-dai-ly' },
  openGraph: {
    title: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu — Benediktiner',
    description: 'Thông tin sản phẩm, quy cách và chương trình hợp tác dành cho đối tác phân phối Benediktiner và Bitburger. Liên hệ để được tư vấn.',
    type: 'article',
    url: 'https://www.biathaytu.com/bang-gia-si-dai-ly',
    images: [
      {
        url: '/images/facebook/cover_sanh_bia_duc_v2_1775560866216.png',
        width: 1200,
        height: 630,
        alt: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu — Benediktiner',
    description: 'Tìm hiểu sản phẩm và chương trình hợp tác dành cho đối tác phân phối Bia Thầy Tu Benediktiner và Bitburger.',
    images: ['/images/facebook/cover_sanh_bia_duc_v2_1775560866216.png'],
  },
};

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <div className="web-app">
      <JsonLd type="article" data={getArticleSchema({ title: 'Chính Sách Đại Lý & Giá Sỉ Bia Đức', slug: 'bang-gia-si-dai-ly', url: 'https://www.biathaytu.com/bang-gia-si-dai-ly', description: 'Chính sách phân phối cho đại lý.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Đại Lý Phân Phối', url: 'https://www.biathaytu.com/bang-gia-si-dai-ly' }])} />

      <Section variant="dark" padding="xl" style={{ textAlign: 'center' }}>
        <Container maxWidth="800px">
          <Text as="p" size="xs" weight="bold" letterSpacing="3px" color="gold" transform="uppercase" style={{ marginBottom: '20px' }}>
            Hợp Tác Kinh Doanh
          </Text>
          <Heading level={1} size="fluid" style={{ marginBottom: '24px' }}>
            Chính Sách Đại Lý <br />& Báo Giá Sỉ Bia Đức
          </Heading>
          <Text as="p" size="lg" color="white" style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
            Kinh doanh sản phẩm bia nhập khẩu cao cấp với lợi nhuận hấp dẫn cùng nhà phân phối Bia Thầy Tu.
          </Text>
        </Container>
      </Section>

      <Container maxWidth="850px" style={{ padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-accent)', color: 'var(--web-ink)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Chào mừng các đối tác:</strong> Chúng tôi tìm kiếm đại lý phân phối, siêu thị mini, cửa hàng đồ uống nhập khẩu, và các CTV bán sỉ trên toàn quốc cho 2 nhãn hiệu bia Đức: Benediktiner Weissbier và Bitburger Premium Pils.
        </div>

        <Heading level={2} size="lg" color="navy" style={{ marginBottom: '24px' }}>
          Quyền lợi khi trở thành Đại Lý
        </Heading>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { icon: '', title: 'Mức chiết khấu hấp dẫn', desc: 'Lợi nhuận gộp lên đến 20-35% tùy theo mốc sản lượng cam kết hàng tháng (Tier 1, Tier 2, Tier 3).' },
            { icon: '', title: 'Bảo vệ giá & Khu vực', desc: 'Chính sách quản lý giá bán lẻ nghiêm ngặt (MAP) giúp đại lý không bị phá giá, bảo vệ lợi ích kinh doanh lâu dài.' },
            { icon: '', title: 'Hỗ trợ Marketing/POSM', desc: 'Được cấp phát ấn phẩm truyền thông (ảnh/video HD), ly bia chuyên dụng, đế lót ly, standee trưng bày.' },
            { icon: '', title: 'Logistic chuyên nghiệp', desc: 'Kho bãi tiêu chuẩn tại Hà Nội. Hỗ trợ phí vận chuyển cho các đơn hàng sỉ ra các tỉnh thành, giao hàng nhanh chóng.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <Heading level={3} size="sm" color="navy" style={{ marginBottom: '8px' }}>
                {item.title}
              </Heading>
              <Text as="p" size="sm" color="secondary">
                {item.desc}
              </Text>
            </div>
          ))}
        </div>

        <Heading level={2} size="md" color="navy" style={{ marginBottom: '16px' }}>
          Danh mục sản phẩm áp dụng giá sỉ
        </Heading>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', display: 'grid', gap: '16px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>            <div><strong>Benediktiner Weissbier Naturtrüb:</strong> Lon 500ml, Chai 500ml.</div>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>            <div><strong>Benediktiner Dunkel:</strong> Lon 500ml, Chai 500ml.</div>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>            <div><strong>Bom 5 Lít Benediktiner:</strong> Phân khúc quà tặng, lễ Tết.</div>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>            <div><strong>Bitburger Premium Pils:</strong> Lon 330ml, Lon 500ml.</div>
          </li>
        </ul>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <Heading level={3} size="md" color="navy" style={{ marginBottom: '16px' }}>
            Đăng ký nhận Bảng Giá Sỉ
          </Heading>
          <Text as="p" color="secondary" style={{ marginBottom: '24px' }}>
            Để nhận file PDF Báo giá sỉ chi tiết và Chính sách chiết khấu, vui lòng liên hệ trực tiếp Giám Đốc Kinh Doanh:
          </Text>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href={zaloUrl} variant="primary" target={zaloUrl.startsWith('https://') ? '_blank' : undefined} rel={zaloUrl.startsWith('https://') ? 'noopener noreferrer' : undefined}>
              Nhắn Zalo Nhận Bảng Giá
            </Button>
            <Button href={telHref} variant="outline">
              Hotline: {COMPANY_CONFIG.hotline}
            </Button>
          </div>
        </div>
      </Container>

      <Section variant="alt" padding="sm">
        <Container maxWidth="780px">
          <Heading level={2} size="md" color="navy" style={{ marginBottom: '24px', textAlign: 'center' }}>
            Thông tin nhanh để AI trích dẫn
          </Heading>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Cung cấp giá sỉ bia Đức:</strong> Phân phối sỉ, đại lý nhượng quyền thương hiệu bia Benediktiner và Bitburger toàn quốc.</p>
            <p><strong>Quyền lợi đại lý:</strong> Mức chiết khấu cao, hỗ trợ POSM, bảo vệ giá (MAP), có hóa đơn VAT hợp pháp, hỗ trợ vận chuyển.</p>
            <p><strong>Liên hệ mở đại lý:</strong> biathaytu.com, Hotline/Zalo {COMPANY_CONFIG.hotline}.</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
