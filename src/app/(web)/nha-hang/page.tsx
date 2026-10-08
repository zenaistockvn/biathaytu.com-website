import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary, FaqSection } from '../components/EditorialPage';
import DiningSubNav from '../components/DiningSubNav';
import RestaurantGallery from '../components/RestaurantGallery';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Nhà hàng Bia Thầy Tu - Không gian ẩm thực và bia Đức tại Hà Nội',
  description: 'Nhà hàng Bia Thầy Tu tại 26 Vạn Phúc, Ba Đình, Hà Nội. Trải nghiệm bia tu viện Benediktiner chuẩn Đức cùng ẩm thực Bavaria: Giò heo muối, xúc xích nướng, sườn bò nướng.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/nha-hang' },
  openGraph: {
    title: 'Nhà hàng Bia Thầy Tu - Không gian ẩm thực và bia Đức tại Hà Nội',
    description: 'Nhà hàng Bia Thầy Tu tại 26 Vạn Phúc, Ba Đình, Hà Nội. Trải nghiệm bia tu viện Benediktiner chuẩn Đức cùng ẩm thực Bavaria.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/nha-hang',
    images: [
      {
        url: '/images/restaurant/phong-vip-benediktiner.jpg',
        width: 1600,
        height: 1067,
        alt: 'Không gian phòng tiệc VIP sang trọng tại Nhà hàng Bia Thầy Tu 26 Vạn Phúc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà hàng Bia Thầy Tu - Không gian ẩm thực và bia Đức tại Hà Nội',
    description: 'Nhà hàng Bia Thầy Tu tại 26 Vạn Phúc, Ba Đình, Hà Nội. Thưởng thức bia tu viện Benediktiner chuẩn Đức cùng ẩm thực Bavaria nguyên bản.',
    images: ['/images/restaurant/phong-vip-benediktiner.jpg'],
  },
};

const restaurantFaqs = [
  {
    question: 'Nhà hàng Bia Thầy Tu tại Hà Nội nằm ở vị trí nào?',
    answer: `Nhà hàng tọa lạc tại ${COMPANY_CONFIG.showroomAddress}. Không gian có khu vực đỗ xe thuận tiện và tiếp đón khách hàng từ ${COMPANY_CONFIG.restaurantHours} hàng ngày.`,
  },
  {
    question: 'Nhà hàng có không gian phòng riêng để tiếp khách hoặc tổ chức tiệc không?',
    answer: 'Nhà hàng bố trí hệ thống phòng VIP riêng tư yên tĩnh dành cho gặp gỡ đối tác, tiệc gia đình cùng khu vực Beer Garden thoáng đãng ngoài trời. Anh/chị nên liên hệ đặt bàn trước để chuẩn bị chu đáo nhất.',
  },
  {
    question: 'Các món ăn đặc trưng nhất của nhà hàng là gì?',
    answer: 'Thực đơn nổi bật với ẩm thực phong cách Đức và châu Âu như giò heo muối chiên giòn (Schweinshaxe), xúc xích nướng than hoa (Bratwurst), sườn nướng thảo mộc, bò nướng tảng sốt tiêu, kết hợp cùng các dòng bia lúa mì Benediktiner tươi mát.',
  },
  {
    question: 'Tôi có thể thưởng thức những dòng bia nào tại nhà hàng?',
    answer: 'Nhà hàng phục vụ đầy đủ các dòng bia chính hãng gồm Benediktiner Weissbier Naturtrüb (bia vàng không lọc), Weissbier Dunkel (bia đen mạch nha rang), bom bia Festbier 5L và các dòng bia Đức hảo hạng khác.',
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
          title: 'Nhà hàng Bia Thầy Tu - Không gian ẩm thực và bia Đức tại Hà Nội',
          slug: 'nha-hang',
          url: 'https://www.biathaytu.com.vn/nha-hang',
          description: 'Nhà hàng Bia Thầy Tu tại 26 Vạn Phúc, Ba Đình, Hà Nội. Thưởng thức bia tu viện Benediktiner chuẩn Đức cùng ẩm thực Bavaria nguyên bản.',
          datePublished: '2026-10-01',
          dateModified: '2026-10-01',
        })}
      />
      <JsonLd
        type="breadcrumb"
        data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.restaurant.href, label: NAV.restaurant.label }))}
      />

      <EditorialPage
        hero={{
          title: 'Nhà hàng Bia Thầy Tu',
          kicker: 'Bavarian Brauhaus & Beer Garden',
          lead: 'Không gian văn hóa bia tu viện Đức và trải nghiệm ẩm thực Bavaria nguyên bản ngay tại trung tâm Hà Nội.',
          image: {
            src: '/images/restaurant/phong-vip-benediktiner.jpg',
            alt: 'Không gian phòng tiệc VIP sang trọng tại Nhà hàng Bia Thầy Tu 26 Vạn Phúc',
            position: 'center center',
          },
        }}
        after={<FaqSection items={restaurantFaqs} />}
      >
        <DiningSubNav current="restaurant" />

        <Summary>
          <p>
            <strong>Điểm hẹn ẩm thực độc bản:</strong> Tọa lạc tại Ngõ 26 Vạn Phúc, Ba Đình, Nhà hàng Bia Thầy Tu là nơi hội tụ tinh hoa bia tu viện Benediktiner hơn 400 năm truyền thống kết hợp cùng nghệ thuật ẩm thực Bavaria nguyên bản. Không gian tái hiện phong cách Brauhaus ấm cúng, sang trọng và tách biệt khỏi nhịp sống ồn ào đô thị.
          </p>
        </Summary>

        <h2>Không gian thực tế tại 26 Vạn Phúc</h2>
        <p>
          Nhà hàng gồm 2 tầng được thiết kế chỉn chu theo phong cách ẩm thực châu Âu sang trọng, kết hợp hài hòa giữa văn hóa thưởng bia tu viện và nghệ thuật bài trí hiện đại.
        </p>

        <h3>Tầng 1: Sảnh tiệc và quầy biểu tượng German Taste</h3>
        <p>
          Điểm nhấn kiến trúc độc bản với quầy vòm chai rượu phát sáng logo GT German Taste, không gian bàn tiệc gỗ ấm cúng và tranh di sản Benediktiner nguyên bản.
        </p>
        <RestaurantGallery floor={1} />

        <h3>Tầng 2: Phòng tiệc VIP và di sản Benediktiner</h3>
        <p>
          Phòng tiệc máy lạnh riêng biệt và yên tĩnh, bàn gỗ sồi dài 10-12 chỗ ngồi phục vụ các cuộc tiếp khách đối tác ngoại giao, doanh nghiệp hay họp mặt gia đình cao cấp.
        </p>
        <RestaurantGallery floor={2} />

        <h2>Không gian bia tu viện Bavaria</h2>
        <p>
          Lấy cảm hứng từ những xưởng ủ bia tu viện Ettal miền nam nước Đức, Nhà hàng Bia Thầy Tu mang tới một không gian thưởng bia độc đáo và chỉn chu:
        </p>
        <InfoGrid
          columns={3}
          items={[
            {
              title: 'Nội thất gỗ mộc',
              text: 'Thiết kế bàn ghế gỗ tự nhiên, ánh sáng vàng ấm áp, tạo cảm giác thư thái, mộc mạc và lịch thiệp như đang ngồi giữa Munich.',
            },
            {
              title: 'Vườn bia thoáng đãng',
              text: 'Không gian Beer Garden ngoài trời trong lành, rợp bóng cây xanh mát, lý tưởng cho những buổi hội ngộ bạn bè cuối ngày.',
            },
            {
              title: 'Phòng VIP riêng tư',
              text: 'Phòng tiệc máy lạnh riêng biệt, yên tĩnh và sang trọng dành cho các cuộc tiếp đãi đối tác ngoại giao, doanh nghiệp hay họp mặt gia đình.',
            },
          ]}
        />

        <h2>Nghi thức thưởng bia chuẩn Đức</h2>
        <p>
          Tại Nhà hàng Bia Thầy Tu, mỗi ly bia được phục vụ như một nghi thức ẩm thực thiêng liêng:
        </p>
        <ul>
          <li>
            <strong>Nhiệt độ phục vụ chuẩn 6-8°C:</strong> Bia luôn được giữ lạnh ổn định trong kho bảo quản tiêu chuẩn để giữ trọn vẹn tầng hương tinh tế của men tươi và hoa bia.
          </li>
          <li>
            <strong>Ly Weizen cao cổ chuyên dụng:</strong> Chiếc ly Weizen thủy tinh miệng rộng giúp nâng niu lớp bọt kem tuyết dày dặn, gom trọn vẹn hương chuối chín và đinh hương đặc trưng.
          </li>
          <li>
            <strong>Rót chậm nghiêng 45 độ:</strong> Kỹ thuật rót bia kinh điển đánh thức lớp men tự nhiên dưới đáy chai, tạo nên màu bia vàng óng ả sóng sánh ánh hổ phách.
          </li>
          <li>
            <strong>Đa dạng quy cách trải nghiệm:</strong> Phục vụ bia chai, bia lon ướp lạnh, và bom bia Festbier 5L chia sẻ tại bàn tiệc cùng bạn hữu.
          </li>
        </ul>

        <h2>Thực đơn Beer Pairing đặc sắc</h2>
        <p>
          Ẩm thực tại nhà hàng được bếp trưởng thiết kế riêng để cộng hưởng và tôn vinh hương vị của từng dòng bia tu viện:
        </p>
        <InfoGrid
          columns={2}
          items={[
            {
              title: 'Giò heo muối chiên giòn (Schweinshaxe)',
              text: 'Món ăn biểu tượng Bavaria với lớp da giòn rụm bên ngoài, thịt mềm thơm ngọt bên trong, dùng kèm bắp cải muối chua Sauerkraut và sốt mù tạt Đức. Tuyệt hảo khi dùng kèm Weissbier Dunkel.',
            },
            {
              title: 'Xúc xích Đức nướng than hoa',
              text: 'Xúc xích Nürnberger và Bratwurst truyền thống nướng xém cạnh, thơm mùi thảo mộc thiên nhiên, bùng nổ hương vị khi nâng ly cùng Weissbier Naturtrüb.',
            },
            {
              title: 'Bò nướng sốt tiêu & sườn nướng',
              text: 'Từng thớ thịt bò mềm mọng nướng vừa chín tới, sốt tiêu đen cay nhẹ hòa quyện cùng vị mạch nha rang sâu lắng và hậu vị caramel dịu ngọt.',
            },
            {
              title: 'Cold cuts & phô mai nhập khẩu',
              text: 'Đĩa khai vị tinh tế với xúc xích khô, giăm bông hun khói và phô mai thượng hạng, mở đầu hoàn hảo cho cuộc trò chuyện rôm rả.',
            },
          ]}
        />

        <h2>Thông tin ghé thăm và đặt bàn</h2>
        <p>
          Nhà hàng mở cửa đón tiếp quý thực khách vào tất cả các ngày trong tuần:
        </p>
        <ul>
          <li><strong>Địa chỉ:</strong> {COMPANY_CONFIG.showroomAddress} (gần ngã tư Vạn Phúc - Kim Mã - Liễu Giai)</li>
          <li><strong>Giờ phục vụ:</strong> {COMPANY_CONFIG.restaurantHours} hàng ngày</li>
          <li><strong>Hotline đặt bàn:</strong> {COMPANY_CONFIG.hotline}</li>
        </ul>

        <CtaBand
          title="Đặt bàn trải nghiệm hôm nay"
          text={<>Nhận đặt bàn trước cho nhóm khách, tiệc sinh nhật, tiếp khách VIP. Xem chỉ đường tại <Link href={mapUrl} target="_blank" rel="noopener noreferrer">Google Maps</Link>.</>}
          action={{ href: telHref, label: 'Gọi hotline đặt bàn' }}
          secondary={{ href: zaloUrl, label: 'Nhắn tin qua Zalo' }}
        />

        <h2>Cơ hội hợp tác nhượng quyền</h2>
        <p>
          Bạn ấn tượng với mô hình Nhà hàng Bia Thầy Tu và mong muốn mang không gian văn hóa ẩm thực bia tu viện độc đáo này về địa phương của mình?
        </p>
        <p>
          Chúng tôi đang tìm kiếm các đối tác đầu tư tâm huyết tại <strong>Hà Nội, TP. Hồ Chí Minh</strong> và các thành phố lớn trên toàn quốc để cùng phát triển chuỗi nhà hàng nhượng quyền Bia Thầy Tu với lợi thế nguồn bia chính ngạch trực tiếp từ công ty nhập khẩu.
        </p>
        <p>
          <Link href={NAV.franchise.href}><strong>Khám phá chính sách nhượng quyền nhà hàng Bia Thầy Tu &rarr;</strong></Link>
        </p>
      </EditorialPage>
    </>
  );
}
