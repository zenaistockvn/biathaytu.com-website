'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: '1px solid currentColor',
          borderRadius: 0,
          padding: '2px 8px',
          minHeight: '26px',
          fontFamily: 'var(--font-condensed), sans-serif',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          color: 'inherit',
          transition: 'all 0.2s ease'
        }}
      >
        <span>{currentLang.code.toUpperCase()}</span>
        <svg 
          width="12" height="12" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          backgroundColor: 'var(--web-card-bg)',
          border: '1px solid var(--web-border)',
          borderRadius: 0,
          minWidth: '140px',
          zIndex: 100,
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 16px',
                background: language === lang.code ? 'var(--web-bg-section)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                color: language === lang.code ? 'var(--web-ink)' : 'var(--web-text)',
                fontWeight: language === lang.code ? 600 : 400,
              }}
            >
              <span style={{ fontWeight: 600, minWidth: '22px' }}>{lang.code.toUpperCase()}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
