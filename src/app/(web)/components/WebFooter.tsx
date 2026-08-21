'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import AlcoholWarning from './AlcoholWarning';
import {
  COMPANY_CONFIG,
  getCompanyMailtoHref,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';

export default function WebFooter() {
  const { t } = useLanguage();
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
  const zaloUrl = getCompanyZaloUrl();

  return (
    <footer className="web-footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">BIA THẦY TU</h3>
          <p className="footer-desc">{t('footer.description')}</p>
          <p style={{ margin: '12px 0 0', fontSize: '13px', fontWeight: 700 }}>
            Website giới thiệu sản phẩm — không bán hàng trực tuyến.
          </p>
          <div style={{ marginTop: '16px', fontSize: '13px', opacity: 0.9, lineHeight: '1.65' }}>
            <p style={{ margin: '4px 0' }}><strong>Tên pháp nhân:</strong><br/>{COMPANY_CONFIG.legalName}</p>
            <p style={{ margin: '4px 0' }}><strong>Mã số thuế:</strong> {COMPANY_CONFIG.taxCode}</p>
            <p style={{ margin: '4px 0' }}><strong>Số Giấy chứng nhận ĐKKD:</strong> {COMPANY_CONFIG.businessRegistrationCertificateNumber}</p>
            <p style={{ margin: '4px 0' }}><strong>Địa chỉ trụ sở theo ĐKKD:</strong><br/>{COMPANY_CONFIG.registeredAddress}</p>
            <p style={{ margin: '4px 0' }}><strong>Địa chỉ showroom:</strong><br/>{COMPANY_CONFIG.showroomAddress}</p>
            <p style={{ margin: '4px 0' }}><strong>Người đại diện theo pháp luật:</strong><br/>{COMPANY_CONFIG.legalRepresentative}</p>
            <p style={{ margin: '4px 0' }}><strong>Hotline:</strong> {COMPANY_CONFIG.hotline}</p>
            <p style={{ margin: '4px 0' }}><strong>Email:</strong> {COMPANY_CONFIG.email}</p>
          </div>
          <div className="footer-socials" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            {zaloUrl ? (
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Zalo" style={{ fontSize: '13px', fontWeight: 800 }}>ZALO</a>
            ) : (
              <span className="footer-social-icon" title="Zalo sẽ khả dụng sau khi cập nhật hotline" aria-disabled="true" style={{ fontSize: '13px', fontWeight: 800, opacity: 0.55 }}>ZALO</span>
            )}
            {telHref ? (
              <a href={telHref} className="footer-social-icon" title="Hotline" aria-label={`Gọi ${COMPANY_CONFIG.hotline}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.31-.31.76-.42 1.17-.28 1.29.43 2.66.66 4.07.66.63 0 1.14.51 1.14 1.14v3.5c0 .63-.51 1.14-1.14 1.14C10.79 21.34 2.66 13.21 2.66 3.35c0-.63.51-1.14 1.14-1.14h3.5c.63 0 1.14.51 1.14 1.14 0 1.41.23 2.78.66 4.07.13.41.03.86-.28 1.17l-2.2 2.2Z"/></svg>
              </a>
            ) : null}
            {mailtoHref ? (
              <a href={mailtoHref} className="footer-social-icon" title="Email" aria-label={`Email ${COMPANY_CONFIG.email}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <h4 className="footer-heading">{t('nav.products')}</h4>
          <div className="footer-links">
            <Link href="/san-pham/benediktiner-naturtrub-thung-12-chai-500ml">Benediktiner Weissbier</Link>
            <Link href="/san-pham/benediktiner-dunkel-thung-12-chai-500ml">Benediktiner Dunkel</Link>
            <Link href="/san-pham/benediktiner-mix-2-v-thng-12-chai-500ml">Benediktiner Mix 2 Vị</Link>
            <Link href="/san-pham/benediktiner-naturtrub-bom-5l">Bom 5L Benediktiner</Link>
            <Link href="/qua-tang-bia-duc">Quà Tặng Bia Đức</Link>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Chính Sách & Tuân Thủ</h4>
          <div className="footer-links">
            <Link href="/chinh-sach-kiem-soat-do-tuoi">Kiểm soát độ tuổi</Link>
            <Link href="/thong-tin-mua-hang">Thông tin mua hàng</Link>
            <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link href="/chinh-sach-cookie">Chính sách cookie</Link>
            <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">{t('footer.contact.title')}</h4>
          <div className="footer-contact">
            <p>
              <strong>Hotline:</strong><br/>
              {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : <span>{COMPANY_CONFIG.hotline}</span>}
            </p>
            <p>
              <strong>Email:</strong><br/>
              {mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : <span>{COMPANY_CONFIG.email}</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        <AlcoholWarning variant="footer" style={{ width: '100%', justifyContent: 'center' }} />
      </div>

      <div className="footer-bottom" style={{ marginTop: '20px' }}>
        <div className="container footer-bottom-inner">
          <span>&copy; {new Date().getFullYear()} Bia Thầy Tu. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="footer-18-badge">18</span>
            Thưởng thức có trách nhiệm. Không lái xe sau khi sử dụng đồ uống có cồn.
          </span>
        </div>
      </div>
    </footer>
  );
}
