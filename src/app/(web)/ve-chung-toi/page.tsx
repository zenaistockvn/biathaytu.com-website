import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi | Bia Thầy Tu',
  description: 'Tìm hiểu về Bia Thầy Tu, điểm kết nối câu chuyện Benediktiner, văn hoá bia Đức và nghệ thuật thưởng thức tại Việt Nam.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/ve-chung-toi' },
  openGraph: {
    title: 'Về Chúng Tôi | Bia Thầy Tu',
    description: 'Tìm hiểu về Bia Thầy Tu, điểm kết nối câu chuyện Benediktiner, văn hoá bia Đức và nghệ thuật thưởng thức tại Việt Nam.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/ve-chung-toi',
    images: [
      {
        url: '/images/brand/benediktiner-official/ettal-monastery.jpg',
        width: 600,
        height: 400,
        alt: 'Tu viện Ettal, nơi khởi nguồn câu chuyện Benediktiner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Về Bia Thầy Tu',
    description: 'Tìm hiểu về Bia Thầy Tu, điểm kết nối câu chuyện Benediktiner, văn hoá bia Đức và nghệ thuật thưởng thức tại Việt Nam.',
    images: ['/images/brand/benediktiner-official/ettal-monastery.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Về Chúng Tôi', slug: 've-chung-toi', url: 'https://www.biathaytu.com.vn/ve-chung-toi', description: 'Thông tin nhà nhập khẩu Bia Thầy Tu.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com.vn' }, { name: 'Về Chúng Tôi', url: 'https://www.biathaytu.com.vn/ve-chung-toi' }])} />

      <EditorialPage
        hero={{
          eyebrow: 'Bia Thầy Tu',
          title: 'Về chúng tôi',
          kicker: 'Hương vị nguyên bản từ Bavaria',
          lead: 'Mang nền văn hóa bia Bavaria 400 năm tuổi đến với bàn tiệc của người Việt.',
          image: { src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Tu viện Ettal tại Bavaria' },
        }}
      >
        <Summary>
          <p><strong>Tầm nhìn:</strong> trở thành cầu nối văn hóa ẩm thực Đức và Việt. <strong>Bia Thầy Tu</strong> không chỉ bán bia, chúng tôi mang tới một phong cách thưởng thức bia có trách nhiệm và tinh tế theo chuẩn châu Âu.</p>
        </Summary>

        <h2>Sứ mệnh</h2>
        <p>Bia Thầy Tu giới thiệu <strong>Benediktiner Weissbier</strong> và các lựa chọn bia Đức tới người thưởng thức tại Việt Nam. Website tập trung vào câu chuyện thương hiệu, đặc tính từng dòng bia, nghệ thuật rót bia và các giải pháp dành cho nhà hàng, khách sạn. Xem <Link href="/chung-nhan-nhap-khau-chinh-hang">thông tin nguồn gốc sản phẩm</Link> để tìm hiểu thêm.</p>

        <h2>Ba giá trị cốt lõi</h2>
        <InfoGrid
          items={[
            { title: '100% nguyên bản', text: 'Từ chối sản xuất tại nước thứ ba. Tất cả được sản xuất và đóng chai tại Đức theo Luật Tinh Khiết 1516.' },
            { title: 'Tôn trọng men sống', text: 'Kho vận lạnh giúp bảo tồn lớp men sống (Naturtrüb) của dòng bia lúa mì.' },
            { title: 'Dịch vụ tận tâm', text: 'Từ khách hàng cá nhân đến nhà hàng HORECA, chúng tôi đều phục vụ chuyên nghiệp.' },
          ]}
        />

        <h2>Thông tin liên hệ</h2>
        <table>
          <tbody>
            <tr><th scope="row">Thương hiệu</th><td>Bia Thầy Tu</td></tr>
            <tr><th scope="row">Showroom</th><td>{COMPANY_CONFIG.showroomAddress}</td></tr>
            <tr><th scope="row">Hotline tư vấn</th><td>{COMPANY_CONFIG.hotline}</td></tr>
            <tr><th scope="row">Email</th><td>{COMPANY_CONFIG.email}</td></tr>
          </tbody>
        </table>

        <CtaBand
          title="Kết nối với chúng tôi"
          text={<>Ghé showroom tại Vạn Phúc để tìm hiểu các dòng bia đang được giới thiệu. Nếu bạn là đối tác kinh doanh, tham khảo <Link href="/bia-duc-cho-nha-hang-khach-san">giải pháp cho nhà hàng và khách sạn</Link>.</>}
          action={{ href: '/lien-he', label: 'Đến trang liên hệ' }}
        />
      </EditorialPage>
    </>
  );
}
