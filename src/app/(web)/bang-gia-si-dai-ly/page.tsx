import type { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { BRAND, BRAND_TEL_HREF } from '@/lib/brand';

const PAGE_URL = `${BRAND.siteUrl}/bang-gia-si-dai-ly`;

export const metadata: Metadata = {
  title: 'Hợp Tác Đại Lý Benediktiner — German Taste',
  description: 'Thông tin hợp tác phân phối Benediktiner dành cho đại lý, cửa hàng, nhà hàng và khách sạn. Chính sách thương mại được trao đổi riêng.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Hợp Tác Đại Lý Benediktiner — German Taste',
    description: 'Tìm hiểu danh mục, hỗ trợ bán hàng và quy trình hợp tác phân phối Benediktiner tại Việt Nam.',
    type: 'article',
    url: PAGE_URL,
    images: [{
      url: '/images/facebook/cover_sanh_bia_duc_v2_1775560866216.png',
      width: 1200,
      height: 630,
      alt: 'Hợp tác đại lý Benediktiner tại Việt Nam',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hợp Tác Đại Lý Benediktiner — German Taste',
    description: 'Danh mục, hỗ trợ bán hàng và quy trình hợp tác phân phối Benediktiner tại Việt Nam.',
    images: ['/images/facebook/cover_sanh_bia_duc_v2_1775560866216.png'],
  },
};

const partnerBenefits = [
  ['Danh mục rõ ràng', 'Danh mục sản phẩm, quy cách và thông tin bán hàng được chuẩn hóa để đối tác dễ triển khai.'],
  ['Bảo vệ thương hiệu', 'Phối hợp quản lý hình ảnh, nội dung và trải nghiệm thương hiệu Benediktiner trên từng kênh bán.'],
  ['Hỗ trợ Marketing/POSM', 'Cung cấp tài liệu truyền thông, hình ảnh, vật phẩm trưng bày và hướng dẫn giới thiệu sản phẩm.'],
  ['Phối hợp vận hành', 'Trao đổi kế hoạch cung ứng và giao nhận theo khu vực, mô hình kinh doanh và nhu cầu thực tế.'],
] as const;

export default function Page() {
  return (
    <div className="web-app">
      <JsonLd type="article" data={getArticleSchema({
        title: 'Hợp tác đại lý Benediktiner',
        slug: 'bang-gia-si-dai-ly',
        url: PAGE_URL,
        description: 'Thông tin hợp tác phân phối Benediktiner tại Việt Nam.',
        datePublished: '2026-04-24',
        dateModified: '2026-08-22',
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: BRAND.siteUrl },
        { name: 'Hợp tác đại lý', url: PAGE_URL },
      ])} />

      <Section variant="dark" padding="xl" style={{ textAlign: 'center' }}>
        <Container maxWidth="800px">
          <Text as="p" size="xs" weight="bold" letterSpacing="3px" color="gold" transform="uppercase" style={{ marginBottom: '20px' }}>
            Hợp Tác Kinh Doanh
          </Text>
          <Heading level={1} size="fluid" style={{ marginBottom: '24px' }}>
            Trở Thành Đối Tác Phân Phối Benediktiner
          </Heading>
          <Text as="p" size="lg" color="white" style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
            German Taste trao đổi chính sách thương mại riêng với từng đối tác theo mô hình, khu vực và kế hoạch kinh doanh.
          </Text>
        </Container>
      </Section>

      <Container maxWidth="900px" style={{ padding: '60px 20px' }}>
        <div style={{ background: 'var(--web-bg-section)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', lineHeight: 1.7 }}>
          <strong>Nguyên tắc công khai:</strong> website chỉ hiển thị giá niêm yết retail. Điều kiện thương mại dành cho đại lý, nhà hàng, khách sạn và đối tác được trao đổi trực tiếp, không công khai trên website.
        </div>

        <Heading level={2} size="lg" color="navy" style={{ marginBottom: '24px' }}>
          German Taste hỗ trợ đối tác như thế nào?
        </Heading>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {partnerBenefits.map(([title, desc]) => (
            <div key={title} style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <Heading level={3} size="sm" color="navy" style={{ marginBottom: '8px' }}>{title}</Heading>
              <Text as="p" size="sm" color="secondary">{desc}</Text>
            </div>
          ))}
        </div>

        <div style={{ padding: '36px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <Heading level={3} size="md" color="navy" style={{ marginBottom: '12px' }}>
            Trao đổi chính sách hợp tác
          </Heading>
          <Text as="p" color="secondary" style={{ marginBottom: '24px' }}>
            Vui lòng liên hệ trực tiếp German Taste để đội ngũ phụ trách trao đổi danh mục, khu vực và điều kiện hợp tác phù hợp.
          </Text>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href={BRAND.socialLinks.zalo} variant="primary" target="_blank" rel="noopener noreferrer">
              Nhắn Zalo
            </Button>
            <Button href={BRAND_TEL_HREF} variant="outline">
              Hotline: {BRAND.hotline}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
