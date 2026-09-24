import ZaloCTA from '../components/ZaloCTA';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyMailtoHref, getCompanyTelHref } from '@/config/company';
import type { Metadata } from 'next';
import { PageHeader } from '../components/EditorialPage'
import TitleBlock from '../components/ui/TitleBlock'
import styles from './page.module.css';

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

/** Liên hệ: dải tiêu đề, cột thông tin (bảng kẻ mảnh) và cột chọn nhu cầu mở Zalo. */
export default function ContactPage() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_CONFIG.showroomAddress)}`;

  return (
    <>
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Liên Hệ', url: 'https://www.biathaytu.com/lien-he' },
      ])} />

      <PageHeader
        tone="light"
        eyebrow="Liên hệ"
        title="Kết nối với chúng tôi"
        lead="Đội ngũ tư vấn luôn sẵn sàng về các dòng bia, hỗ trợ đại lý hoặc cung cấp cho sự kiện."
      />

      <div className={styles.body}>
        <div className={`container ${styles.grid}`}>
          <section aria-labelledby="contact-info-title">
            <TitleBlock id="contact-info-title" as="h2" size="h3" title="Thông tin liên hệ" />
            <dl className={styles.rows}>
              <div>
                <dt>Bia Thầy Tu</dt>
                <dd>Điểm giới thiệu và tư vấn Bia Thầy Tu Benediktiner tại Việt Nam.</dd>
              </div>
              <div>
                <dt>Showroom</dt>
                <dd>
                  {COMPANY_CONFIG.showroomAddress}
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>Xem chỉ đường</a>
                </dd>
              </div>
              <div>
                <dt>Tổng đài</dt>
                <dd>
                  {telHref ? <a href={telHref} className={styles.phone}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
                  <span className={styles.note}>Hỗ trợ 09:00 đến 21:00 hàng ngày</span>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.panel} data-surface="ink" aria-labelledby="contact-help-title">
            <TitleBlock id="contact-help-title" as="h2" size="h3" title="Bạn cần hỗ trợ gì?" />
            <p className={styles.panelText}>Chọn nhu cầu bên dưới để mở Zalo với lời nhắn soạn sẵn; chúng tôi phản hồi trong khoảng 30 phút.</p>
            <div className={styles.actions}>
              <ZaloCTA label="Tư vấn dòng bia phù hợp" productName="Tư vấn sản phẩm" />
              <ZaloCTA label="Báo giá sỉ / Đại lý" productName="Báo giá sỉ / Đại lý" variant="outline" />
              <ZaloCTA label="Cung cấp cho sự kiện / nhà hàng" productName="Cung cấp sự kiện / nhà hàng" variant="outline" />
              <ZaloCTA label="Câu hỏi khác" variant="outline" />
            </div>
            <p className={styles.panelText}>
              Hoặc gọi trực tiếp {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
