import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)',
  description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bia-duc-cho-nha-hang-khach-san' },
  openGraph: {
    title: 'Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)',
    description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bia-duc-cho-nha-hang-khach-san',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Giải Pháp Cung Cấp Bia Đức Cho Nhà Hàng Khách Sạn (Horeca)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)',
    description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Giải pháp Bia Đức cho Horeca', slug: 'bia-duc-cho-nha-hang-khach-san', url: 'https://www.biathaytu.com.vn/bia-duc-cho-nha-hang-khach-san', description: 'Cung cấp bia Đức sỉ cho nhà hàng khách sạn.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.horeca.href, label: 'Bia Đức Cho Nhà Hàng Khách Sạn' }))} />

      <EditorialPage
        hero={{
          // Menu đã đánh dấu HORECA nên bỏ nhãn "B2B và HORECA": còn tiêu đề, dòng phụ, một câu dẫn.
          // Ảnh cũ là góc cắt poster Bitburger, lộ chữ in của poster; dùng ảnh Benediktiner trên bàn gỗ.
          title: 'Cho nhà hàng',
          kicker: 'Khách sạn, bar và sự kiện',
          lead: 'Đưa các dòng bia Đức lâu đời vào menu đồ uống, cùng đơn vị phân phối chính hãng.',
          image: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier trên bàn gỗ ngoài vườn bia', position: '70% center' },
        }}
      >
        <Summary>
          <p><strong>Lợi thế cạnh tranh:</strong> menu đồ uống (Beverage Menu) chiếm đến 30% lợi nhuận của một nhà hàng cao cấp. Đưa các thương hiệu bia Đức lâu đời như Benediktiner hay Bitburger vào menu không chỉ tăng trải nghiệm food pairing mà còn định vị không gian của bạn.</p>
        </Summary>

        <h2>Vì sao chọn chúng tôi?</h2>
        <InfoGrid
          columns={2}
          items={[
            { title: 'Đối tác phân phối', text: 'Nguồn hàng nhập khẩu chính ngạch, hóa đơn VAT đầy đủ, giá gốc không qua trung gian.' },
            { title: 'Chính sách chiết khấu sâu', text: 'Mức chiết khấu thương mại linh hoạt dựa trên sản lượng cam kết, giúp tối ưu lợi nhuận cho HORECA.' },
            { title: 'Hỗ trợ POSM trọn gói', text: 'Ly bia chuyên dụng (ly Weizen, ly Pilsner), đế lót ly (coaster), tháp bia, ô dù và các ấn phẩm menu.' },
            { title: 'Giao hàng hỏa tốc', text: 'Đội ngũ xe tải lạnh riêng, cam kết giao hàng trong 2 đến 4 tiếng khu vực nội thành để không gián đoạn vận hành.' },
          ]}
        />

        <h2>Tư vấn food pairing</h2>
        <p>Chuyên viên của Bia Thầy Tu làm việc trực tiếp với bếp trưởng, quản lý nhà hàng để thiết kế <Link href="/food-pairing-bia-duc">gợi ý food pairing cho thực đơn</Link>:</p>
        <ul>
          <li><strong>Thiết kế menu pairing:</strong> ghép món đặc trưng của quán với bia (ví dụ BBQ và Dunkel, hải sản và Weissbier).</li>
          <li><strong>Đào tạo nhân viên:</strong> cách rót bia lúa mì, nhiệt độ phục vụ, cách giới thiệu câu chuyện bia cho thực khách.</li>
          <li><strong>Sự kiện trải nghiệm:</strong> hỗ trợ tổ chức các buổi &quot;Beer Tasting Night&quot; thu hút khách mới.</li>
        </ul>

        <CtaBand
          title="Nhận báo giá sỉ"
          text={<>Chuyên viên B2B sẽ liên hệ trong vòng 2 giờ làm việc. Xem chi tiết <Link href="/bang-gia-si-dai-ly">chính sách giá sỉ cho đại lý</Link>.</>}
          action={{ href: zaloUrl, label: 'Chat Zalo B2B', external: zaloUrl.startsWith('https://') }}
          secondary={{ href: telHref, label: 'Gọi hotline HORECA' }}
        />
      </EditorialPage>
    </>
  );
}
