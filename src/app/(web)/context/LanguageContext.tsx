'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    'nav.brand': 'Câu Chuyện',
    'nav.tasting': 'Thưởng Thức',
    'nav.knowledge': 'Kiến Thức',
    'nav.horeca': 'HORECA',
    'nav.contact': 'Liên Hệ',
    'nav.consult': 'Liên Hệ Tư Vấn',

    // Hero Section
    'hero.badge': 'Benediktiner · Công thức Benedictine từ Đức',
    'hero.title.line1': 'Bia Thầy Tu',
    'hero.title.line2': 'Một khoảng lặng nguyên bản',
    'hero.description.1': 'Hơn 400 năm truyền thống bia lúa mì khởi nguồn từ Tu viện Ettal.',
    'hero.description.2': 'Được nấu tại Lich theo công thức Benedictine nguyên bản.',
    'hero.btn.explore': 'Khám phá hương vị',
    'hero.btn.story': 'Câu chuyện từ Ettal',

    // Trust bar
    'trust.award': 'iTQi 3 Sao 2022',
    'trust.shipping': 'Tư Vấn Toàn Quốc',
    'trust.authentic': 'Chính Hãng 100%',

    // Footer
    'footer.description': 'Bia Thầy Tu Benediktiner — bia Đức nhập khẩu chính hãng. Thông tin sản phẩm, thương hiệu và tư vấn.',
    'footer.company.title': 'Công Ty',
    'footer.company.about': 'Về Chúng Tôi',
    'footer.company.b2b': 'Khách Hàng Doanh Nghiệp',
    'footer.company.policy': 'Chính Sách & Tuân Thủ',
    'footer.contact.title': 'Liên Hệ',
    'footer.contact.hotline': 'Hotline: 0915 31 21 66',
    'footer.contact.time': 'Thứ 2 - Chủ Nhật (9:00 - 21:00)',
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
    'hero.badge': 'Benediktiner · Benedictine recipe from Germany',
    'hero.title.line1': 'Bia Thầy Tu',
    'hero.title.line2': 'An original moment of calm',
    'hero.description.1': 'Over 400 years of wheat beer tradition rooted in Ettal Abbey.',
    'hero.description.2': 'Brewed in Lich according to the original Benedictine recipe.',
    'hero.btn.explore': 'Explore the beers',
    'hero.btn.story': 'The story from Ettal',

    // Trust bar
    'trust.award': 'iTQi 3-Star 2022',
    'trust.shipping': 'Nationwide Consultation',
    'trust.authentic': '100% Authentic',

    // Footer
    'footer.description': 'Benediktiner by Bia Thầy Tu — authentic German imported beer, product information and consultation.',
    'footer.company.title': 'Company',
    'footer.company.about': 'About Us',
    'footer.company.b2b': 'B2B Customers',
    'footer.company.policy': 'Policies & Compliance',
    'footer.contact.title': 'Contact',
    'footer.contact.hotline': 'Hotline: +84 915 31 21 66',
    'footer.contact.time': 'Mon - Sun (9:00 - 21:00)',
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
    'hero.badge': 'Benediktiner · Benediktinisches Rezept aus Deutschland',
    'hero.title.line1': 'Bia Thầy Tu',
    'hero.title.line2': 'Ein ursprünglicher Moment der Ruhe',
    'hero.description.1': 'Über 400 Jahre Weißbiertradition mit Wurzeln im Kloster Ettal.',
    'hero.description.2': 'In Lich nach dem originalen Benediktinerrezept gebraut.',
    'hero.btn.explore': 'Biere entdecken',
    'hero.btn.story': 'Die Geschichte aus Ettal',

    // Trust bar
    'trust.award': 'iTQi 3-Sterne 2022',
    'trust.shipping': 'Beratung in ganz Vietnam',
    'trust.authentic': '100% Authentisch',

    // Footer
    'footer.description': 'Benediktiner von Bia Thầy Tu — authentisches deutsches Importbier, Produktinformationen und Beratung.',
    'footer.company.title': 'Unternehmen',
    'footer.company.about': 'Über Uns',
    'footer.company.b2b': 'B2B Kunden',
    'footer.company.policy': 'Richtlinien & Compliance',
    'footer.contact.title': 'Kontakt',
    'footer.contact.hotline': 'Hotline: +84 915 31 21 66',
    'footer.contact.time': 'Mo - So (9:00 - 21:00)',
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
