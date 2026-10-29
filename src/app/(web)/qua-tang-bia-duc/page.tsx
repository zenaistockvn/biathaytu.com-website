import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage'
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Quà tặng bia Đức cho doanh nghiệp: Thùng mix, bom 5L',
  description: 'Thùng 12 chai Benediktiner mix Naturtrüb và Dunkel, bom 5L có vòi rót sẵn, set 6 chai kèm ly Weizen. In logo lên bao bì, có hoá đơn VAT cho doanh nghiệp.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/qua-tang-bia-duc' },
  openGraph: {
    title: 'Quà tặng bia Đức cho doanh nghiệp: Thùng mix, bom 5L',
    description: 'Thùng 12 chai Benediktiner mix Naturtrüb và Dunkel, bom 5L có vòi rót sẵn, set 6 chai kèm ly Weizen. In logo lên bao bì, có hoá đơn VAT cho doanh nghiệp.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/qua-tang-bia-duc',
    images: [
      {
        url: '/images/og/garden.jpg',
        width: 1200,
        height: 630,
        alt: 'Quà tặng bia Đức cho doanh nghiệp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quà tặng bia Đức cho doanh nghiệp: Thùng mix, bom 5L',
    description: 'Thùng 12 chai Benediktiner mix Naturtrüb và Dunkel, bom 5L có vòi rót sẵn, set 6 chai kèm ly Weizen. In logo lên bao bì, có hoá đơn VAT cho doanh nghiệp.',
    images: ['/images/og/garden.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Quà tặng bia Đức', slug: 'qua-tang-bia-duc', url: 'https://www.biathaytu.com.vn/qua-tang-bia-duc', description: 'Các set quà bia Đức cho doanh nghiệp: Thùng mix, bom 5L, set kèm ly.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/qua-tang-bia-duc', label: 'Quà tặng bia Đức' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Quà tặng doanh nghiệp',
          title: 'Quà tặng bia Đức',
          kicker: 'Lễ, Tết và tri ân đối tác',
          lead: 'Bia lúa mì Benediktiner, men từ hầm tu viện Ettal, hơn 400 năm truyền thống. Có thùng mix, bom 5 lít và set kèm ly.',
        }}
      >
        <Summary>
          <p><strong>Chọn theo người nhận:</strong> Người thích bia lúa mì thì thùng Mix 2 vị, nhà hay có tiệc thì bom 5 lít, người quen Pilsner thì Bitburger. Xem toàn bộ <Link href="/san-pham">danh mục bia Đức</Link>.</p>
        </Summary>

        <h2>Các set quà</h2>
        <InfoGrid
          items={[
            { title: <Link href="/san-pham/benediktiner-mix-2-vi-thung-12-chai-500ml">Hộp Mix 2 vị</Link>, text: 'Thùng 12 chai gồm 6 Weissbier (bia lúa mì) và 6 Dunkel (bia đen). Hộp cứng, quai xách.', meta: 'Quà tặng doanh nghiệp' },
            { title: <Link href="/san-pham/benediktiner-naturtrub-bom-5l">Bom 5 lít Naturtrüb</Link>, text: 'Bom 5 lít có vòi rót sẵn, người nhận mở ra rót được ngay trong bữa tiệc.', meta: 'Quà tặng doanh nghiệp' },
            { title: 'Set quà kèm ly', text: '6 chai bia nhập khẩu kèm 1 ly Weizen.', meta: 'Quà tặng doanh nghiệp' },
          ]}
        />

        <h2>Dành cho doanh nghiệp</h2>
        <ul>
          <li><strong>Chiết khấu:</strong> Giá ưu đãi cho đơn số lượng lớn dịp lễ, Tết.</li>
          <li><strong>Hoá đơn VAT:</strong> Chứng từ hợp lệ, CO/CQ, hoá đơn VAT theo yêu cầu doanh nghiệp.</li>
          <li><strong>In logo:</strong> In logo doanh nghiệp lên bao bì, thiệp chúc mừng thiết kế theo nhận diện thương hiệu.</li>
          <li><strong>Nhiều điểm nhận:</strong> Gửi quà theo danh sách đối tác của anh chị, cách giao trao đổi khi đặt.</li>
        </ul>

        <CtaBand
          title="Hợp tác phân phối"
          text="Đại lý và đối tác phân phối có thể để lại thông tin để trao đổi về sản phẩm."
          action={{ href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' }}
        />
      </EditorialPage>
    </>
  );
}
