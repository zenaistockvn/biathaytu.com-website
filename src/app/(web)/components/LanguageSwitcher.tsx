'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

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

  // `language-switcher` giữ lại làm móc: WebHeader.module.css nới vùng chạm cho nút này.
  return (
    <div className={`language-switcher ${styles.root}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Ngôn ngữ: ${currentLang.label}`}
      >
        <span>{currentLang.code.toUpperCase()}</span>
        <svg
          className={styles.chevron}
          data-open={isOpen}
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {languages.map((lang) => (
            <button
              type="button"
              key={lang.code}
              className={styles.option}
              aria-pressed={language === lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <span className={styles.code}>{lang.code.toUpperCase()}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
