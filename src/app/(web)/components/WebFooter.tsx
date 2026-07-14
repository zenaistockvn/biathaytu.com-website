'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function WebFooter() {
  const { t } = useLanguage();
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

        {/* Liên kết */}
        <div>
          <h4 className="footer-heading">{t('footer.company.title')}</h4>
          <div className="footer-links">
            <Link href="/thuong-hieu">{t('footer.company.about')}</Link>
            <Link href="/kien-thuc">{t('nav.knowledge')}</Link>
            <a href="https://biathaytu.com/pages/khach-hang-doanh-nghiep" target="_blank" rel="noopener noreferrer">{t('footer.company.b2b')}</a>
            <a href="https://biathaytu.com/pages/chinh-sach-giao-hang" target="_blank" rel="noopener noreferrer">{t('footer.company.policy')}</a>
          </div>
        </div>

        {/* Liên hệ */}
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
            <p>
              <strong>Website:</strong><br/>
              <a href="https://biathaytu.com" target="_blank" rel="noopener noreferrer">biathaytu.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>&copy; {new Date().getFullYear()} Bia Thầy Tu. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="footer-18-badge">18</span>
            Sản phẩm dành cho người từ đủ 18 tuổi. Thưởng thức có trách nhiệm. Không lái xe sau khi sử dụng đồ uống có cồn.
          </span>
        </div>
      </div>
    </footer>
  );
}
