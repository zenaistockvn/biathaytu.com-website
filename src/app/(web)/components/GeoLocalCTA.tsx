import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import { NAV } from '@/config/navigation';
import styles from './GeoLocalCTA.module.css';

/**
 * Khối showroom cuối bài viết (audit L4): dải xanh đêm phẳng theo hệ thống, nút sáng + link,
 * bản đồ bên phải. Giờ hỗ trợ đọc từ COMPANY_CONFIG.supportHours, không viết cứng.
 */
export default function GeoLocalCTA() {
  const telHref = getCompanyTelHref() || NAV.contact.href;
  const zaloUrl = getCompanyZaloUrl();
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY_CONFIG.showroomAddress)}&output=embed`;

  return (
    <aside className={styles.card} data-surface="ink" aria-labelledby="geo-cta-title">
      <div className={styles.body}>
        <p className={styles.kicker}>Trải nghiệm trực tiếp</p>
        <p id="geo-cta-title" className={styles.title}>Ghé thăm showroom Bia Thầy Tu</p>
        <p className={styles.text}>Xem các dòng bia đang giới thiệu và nhận tư vấn trực tiếp tại showroom.</p>

        <dl className={styles.info}>
          <div>
            <dt>Showroom</dt>
            <dd>{COMPANY_CONFIG.showroomAddress}</dd>
          </div>
          <div>
            <dt>Hotline / Zalo</dt>
            <dd>{COMPANY_CONFIG.hotline} ({COMPANY_CONFIG.supportHours} hàng ngày)</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <a href={telHref} className="btn-light">Gọi hotline</a>
          {zaloUrl ? (
            <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>Mở Zalo</a>
          ) : null}
        </div>
      </div>

      <div className={styles.map}>
        <iframe
          src={mapEmbedUrl}
          className={styles.iframe}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ showroom Bia Thầy Tu"
        />
      </div>
    </aside>
  );
}
