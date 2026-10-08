import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary, StepList, FaqSection } from '../components/EditorialPage';
import DiningSubNav from '../components/DiningSubNav';
import FranchiseConsultationForm from '../components/FranchiseConsultationForm';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Nhượng quyền nhà hàng Bia Thầy Tu - Cơ hội đầu tư chuỗi F&B đẳng cấp',
  description: 'Hợp tác nhượng quyền chuỗi nhà hàng Bia Thầy Tu tại Hà Nội, TP.HCM và các tỉnh thành phố lớn. Nguồn bia Đức Benediktiner chính ngạch từ công ty nhập khẩu, biên lợi nhuận cao, chuyển giao trọn gói.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/nhuong-quyen' },
  openGraph: {
    title: 'Nhượng quyền nhà hàng Bia Thầy Tu - Cơ hội đầu tư chuỗi F&B đẳng cấp',
    description: 'Hợp tác nhượng quyền chuỗi nhà hàng Bia Thầy Tu tại Hà Nội, TP.HCM và các tỉnh thành phố lớn. Nguồn bia Đức chính ngạch trực tiếp từ công ty nhập khẩu.',
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
    title: 'Nhượng quyền nhà hàng Bia Thầy Tu - Cơ hội đầu tư chuỗi F&B đẳng cấp',
    description: 'Hợp tác nhượng quyền chuỗi nhà hàng Bia Thầy Tu tại Hà Nội, TP.HCM và các thành phố lớn.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const franchiseSteps = [
  {
    title: 'Đăng ký thông tin và tư vấn ban đầu',
    text: 'Đối tác gửi thông tin đăng ký tư vấn qua website hoặc liên hệ hotline. Đội ngũ phát triển dự án trao đổi sơ bộ về định hướng, năng lực tài chính và mục tiêu đầu tư.',
  },
  {
    title: 'Khảo sát mặt bằng và đánh giá P&L',
    text: 'Chuyên viên tiến hành khảo sát vị trí mặt bằng thực tế tại Hà Nội, TP.HCM hoặc tỉnh thành mục tiêu; lập bảng dự toán doanh thu, chi phí vận hành và thời gian hoàn vốn.',
  },
  {
    title: 'Ký kết hợp đồng nhượng quyền thương hiệu',
    text: 'Hai bên thống nhất các điều khoản hợp tác, ký hợp đồng nhượng quyền chính thức và kích hoạt quy trình triển khai setup nhà hàng.',
  },
  {
    title: 'Thiết kế 3D và thi công không gian',
    text: 'Đội ngũ kiến trúc sư lên bản vẽ thiết kế 3D chuẩn nhận diện Bavaria Brauhaus, bố trí công năng quầy bar bia, khu vực bếp Âu và không gian bàn tiệc.',
  },
  {
    title: 'Đào tạo nhân sự và chuyển giao công thức',
    text: 'Đào tạo quản lý vận hành, kỹ thuật rót bia Weizen chuẩn tu viện Đức, chuyển giao quy trình bếp món ăn Âu và hướng dẫn sử dụng phần mềm quản lý.',
  },
  {
    title: 'Khai trương và đồng hành dài hạn',
    text: 'Hỗ trợ tổ chức chiến dịch truyền thông ra mắt nhà hàng, cung cấp nguồn bia nhập khẩu ổn định giá gốc và đồng hành tối ưu hóa kinh doanh định kỳ.',
  },
] as const;

const franchiseFaqs = [
  {
    question: 'Chi phí nhượng quyền nhà hàng Bia Thầy Tu gồm những khoản nào?',
    answer: 'Tổng mức đầu tư bao gồm phí nhượng quyền thương hiệu ban đầu, chi phí thiết kế và thi công nội thất theo chuẩn Bavaria, trang thiết bị quầy bar bia, bếp Âu, hệ thống POSM và lượng hàng hóa lưu kho ban đầu. Chi phí cụ thể tùy thuộc vào diện tích mặt bằng và mô hình lựa chọn.',
  },
  {
    question: 'Nguồn bia cung cấp cho nhà hàng nhượng quyền được đảm bảo thế nào?',
    answer: 'Nhà hàng nhượng quyền được ký hợp đồng cung ứng bia chính ngạch trực tiếp từ Công ty TNHH German Taste - đơn vị nhập khẩu chính ngạch các dòng bia Benediktiner và Bitburger từ Đức. Nguồn hàng luôn ổn định, đầy đủ chứng nhận chất lượng, hóa đơn VAT và giá gốc ưu đãi tối đa.',
  },
  {
    question: 'Thời gian từ lúc ký hợp đồng đến khi khai trương mất bao lâu?',
    answer: 'Thông thường quy trình thiết kế, thi công, lắp đặt trang thiết bị và đào tạo nhân sự hoàn thiện trong khoảng 30 đến 45 ngày tùy theo hiện trạng mặt bằng thực tế.',
  },
  {
    question: 'Đối tác chưa có kinh nghiệm trong ngành F&B có thể tham gia nhượng quyền không?',
    answer: 'Hoàn toàn được. Mô hình nhà hàng Bia Thầy Tu được chuẩn hóa toàn diện từ quy trình bếp, quản lý kho bia, đào tạo nhân viên phục vụ đến phần mềm quản lý, giúp đối tác dễ dàng vận hành dù chưa từng làm F&B.',
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
          title: 'Nhượng quyền nhà hàng Bia Thầy Tu - Cơ hội đầu tư F&B đẳng cấp',
          slug: 'nhuong-quyen',
          url: 'https://www.biathaytu.com.vn/nhuong-quyen',
          description: 'Hợp tác nhượng quyền chuỗi nhà hàng Bia Thầy Tu tại Hà Nội, TP.HCM và các thành phố lớn.',
          datePublished: '2026-10-01',
          dateModified: '2026-10-01',
        })}
      />
      <JsonLd
        type="breadcrumb"
        data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.franchise.href, label: NAV.franchise.label }))}
      />

      <EditorialPage
        hero={{
          title: 'Nhượng quyền nhà hàng',
          kicker: 'Cơ hội hợp tác đầu tư F&B',
          lead: 'Đồng hành cùng đơn vị nhập khẩu chính ngạch, phát triển chuỗi nhà hàng bia tu viện Đức đẳng cấp và sinh lời bền vững tại Việt Nam.',
          image: {
            src: '/images/brand/benediktiner-official/home-hero.jpg',
            alt: 'Cội nguồn bia tu viện Benediktiner Đức và không gian nhượng quyền ẩm thực',
            position: 'center center',
          },
        }}
        after={<FaqSection items={franchiseFaqs} />}
      >
        <DiningSubNav current="franchise" />

        <Summary>
          <p>
            <strong>Đón đầu xu hướng F&B văn minh:</strong> Người tiêu dùng Việt Nam ngày càng tìm kiếm những không gian ẩm thực có chiều sâu văn hóa, đồ uống cao cấp nhập khẩu chính ngạch và chất lượng phục vụ lịch thiệp. Chuỗi <strong>Nhà hàng Bia Thầy Tu</strong> mang đến mô hình kinh doanh F&B độc bản: Kết hợp di sản bia tu viện Đức hơn 400 năm với ẩm thực Bavaria đặc sắc, mở ra cơ hội đầu tư sinh lời vượt trội cho các đối tác nhượng quyền.
          </p>
        </Summary>

        <h2>Lợi thế khác biệt của mô hình Bia Thầy Tu</h2>
        <p>
          Trở thành đối tác nhượng quyền của Bia Thầy Tu, bạn nắm trong tay những lợi thế cạnh tranh mà các mô hình F&B thông thường không thể có được:
        </p>
        <InfoGrid
          columns={2}
          items={[
            {
              title: 'Nguồn bia gốc từ đơn vị nhập khẩu',
              text: 'Được bảo hộ nguồn cung cấp trực tiếp từ Công ty TNHH German Taste. Giá nhập hàng tận gốc không qua trung gian thương mại, đảm bảo biên lợi nhuận đồ uống luôn ở mức tối ưu.',
            },
            {
              title: 'Thương hiệu di sản 400 năm',
              text: 'Sức mạnh từ thương hiệu Benediktiner có nguồn gốc từ Tu viện Ettal (thành lập 1330). Câu chuyện lịch sử sâu sắc tạo niềm tin tuyệt đối cho khách hàng cao cấp và giới sành bia.',
            },
            {
              title: 'Thị trường ngách ít cạnh tranh trực tiếp',
              text: 'Tách biệt khỏi sự cạnh tranh gay gắt của các quán nhậu bình dân hay beer club ồn ào. Mô hình hướng đến giới trung lưu, doanh nhân, tiệc gia đình với giá trị đơn hàng trung bình cao.',
            },
            {
              title: 'Cơ sở mẫu tại Hà Nội chứng thực hiệu quả',
              text: 'Mô hình đã được thử nghiệm và vận hành thực tế tại cơ sở mẫu (26 Vạn Phúc, Ba Đình, Hà Nội), giúp quy trình hóa mọi mắt xích từ bếp, quầy bar đến dịch vụ khách hàng.',
            },
          ]}
        />

        <h2>Thị trường mục tiêu ưu tiên phát triển</h2>
        <p>
          Nhằm xây dựng mạng lưới chuỗi nhà hàng vững mạnh và đồng bộ, chúng tôi ưu tiên tìm kiếm đối tác hợp tác tại các khu vực trọng điểm:
        </p>
        <ul>
          <li>
            <strong>Hà Nội và vùng kinh tế phía Bắc:</strong> Các quận Ba Đình, Cầu Giấy, Tây Hồ, Hoàn Kiếm, Đống Đa, Nam Từ Liêm, cũng như Hải Phòng, Quảng Ninh, Bắc Ninh.
          </li>
          <li>
            <strong>TP. Hồ Chí Minh và Đông Nam Bộ:</strong> Quận 1, Quận 2 (Thảo Điền / An Phú), Quận 7, Bình Thạnh, TP. Thủ Đức, Bình Dương, Đồng Nai, Vũng Tàu.
          </li>
          <li>
            <strong>Các thành phố du lịch và trung tâm kinh tế lớn:</strong> Đà Nẵng, Nha Trang, Cần Thơ, Buôn Ma Thuột.
          </li>
        </ul>

        <h2>Hai mô hình nhượng quyền linh hoạt</h2>
        <p>
          Tùy theo diện tích mặt bằng và quy mô vốn của nhà đầu tư, chúng tôi cung cấp hai định dạng kinh doanh tiêu chuẩn:
        </p>
        <InfoGrid
          columns={2}
          items={[
            {
              title: 'Mô hình 1: Monastic Beer Bistro (80 - 150m²)',
              text: 'Phù hợp với nhà phố trung tâm, shophouse khu đô thị mới. Không gian tập trung vào trải nghiệm bia chai, bia lon ướp lạnh, bia bom 5L và thực đơn món nhắm Âu gọn nhẹ. Vốn đầu tư linh hoạt, thu hồi vốn nhanh.',
            },
            {
              title: 'Mô hình 2: Bavarian Beer Garden & Restaurant (200 - 500m²+)',
              text: 'Phù hợp mặt bằng biệt thự hoặc khu đất có sân vườn. Tích hợp không gian vườn bia thoáng đãng ngoài trời, quầy bar trung tâm và hệ thống phòng VIP tiếp khách riêng tư. Sản lượng tiêu thụ bia và doanh thu tiệc lớn.',
            },
          ]}
        />

        <h2>Gói hỗ trợ toàn diện từ thương hiệu</h2>
        <p>
          Đối tác nhượng quyền được hỗ trợ trọn gói theo tiêu chuẩn chuyên nghiệp nhất:
        </p>
        <ul>
          <li><strong>Khảo sát mặt bằng:</strong> Đánh giá vị trí, lưu lượng khách tiềm năng và phân tích tính khả thi tài chính.</li>
          <li><strong>Thiết kế nhận diện:</strong> Cung cấp hồ sơ bản vẽ thiết kế 2D và 3D mang đậm phong cách Bavarian Brauhaus truyền thống.</li>
          <li><strong>Đào tạo nhân sự:</strong> Khóa đào tạo chuẩn hóa cho quản lý, nhân viên phục vụ về văn hóa bia Đức, kỹ thuật rót bia Weizen và tư vấn món ăn.</li>
          <li><strong>Chuyển giao công nghệ bếp:</strong> Định lượng nguyên vật liệu, công thức chế biến các món ăn đặc trưng của ẩm thực Đức - Âu.</li>
          <li><strong>Hỗ trợ POSM chính hãng:</strong> Cung cấp ly Weizen thủy tinh chính hãng, tháp bia, lót ly, tạp dề, thực đơn in ấn tiêu chuẩn cao cấp.</li>
          <li><strong>Marketing và truyền thông:</strong> Hỗ trợ kế hoạch truyền thông ngày khai trương, định vị thương hiệu trên các nền tảng số và bản đồ ẩm thực.</li>
        </ul>

        <h2>Quy trình 6 bước hợp tác nhượng quyền</h2>
        <StepList steps={franchiseSteps} />

        <h2>Đăng ký tư vấn đầu tư nhượng quyền</h2>
        <p>
          Hãy để lại thông tin để nhận hồ sơ năng lực dự án, bảng dự toán doanh thu chi tiết và xếp lịch hẹn làm việc trực tiếp với ban lãnh đạo:
        </p>

        <FranchiseConsultationForm />

        <CtaBand
          title="Kết nối trực tiếp ban phát triển dự án"
          text={<>Trao đổi bảo mật về cơ hội đầu tư và hợp tác kinh doanh chuỗi nhà hàng Bia Thầy Tu tại Việt Nam. Hotline ưu tiên: {COMPANY_CONFIG.hotline}.</>}
          action={{ href: telHref, label: 'Gọi hotline dự án' }}
          secondary={{ href: zaloUrl, label: 'Nhắn tin Zalo' }}
        />
      </EditorialPage>
    </>
  );
}
