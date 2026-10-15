'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMPANY_CONFIG } from '@/config/company';

export type LanguageCode = 'vi' | 'en' | 'de';

type Translations = {
  [key in LanguageCode]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  vi: {
    // Header & Navigation
    'nav.products': 'Benediktiner',
    'nav.brand': 'Câu chuyện',
    'nav.tasting': 'Cách uống',
    'nav.knowledge': 'Kiến thức',
    'nav.horeca': 'HORECA',
    'nav.contact': 'Liên hệ',
    'nav.consult': 'Liên hệ tư vấn',

    // Hero Section
    'hero.badge': 'Benediktiner, công thức dòng Biển Đức',
    'hero.title.line1': 'Bia Thầy Tu',
    'hero.title.line2': 'Benediktiner Weissbier',
    'hero.description.1': 'Hơn 400 năm truyền thống bia lúa mì của dòng Biển Đức, gắn với Tu viện Ettal.',
    'hero.description.2': 'Ủ tại Lich, bang Hessen, theo công thức gốc.',
    'hero.btn.explore': 'Xem các dòng bia',
    'hero.btn.story': 'Câu chuyện từ Ettal',

    // Trust bar
    'trust.award': 'iTQi 3 sao 2022',
    'trust.shipping': 'Tư vấn toàn quốc',
    'trust.authentic': 'Nhập khẩu trực tiếp',

    // Footer
    'footer.description': 'Bia Thầy Tu Benediktiner, bia Đức nhập khẩu. Thông tin sản phẩm, thương hiệu và tư vấn.',
    'footer.company.title': 'Công ty',
    'footer.company.about': 'Về Bia Thầy Tu',
    'footer.company.b2b': 'Khách hàng doanh nghiệp',
    'footer.company.policy': 'Chính sách và tuân thủ',
    'footer.contact.title': 'Liên hệ',
    'footer.contact.hotline': `Hotline: ${COMPANY_CONFIG.hotline}`,
    'footer.contact.time': `Thứ 2 - Chủ nhật (${COMPANY_CONFIG.supportHours})`,
    'footer.contact.email': 'info@biathaytu.com.vn',
    'footer.reserved': 'All rights reserved.',
  },
  en: {
    // Header & Navigation
    'nav.products': 'Benediktiner',
    'nav.brand': 'Our Story',
    'nav.tasting': 'Enjoyment',
    'nav.knowledge': 'Beer Knowledge',
    'nav.horeca': 'HORECA',
    'nav.contact': 'Contact Us',
    'nav.consult': 'Get Advice',

    // Hero Section
    'hero.badge': 'Benediktiner, Benedictine recipe from Germany',
    'hero.title.line1': 'Bia Thầy Tu',
    'hero.title.line2': 'Benediktiner Weissbier',
    'hero.description.1': 'Over 400 years of wheat beer tradition rooted in Ettal Abbey.',
    'hero.description.2': 'Brewed in Lich according to the original Benedictine recipe.',
    'hero.btn.explore': 'Explore the beers',
    'hero.btn.story': 'The story from Ettal',

    // Trust bar
    'trust.award': 'iTQi 3-Star 2022',
    'trust.shipping': 'Nationwide Consultation',
    'trust.authentic': '100% Authentic',

    // Footer
    'footer.description': 'Benediktiner by Bia Thầy Tu, authentic German imported beer, product information and consultation.',
    'footer.company.title': 'Company',
    'footer.company.about': 'About Us',
    'footer.company.b2b': 'B2B Customers',
    'footer.company.policy': 'Policies & Compliance',
    'footer.contact.title': 'Contact',
    'footer.contact.hotline': `Hotline: ${COMPANY_CONFIG.hotline}`,
    'footer.contact.time': 'Mon - Sun (8:00 - 22:00)',
    'footer.contact.email': 'info@biathaytu.com.vn',
    'footer.reserved': 'All rights reserved.',
  },
  de: {
    // Header & Navigation
    'nav.products': 'Benediktiner',
    'nav.brand': 'Geschichte',
    'nav.tasting': 'Genuss',
    'nav.knowledge': 'Bierwissen',
    'nav.horeca': 'HORECA',
    'nav.contact': 'Kontakt',
    'nav.consult': 'Beratung',

    // Hero Section
    'hero.badge': 'Benediktiner, Benediktinisches Rezept aus Deutschland',
    'hero.title.line1': 'Bia Thầy Tu',
    'hero.title.line2': 'Benediktiner Weissbier',
    'hero.description.1': 'Über 400 Jahre Weißbiertradition mit Wurzeln im Kloster Ettal.',
    'hero.description.2': 'In Lich nach dem originalen Benediktinerrezept gebraut.',
    'hero.btn.explore': 'Biere entdecken',
    'hero.btn.story': 'Die Geschichte aus Ettal',

    // Trust bar
    'trust.award': 'iTQi 3-Sterne 2022',
    'trust.shipping': 'Beratung in ganz Vietnam',
    'trust.authentic': '100% Authentisch',

    // Footer
    'footer.description': 'Benediktiner von Bia Thầy Tu, authentisches deutsches Importbier, Produktinformationen und Beratung.',
    'footer.company.title': 'Unternehmen',
    'footer.company.about': 'Über Uns',
    'footer.company.b2b': 'B2B Kunden',
    'footer.company.policy': 'Richtlinien & Compliance',
    'footer.contact.title': 'Kontakt',
    'footer.contact.hotline': `Hotline: ${COMPANY_CONFIG.hotline}`,
    'footer.contact.time': 'Mo - So (8:00 - 22:00)',
    'footer.contact.email': 'info@biathaytu.com.vn',
    'footer.reserved': 'Alle Rechte vorbehalten.',
  }
};

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('vi');

  useEffect(() => {
    const savedLang = localStorage.getItem('bt_lang') as LanguageCode;
    if (savedLang && ['vi', 'en', 'de'].includes(savedLang)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('bt_lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
