'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { getCompanyZaloUrl } from '@/config/company';

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
  '/san-pham',
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

  const navLinks = [
    { href: '/san-pham#benediktiner', label: 'Benediktiner' },
    { href: '/san-pham#bia-duc-khac', label: 'Bia Đức tuyển chọn' },
    { href: '/bia-duc-cho-nha-hang-khach-san', label: 'HORECA / Đại lý' },
    { href: '/kien-thuc', label: 'Kiến thức bia Đức' },
  ];

  const hasDarkHero = isDarkHeroPath(pathname);
  const headerOnDark = hasDarkHero && !scrolled && !menuOpen;
  const consultUrl = getCompanyZaloUrl();
  const isCurrentPath = (href: string) => {
    if (href.includes('#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className={`web-header ${headerOnDark ? 'web-header--transparent' : 'web-header--solid'}`}>
      <div className="container header-inner">
        <Link href="/" className="header-logo">
          <Image
            src="/logo.png"
            alt="Bia Thầy Tu Logo"
            width={48}
            height={48}
            priority
          />
          Bia Thầy Tu
        </Link>

        <nav className="web-nav-desktop nav-desktop-links">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-desktop-link"
              aria-current={isCurrentPath(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}

          <Button
            href={consultUrl || '/lien-he'}
            variant="primary"
            size="sm"
            target={consultUrl ? '_blank' : undefined}
            rel={consultUrl ? 'noopener noreferrer' : undefined}
          >
            {t('nav.consult')}
          </Button>
          <LanguageSwitcher />
        </nav>

        <div className="web-nav-mobile-right">
          <button
            className="web-nav-hamburger"
            onClick={() => setMenuOpenPath(menuOpen ? null : pathname)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="web-mobile-menu-overlay">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpenPath(null)}
              className="web-mobile-menu-link"
              aria-current={isCurrentPath(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Button
            href={consultUrl || '/lien-he'}
            variant="primary"
            className="web-mobile-menu-action"
            target={consultUrl ? '_blank' : undefined}
            rel={consultUrl ? 'noopener noreferrer' : undefined}
          >
            {t('nav.consult')}
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
