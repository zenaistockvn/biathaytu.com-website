import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, Summary, StepList, FaqSection } from '../components/EditorialPage';
import DiningSubNav from '../components/DiningSubNav';
import FranchiseConsultationForm from '../components/FranchiseConsultationForm';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Nhượng quyền nhà hàng Bia Thầy Tu',
  description: 'Tư vấn mở nhà hàng Bia Thầy Tu theo nhượng quyền. Bia Benediktiner, Bitburger lấy thẳng từ German Taste, đơn vị nhập khẩu.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/nhuong-quyen' },
  openGraph: {
    title: 'Nhượng quyền nhà hàng Bia Thầy Tu',
    description: 'Tư vấn mở nhà hàng Bia Thầy Tu theo nhượng quyền. Bia lấy thẳng từ công ty nhập khẩu.',
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
    title: 'Nhượng quyền nhà hàng Bia Thầy Tu',
    description: 'Tư vấn mở nhà hàng Bia Thầy Tu theo nhượng quyền.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const franchiseSteps = [
  {
    title: 'Gửi thông tin',
    text: 'Đối tác để lại thông tin qua form trên trang này hoặc gọi hotline.',
  },
  {
    title: 'Trao đổi và khảo sát',
    text: 'Bên mình liên hệ lại, trao đổi về mặt bằng và kế hoạch của đối tác.',
  },
  {
    title: 'Thống nhất và ký hợp đồng',
    text: 'Hai bên thống nhất điều khoản rồi ký hợp đồng.',
  },
  {
    title: 'Chuẩn bị và khai trương',
    text: 'Bên mình hỗ trợ đối tác chuẩn bị nhà hàng tới ngày khai trương.',
  },
] as const;

const franchiseFaqs = [
  {
    question: 'Chi phí nhượng quyền bao nhiêu?',
    answer: 'Tùy mặt bằng và quy mô nhà hàng. Bên mình báo cụ thể sau khi trao đổi và khảo sát.',
  },
  {
    question: 'Bia cho nhà hàng nhượng quyền lấy từ đâu?',
    answer: 'Từ Công ty TNHH German Taste, đơn vị nhập khẩu Benediktiner và Bitburger từ Đức, có giấy tờ nhập khẩu và hóa đơn VAT.',
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
          title: 'Nhượng quyền nhà hàng Bia Thầy Tu',
          slug: 'nhuong-quyen',
          url: 'https://www.biathaytu.com.vn/nhuong-quyen',
          description: 'Tư vấn mở nhà hàng Bia Thầy Tu theo nhượng quyền.',
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
          lead: 'Mở nhà hàng bia Đức theo mô hình Nhà hàng Bia Thầy Tu ở Ngõ 26 Vạn Phúc, bia lấy thẳng từ công ty nhập khẩu.',
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
            <strong>Nhà hàng mẫu:</strong> Nhà hàng Bia Thầy Tu ở {COMPANY_CONFIG.showroomAddress} là mô hình bên mình đang vận hành. Đối tác muốn mở nhà hàng cùng tên thì để lại thông tin, bên mình liên hệ trao đổi. Bia <strong>Benediktiner, Bitburger</strong> lấy trực tiếp từ Công ty TNHH German Taste, đơn vị nhập khẩu.
          </p>
        </Summary>

        <h2>Các bước hợp tác</h2>
        <StepList steps={franchiseSteps} />

        <h2>Đăng ký tư vấn nhượng quyền</h2>
        <p>
          Để lại thông tin, bên mình liên hệ lại để trao đổi.
        </p>

        <FranchiseConsultationForm />

        <CtaBand
          title="Gọi trao đổi trực tiếp"
          text={<>Hotline: {COMPANY_CONFIG.hotline}.</>}
          action={{ href: telHref, label: 'Gọi hotline' }}
          secondary={{ href: zaloUrl, label: 'Nhắn tin Zalo' }}
        />
        <p>
          <Link href={NAV.restaurant.href}><strong>Xem nhà hàng mẫu &rarr;</strong></Link>
        </p>
      </EditorialPage>
    </>
  );
}
