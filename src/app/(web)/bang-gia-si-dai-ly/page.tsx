import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';
import ProductConsultationForm from '../components/ProductConsultationForm';

export const metadata: Metadata = {
  title: 'Đại lý bia Đức Benediktiner, Bitburger: Chiết khấu, quy cách',
  description: 'German Taste tìm đại lý, cửa hàng đồ uống, siêu thị mini cho Benediktiner và Bitburger. Chiết khấu theo sản lượng, hỗ trợ ly, standee; thông tin hợp tác dành cho đại lý và nhà phân phối.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly' },
  openGraph: {
    title: 'Đại lý bia Đức Benediktiner, Bitburger: Chiết khấu, quy cách',
    description: 'German Taste tìm đại lý, cửa hàng đồ uống, siêu thị mini cho Benediktiner và Bitburger. Chiết khấu theo sản lượng, hỗ trợ ly, standee; thông tin hợp tác dành cho đại lý và nhà phân phối.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly',
    images: [
      {
        url: '/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Đại lý bia Đức nhập khẩu Benediktiner, Bitburger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đại lý bia Đức Benediktiner, Bitburger: Chiết khấu, quy cách',
    description: 'Đại lý Benediktiner và Bitburger: Chiết khấu theo sản lượng, hỗ trợ ly, standee, thông tin hợp tác dành cho đại lý và nhà phân phối.',
    images: ['/images/og/home.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chính sách đại lý & giá sỉ bia Đức', slug: 'bang-gia-si-dai-ly', url: 'https://www.biathaytu.com.vn/bang-gia-si-dai-ly', description: 'Chính sách phân phối cho đại lý.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/bang-gia-si-dai-ly', label: 'Đại lý phân phối' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Hợp tác kinh doanh',
          title: 'Hợp tác phân phối',
          kicker: 'Benediktiner và Bitburger',
          lead: 'Thông tin dành cho đại lý, nhà phân phối và đối tác phát triển hệ thống Bia Thầy Tu.',
        }}
      >
        <Summary>
          <p><strong>Bên mình đang tìm:</strong> Đại lý phân phối, siêu thị mini, cửa hàng đồ uống nhập khẩu và cộng tác viên bán sỉ trên toàn quốc cho 2 nhãn bia Đức: Benediktiner Weissbier và Bitburger Premium Pils. German Taste nhập khẩu trực tiếp cả hai nhãn.</p>
        </Summary>

        <h2>Đại lý được gì</h2>
        <InfoGrid
          columns={2}
          items={[
            { title: 'Chiết khấu theo sản lượng', text: 'Mức chiết khấu theo mốc sản lượng cam kết hàng tháng. Thông tin cụ thể được trao đổi khi hợp tác.' },
            { title: 'Hỗ trợ theo khu vực', text: 'Chính sách hợp tác được trao đổi theo từng khu vực.' },
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

        <ProductConsultationForm />
      </EditorialPage>
    </>
  );
}
