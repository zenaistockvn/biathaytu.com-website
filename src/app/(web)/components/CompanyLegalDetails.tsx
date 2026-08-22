import { BRAND, BRAND_MAILTO_HREF, BRAND_TEL_HREF } from '@/lib/brand';

interface CompanyLegalDetailsProps {
  compact?: boolean;
}

export default function CompanyLegalDetails({ compact = false }: CompanyLegalDetailsProps) {
  const rows = [
    ['Tên pháp nhân', BRAND.legalName],
    ['Mã số thuế', BRAND.taxCode],
    ['Số Giấy chứng nhận ĐKKD', BRAND.businessRegistrationCertificateNumber],
    ['Địa chỉ trụ sở theo ĐKKD', BRAND.registeredAddress],
    ['Địa chỉ showroom', BRAND.showroomAddress],
    ['Người đại diện theo pháp luật', BRAND.legalRepresentative],
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
        <strong>Hotline:</strong> <a href={BRAND_TEL_HREF}>{BRAND.hotline}</a>
      </p>
      <p style={{ margin: '4px 0' }}>
        <strong>Email:</strong> <a href={BRAND_MAILTO_HREF}>{BRAND.email}</a>
      </p>
    </div>
  );
}
