import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
  description: 'Minh bạch nguồn gốc xuất xứ Bia Thầy Tu Benediktiner. Đầy đủ giấy tờ hải quan, CO/CQ, Công bố chất lượng sản phẩm nhập khẩu nguyên chai từ Đức.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/chung-nhan-nhap-khau-chinh-hang' },
  openGraph: {
    title: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
    description: 'Minh bạch nguồn gốc xuất xứ Bia Thầy Tu Benediktiner. Đầy đủ giấy tờ hải quan, CO/CQ, Công bố chất lượng sản phẩm nhập khẩu nguyên chai từ Đức.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/chung-nhan-nhap-khau-chinh-hang',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
    description: 'Minh bạch nguồn gốc xuất xứ Bia Thầy Tu Benediktiner. Đầy đủ giấy tờ hải quan, CO/CQ, Công bố chất lượng sản phẩm nhập khẩu nguyên chai từ Đức.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chứng Nhận Nhập Khẩu Bia Đức', slug: 'chung-nhan-nhap-khau-chinh-hang', url: 'https://www.biathaytu.com.vn/chung-nhan-nhap-khau-chinh-hang', description: 'Tính minh bạch và giấy tờ pháp lý nhập khẩu bia Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/chung-nhan-nhap-khau-chinh-hang', label: 'Chứng Nhận Nhập Khẩu' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Minh bạch và uy tín',
          title: 'Chứng nhận nhập khẩu',
          kicker: 'Chất lượng và nguồn gốc',
          lead: 'Minh bạch về pháp lý và nguồn gốc nhập khẩu nguyên chai từ Đức.',
        }}
      >
        <Summary>
          <p><strong>Cam kết:</strong> không bán hàng xách tay trôi nổi, không bán hàng cận date. Toàn bộ sản phẩm Bia Thầy Tu Benediktiner và Bitburger được nhập khẩu chính ngạch, hoàn thành nghĩa vụ thuế hải quan.</p>
        </Summary>

        <h2>Tính pháp lý và hồ sơ nhập khẩu</h2>
        <p>Đối với khách hàng doanh nghiệp (B2B) và HORECA, tính hợp pháp của hàng hóa là ưu tiên số một. Mọi lô hàng bia Đức do chúng tôi phân phối đều đi kèm bộ hồ sơ gồm:</p>
        <InfoGrid
          items={[
            { title: 'Tờ khai hải quan', text: 'Minh chứng lô hàng đã thông quan hợp pháp tại cảng Việt Nam.' },
            { title: 'Chứng nhận CO/CQ', text: 'Giấy chứng nhận xuất xứ (Certificate of Origin) từ Đức và chứng nhận chất lượng từ nhà máy sản xuất.' },
            { title: 'Bản tự công bố', text: 'Hồ sơ tự công bố chất lượng an toàn vệ sinh thực phẩm theo quy định Bộ Y tế.' },
          ]}
        />

        <h2>Giải thưởng quốc tế iTQi</h2>
        <h3>Superior Taste Award (3 sao)</h3>
        <p>Năm 2022, Benediktiner Weissbier Naturtrüb nhận giải thưởng <strong>hương vị 3 sao (mức cao nhất, Exceptional)</strong> từ Viện Hương vị Chất lượng Quốc tế (International Taste Institute, iTQi) tại Brussels, Bỉ. Giải thưởng được đánh giá mù (blind-tasting) bởi hội đồng 200 chuyên gia ẩm thực và sommelier hàng đầu thế giới.</p>

        <CtaBand
          title="Yên tâm nhập sỉ và kinh doanh"
          text="Chúng tôi đồng hành cùng nhà phân phối với hồ sơ pháp lý đầy đủ."
          action={{ href: '/bang-gia-si-dai-ly', label: 'Xem chính sách đại lý' }}
        />
      </EditorialPage>
    </>
  );
}
