import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary, StepList, FaqSection } from '../components/EditorialPage';
import DiningSubNav from '../components/DiningSubNav';
import FranchiseConsultationForm from '../components/FranchiseConsultationForm';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Nhượng quyền nhà hàng Bia Thầy Tu: Mô hình, hỗ trợ, các bước',
  description: 'Mở nhà hàng Bia Thầy Tu theo nhượng quyền tại Hà Nội, TP.HCM và các thành phố lớn. Bia Benediktiner, Bitburger lấy thẳng từ German Taste, đơn vị nhập khẩu.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/nhuong-quyen' },
  openGraph: {
    title: 'Nhượng quyền nhà hàng Bia Thầy Tu: Mô hình, hỗ trợ, các bước',
    description: 'Mở nhà hàng Bia Thầy Tu theo nhượng quyền tại Hà Nội, TP.HCM và các thành phố lớn. Bia lấy thẳng từ công ty nhập khẩu.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/nhuong-quyen',
    images: [
      {
        url: '/images/brand/benediktiner-official/home-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Nhượng quyền chuỗi nhà hàng Bia Thầy Tu Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhượng quyền nhà hàng Bia Thầy Tu: Mô hình, hỗ trợ, các bước',
    description: 'Mở nhà hàng Bia Thầy Tu theo nhượng quyền tại Hà Nội, TP.HCM và các thành phố lớn.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const franchiseSteps = [
  {
    title: 'Đăng ký thông tin và tư vấn ban đầu',
    text: 'Đối tác gửi thông tin qua form trên trang này hoặc gọi hotline. Bên mình hỏi về định hướng, khả năng tài chính và mục tiêu đầu tư.',
  },
  {
    title: 'Khảo sát mặt bằng, dự toán lãi lỗ',
    text: 'Bên mình đến xem mặt bằng tại Hà Nội, TP.HCM hoặc tỉnh đối tác chọn, rồi lập bảng dự toán doanh thu, chi phí vận hành và thời gian hoàn vốn.',
  },
  {
    title: 'Ký hợp đồng nhượng quyền',
    text: 'Hai bên thống nhất điều khoản, ký hợp đồng và bắt đầu dựng nhà hàng.',
  },
  {
    title: 'Thiết kế 3D và thi công',
    text: 'Kiến trúc sư vẽ bản 3D theo nhận diện Bia Thầy Tu, bố trí quầy bar bia, bếp Âu và khu bàn tiệc.',
  },
  {
    title: 'Đào tạo nhân sự và chuyển giao công thức',
    text: 'Đào tạo quản lý vận hành, cách rót bia Weizen, quy trình bếp món Âu và cách dùng phần mềm quản lý.',
  },
  {
    title: 'Khai trương và hỗ trợ sau đó',
    text: 'Hỗ trợ truyền thông ngày ra mắt, giao bia nhập khẩu đều đặn và cùng đối tác xem lại số liệu kinh doanh định kỳ.',
  },
] as const;

const franchiseFaqs = [
  {
    question: 'Chi phí nhượng quyền nhà hàng Bia Thầy Tu gồm những khoản nào?',
    answer: 'Gồm phí nhượng quyền ban đầu, thiết kế và thi công nội thất, thiết bị quầy bar bia và bếp Âu, vật dụng có logo hãng và lượng hàng tồn kho ban đầu. Con số cụ thể tùy diện tích mặt bằng và mô hình đối tác chọn, bên mình báo sau khi khảo sát.',
  },
  {
    question: 'Bia cho nhà hàng nhượng quyền lấy từ đâu?',
    answer: 'Từ Công ty TNHH German Taste, đơn vị nhập khẩu chính ngạch Benediktiner và Bitburger từ Đức. Nhà hàng ký hợp đồng mua bia trực tiếp, hàng có giấy tờ nhập khẩu và hóa đơn VAT.',
  },
  {
    question: 'Từ lúc ký hợp đồng đến khi khai trương mất bao lâu?',
    answer: 'Thường khoảng 30 đến 45 ngày cho thiết kế, thi công, lắp thiết bị và đào tạo nhân sự. Mặt bằng cần sửa nhiều thì lâu hơn.',
  },
  {
    question: 'Chưa làm F&B bao giờ có nhận nhượng quyền được không?',
    answer: 'Được. Quy trình bếp, quản lý kho bia, đào tạo nhân viên và phần mềm quản lý đều đã chạy thật ở nhà hàng mẫu, đối tác học theo từng bước.',
  },
] as const;

export default function FranchisePage() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <>
      <JsonLd
        type="article"
        data={getArticleSchema({
          title: 'Nhượng quyền nhà hàng Bia Thầy Tu: Mô hình, hỗ trợ, các bước',
          slug: 'nhuong-quyen',
          url: 'https://www.biathaytu.com.vn/nhuong-quyen',
          description: 'Mở nhà hàng Bia Thầy Tu theo nhượng quyền tại Hà Nội, TP.HCM và các thành phố lớn.',
          datePublished: '2026-10-01',
          dateModified: '2026-10-16',
        })}
      />
      <JsonLd
        type="breadcrumb"
        data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.franchise.href, label: NAV.franchise.label }))}
      />

      <EditorialPage
        hero={{
          title: 'Nhượng quyền nhà hàng',
          kicker: 'Hợp tác mở nhà hàng Bia Thầy Tu',
          lead: 'Mở nhà hàng bia Đức theo mô hình đang chạy ở Ngõ 26 Vạn Phúc, bia lấy thẳng từ công ty nhập khẩu.',
          image: {
            src: '/images/brand/benediktiner-official/home-hero.jpg',
            alt: 'Benediktiner Weissbier trước khung cảnh Tu viện Ettal',
            position: 'center center',
          },
        }}
        after={<FaqSection items={franchiseFaqs} />}
      >
        <DiningSubNav current="franchise" />

        <Summary>
          <p>
            <strong>Mô hình đã có nhà hàng mẫu:</strong> Nhà hàng Bia Thầy Tu ở {COMPANY_CONFIG.showroomAddress} là nơi bên mình chạy mô hình trước khi nhượng quyền. Đối tác mở nhà hàng cùng tên, nhận công thức bếp, và lấy bia <strong>Benediktiner, Bitburger</strong> trực tiếp từ Công ty TNHH German Taste, đơn vị nhập khẩu. Chi phí và thời gian hoàn vốn tính riêng theo mặt bằng của từng đối tác, sau khi khảo sát.
          </p>
        </Summary>

        <h2>Đối tác nhận được gì</h2>
        <p>
          Bốn điều đối tác có ngay từ đầu:
        </p>
        <InfoGrid
          columns={2}
          items={[
            {
              title: 'Bia lấy thẳng từ đơn vị nhập khẩu',
              text: 'Benediktiner và Bitburger do Công ty TNHH German Taste nhập khẩu và giao thẳng cho nhà hàng, không qua đại lý trung gian. Có hóa đơn VAT.',
            },
            {
              title: 'Thương hiệu hơn 400 năm truyền thống',
              text: 'Benediktiner ủ tại Lich, bang Hessen, theo công thức gốc của dòng Biển Đức, men lấy từ hầm tu viện Ettal (lập năm 1330). Nhân viên có sẵn câu chuyện để kể với khách tại bàn.',
            },
            {
              title: 'Khách tiếp đối tác và tiệc gia đình',
              text: 'Mô hình nhắm tới khách văn phòng, doanh nhân và tiệc gia đình. Không cạnh tranh giá với quán nhậu bình dân hay beer club.',
            },
            {
              title: 'Nhà hàng mẫu ở Hà Nội',
              text: `Quy trình bếp, quầy bar và phục vụ được làm thật tại ${COMPANY_CONFIG.showroomAddress} trước khi chuyển giao. Đối tác có thể ghé ăn như khách thường để xem tận nơi.`,
            },
          ]}
        />

        <h2>Khu vực đang tìm đối tác</h2>
        <p>
          Bên mình ưu tiên các khu vực sau:
        </p>
        <ul>
          <li>
            <strong>Hà Nội và các tỉnh phía Bắc:</strong> Các quận Ba Đình, Cầu Giấy, Tây Hồ, Hoàn Kiếm, Đống Đa, Nam Từ Liêm, cùng Hải Phòng, Quảng Ninh, Bắc Ninh.
          </li>
          <li>
            <strong>TP. Hồ Chí Minh và Đông Nam Bộ:</strong> Quận 1, Quận 2 (Thảo Điền / An Phú), Quận 7, Bình Thạnh, TP. Thủ Đức, Bình Dương, Đồng Nai, Vũng Tàu.
          </li>
          <li>
            <strong>Thành phố du lịch và trung tâm kinh tế:</strong> Đà Nẵng, Nha Trang, Cần Thơ, Buôn Ma Thuột.
          </li>
        </ul>

        <h2>Hai mô hình theo diện tích</h2>
        <p>
          Chọn mô hình theo mặt bằng và số vốn:
        </p>
        <InfoGrid
          columns={2}
          items={[
            {
              title: 'Mô hình 1: Monastic Beer Bistro (80 - 150m²)',
              text: 'Hợp nhà phố trung tâm, shophouse khu đô thị mới. Bán bia chai, lon, bom 5L và món nhắm Âu gọn. Vốn ban đầu thấp hơn mô hình 2.',
            },
            {
              title: 'Mô hình 2: Beer Garden và nhà hàng (200 - 500m²+)',
              text: 'Hợp biệt thự hoặc khu đất có sân vườn. Có vườn bia ngoài trời, quầy bar ở giữa và phòng riêng tiếp khách.',
            },
          ]}
        />

        <h2>Bên mình hỗ trợ những gì</h2>
        <p>
          Từ lúc chọn mặt bằng tới ngày khai trương:
        </p>
        <ul>
          <li><strong>Khảo sát mặt bằng:</strong> Xem vị trí, lượng khách qua lại và tính thử bài toán tài chính.</li>
          <li><strong>Thiết kế nhận diện:</strong> Bản vẽ 2D và 3D theo kiểu Brauhaus Đức.</li>
          <li><strong>Đào tạo nhân sự:</strong> Đào tạo quản lý và nhân viên phục vụ về bia Đức, cách rót bia Weizen và cách gợi ý món cho khách.</li>
          <li><strong>Chuyển giao công thức bếp:</strong> Định lượng nguyên liệu và công thức các món Đức, món Âu trong thực đơn.</li>
          <li><strong>Vật dụng có logo hãng:</strong> Ly Weizen thủy tinh chính hãng, tháp bia, lót ly, tạp dề, thực đơn in sẵn.</li>
          <li><strong>Truyền thông:</strong> Kế hoạch truyền thông ngày khai trương, đưa nhà hàng lên Google Maps và các trang đánh giá món ăn.</li>
        </ul>

        <h2>Sáu bước từ đăng ký tới khai trương</h2>
        <StepList steps={franchiseSteps} />

        <h2>Đăng ký tư vấn nhượng quyền</h2>
        <p>
          Để lại thông tin, bên mình gửi hồ sơ dự án, bảng dự toán doanh thu và hẹn lịch gặp trực tiếp ban lãnh đạo.
        </p>

        <FranchiseConsultationForm />

        <CtaBand
          title="Gọi thẳng ban phát triển dự án"
          text={<>Trao đổi riêng về mặt bằng, số vốn và mô hình hợp với anh chị. Hotline: {COMPANY_CONFIG.hotline}.</>}
          action={{ href: telHref, label: 'Gọi hotline dự án' }}
          secondary={{ href: zaloUrl, label: 'Nhắn tin Zalo' }}
        />
      </EditorialPage>
    </>
  );
}
