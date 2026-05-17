'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';

export default function WebHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/san-pham', label: t('nav.products') },
    { href: '/thuong-hieu', label: t('nav.brand') },
    { href: '/kien-thuc', label: t('nav.knowledge') },
    { href: '/lien-he', label: t('nav.contact') },
  ];

  const textColor = scrolled ? 'var(--web-text-secondary)' : 'rgba(255,255,255,0.85)';
  const logoColor = scrolled ? 'var(--web-navy)' : '#fff';
  const cartIconColor = scrolled ? 'var(--web-navy)' : '#fff';
  
  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <header className={`web-header ${scrolled ? 'web-header--solid' : 'web-header--transparent'}`}>
      <div className="container header-inner">
        {/* LOGO */}
        <Link href="/" className="header-logo" style={{ color: logoColor }}>
          <Image 
            src="/logo.jpg" 
            alt="Bia Thầy Tu Logo" 
            width={48} 
            height={48} 
            priority 
          />
          Bia Thầy Tu
        </Link>

        {/* Desktop NAV */}
        <nav className="web-nav-desktop nav-desktop-links">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="nav-desktop-link" style={{ color: textColor }}>
              {link.label}
            </Link>
          ))}
          
          {/* Cart Icon */}
          <Link href="/dat-hang" className="cart-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cartIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {mounted && totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          <Button 
            href="https://zalo.me/biathaytu"
            variant="primary"
            size="sm"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {t('nav.order')}
          </Button>
          <LanguageSwitcher />
        </nav>

        {/* Mobile Nav Right Area */}
        <div className="web-nav-mobile-right">
          <Link href="/dat-hang" className="cart-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cartIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {mounted && totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button 
            className="web-nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ color: scrolled ? 'var(--web-navy)' : '#fff' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="web-mobile-menu-overlay">
          {navLinks.map(link => (
            <Link 
              key={link.href} href={link.href} 
              onClick={() => setMenuOpen(false)}
              className="web-mobile-menu-link"
            >
              {link.label}
            </Link>
          ))}
          <Button 
            href="https://zalo.me/biathaytu"
            variant="primary"
            className="web-mobile-menu-action"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {t('nav.order')}
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
