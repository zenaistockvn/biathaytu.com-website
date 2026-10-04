import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, FaqSection, InfoGrid, Summary } from '../components/EditorialPage';
import { COMPANY_CONFIG } from '@/config/company';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu là gì? Nguồn gốc bia Benediktiner Đức',
  description: 'Bia Thầy Tu là tên gọi tại Việt Nam của bia lúa mì Benediktiner Weissbier: Công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal (Bavaria), ủ tại Lich, Đức.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi' },
  openGraph: {
    title: 'Bia Thầy Tu là gì? Nguồn gốc bia Benediktiner Đức',
    description: 'Bia Thầy Tu là tên gọi tại Việt Nam của bia lúa mì Benediktiner Weissbier: Công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal (Bavaria), ủ tại Lich, Đức.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu là gì? Nguồn gốc bia Benediktiner từ Tu viện Ettal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu là gì? Nguồn gốc bia Benediktiner Đức',
    description: 'Bia Thầy Tu là tên gọi tại Việt Nam của bia lúa mì Benediktiner Weissbier: Công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal (Bavaria), ủ tại Lich, Đức.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const faqs = [
    { question: 'Bia Thầy Tu là bia gì?', answer: 'Bia Thầy Tu là tên gọi tại Việt Nam của bia lúa mì Đức Benediktiner Weissbier. Bia được ủ tại Lich, bang Hessen, theo công thức gốc dòng Biển Đức, với men từ hầm tu viện Ettal (Bavaria), nơi nấu bia từ năm 1609.' },
    { question: 'Vì sao gọi là "bia thầy tu"?', answer: 'Benediktiner là tên tiếng Đức của dòng tu Biển Đức (Benedictine). Công thức và men bia đến từ tu viện Ettal của dòng tu này, nơi có truyền thống nấu bia hơn 400 năm. Còn bia ngày nay được ủ tại nhà bia ở Lich, bang Hessen.' },
    { question: 'Tìm hiểu Bia Thầy Tu ở đâu?', answer: `Xem thông tin sản phẩm tại biathaytu.com.vn, liên hệ Zalo/Hotline ${COMPANY_CONFIG.hotline} hoặc ghé showroom ${COMPANY_CONFIG.showroomAddress}.` },
  ];

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Thầy Tu là gì?', slug: 'bia-thay-tu-la-gi', url: 'https://www.biathaytu.com.vn/bia-thay-tu-la-gi', description: 'Nguồn gốc Bia Thầy Tu Benediktiner: Công thức và men từ Tu viện Ettal.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="faq" data={getFaqSchema(faqs)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/bia-thay-tu-la-gi', label: 'Bia Thầy Tu là gì?' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Kiến thức bia Đức',
          title: 'Bia Thầy Tu là gì?',
          kicker: 'Benediktiner Weissbier',
          lead: 'Tên gọi, nguồn gốc và nơi ủ của dòng bia lúa mì mang tên dòng tu Biển Đức.',
        }}
        after={<FaqSection items={faqs} />}
      >
        <Summary>
          <p><strong>Tóm tắt:</strong> Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì <strong>Benediktiner Weissbier</strong>, theo công thức gốc dòng Biển Đức, với men từ hầm Tu viện Ettal, Bavaria, nơi nấu bia từ năm 1609. Bia được ủ tại Lich, bang Hessen, chỉ từ nước, malt lúa mì và đại mạch, hoa bia và men.</p>
        </Summary>

        <h2>Vì sao gọi là &quot;Bia Thầy Tu&quot;?</h2>
        <p>&quot;Benediktiner&quot; là tên tiếng Đức của dòng tu Biển Đức (Benedictine), nên người Việt quen gọi là &quot;Bia Thầy Tu&quot;. Nhiều người nghĩ bia do các thầy tu nấu, nhưng không phải vậy: Bia ủ theo công thức gốc của dòng tu, men lấy từ hầm tu viện Ettal, còn nơi nấu là nhà bia ở thị trấn Lich, bang Hessen. Ở châu Âu, truyền thống ủ bia trong tu viện có từ thời Trung Cổ.</p>
        <p>Tu viện Ettal ở Bavaria do Hoàng đế Ludwig IV lập năm 1330. Tu viện nấu bia từ năm 1609. Benediktiner tiếp nối truyền thống đó bằng công thức gốc của dòng tu và men hầm Ettal.</p>

        <h2>Luật Tinh Khiết 1516, Reinheitsgebot</h2>
        <p>Benediktiner tuân thủ Luật Tinh Khiết (Reinheitsgebot) do Công tước Wilhelm IV ban hành năm 1516, một trong những quy định về thực phẩm lâu đời nhất. Bản gốc năm 1516 cho phép nước, đại mạch và hoa bia; men và lúa mì được đưa vào quy định về sau. Ngày nay bia Đức theo quy định này chỉ dùng nước, malt, hoa bia và men.</p>
        <p>Không phụ gia. Không chất bảo quản. Không hương liệu nhân tạo.</p>

        <h2>Các dòng bia Đức tại Bia Thầy Tu</h2>
        <InfoGrid
          items={[
            { title: 'Weissbier Naturtrüb', text: 'Bia lúa mì không lọc. Hương chuối chín, đinh hương, bọt trắng dày.', meta: '5,4% vol.' },
            { title: 'Benediktiner Dunkel', text: 'Bia đen lúa mì. Hương caramel, mật ong, mạch nha rang.', meta: '5,4% vol.' },
            { title: 'Bitburger Premium Pils', text: 'Pilsner Đức. Hoa bia Siegelhopfen, đắng thanh, hậu vị khô.', meta: '4,8% vol.' },
          ]}
        />

        <h2>Vì sao Naturtrüb có màu đục?</h2>
        <p>Benediktiner Weissbier Naturtrüb không qua lọc, nên men vẫn còn trong chai và làm bia có màu vàng đục. &quot;Naturtrüb&quot; trong tiếng Đức nghĩa là &quot;đục tự nhiên&quot;. Rót gần hết chai thì xoay nhẹ phần còn lại cho tan lớp men dưới đáy rồi rót nốt.</p>

        <CtaBand
          title="Sẵn sàng trải nghiệm?"
          text="Xem các dòng Bia Thầy Tu Benediktiner chính hãng và liên hệ để được tư vấn quy cách, giá và điểm nhận hàng."
          action={{ href: '/san-pham', label: 'Xem sản phẩm' }}
        />
      </EditorialPage>
    </>
  );
}
