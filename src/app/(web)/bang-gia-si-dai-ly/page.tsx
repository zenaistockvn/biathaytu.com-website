import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu, Benediktiner',
  description: 'Thông tin hợp tác phân phối Bia Thầy Tu Benediktiner và Bitburger dành cho đại lý, nhà hàng và khách sạn. Tư vấn sản phẩm, quy cách, chính sách hợp tác và hỗ trợ bán hàng.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly' },
  openGraph: {
    title: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu, Benediktiner',
    description: 'Thông tin sản phẩm, quy cách và chương trình hợp tác dành cho đối tác phân phối Benediktiner và Bitburger. Liên hệ để được tư vấn.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly',
    images: [
      {
        url: '/images/brand/benediktiner-official/home-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thông Tin Sỉ & Đại Lý Bia Đức Nhập Khẩu, Benediktiner',
    description: 'Tìm hiểu sản phẩm và chương trình hợp tác dành cho đối tác phân phối Bia Thầy Tu Benediktiner và Bitburger.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chính Sách Đại Lý & Giá Sỉ Bia Đức', slug: 'bang-gia-si-dai-ly', url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly', description: 'Chính sách phân phối cho đại lý.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com.vn' }, { name: 'Đại Lý Phân Phối', url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly' }])} />

      <EditorialPage
        hero={{
          eyebrow: 'Hợp tác kinh doanh',
          title: 'Đại lý và giá sỉ',
          kicker: 'Benediktiner và Bitburger',
          lead: 'Kinh doanh bia nhập khẩu cao cấp cùng nhà phân phối Bia Thầy Tu.',
        }}
      >
        <Summary>
          <p><strong>Chào mừng các đối tác:</strong> chúng tôi tìm kiếm đại lý phân phối, siêu thị mini, cửa hàng đồ uống nhập khẩu và cộng tác viên bán sỉ trên toàn quốc cho 2 nhãn hiệu bia Đức: Benediktiner Weissbier và Bitburger Premium Pils.</p>
        </Summary>

        <h2>Quyền lợi đại lý</h2>
        <InfoGrid
          columns={2}
          items={[
            { title: 'Mức chiết khấu hấp dẫn', text: 'Lợi nhuận gộp lên đến 20-35% tùy theo mốc sản lượng cam kết hàng tháng (Tier 1, Tier 2, Tier 3).' },
            { title: 'Bảo vệ giá và khu vực', text: 'Chính sách quản lý giá bán lẻ nghiêm ngặt (MAP) giúp đại lý không bị phá giá, bảo vệ lợi ích kinh doanh lâu dài.' },
            { title: 'Hỗ trợ marketing, POSM', text: 'Ấn phẩm truyền thông (ảnh, video HD), ly bia chuyên dụng, đế lót ly, standee trưng bày.' },
            { title: 'Logistics chuyên nghiệp', text: 'Kho bãi tiêu chuẩn tại Hà Nội. Hỗ trợ phí vận chuyển cho đơn hàng sỉ ra các tỉnh thành, giao hàng nhanh chóng.' },
          ]}
        />

        <h2>Danh mục áp dụng giá sỉ</h2>
        <table>
          <thead>
            <tr><th scope="col">Sản phẩm</th><th scope="col">Quy cách</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Benediktiner Weissbier Naturtrüb</strong></td><td>Lon 500ml, chai 500ml</td></tr>
            <tr><td><strong>Benediktiner Dunkel</strong></td><td>Lon 500ml, chai 500ml</td></tr>
            <tr><td><strong>Bom 5 lít Benediktiner</strong></td><td>Phân khúc quà tặng, lễ Tết</td></tr>
            <tr><td><strong>Bitburger Premium Pils</strong></td><td>Lon 330ml, lon 500ml</td></tr>
          </tbody>
        </table>

        <CtaBand
          title="Nhận bảng giá sỉ"
          text="Để nhận file PDF báo giá sỉ chi tiết và chính sách chiết khấu, vui lòng liên hệ trực tiếp giám đốc kinh doanh."
          action={{ href: zaloUrl, label: 'Nhắn Zalo nhận bảng giá', external: zaloUrl.startsWith('https://') }}
          secondary={{ href: telHref, label: `Hotline ${COMPANY_CONFIG.hotline}` }}
        />
      </EditorialPage>
    </>
  );
}
