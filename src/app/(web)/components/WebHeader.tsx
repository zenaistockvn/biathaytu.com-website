'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { getCompanyZaloUrl } from '@/config/company';

const DARK_HERO_PATHS = new Set(['/', '/kien-thuc']);

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
    { href: '/san-pham', label: t('nav.products') },
    { href: '/thuong-hieu', label: t('nav.brand') },
    { href: '/huong-dan-rot-bia-lua-mi', label: t('nav.tasting') },
    { href: '/kien-thuc', label: t('nav.knowledge') },
    { href: '/bia-duc-cho-nha-hang-khach-san', label: t('nav.horeca') },
  ];

  const hasDarkHero = DARK_HERO_PATHS.has(pathname);
  const headerOnDark = hasDarkHero && !scrolled && !menuOpen;
  const consultUrl = getCompanyZaloUrl();
  const isCurrentPath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
            {menuOpen ? '✕' : '☰'}
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
