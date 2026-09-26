import { COMPANY_CONFIG, getCompanyMailtoHref, getCompanyTelHref } from '@/config/company';
import styles from './CompanyLegalDetails.module.css';

interface CompanyLegalDetailsProps {
  compact?: boolean;
}

/** Khối pháp nhân và liên hệ ở cuối các trang pháp lý. */
export default function CompanyLegalDetails({ compact = false }: CompanyLegalDetailsProps) {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();

  const rows = [
    ['Tên pháp nhân', COMPANY_CONFIG.legalName],
    ['Mã số thuế', COMPANY_CONFIG.taxCode],
    ['Số Giấy chứng nhận ĐKKD', COMPANY_CONFIG.businessRegistrationCertificateNumber],
    ['Địa chỉ trụ sở theo ĐKKD', COMPANY_CONFIG.registeredAddress],
    ['Địa chỉ showroom', COMPANY_CONFIG.showroomAddress],
    ['Người đại diện theo pháp luật', COMPANY_CONFIG.legalRepresentative],
  ] as const;

  return (
    <div className={`${styles.box}${compact ? ` ${styles.compact}` : ''}`} aria-label="Thông tin pháp nhân và liên hệ">
      {rows.map(([label, value]) => (
        <p key={label} className={styles.row}>
          <strong>{label}:</strong> {value}
        </p>
      ))}
      <p className={styles.row}>
        <strong>Hotline:</strong>{' '}
        {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
      </p>
      <p className={styles.row}>
        <strong>Email:</strong>{' '}
        {mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}
      </p>
    </div>
  );
}
