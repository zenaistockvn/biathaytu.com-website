import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG, getCompanyMailtoHref, getCompanyTelHref } from '@/config/company';
import type { Metadata } from 'next';
import { PageHeader } from '../components/EditorialPage'
import TitleBlock from '../components/ui/TitleBlock'
import styles from './page.module.css';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Liên hệ & tư vấn Bia Thầy Tu Benediktiner',
  description: `Liên hệ Bia Thầy Tu, Hotline ${COMPANY_CONFIG.hotline}. Điểm giới thiệu ${COMPANY_CONFIG.showroomAddress}. Tư vấn sản phẩm, HORECA và hợp tác phân phối.`,
  alternates: {
    canonical: 'https://www.biathaytu.com.vn/lien-he',
  },
  openGraph: {
    title: 'Liên hệ & tư vấn Bia Thầy Tu Benediktiner',
    description: `Liên hệ Bia Thầy Tu, Hotline ${COMPANY_CONFIG.hotline}. Điểm giới thiệu ${COMPANY_CONFIG.showroomAddress}.`,
    type: 'website',
    url: 'https://www.biathaytu.com.vn/lien-he',
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
    title: 'Liên hệ & tư vấn Bia Thầy Tu Benediktiner',
    description: `Liên hệ Bia Thầy Tu, Hotline ${COMPANY_CONFIG.hotline}. Điểm giới thiệu ${COMPANY_CONFIG.showroomAddress}.`,
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

/** Liên hệ: dải tiêu đề, cột thông tin (bảng kẻ mảnh) và cột chọn nhu cầu mở Zalo. */
export default function ContactPage() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
  const mapUrl = COMPANY_CONFIG.showroomMapUrl;

  return (
    <>
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.contact))} />

      <PageHeader
        tone="light"
        eyebrow="Liên hệ"
        title="Kết nối với chúng tôi"
        lead="Liên hệ Bia Thầy Tu hoặc đăng ký hợp tác phân phối."
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
                  <span className={styles.note}>Hỗ trợ {COMPANY_CONFIG.supportHours} hàng ngày</span>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.panel} data-surface="ink" aria-labelledby="contact-help-title">
            <TitleBlock id="contact-help-title" as="h2" size="h3" title="Hợp tác cùng Bia Thầy Tu" />
            <p className={styles.panelText}>Anh chị quan tâm làm đại lý, nhà phân phối hoặc phát triển hệ thống có thể để lại thông tin để chúng tôi liên hệ.</p>
            <div className={styles.actions}>
              <Link href="/bang-gia-si-dai-ly#dang-ky-hop-tac" className="btn-primary">Đăng ký hợp tác</Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
