import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary, FaqSection } from '../components/EditorialPage';
import DiningSubNav from '../components/DiningSubNav';
import RestaurantGallery from '../components/RestaurantGallery';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
  description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}, mở ${COMPANY_CONFIG.restaurantHours}. Bia Benediktiner, Bitburger, chân giò và xúc xích kiểu Đức, phòng riêng 10 - 12 chỗ.`,
  alternates: { canonical: 'https://www.biathaytu.com.vn/nha-hang' },
  openGraph: {
    title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
    description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}. Bia Benediktiner rót ly Weizen, chân giò, xúc xích kiểu Đức, phòng riêng tầng 2.`,
    type: 'article',
    url: 'https://www.biathaytu.com.vn/nha-hang',
    images: [
      {
        url: '/images/restaurant/phong-vip-benediktiner.jpg',
        width: 1600,
        height: 1067,
        alt: 'Phòng riêng tầng 2 Nhà hàng Bia Thầy Tu, bàn gỗ dài và tranh Benediktiner, Ngõ 26 Vạn Phúc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà hàng Bia Thầy Tu, bia Đức và món Đức ở Ngõ 26 Vạn Phúc',
    description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}. Bia Benediktiner rót ly Weizen, chân giò, xúc xích kiểu Đức, phòng riêng tầng 2.`,
    images: ['/images/restaurant/phong-vip-benediktiner.jpg'],
  },
};

const restaurantFaqs = [
  {
    question: 'Nhà hàng Bia Thầy Tu ở đâu, mở cửa lúc nào?',
    answer: `Ở ${COMPANY_CONFIG.showroomAddress}, mở ${COMPANY_CONFIG.restaurantHours} mỗi ngày. Có chỗ đỗ xe miễn phí cho khách.`,
  },
  {
    question: 'Nhà hàng có phòng riêng để tiếp khách hoặc làm tiệc không?',
    answer: 'Có. Tầng 2 có phòng riêng máy lạnh, bàn gỗ dài 10 - 12 chỗ và màn hình lớn, hợp bữa tiếp đối tác hay tiệc gia đình. Ngoài ra có khu Beer Garden ngoài trời. Anh chị nên gọi đặt trước để giữ phòng.',
  },
  {
    question: 'Món Đức ở nhà hàng có những món nào?',
    answer: 'Chân giò Đức nướng giòn, chân giò hầm kiểu Đức, xúc xích kiểu Đức và salami Đức. Thực đơn còn có sườn nướng, steak, hải sản, món Việt và lẩu cho bàn đông người.',
  },
  {
    question: 'Nhà hàng có những bia nào?',
    answer: 'Benediktiner Weissbier Naturtrüb và Dunkel (chai, lon 500ml), Benediktiner Festbier, Bitburger Pilsener và bom 5L Köstritzer Schwarzbier. Bom 5L có cả Naturtrüb, Festbier và Bitburger. Ngoài bia có vang Đức Thörle và Rappenhof.',
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
          description: `Nhà hàng Bia Thầy Tu, ${COMPANY_CONFIG.showroomAddress}. Bia Benediktiner rót ly Weizen, chân giò, xúc xích kiểu Đức, phòng riêng tầng 2.`,
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
          lead: 'Bia Benediktiner rót đúng ly Weizen, chân giò nướng giòn và phòng riêng cho bàn tiếp khách, ngay trong Ngõ 26 Vạn Phúc.',
          image: {
            src: '/images/restaurant/phong-vip-benediktiner.jpg',
            alt: 'Phòng riêng tầng 2 Nhà hàng Bia Thầy Tu, bàn gỗ dài và tranh Benediktiner, Ngõ 26 Vạn Phúc',
            position: 'center center',
          },
        }}
        after={<FaqSection items={restaurantFaqs} />}
      >
        <DiningSubNav current="restaurant" />

        <Summary>
          <p>
            <strong>Phòng riêng cho bàn tiếp khách:</strong> Bàn mười người có khách đối tác, cần phòng riêng và bia Đức rót đúng ly thì lên tầng 2 của Nhà hàng Bia Thầy Tu. Bia chính là Benediktiner, bia lúa mì theo công thức gốc của dòng Biển Đức, hơn 400 năm truyền thống. Đi cùng có Bitburger và bom Köstritzer 5L. Nhà hàng mở {COMPANY_CONFIG.restaurantHours} mỗi ngày, tại {COMPANY_CONFIG.showroomAddress}.
          </p>
        </Summary>

        <h2>Hai tầng ở Ngõ 26 Vạn Phúc</h2>
        <p>
          Nhà hàng có hai tầng. Tầng 1 là sảnh bàn tiệc và quầy trưng bày, tầng 2 là phòng riêng. Ảnh chụp tại nhà hàng.
        </p>

        <h3>Tầng 1: Sảnh bàn tiệc và vòm chai German Taste</h3>
        <p>
          Giữa sảnh là vòm đá ốp hình chai, đèn logo GT German Taste. Hai bên là kệ vang Đức và bia Bitburger. Bàn gỗ, ghế bọc da, trên tường có poster Benediktiner chụp tu viện Ettal dưới chân núi Alps.
        </p>
        <RestaurantGallery floor={1} />

        <h3>Tầng 2: Phòng riêng 10 - 12 chỗ</h3>
        <p>
          Phòng riêng có máy lạnh, bàn gỗ dài 10 - 12 chỗ và màn hình lớn. Hợp bữa tiếp đối tác, họp mặt công ty hay tiệc gia đình. Trên tường là bộ tranh đen trắng của Benediktiner vẽ các công đoạn làm bia.
        </p>
        <RestaurantGallery floor={2} />

        <h2>Chọn chỗ ngồi theo số người</h2>
        <p>
          Nhà hàng có ba kiểu chỗ ngồi:
        </p>
        <InfoGrid
          columns={3}
          items={[
            {
              title: 'Sảnh tầng 1',
              text: 'Bàn gỗ, ghế bọc da, đèn vàng. Hợp nhóm bạn bè hoặc gia đình, gọi bom 5L rót ngay tại bàn.',
            },
            {
              title: 'Beer Garden',
              text: 'Khu ngồi ngoài trời có cây xanh, hợp nhóm đồng nghiệp ngồi sau giờ làm.',
            },
            {
              title: 'Phòng riêng tầng 2',
              text: 'Máy lạnh, bàn dài 10 - 12 chỗ, màn hình lớn. Dùng cho bữa tiếp đối tác, họp mặt công ty. Nên gọi đặt trước.',
            },
          ]}
        />

        <h2>Bia ở đây rót thế nào</h2>
        <p>
          Bia lúa mì rót sai ly hay lạnh quá thì mất bọt, mất mùi. Nhà hàng rót theo bốn điều:
        </p>
        <ul>
          <li>
            <strong>Nhiệt độ:</strong> Bia giữ lạnh sẵn. Naturtrüb hợp 7 - 9 °C, Dunkel 8 - 10 °C, Festbier 6 - 8 °C. Lạnh quá thì bia bớt thơm.
          </li>
          <li>
            <strong>Ly Weizen:</strong> Ly cao, thành cong, miệng rộng hơn đáy. Ly này giữ lớp bọt dày và gom mùi chuối chín, đinh hương của Naturtrüb.
          </li>
          <li>
            <strong>Rót nghiêng 45 độ:</strong> Rót chậm theo thành ly tới khoảng 3/4 chai. Xoay nhẹ phần còn lại cho lớp men dưới đáy tan ra rồi rót nốt, bia sẽ đục đều.
          </li>
          <li>
            <strong>Chai, lon hay bom 5L:</strong> Có bia chai, lon 500ml và bom 5L. Bom 5L rót ngay tại bàn, hợp bàn đông người.
          </li>
        </ul>

        <h2>Món Đức gọi kèm bia</h2>
        <p>
          Thực đơn có cả món Việt, lẩu và sushi cho bàn đông. Nhóm món Đức hợp với bia nhất là:
        </p>
        <InfoGrid
          columns={2}
          items={[
            {
              title: 'Chân giò Đức nướng giòn',
              text: 'Da giòn, thịt mềm, phần lớn để cả bàn chia nhau. Bếp cần khoảng 30 - 40 phút, nên gọi ngay khi ngồi xuống. Hợp với Weissbier Dunkel.',
            },
            {
              title: 'Xúc xích kiểu Đức',
              text: 'Xúc xích nướng, vỏ săn, ăn khi còn nóng. Lên món nhanh, gọi trước trong lúc chờ món chính. Hợp với Weissbier Naturtrüb.',
            },
            {
              title: 'Sườn nướng và steak',
              text: 'Sườn BBQ nướng chậm, sườn cừu nướng thảo mộc, bò Fuji áp chảo, steak bò Úc. Món nướng thì gọi Dunkel, vị mạch nha rang hợp thịt nướng.',
            },
            {
              title: 'Salami Đức và phô mai',
              text: 'Salami Đức cắt lát mỏng, có phần nhỏ và phần lớn, thêm phô mai sợi. Món nguội, lên bàn ngay khi cả bàn vừa ngồi.',
            },
          ]}
        />
        <p>
          <a href={COMPANY_CONFIG.restaurantMenuUrl} target="_blank" rel="noopener noreferrer"><strong>Xem thực đơn đầy đủ và giá &rarr;</strong></a>
        </p>

        <h2>Địa chỉ, giờ mở cửa, đặt bàn</h2>
        <p>
          Nhà hàng mở mọi ngày trong tuần:
        </p>
        <ul>
          <li><strong>Địa chỉ:</strong> {COMPANY_CONFIG.showroomAddress} (gần ngã tư Vạn Phúc - Kim Mã - Liễu Giai)</li>
          <li><strong>Giờ mở cửa:</strong> {COMPANY_CONFIG.restaurantHours} mỗi ngày</li>
          <li><strong>Hotline đặt bàn:</strong> {COMPANY_CONFIG.hotline}</li>
          <li><strong>Thực đơn:</strong> <a href={COMPANY_CONFIG.restaurantMenuUrl} target="_blank" rel="noopener noreferrer">menu.biathaytu.com.vn</a></li>
        </ul>

        <CtaBand
          title="Đặt bàn trước"
          text={<>Đặt trước cho bàn đông, tiệc sinh nhật hoặc phòng riêng tầng 2. Xem chỉ đường trên <Link href={mapUrl} target="_blank" rel="noopener noreferrer">Google Maps</Link>.</>}
          action={{ href: telHref, label: 'Gọi hotline đặt bàn' }}
          secondary={{ href: zaloUrl, label: 'Nhắn tin qua Zalo' }}
        />

        <h2>Mở nhà hàng Bia Thầy Tu ở nơi khác</h2>
        <p>
          German Taste đang tìm đối tác mở nhà hàng Bia Thầy Tu theo mô hình nhượng quyền, lấy nhà hàng ở Ngõ 26 Vạn Phúc làm mẫu.
        </p>
        <p>
          Ưu tiên <strong>Hà Nội, TP. Hồ Chí Minh</strong> và các thành phố lớn. Bia cho nhà hàng nhượng quyền lấy trực tiếp từ công ty nhập khẩu, không qua đại lý.
        </p>
        <p>
          <Link href={NAV.franchise.href}><strong>Xem cách hợp tác nhượng quyền &rarr;</strong></Link>
        </p>
      </EditorialPage>
    </>
  );
}
