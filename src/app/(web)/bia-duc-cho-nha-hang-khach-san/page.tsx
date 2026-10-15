import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bia Đức cho nhà hàng, khách sạn (HORECA)',
  description: 'German Taste nhập khẩu trực tiếp Benediktiner, Bitburger cho nhà hàng, khách sạn, bar: Hoá đơn VAT, chiết khấu theo sản lượng, ly và đế lót, gợi ý món ăn kèm.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bia-duc-cho-nha-hang-khach-san' },
  openGraph: {
    title: 'Bia Đức cho nhà hàng, khách sạn (HORECA)',
    description: 'German Taste nhập khẩu trực tiếp Benediktiner, Bitburger cho nhà hàng, khách sạn, bar: Hoá đơn VAT, chiết khấu theo sản lượng, ly và đế lót, gợi ý món ăn kèm.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/bia-duc-cho-nha-hang-khach-san',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Đức cho nhà hàng, khách sạn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Đức cho nhà hàng, khách sạn (HORECA)',
    description: 'German Taste nhập khẩu trực tiếp Benediktiner, Bitburger cho nhà hàng, khách sạn, bar: Hoá đơn VAT, chiết khấu theo sản lượng, ly và đế lót, gợi ý món ăn kèm.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Đức cho nhà hàng, khách sạn', slug: 'bia-duc-cho-nha-hang-khach-san', url: 'https://www.biathaytu.com.vn/bia-duc-cho-nha-hang-khach-san', description: 'Cung cấp bia Đức sỉ cho nhà hàng, khách sạn.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.horeca.href, label: 'Bia Đức cho nhà hàng khách sạn' }))} />

      <EditorialPage
        hero={{
          // Menu đã đánh dấu HORECA nên bỏ nhãn "B2B và HORECA": còn tiêu đề, dòng phụ, một câu dẫn.
          // Ảnh cũ là góc cắt poster Bitburger, lộ chữ in của poster; dùng ảnh Benediktiner trên bàn gỗ.
          title: 'Cho nhà hàng',
          kicker: 'Khách sạn, bar và sự kiện',
          lead: 'Benediktiner và Bitburger cho menu đồ uống, do German Taste nhập khẩu trực tiếp, có hoá đơn VAT.',
          image: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier trên bàn gỗ ngoài vườn bia', position: '70% center' },
        }}
      >
        <Summary>
          <p><strong>Vì sao thêm bia Đức vào menu:</strong> Menu đồ uống là một phần doanh thu của nhà hàng. Có Benediktiner hay Bitburger, khách có thêm một chai bia Đức để gọi cùng món, còn quán có thêm một dòng bia có câu chuyện để giới thiệu.</p>
        </Summary>

        <h2>Nhà hàng nhận được gì</h2>
        <InfoGrid
          columns={2}
          items={[
            { title: 'Nhập khẩu trực tiếp', text: 'German Taste nhập khẩu chính ngạch, có tờ khai hải quan, CO/CQ và xuất hoá đơn VAT.' },
            { title: 'Chiết khấu theo sản lượng', text: 'Mức chiết khấu theo sản lượng cam kết.' },
            { title: 'Ly, đế lót, menu', text: 'Ly bia chuyên dụng (ly Weizen, ly Pilsner), đế lót ly, tháp bia, ô dù và ấn phẩm menu.' },
            { title: 'Kho tại Hà Nội', text: 'Kho bảo quản tại Hà Nội. Lịch giao nhận thống nhất trong từng hợp đồng để quán không bị đứt hàng.' },
          ]}
        />

        <h2>Ghép bia với món của quán</h2>
        <p>Người của Bia Thầy Tu làm việc với bếp trưởng, quản lý nhà hàng để <Link href="/food-pairing-bia-duc">chọn bia cho từng món trong thực đơn</Link>:</p>
        <ul>
          <li><strong>Ghép món với bia:</strong> Món của quán đi với dòng nào, ví dụ BBQ với Dunkel, hải sản với Weissbier.</li>
          <li><strong>Đào tạo nhân viên:</strong> Cách rót bia lúa mì, nhiệt độ phục vụ, cách kể cho khách nghe bia đến từ đâu.</li>
          <li><strong>Buổi giới thiệu bia:</strong> Hỗ trợ tổ chức buổi nếm bia cho khách của nhà hàng.</li>
        </ul>

        <CtaBand
          title="Nhận báo giá sỉ"
          text={<>Bên mình gọi lại trong vòng 2 giờ làm việc. Xem chi tiết <Link href="/bang-gia-si-dai-ly">chính sách giá sỉ cho đại lý</Link>.</>}
          action={{ href: zaloUrl, label: 'Mở Zalo', external: zaloUrl.startsWith('https://') }}
          secondary={{ href: telHref, label: 'Gọi hotline HORECA' }}
        />
      </EditorialPage>
    </>
  );
}
