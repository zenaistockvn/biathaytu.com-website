'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import AlcoholWarning from './AlcoholWarning';

export default function WebFooter() {
  const { t } = useLanguage();

  const handleResetAge = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetAgeVerification'));
  };

  const handleResetCookie = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetCookieConsent'));
  };

  return (
    <footer className="web-footer">
      <div className="container footer-grid">
        {/* Company Info */}
        <div>
          <h3 className="footer-brand">BIA THẦY TU</h3>
          <p className="footer-desc">
            {t('footer.description')}
          </p>
          <div style={{ marginTop: '16px', fontSize: '13px', opacity: 0.85, lineHeight: '1.6' }}>
            <p style={{ margin: '4px 0' }}>
              <strong>Đơn vị phân phối:</strong><br/>
              Công ty TNHH Euro Choice Việt Nam
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Địa chỉ:</strong><br/>
              659A Lạc Long Quân, Phường Tây Hồ, Hà Nội
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>GPKD số:</strong> 0110870013 do Sở KH&ĐT Hà Nội cấp
            </p>
          </div>
          <div className="footer-socials" style={{ marginTop: '20px' }}>
            <a 
              href="https://zalo.me/0899191313"
              target="_blank" rel="noopener noreferrer"
              className="footer-social-icon"
              title="Zalo"
            >💬</a>
            <a 
              href="tel:0899191313"
              className="footer-social-icon"
              title="Hotline"
            >📞</a>
            <a 
              href="mailto:info@biathaytu.com"
              className="footer-social-icon"
              title="Email"
            >✉️</a>
          </div>
        </div>

        {/* Sản phẩm */}
        <div>
          <h4 className="footer-heading">{t('nav.products')}</h4>
          <div className="footer-links">
            <Link href="/san-pham">Benediktiner Weissbier</Link>
            <Link href="/san-pham">Benediktiner Dunkel</Link>
            <Link href="/san-pham">Benediktiner Mix 2 Vị</Link>
            <Link href="/san-pham">Bom 5L Benediktiner</Link>
          </div>
        </div>

        {/* Quy định & Điều khoản */}
        <div>
          <h4 className="footer-heading">Chính Sách & Tuân Thủ</h4>
          <div className="footer-links">
            <Link href="/chinh-sach-kiem-soat-do-tuoi">Kiểm soát độ tuổi</Link>
            <Link href="/chinh-sach-giao-hang">Chính sách giao hàng</Link>
            <Link href="/chinh-sach-thanh-toan">Chính sách thanh toán</Link>
            <Link href="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
            <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link href="/chinh-sach-cookie">Chính sách cookie</Link>
            <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
          </div>
        </div>

        {/* Liên hệ & Tùy chọn */}
        <div>
          <h4 className="footer-heading">{t('footer.contact.title')}</h4>
          <div className="footer-contact">
            <p>
              <strong>{t('footer.contact.hotline')}</strong><br/>
              <span style={{ fontSize: '12px' }}>{t('footer.contact.time')}</span>
            </p>
            <p>
              <strong>Email:</strong><br/>
              <a href="mailto:info@biathaytu.com">{t('footer.contact.email')}</a>
            </p>
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleResetAge}
                style={{
                  background: 'none',
                  border: '1px dashed #f39c12',
                  color: '#f39c12',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                🔄 Xóa xác nhận độ tuổi
              </button>
              <button
                onClick={handleResetCookie}
                style={{
                  background: 'none',
                  border: '1px dashed #94a3b8',
                  color: '#94a3b8',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                ⚙️ Cài đặt Cookie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning banner block */}
      <div className="container" style={{ marginTop: '20px' }}>
        <AlcoholWarning variant="footer" style={{ width: '100%', justifyContent: 'center' }} />
      </div>

      {/* Bottom bar */}
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
