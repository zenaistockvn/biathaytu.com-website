import { COMPANY_CONFIG, getCompanyMailtoHref, getCompanyTelHref } from '@/config/company';

interface CompanyLegalDetailsProps {
  compact?: boolean;
}

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
    <div
      style={{
        marginTop: compact ? '16px' : '28px',
        padding: compact ? '16px' : '20px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        lineHeight: 1.7,
      }}
      aria-label="Thông tin pháp nhân và liên hệ"
    >
      {rows.map(([label, value]) => (
        <p key={label} style={{ margin: '4px 0' }}>
          <strong>{label}:</strong> {value}
        </p>
      ))}
      <p style={{ margin: '4px 0' }}>
        <strong>Hotline:</strong>{' '}
        {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
      </p>
      <p style={{ margin: '4px 0' }}>
        <strong>Email:</strong>{' '}
        {mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}
      </p>
    </div>
  );
}
