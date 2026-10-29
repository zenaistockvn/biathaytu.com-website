import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bia Benediktiner chính hãng: Cách nhận biết hàng nhập khẩu',
  description: 'Ba chỗ cần xem trên chai Benediktiner nhập khẩu: Nhãn phụ tiếng Việt, mã vạch 400 - 440 cùng tên nhà sản xuất, và màu đục tự nhiên của Naturtrüb.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bia-benediktiner-chinh-hang' },
  openGraph: {
    title: 'Bia Benediktiner chính hãng: Cách nhận biết hàng nhập khẩu',
    description: 'Ba chỗ cần xem trên chai Benediktiner nhập khẩu: Nhãn phụ tiếng Việt, mã vạch 400 - 440 cùng tên nhà sản xuất, và màu đục tự nhiên của Naturtrüb.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bia-benediktiner-chinh-hang',
    images: [
      {
        url: '/images/og/garden.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Benediktiner chính hãng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Benediktiner chính hãng: Cách nhận biết hàng nhập khẩu',
    description: 'Ba chỗ cần xem trên chai Benediktiner nhập khẩu: Nhãn phụ tiếng Việt, mã vạch 400 - 440 cùng tên nhà sản xuất, và màu đục tự nhiên của Naturtrüb.',
    images: ['/images/og/garden.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Cách nhận biết bia Benediktiner nhập khẩu', slug: 'bia-benediktiner-chinh-hang', url: 'https://www.biathaytu.com.vn/bia-benediktiner-chinh-hang', description: 'Cách nhận biết bia Benediktiner nhập khẩu qua nhãn phụ, mã vạch và màu bia.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/bia-benediktiner-chinh-hang', label: 'Bia Benediktiner chính hãng' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Trước khi mua',
          title: 'Benediktiner chính hãng',
          kicker: 'Cách nhận biết',
          lead: 'Nhãn phụ, mã vạch, tên nhà sản xuất và màu bia: Những chỗ cần xem trên một chai Benediktiner bán tại Việt Nam.',
        }}
      >
        <Summary>
          <p><strong>Nguồn hàng:</strong> Benediktiner bên mình bán do German Taste nhập khẩu trực tiếp, có tờ khai hải quan, CO/CQ, và được giữ trong kho tránh nắng, tránh nóng.</p>
        </Summary>

        <h2>Ba cách nhận biết</h2>
        <h3>1. Nhãn phụ tiếng Việt</h3>
        <p>Bia nhập khẩu nguyên chai từ Đức phải có nhãn phụ tiếng Việt (theo quy định của pháp luật Việt Nam), dán đè hoặc in kèm. Nhãn ghi đơn vị nhập khẩu, nồng độ cồn, thành phần và cảnh báo sức khỏe. Ngày sản xuất (MFG) và hạn sử dụng (EXP) in laser trên chai, lon.</p>
        <h3>2. Mã vạch và nhà sản xuất</h3>
        <p>Mã vạch của bia Đức thường bắt đầu bằng đầu số 400 đến 440. Trên nhãn chai, lon phải có tên nhà sản xuất: <strong>Benediktiner Weißbräu GmbH</strong>, Ettal. Bia ủ tại Lich, bang Hessen.</p>
        <h3>3. Bia trong ly</h3>
        <p>Weissbier Naturtrüb thật có màu vàng, đục tự nhiên vì men còn trong bia, không lọc. Bọt trắng, mịn, giữ lâu trên miệng ly. Mùi chuối chín và đinh hương rõ.</p>

        <h2>Vì sao nên mua nơi có giấy tờ nhập khẩu?</h2>
        <InfoGrid
          items={[
            { title: 'Bảo quản đúng cách', text: 'Bia lúa mì không lọc nhạy với nhiệt độ và ánh sáng. Hàng được giữ trong kho, tránh nắng và nhiệt độ cao.' },
            { title: 'Hạn sử dụng rõ', text: 'Nhập hàng theo lô, hạn sử dụng in trên từng chai, lon.' },
            { title: 'Hoá đơn cho doanh nghiệp', text: 'Xuất hoá đơn VAT cho doanh nghiệp, nhà hàng, khách sạn.' },
          ]}
        />
        <p>Các quy cách chai, lon, bom đang bán có trong <Link href="/san-pham">danh mục Benediktiner</Link>.</p>

        <CtaBand
          title="Hợp tác phân phối"
          text="Đại lý và nhà phân phối có thể để lại thông tin để trao đổi về sản phẩm."
          action={{ href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' }}
        />
      </EditorialPage>
    </>
  );
}
