import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bia Benediktiner chính hãng là gì? Cách nhận biết hàng thật',
  description: 'Bia Benediktiner chính hãng: dấu hiệu nhận biết hàng nhập khẩu nguyên chai, phân biệt thật và giả, công thức gốc dòng Biển Đức với men hầm Tu viện Ettal.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bia-benediktiner-chinh-hang' },
  openGraph: {
    title: 'Bia Benediktiner chính hãng là gì? Cách nhận biết hàng thật',
    description: 'Bia Benediktiner chính hãng: dấu hiệu nhận biết hàng nhập khẩu nguyên chai, phân biệt thật và giả, công thức gốc dòng Biển Đức với men hầm Tu viện Ettal.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bia-benediktiner-chinh-hang',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Benediktiner chính hãng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Benediktiner chính hãng là gì? Cách nhận biết hàng thật',
    description: 'Bia Benediktiner chính hãng: dấu hiệu nhận biết hàng nhập khẩu nguyên chai, phân biệt thật và giả, công thức gốc dòng Biển Đức với men hầm Tu viện Ettal.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Benediktiner chính hãng', slug: 'bia-benediktiner-chinh-hang', url: 'https://www.biathaytu.com.vn/bia-benediktiner-chinh-hang', description: 'Cách nhận biết bia Benediktiner chính hãng.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/bia-benediktiner-chinh-hang', label: 'Bia Benediktiner chính hãng' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Chất lượng Đức',
          title: 'Benediktiner chính hãng',
          kicker: 'Cách nhận biết',
          lead: 'Nguồn gốc, nhãn sản phẩm và những thông tin cần kiểm tra trên một chai Benediktiner tại Việt Nam.',
        }}
      >
        <Summary>
          <p><strong>Cam kết chính hãng:</strong> mọi sản phẩm Bia Thầy Tu Benediktiner được phân phối qua hệ thống của chúng tôi đều có nguồn gốc rõ ràng, đầy đủ giấy tờ hải quan (CO/CQ), và được bảo quản trong kho lạnh để giữ trọn hương vị.</p>
        </Summary>

        <h2>Ba cách nhận biết</h2>
        <h3>1. Nhãn mác và ngôn ngữ</h3>
        <p>Bia nhập khẩu nguyên chai từ Đức luôn có nhãn phụ tiếng Việt (theo quy định của pháp luật Việt Nam) dán đè hoặc in kèm, ghi rõ đơn vị nhập khẩu, nồng độ cồn, thành phần và cảnh báo sức khỏe. Ngày sản xuất (MFG) và hạn sử dụng (EXP) được in laser trên chai, lon.</p>
        <h3>2. Nguồn gốc xuất xứ</h3>
        <p>Mã vạch của bia Đức thường bắt đầu bằng đầu số 400 đến 440. Trên nhãn chai, lon bắt buộc có thông tin nhà sản xuất: <strong>Benediktiner Weißbräu GmbH</strong> (Ettal, Bavaria).</p>
        <h3>3. Chất lượng bia bên trong</h3>
        <p>Với dòng Weissbier Naturtrüb, bia thật có độ đục tự nhiên (do men sống chưa lọc) và màu vàng hổ phách đậm. Bọt bia trắng, mịn, giữ lâu trên miệng ly. Hương chuối chín và đinh hương rõ.</p>

        <h2>Vì sao nên chọn nguồn nhập khẩu rõ ràng?</h2>
        <InfoGrid
          items={[
            { title: 'Bảo quản chuẩn', text: 'Bia lúa mì chứa men sống nhạy cảm với nhiệt độ; chúng tôi bảo quản trong kho lạnh chuyên dụng.' },
            { title: 'Date mới', text: 'Nhập khẩu liên tục, đảm bảo hạn sử dụng dài và bia luôn tươi.' },
            { title: 'Hỗ trợ B2B', text: 'Hóa đơn VAT đầy đủ cho doanh nghiệp, nhà hàng, khách sạn.' },
          ]}
        />
        <p>Muốn tìm hiểu quy cách đang được giới thiệu? Xem <Link href="/san-pham">bộ sưu tập Benediktiner</Link>.</p>

        <CtaBand
          title="Yên tâm thưởng thức"
          text="Trao đổi với đội ngũ Bia Thầy Tu về sản phẩm, cách thưởng thức hoặc nhu cầu hợp tác."
          action={{ href: '/lien-he', label: 'Liên hệ tư vấn' }}
        />
      </EditorialPage>
    </>
  );
}
