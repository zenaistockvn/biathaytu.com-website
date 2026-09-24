import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, FaqSection, InfoGrid, Summary } from '../components/EditorialPage';
import { COMPANY_CONFIG } from '@/config/company';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Là Gì? Nguồn Gốc Bia Benediktiner Đức',
  description: 'Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì Benediktiner Weissbier, được ủ từ năm 1609 tại Tu Viện Ettal, Bavaria (Đức). Tìm hiểu lịch sử 400 năm.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi' },
  openGraph: {
    title: 'Bia Thầy Tu Là Gì? Nguồn Gốc Bia Benediktiner Đức',
    description: 'Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì Benediktiner Weissbier, được ủ từ năm 1609 tại Tu Viện Ettal, Bavaria (Đức). Tìm hiểu lịch sử 400 năm.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu Là Gì? Nguồn Gốc Bia Benediktiner Từ Tu Viện Ettal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Là Gì? Nguồn Gốc Bia Benediktiner Đức',
    description: 'Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì Benediktiner Weissbier, được ủ từ năm 1609 tại Tu Viện Ettal, Bavaria (Đức). Tìm hiểu lịch sử 400 năm.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const faqs = [
    { question: 'Bia Thầy Tu là bia gì?', answer: 'Bia Thầy Tu là tên gọi tại Việt Nam của dòng bia lúa mì Đức Benediktiner Weissbier, được ủ theo truyền thống tu viện Ettal (Bavaria) từ năm 1609, tuân thủ Luật Tinh Khiết Reinheitsgebot 1516.' },
    { question: 'Vì sao gọi là "bia thầy tu"?', answer: 'Vì bia Benediktiner gắn với phương pháp ủ bia của các tu sĩ dòng Benedictine tại Tu Viện Ettal, nơi gìn giữ công thức và tiêu chuẩn ủ bia suốt hơn 400 năm.' },
    { question: 'Tìm hiểu Bia Thầy Tu ở đâu?', answer: `Xem thông tin sản phẩm tại biathaytu.com.vn, liên hệ Zalo/Hotline ${COMPANY_CONFIG.hotline} hoặc ghé showroom ${COMPANY_CONFIG.showroomAddress}.` },
  ];

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Thầy Tu Là Gì?', slug: 'bia-thay-tu-la-gi', url: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi', description: 'Nguồn gốc và lịch sử Bia Thầy Tu Benediktiner từ Tu Viện Ettal.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="faq" data={getFaqSchema(faqs)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com.vn' }, { name: 'Bia Thầy Tu Là Gì?', url: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi' }])} />

      <EditorialPage
        hero={{
          eyebrow: 'Kiến thức bia Đức',
          title: 'Bia Thầy Tu là gì?',
          kicker: 'Benediktiner Weissbier',
          lead: 'Câu chuyện về dòng bia lúa mì được ủ bởi các tu sĩ dòng Benedictine từ năm 1609 tại chân dãy Alps.',
        }}
        after={<FaqSection items={faqs} />}
      >
        <Summary>
          <p><strong>Tóm tắt:</strong> Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì <strong>Benediktiner Weissbier</strong>, được ủ theo truyền thống tu viện từ năm 1609 tại Tu Viện Ettal, Bavaria (Đức). Bia tuân thủ Luật Tinh Khiết 1516, chỉ dùng 4 nguyên liệu: nước, malt lúa mì, hoa bia và men.</p>
        </Summary>

        <h2>Vì sao gọi là &quot;Bia Thầy Tu&quot;?</h2>
        <p>Cái tên &quot;Bia Thầy Tu&quot; bắt nguồn từ việc dòng bia này được các tu sĩ (thầy tu) dòng Benedictine ủ trong tu viện. Ở châu Âu, truyền thống ủ bia trong tu viện có từ thời Trung Cổ, các tu sĩ coi bia là &quot;bánh mì lỏng&quot; giúp duy trì sức lực trong những ngày ăn chay dài.</p>
        <p>Tu Viện Ettal được thành lập năm 1330 bởi Hoàng đế Ludwig IV. Đến năm 1609, các tu sĩ tại đây bắt đầu ủ bia lúa mì theo phương pháp lên men đỉnh truyền thống. Hơn 400 năm qua, công thức gần như không thay đổi.</p>

        <h2>Luật Tinh Khiết 1516, Reinheitsgebot</h2>
        <p>Benediktiner tuân thủ Luật Tinh Khiết (Reinheitsgebot) do Công tước Wilhelm IV ban hành năm 1516, luật an toàn thực phẩm lâu đời nhất thế giới. Luật quy định bia chỉ được sản xuất từ đúng 4 nguyên liệu: nước, malt đại mạch (sau bổ sung lúa mì), hoa bia và men.</p>
        <p>Không phụ gia. Không chất bảo quản. Không hương liệu nhân tạo.</p>

        <h2>Các dòng bia Thầy Tu tại Việt Nam</h2>
        <InfoGrid
          items={[
            { title: 'Weissbier Naturtrüb', text: 'Bia lúa mì không lọc. Hương chuối chín, đinh hương, bọt trắng dày.', meta: '5,4% vol.' },
            { title: 'Benediktiner Dunkel', text: 'Bia đen lúa mì. Hương caramel, mật ong, mạch nha rang.', meta: '5,4% vol.' },
            { title: 'Bitburger Premium Pils', text: 'Pilsner chuẩn Đức. Hoa bia Hallertau, đắng thanh, sạch miệng.', meta: '4,8% vol.' },
          ]}
        />

        <h2>Bia Thầy Tu khác gì bia thông thường?</h2>
        <p>Bia thương mại thường sản xuất hàng loạt với phụ gia, chất tạo bọt, hương liệu nhân tạo. Bia Thầy Tu Benediktiner thì ngược lại: lên men tự nhiên trong chai (bottle-conditioned), giữ nguyên lớp men sống tạo nên sắc vàng hổ phách đục đặc trưng. Đó cũng là lý do bia có chữ &quot;Naturtrüb&quot;, nghĩa là &quot;tự nhiên không lọc&quot; trong tiếng Đức.</p>

        <CtaBand
          title="Sẵn sàng trải nghiệm?"
          text="Xem các dòng Bia Thầy Tu Benediktiner chính hãng và liên hệ để được tư vấn giao hàng."
          action={{ href: '/san-pham', label: 'Xem sản phẩm' }}
        />
      </EditorialPage>
    </>
  );
}
