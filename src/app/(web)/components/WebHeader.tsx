'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';

export default function WebHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

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
    { href: '/kien-thuc', label: t('nav.knowledge') },
    { href: '/lien-he', label: t('nav.contact') },
  ];

  const textColor = scrolled ? 'var(--web-text-secondary)' : 'rgba(255,255,255,0.85)';
  const logoColor = scrolled ? 'var(--web-ink)' : '#fff';

  return (
    <header className={`web-header ${scrolled ? 'web-header--solid' : 'web-header--transparent'}`}>
      <div className="container header-inner">
        <Link href="/" className="header-logo" style={{ color: logoColor }}>
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
            <Link key={link.href} href={link.href} className="nav-desktop-link" style={{ color: textColor }}>
              {link.label}
            </Link>
          ))}

          <Button
            href="https://zalo.me/0899191313"
            variant="primary"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('nav.consult')}
          </Button>
          <LanguageSwitcher />
        </nav>

        <div className="web-nav-mobile-right">
          <button
            className="web-nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ color: scrolled ? 'var(--web-ink)' : '#fff' }}
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
              onClick={() => setMenuOpen(false)}
              className="web-mobile-menu-link"
            >
              {link.label}
            </Link>
          ))}
          <Button
            href="https://zalo.me/0899191313"
            variant="primary"
            className="web-mobile-menu-action"
            target="_blank"
            rel="noopener noreferrer"
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
