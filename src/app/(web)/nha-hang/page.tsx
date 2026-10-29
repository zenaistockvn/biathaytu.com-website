import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, Summary, FaqSection } from '../components/EditorialPage';
import DiningSubNav from '../components/DiningSubNav';
import RestaurantGallery from '../components/RestaurantGallery';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
  description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}, mở ${COMPANY_CONFIG.restaurantHours}. Bia Benediktiner, Bitburger và món Đức, có phòng riêng cho bàn tiếp khách.`,
  alternates: { canonical: 'https://www.biathaytu.com.vn/nha-hang' },
  openGraph: {
    title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
    description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}. Bia Benediktiner, Bitburger và món Đức, có phòng riêng.`,
    type: 'article',
    url: 'https://www.biathaytu.com.vn/nha-hang',
    images: [
      {
        url: '/images/og/restaurant.jpg',
        width: 1200,
        height: 630,
        alt: 'Phòng riêng Nhà hàng Bia Thầy Tu, bàn gỗ dài và tranh Benediktiner, Ngõ 26 Vạn Phúc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
    description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}. Bia Benediktiner, Bitburger và món Đức, có phòng riêng.`,
    images: ['/images/og/restaurant.jpg'],
  },
};

const restaurantFaqs = [
  {
    question: 'Nhà hàng Bia Thầy Tu ở đâu, mở cửa lúc nào?',
    answer: `Ở ${COMPANY_CONFIG.showroomAddress}, mở ${COMPANY_CONFIG.restaurantHours} mỗi ngày.`,
  },
  {
    question: 'Nhà hàng có phòng riêng để tiếp khách hoặc làm tiệc không?',
    answer: 'Có. Anh chị gọi hotline đặt trước để bên mình giữ phòng.',
  },
  {
    question: 'Nhà hàng có món gì?',
    answer: 'Món Đức như chân giò, xúc xích, cùng các món Việt. Thực đơn đầy đủ và giá xem tại menu.biathaytu.com.vn.',
  },
] as const;

export default function RestaurantPage() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';
  const mapUrl = COMPANY_CONFIG.showroomMapUrl;

  return (
    <>
      <JsonLd
        type="article"
        data={getArticleSchema({
          title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
          slug: 'nha-hang',
          url: 'https://www.biathaytu.com.vn/nha-hang',
          description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}. Bia Benediktiner, Bitburger và món Đức, có phòng riêng.`,
          datePublished: '2026-10-01',
          dateModified: '2026-10-16',
        })}
      />
      <JsonLd
        type="breadcrumb"
        data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.restaurant.href, label: NAV.restaurant.label }))}
      />

      <EditorialPage
        hero={{
          title: 'Nhà hàng Bia Thầy Tu',
          kicker: 'Bia Đức, món Đức, Ngõ 26 Vạn Phúc',
          lead: 'Nhà hàng của German Taste: Uống bia Benediktiner, Bitburger cùng món Đức, ngay trong Ngõ 26 Vạn Phúc.',
          image: {
            src: '/images/restaurant/phong-vip-benediktiner.jpg',
            alt: 'Phòng riêng Nhà hàng Bia Thầy Tu, bàn gỗ dài và tranh Benediktiner, Ngõ 26 Vạn Phúc',
            position: 'center center',
          },
        }}
        after={<FaqSection items={restaurantFaqs} />}
      >
        <DiningSubNav current="restaurant" />

        <Summary>
          <p>
            <strong>Nhà hàng Bia Thầy Tu:</strong> Nhà hàng có 3 tầng, có phòng riêng cho bàn tiếp khách. Bia chính là Benediktiner, bia lúa mì theo công thức gốc của dòng Biển Đức, cùng Bitburger. Mở {COMPANY_CONFIG.restaurantHours} mỗi ngày, tại {COMPANY_CONFIG.showroomAddress}.
          </p>
        </Summary>

        <h2>Không gian nhà hàng</h2>
        <p>Ảnh chụp tại nhà hàng.</p>
        <RestaurantGallery />

        <h2>Bia và món</h2>
        <p>
          Bia lúa mì Benediktiner rót ly Weizen, loại ly cao thành cong giữ được bọt và mùi. Món Đức có chân giò, xúc xích, bên cạnh các món Việt cho bàn đông người.
        </p>
        <p>
          <a href={COMPANY_CONFIG.restaurantMenuUrl} target="_blank" rel="noopener noreferrer"><strong>Xem thực đơn đầy đủ và giá &rarr;</strong></a>
        </p>

        <h2>Địa chỉ, giờ mở cửa, đặt bàn</h2>
        <ul>
          <li><strong>Địa chỉ:</strong> {COMPANY_CONFIG.showroomAddress}</li>
          <li><strong>Giờ mở cửa:</strong> {COMPANY_CONFIG.restaurantHours} mỗi ngày</li>
          <li><strong>Hotline đặt bàn:</strong> {COMPANY_CONFIG.hotline}</li>
          <li><strong>Thực đơn:</strong> <a href={COMPANY_CONFIG.restaurantMenuUrl} target="_blank" rel="noopener noreferrer">menu.biathaytu.com.vn</a></li>
        </ul>

        <CtaBand
          title="Đặt bàn trước"
          text={<>Bàn đông người hoặc phòng riêng nên đặt trước. Xem chỉ đường trên <Link href={mapUrl} target="_blank" rel="noopener noreferrer">Google Maps</Link>.</>}
          action={{ href: telHref, label: 'Gọi hotline đặt bàn' }}
          secondary={{ href: zaloUrl, label: 'Nhắn tin qua Zalo' }}
        />

        <h2>Mở nhà hàng Bia Thầy Tu ở nơi khác</h2>
        <p>
          German Taste nhận tư vấn cho đối tác muốn mở nhà hàng Bia Thầy Tu theo mô hình nhượng quyền. Bia lấy trực tiếp từ công ty nhập khẩu.
        </p>
        <p>
          <Link href={NAV.franchise.href}><strong>Xem cách hợp tác nhượng quyền &rarr;</strong></Link>
        </p>
      </EditorialPage>
    </>
  );
}
