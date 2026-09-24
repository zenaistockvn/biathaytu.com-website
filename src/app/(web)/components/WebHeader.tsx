'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import styles from './WebHeader.module.css';

// Trang có section đầu là dải xanh ngay dưới header. Không thêm /san-pham: thanh menu phụ
// nằm giữa header và hero, header trong suốt sẽ thành dải xanh lơ lửng trên nền sáng.
const DARK_HERO_PATHS = new Set([
  '/',
  '/benediktiner-weissbier-naturtrub',
  '/bitburger-premium-pils',
  '/bia-duc-nhap-khau',
  '/nhan-uu-dai',
  '/benediktiner-dunkel',
  '/bang-gia-si-dai-ly',
  '/qua-tang-bia-duc',
  '/thuong-hieu',
  '/food-pairing-bia-duc',
  '/ve-chung-toi',
  '/chung-nhan-nhap-khau-chinh-hang',
  '/bom-bia-5l-benediktiner',
  '/bia-benediktiner-chinh-hang',
  '/bia-thay-tu-la-gi',
  '/huong-dan-rot-bia-lua-mi',
  '/bia-duc-cho-nha-hang-khach-san',
]);

function isDarkHeroPath(pathname: string): boolean {
  return (
    DARK_HERO_PATHS.has(pathname) ||
    pathname === '/kien-thuc' ||
    pathname.startsWith('/kien-thuc/')
  );
}

// Menu chính theo ngữ pháp Chimay (Nos bières, Depuis 1850, Recettes...).
const NAV_LINKS = [
  { href: '/san-pham#benediktiner', label: 'Bia Benediktiner' },
  { href: '/san-pham#bia-duc-khac', label: 'Bia Đức tuyển chọn' },
  { href: '/thuong-hieu', label: 'Từ 1330' },
  { href: '/huong-dan-rot-bia-lua-mi', label: 'Thưởng thức' },
  { href: '/kien-thuc', label: 'Kiến thức' },
  { href: '/bia-duc-cho-nha-hang-khach-san', label: 'HORECA' },
];

/**
 * Header hai tầng kiểu chimay.com: huy hiệu lớn treo xuống dưới thanh header, bên phải là
 * hàng tiện ích nhỏ (hotline, liên hệ, tư vấn, ngôn ngữ) và hàng menu chính in hoa.
 * Dưới 1024px: huy hiệu nhỏ, nút menu mở lớp phủ toàn màn hình.
 */
export default function WebHeader() {
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const menuOpen = menuOpenPath === pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [menuOpen]);

  const headerOnDark = isDarkHeroPath(pathname) && !scrolled && !menuOpen;
  const consultUrl = getCompanyZaloUrl();
  const telHref = getCompanyTelHref();
  const isCurrentPath = (href: string) => {
    if (href.includes('#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`web-header ${styles.header} ${headerOnDark ? styles.onDark : styles.solid} ${scrolled ? styles.scrolled : ''}`}
      data-surface={headerOnDark ? 'ink' : undefined}
    >
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Bia Thầy Tu, về trang chủ">
          <span className={styles.crest}>
            <Image src="/logo.png" alt="" width={96} height={96} priority sizes="96px" />
          </span>
          <span className={styles.wordmark}>Bia Thầy Tu</span>
        </Link>

        <div className={styles.desktop}>
          <div className={styles.utility}>
            {telHref ? (
              <a href={telHref} className={styles.utilityLink}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                {COMPANY_CONFIG.hotline}
              </a>
            ) : null}
            <Link href="/lien-he" className={styles.utilityBox} aria-current={isCurrentPath('/lien-he') ? 'page' : undefined}>
              Showroom
            </Link>
            <a
              href={consultUrl || '/lien-he'}
              className={styles.utilityBox}
              target={consultUrl ? '_blank' : undefined}
              rel={consultUrl ? 'noopener noreferrer' : undefined}
            >
              {t('nav.consult')}
            </a>
            <LanguageSwitcher />
          </div>

          <nav className={styles.nav} aria-label="Điều hướng chính">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
                aria-current={isCurrentPath(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`web-nav-mobile-right ${styles.mobileRight}`}>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpenPath(menuOpen ? null : pathname)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <nav aria-label="Điều hướng chính">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpenPath(null)}
                className={styles.mobileLink}
                aria-current={isCurrentPath(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/lien-he" onClick={() => setMenuOpenPath(null)} className={styles.mobileLink}>
              Showroom
            </Link>
          </nav>
          <Button
            href={consultUrl || '/lien-he'}
            variant="primary"
            className={styles.mobileAction}
            target={consultUrl ? '_blank' : undefined}
            rel={consultUrl ? 'noopener noreferrer' : undefined}
          >
            {t('nav.consult')}
          </Button>
          <div className={styles.mobileFoot}>
            {telHref ? <a href={telHref}>Hotline {COMPANY_CONFIG.hotline}</a> : null}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
