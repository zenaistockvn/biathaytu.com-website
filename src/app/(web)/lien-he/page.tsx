import ZaloCTA from '../components/ZaloCTA';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ — Đặt Hàng & Tư Vấn Bia Đức',
  description: 'Liên hệ Bia Thầy Tu — Hotline 0899.191.313. Showroom 659A Lạc Long Quân, Phường Tây Hồ, TP. Hà Nội. Tư vấn đại lý, báo giá sỉ, giao hàng toàn quốc.',
  alternates: {
    canonical: 'https://www.biathaytu.com/lien-he',
  },
  openGraph: {
    title: 'Liên Hệ — Đặt Hàng & Tư Vấn Bia Đức',
    description: 'Liên hệ Bia Thầy Tu — Hotline 0899.191.313. Showroom 659A Lạc Long Quân, Phường Tây Hồ, TP. Hà Nội. Tư vấn đại lý, báo giá sỉ, giao hàng toàn quốc.',
    type: 'website',
    url: 'https://www.biathaytu.com/lien-he',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Liên Hệ — Đặt Hàng & Tư Vấn Bia Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liên Hệ — Đặt Hàng & Tư Vấn Bia Đức',
    description: 'Liên hệ Bia Thầy Tu — Hotline 0899.191.313. Showroom 659A Lạc Long Quân, Phường Tây Hồ, TP. Hà Nội. Tư vấn đại lý, báo giá sỉ, giao hàng toàn quốc.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default function ContactPage() {
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
                <span className="muted">Nhà nhập khẩu và phân phối độc quyền Bia Thầy Tu Benediktiner tại Việt Nam.</span>
              </div>
              
              <div>
                <strong>Trụ sở chính &amp; Showroom</strong>
                <span className="muted">659A Lạc Long Quân, Phường Tây Hồ, Hà Nội</span>
              </div>
              
              <div>
                <strong>Tổng đài CSKH</strong>
                <a href="tel:0899191313" className="phone">0899 191 313</a>
                <span className="small">(Hỗ trợ: 09:00 - 21:00 hàng ngày)</span>
              </div>

              <div>
                <strong>Email</strong>
                <a href="mailto:info@biathaytu.com" style={{ opacity: 0.85 }}>info@biathaytu.com</a>
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
              <ZaloCTA 
                label="Đặt mua lẻ — Giao tận nơi" 
                productName="Đặt mua lẻ"
              />
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
              Hoặc gọi trực tiếp <a href="tel:0899191313">0899.191.313</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
