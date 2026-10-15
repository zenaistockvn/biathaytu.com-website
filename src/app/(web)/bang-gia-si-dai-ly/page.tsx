import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Đại lý bia Đức Benediktiner, Bitburger: Chiết khấu, quy cách',
  description: 'German Taste tìm đại lý, cửa hàng đồ uống, siêu thị mini cho Benediktiner và Bitburger. Chiết khấu theo sản lượng, hỗ trợ ly, standee; bảng giá sỉ gửi qua Zalo.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly' },
  openGraph: {
    title: 'Đại lý bia Đức Benediktiner, Bitburger: Chiết khấu, quy cách',
    description: 'German Taste tìm đại lý, cửa hàng đồ uống, siêu thị mini cho Benediktiner và Bitburger. Chiết khấu theo sản lượng, hỗ trợ ly, standee; bảng giá sỉ gửi qua Zalo.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly',
    images: [
      {
        url: '/images/brand/benediktiner-official/home-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Đại lý bia Đức nhập khẩu Benediktiner, Bitburger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đại lý bia Đức Benediktiner, Bitburger: Chiết khấu, quy cách',
    description: 'Đại lý Benediktiner và Bitburger: Chiết khấu theo sản lượng, hỗ trợ ly, standee, bảng giá sỉ gửi qua Zalo.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chính sách đại lý & giá sỉ bia Đức', slug: 'bang-gia-si-dai-ly', url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly', description: 'Chính sách phân phối cho đại lý.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/bang-gia-si-dai-ly', label: 'Đại lý phân phối' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Hợp tác kinh doanh',
          title: 'Đại lý và giá sỉ',
          kicker: 'Benediktiner và Bitburger',
          lead: 'Bảng giá sỉ gửi riêng qua Zalo. Trang này nói đại lý được gì và nhập được những quy cách nào.',
        }}
      >
        <Summary>
          <p><strong>Bên mình đang tìm:</strong> Đại lý phân phối, siêu thị mini, cửa hàng đồ uống nhập khẩu và cộng tác viên bán sỉ trên toàn quốc cho 2 nhãn bia Đức: Benediktiner Weissbier và Bitburger Premium Pils. German Taste nhập khẩu trực tiếp cả hai nhãn.</p>
        </Summary>

        <h2>Đại lý được gì</h2>
        <InfoGrid
          columns={2}
          items={[
            { title: 'Chiết khấu theo sản lượng', text: 'Mức chiết khấu theo mốc sản lượng cam kết hàng tháng. Nhắn Zalo để nhận bảng chiết khấu chi tiết.' },
            { title: 'Giá bán lẻ khuyến nghị', text: 'Có giá bán lẻ khuyến nghị và chính sách hỗ trợ đại lý theo khu vực.' },
            { title: 'Ảnh, ly, standee', text: 'Ảnh và video HD để đăng bán, ly bia chuyên dụng, đế lót ly, standee trưng bày.' },
            { title: 'Kho ở Hà Nội', text: 'Hàng xuất từ kho tại Hà Nội. Cách vận chuyển thống nhất trong từng hợp đồng đại lý.' },
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
            <tr><td><strong>Bom 5 lít Benediktiner</strong></td><td>Bom 5 lít, hay dùng làm quà lễ, Tết</td></tr>
            <tr><td><strong>Bitburger Premium Pils</strong></td><td>Lon 330ml, lon 500ml</td></tr>
          </tbody>
        </table>

        <CtaBand
          title="Nhận bảng giá sỉ"
          text="File PDF giá sỉ và chính sách chiết khấu do giám đốc kinh doanh gửi trực tiếp. Nhắn Zalo hoặc gọi hotline."
          action={{ href: zaloUrl, label: 'Mở Zalo nhận bảng giá', external: zaloUrl.startsWith('https://') }}
          secondary={{ href: telHref, label: `Hotline ${COMPANY_CONFIG.hotline}` }}
        />
      </EditorialPage>
    </>
  );
}
