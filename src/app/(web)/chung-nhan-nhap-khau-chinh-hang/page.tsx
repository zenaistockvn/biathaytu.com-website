import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Giấy tờ nhập khẩu bia Đức: Tờ khai hải quan, CO, CQ',
  description: 'Mỗi lô Benediktiner và Bitburger German Taste nhập về có tờ khai hải quan, giấy chứng nhận xuất xứ CO, chứng nhận CQ của nhà máy và bản tự công bố.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/chung-nhan-nhap-khau-chinh-hang' },
  openGraph: {
    title: 'Giấy tờ nhập khẩu bia Đức: Tờ khai hải quan, CO, CQ',
    description: 'Mỗi lô Benediktiner và Bitburger German Taste nhập về có tờ khai hải quan, giấy chứng nhận xuất xứ CO, chứng nhận CQ của nhà máy và bản tự công bố.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/chung-nhan-nhap-khau-chinh-hang',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Giấy tờ nhập khẩu bia Đức: Tờ khai hải quan, CO, CQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giấy tờ nhập khẩu bia Đức: Tờ khai hải quan, CO, CQ',
    description: 'Mỗi lô Benediktiner và Bitburger German Taste nhập về có tờ khai hải quan, giấy chứng nhận xuất xứ CO, chứng nhận CQ của nhà máy và bản tự công bố.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chứng nhận nhập khẩu bia Đức', slug: 'chung-nhan-nhap-khau-chinh-hang', url: 'https://www.biathaytu.com.vn/chung-nhan-nhap-khau-chinh-hang', description: 'Các giấy tờ nhập khẩu đi kèm mỗi lô bia Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/chung-nhan-nhap-khau-chinh-hang', label: 'Chứng nhận nhập khẩu' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Hồ sơ nhập khẩu',
          title: 'Chứng nhận nhập khẩu',
          kicker: 'Giấy tờ đi kèm mỗi lô hàng',
          lead: 'Giấy tờ nhà hàng, đại lý cần khi nhập bia Đức nguyên chai về bán.',
        }}
      >
        <Summary>
          <p><strong>Nguồn hàng:</strong> Không hàng xách tay, không hàng cận date. Benediktiner và Bitburger do German Taste nhập khẩu chính ngạch, đã nộp thuế hải quan.</p>
        </Summary>

        <h2>Hồ sơ đi kèm mỗi lô hàng</h2>
        <p>Nhà hàng, khách sạn và đại lý thường cần các giấy tờ này khi nhập hàng hoặc khi cơ quan chức năng kiểm tra. Mỗi lô bia Đức German Taste phân phối đều có:</p>
        <InfoGrid
          items={[
            { title: 'Tờ khai hải quan', text: 'Cho thấy lô hàng đã thông quan tại cảng Việt Nam.' },
            { title: 'Chứng nhận CO/CQ', text: 'CO là giấy chứng nhận xuất xứ (Certificate of Origin) từ Đức. CQ là giấy chứng nhận chất lượng của nhà máy.' },
            { title: 'Bản tự công bố', text: 'Hồ sơ tự công bố an toàn thực phẩm theo quy định của Bộ Y tế.' },
          ]}
        />

        <h2>Giải thưởng quốc tế iTQi</h2>
        <h3>Superior Taste Award (3 sao)</h3>
        <p>Năm 2022, Benediktiner Weissbier Naturtrüb nhận <strong>Superior Taste Award 3 sao</strong> của Viện Hương vị Quốc tế (International Taste Institute, iTQi) tại Brussels, Bỉ. Theo iTQi, 3 sao là mức &quot;exceptional&quot;, dành cho sản phẩm đạt 90 đến 100% điểm trong buổi nếm mù của hội đồng đầu bếp và sommelier. Tra cứu tại <a href="https://www.taste-institute.com/en/awarded-products/product-details/9022846" target="_blank" rel="noopener noreferrer">taste-institute.com</a>.</p>

        <CtaBand
          title="Nhập sỉ cho đại lý"
          text="Xem chiết khấu, quy cách cho đại lý, hoặc gọi để hỏi về hồ sơ của lô hàng anh chị cần."
          action={{ href: '/bang-gia-si-dai-ly', label: 'Xem chính sách đại lý' }}
        />
      </EditorialPage>
    </>
  );
}
