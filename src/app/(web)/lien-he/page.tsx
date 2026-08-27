import ZaloCTA from '../components/ZaloCTA';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyMailtoHref, getCompanyTelHref } from '@/config/company';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ & Tư Vấn Bia Thầy Tu Benediktiner',
  description: `Liên hệ Bia Thầy Tu, Hotline ${COMPANY_CONFIG.hotline}. Điểm giới thiệu ${COMPANY_CONFIG.showroomAddress}. Tư vấn sản phẩm, HORECA và hợp tác phân phối.`,
  alternates: {
    canonical: 'https://www.biathaytu.com/lien-he',
  },
  openGraph: {
    title: 'Liên Hệ & Tư Vấn Bia Thầy Tu Benediktiner',
    description: `Liên hệ Bia Thầy Tu, Hotline ${COMPANY_CONFIG.hotline}. Điểm giới thiệu ${COMPANY_CONFIG.showroomAddress}.`,
    type: 'website',
    url: 'https://www.biathaytu.com/lien-he',
    images: [
      {
        url: '/images/brand/benediktiner-official/home-hero.jpg',
        width: 1920,
        height: 969,
        alt: 'Liên hệ và tư vấn Bia Thầy Tu Benediktiner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liên Hệ & Tư Vấn Bia Thầy Tu Benediktiner',
    description: `Liên hệ Bia Thầy Tu, Hotline ${COMPANY_CONFIG.hotline}. Điểm giới thiệu ${COMPANY_CONFIG.showroomAddress}.`,
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

export default function ContactPage() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();

  return (
    <div className="subpage-wrap">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Liên Hệ', url: 'https://www.biathaytu.com/lien-he' },
      ])} />

      {/* Header */}
      <section className="container subpage-header-compact">
        <span className="section-label">Liên Hệ</span>
        <h1 className="page-title">Kết Nối Với Chúng Tôi</h1>
        <p className="page-subtitle" style={{ maxWidth: '700px' }}>
          Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn về các dòng bia, hỗ trợ đại lý, hoặc cung cấp cho sự kiện.
        </p>
      </section>

      <section className="container" style={{ maxWidth: '900px' }}>
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info-panel">
            <h2>Thông Tin Liên Hệ</h2>
            
            <div className="contact-info-list">
              <div>
                <strong>Bia Thầy Tu</strong>
                <span className="muted">Điểm giới thiệu và tư vấn Bia Thầy Tu Benediktiner tại Việt Nam.</span>
              </div>
              
              <div>
                <strong>Điểm giới thiệu sản phẩm</strong>
                <span className="muted">{COMPANY_CONFIG.showroomAddress}</span>
              </div>
              
              <div>
                <strong>Tổng đài CSKH</strong>
                {telHref ? <a href={telHref} className="phone">{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
                <span className="small">(Hỗ trợ: 09:00 - 21:00 hàng ngày)</span>
              </div>

              <div>
                <strong>Email</strong>
                {mailtoHref ? <a href={mailtoHref} style={{ opacity: 0.85 }}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}
              </div>
            </div>

            <div className="contact-divider">
               <h3>Tư vấn Khách Sỉ &amp; Đại Lý</h3>
               <ZaloCTA label="Nhắn tin cho chuyên viên Zalo" />
            </div>
          </div>

          {/* Quick CTA Panel */}
          <div className="contact-cta-panel">
            <h2>Bạn Cần Hỗ Trợ Gì?</h2>
            <p className="subtitle">
              Chọn loại yêu cầu bên dưới, chúng tôi sẽ phản hồi trong vòng 30 phút qua Zalo.
            </p>
            
            <div className="contact-cta-list">
              <ZaloCTA label="Tư vấn dòng bia phù hợp" productName="Tư vấn sản phẩm" />
              <ZaloCTA 
                label="Báo giá sỉ / Đại lý" 
                productName="Báo giá sỉ / Đại lý"
                variant="outline"
              />
              <ZaloCTA 
                label="Cung cấp cho sự kiện / nhà hàng" 
                productName="Cung cấp sự kiện / nhà hàng"
                variant="outline"
              />
              <ZaloCTA 
                label="Câu hỏi khác" 
                variant="outline"
              />
            </div>

            <p className="contact-alt-phone">
              Hoặc gọi trực tiếp {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
