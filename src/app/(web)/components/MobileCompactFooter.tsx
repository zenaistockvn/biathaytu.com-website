import Link from 'next/link';
import AlcoholWarning from './AlcoholWarning';
import {
  COMPANY_CONFIG,
  getCompanyMailtoHref,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';

export default function MobileCompactFooter() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
  const zaloUrl = getCompanyZaloUrl();

  return (
    <footer className="mobile-compact-footer" aria-label="Thông tin Bia Thầy Tu trên thiết bị di động">
      <div className="container">
        <h3 className="mobile-footer-brand">BIA THẦY TU</h3>
        <p className="mobile-footer-brochure-note">
          Website giới thiệu sản phẩm — không bán hàng trực tuyến.
        </p>

        <div className="mobile-footer-legal">
          <p><strong>Tên pháp nhân:</strong><br />{COMPANY_CONFIG.legalName}</p>
          <p><strong>Mã số thuế:</strong> {COMPANY_CONFIG.taxCode}</p>
          <p><strong>Số Giấy chứng nhận ĐKKD:</strong> {COMPANY_CONFIG.businessRegistrationCertificateNumber}</p>
          <p><strong>Địa chỉ trụ sở theo ĐKKD:</strong><br />{COMPANY_CONFIG.registeredAddress}</p>
          <p><strong>Địa chỉ showroom:</strong><br />{COMPANY_CONFIG.showroomAddress}</p>
          <p><strong>Người đại diện theo pháp luật:</strong><br />{COMPANY_CONFIG.legalRepresentative}</p>
          <p>
            <strong>Hotline:</strong>{' '}
            {telHref ? <a className="mobile-footer-link" href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            {mailtoHref ? <a className="mobile-footer-link" href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}
          </p>
        </div>

        <div className="mobile-footer-accordions">
          <details>
            <summary>Sản phẩm</summary>
            <div className="mobile-footer-accordion-content">
              <Link href="/san-pham/benediktiner-naturtrub-thung-12-chai-500ml">Benediktiner Weissbier</Link>
              <Link href="/san-pham/benediktiner-dunkel-thung-12-chai-500ml">Benediktiner Dunkel</Link>
              <Link href="/san-pham/benediktiner-mix-2-v-thng-12-chai-500ml">Benediktiner Mix 2 Vị</Link>
              <Link href="/san-pham/benediktiner-naturtrub-bom-5l">Bom 5L Benediktiner</Link>
              <Link href="/qua-tang-bia-duc">Quà Tặng Bia Đức</Link>
            </div>
          </details>

          <details>
            <summary>Chính sách &amp; tuân thủ</summary>
            <div className="mobile-footer-accordion-content">
              <Link href="/chinh-sach-kiem-soat-do-tuoi">Kiểm soát độ tuổi</Link>
              <Link href="/thong-tin-mua-hang">Thông tin mua hàng</Link>
              <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link href="/chinh-sach-cookie">Chính sách cookie</Link>
              <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
            </div>
          </details>

          <details>
            <summary>Liên hệ nhanh</summary>
            <div className="mobile-footer-accordion-content">
              {telHref ? <a href={telHref}>Gọi {COMPANY_CONFIG.hotline}</a> : <span>{COMPANY_CONFIG.hotline}</span>}
              {zaloUrl ? <a href={zaloUrl} target="_blank" rel="noopener noreferrer">Chat Zalo</a> : null}
              {mailtoHref ? <a href={mailtoHref}>Email {COMPANY_CONFIG.email}</a> : <span>{COMPANY_CONFIG.email}</span>}
            </div>
          </details>
        </div>

        <div className="mobile-footer-warning">
          <AlcoholWarning variant="footer" style={{ width: '100%', justifyContent: 'center' }} />
        </div>

        <div className="mobile-footer-bottom">
          <span>&copy; {new Date().getFullYear()} Bia Thầy Tu. All rights reserved.</span>
          <span>Thưởng thức có trách nhiệm. Không lái xe sau khi sử dụng đồ uống có cồn.</span>
        </div>
      </div>
    </footer>
  );
}
