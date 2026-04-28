'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useCartStore } from '@/stores/useCartStore';

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
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '72px' 
      }}>
        {/* LOGO */}
        <Link href="/" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: "'Playfair Display', serif", 
          fontSize: '24px', 
          fontWeight: 800,
          color: logoColor,
          letterSpacing: '-0.5px',
          transition: 'color 0.3s ease',
        }}>
          <Image 
            src="/logo.jpg" 
            alt="Bia Thầy Tu Logo" 
            width={48} 
            height={48} 
            priority 
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          Bia Thầy Tu
        </Link>

        {/* Desktop NAV */}
        <nav className="web-nav-desktop" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ 
              fontWeight: 500, fontSize: '14px',
              letterSpacing: '0.3px', color: textColor,
              transition: 'color 0.3s ease',
            }}>{link.label}</Link>
          ))}
          
          {/* Cart Icon */}
          <Link href="/dat-hang" className="cart-icon-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cartIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s ease' }}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {mounted && totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          <a 
            href="https://zalo.me/biathaytu"
            target="_blank" rel="noopener noreferrer"
            className="btn-primary" 
            style={{ padding: '10px 22px', fontSize: '13px' }}
          >
            {t('nav.order')}
          </a>
          <LanguageSwitcher />
        </nav>

        {/* Mobile Nav Right Area */}
        <div className="web-nav-mobile-right" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
          <Link href="/dat-hang" className="cart-icon-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px', fontSize: '24px',
              color: scrolled ? 'var(--web-navy)' : '#fff',
              transition: 'color 0.3s ease',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="web-mobile-menu" style={{
          position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(254, 252, 248, 0.98)',
          backdropFilter: 'blur(12px)',
          padding: '24px 20px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          zIndex: 49, animation: 'fadeIn 0.2s ease',
        }}>
          {navLinks.map(link => (
            <Link 
              key={link.href} href={link.href} 
              onClick={() => setMenuOpen(false)}
              style={{ 
                padding: '16px 0', fontSize: '18px', fontWeight: 600,
                color: 'var(--web-text)', borderBottom: '1px solid var(--web-border)',
                display: 'block',
              }}
            >{link.label}</Link>
          ))}
          <a 
            href="https://zalo.me/biathaytu"
            target="_blank" rel="noopener noreferrer"
            className="btn-primary" 
            style={{ padding: '16px', fontSize: '16px', textAlign: 'center', marginTop: '16px', marginBottom: '16px' }}
          >
            {t('nav.order')}
          </a>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
