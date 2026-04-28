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
    'nav.products': 'Sản Phẩm',
    'nav.brand': 'Thương Hiệu',
    'nav.knowledge': 'Kiến Thức',
    'nav.contact': 'Liên Hệ',
    'nav.order': 'Đặt Hàng Ngay',
    
    // Hero Section
    'hero.badge': '🇩🇪 Nhập Khẩu Chính Hãng Từ Đức',
    'hero.title.line1': 'Tuyệt Tác',
    'hero.title.line2': 'Bia Thầy Tu',
    'hero.title.highlight': 'Đẳng Cấp Nguyên Bản',
    'hero.description': 'Thưởng thức nghệ thuật ủ bia trên 400 năm từ Tu Viện Ettal. Tuyệt tác bia lúa mì Đức nguyên bản chuẩn Luật Tinh Khiết 1516.',
    'hero.btn.explore': 'Khám Phá Sản Phẩm',
    'hero.btn.quote': 'Báo Giá Sỉ / Đại Lý',
    
    // Trust bar
    'trust.award': 'iTQi 3 Sao 2022',
    'trust.shipping': 'Giao Toàn Quốc',
    'trust.authentic': 'Chính Hãng 100%',
    
    // Footer
    'footer.description': 'Bia Thầy Tu Benediktiner — nhập khẩu chính hãng từ Đức. Giao hàng toàn quốc.',
    'footer.company.title': 'Công Ty',
    'footer.company.about': 'Về Chúng Tôi',
    'footer.company.b2b': 'Khách Hàng Doanh Nghiệp',
    'footer.company.policy': 'Chính Sách & Giao Hàng',
    'footer.contact.title': 'Liên Hệ',
    'footer.contact.hotline': 'Hotline HN: 091.531.2166',
    'footer.contact.time': 'Thứ 2 - Chủ Nhật (9:00 - 21:00)',
    'footer.contact.email': 'info@biathaytu.com',
    'footer.reserved': 'All rights reserved.',
  },
  en: {
    // Header & Navigation
    'nav.products': 'Products',
    'nav.brand': 'Our Brand',
    'nav.knowledge': 'Beer Knowledge',
    'nav.contact': 'Contact Us',
    'nav.order': 'Order Now',
    
    // Hero Section
    'hero.badge': '🇩🇪 100% Imported from Germany',
    'hero.title.line1': 'The Masterpiece',
    'hero.title.line2': 'Monastery Beer',
    'hero.title.highlight': 'Original Class',
    'hero.description': 'Experience the 400-year brewing art from Ettal Monastery. A masterpiece of German wheat beer brewed to the 1516 Purity Law.',
    'hero.btn.explore': 'Explore Products',
    'hero.btn.quote': 'B2B/Wholesale Quote',
    
    // Trust bar
    'trust.award': 'iTQi 3-Star 2022',
    'trust.shipping': 'Nationwide Shipping',
    'trust.authentic': '100% Authentic',
    
    // Footer
    'footer.description': 'Benediktiner Weissbier — officially imported from Germany. Nationwide delivery.',
    'footer.company.title': 'Company',
    'footer.company.about': 'About Us',
    'footer.company.b2b': 'B2B Customers',
    'footer.company.policy': 'Shipping Policy',
    'footer.contact.title': 'Contact',
    'footer.contact.hotline': 'Hotline: +84 91 531 2166',
    'footer.contact.time': 'Mon - Sun (9:00 - 21:00)',
    'footer.contact.email': 'info@biathaytu.com',
    'footer.reserved': 'All rights reserved.',
  },
  de: {
    // Header & Navigation
    'nav.products': 'Produkte',
    'nav.brand': 'Unsere Marke',
    'nav.knowledge': 'Bierwissen',
    'nav.contact': 'Kontakt',
    'nav.order': 'Jetzt Bestellen',
    
    // Hero Section
    'hero.badge': '🇩🇪 100% Importiert aus Deutschland',
    'hero.title.line1': 'Das Meisterwerk',
    'hero.title.line2': 'Klosterbier',
    'hero.title.highlight': 'Originalklasse',
    'hero.description': 'Erleben Sie die 400-jährige Braukunst des Klosters Ettal. Ein Meisterwerk des deutschen Weißbiers nach dem Reinheitsgebot von 1516.',
    'hero.btn.explore': 'Produkte Entdecken',
    'hero.btn.quote': 'B2B/Großhandel',
    
    // Trust bar
    'trust.award': 'iTQi 3-Sterne 2022',
    'trust.shipping': 'Bundesweiter Versand',
    'trust.authentic': '100% Authentisch',
    
    // Footer
    'footer.description': 'Benediktiner Weissbier — offiziell aus Deutschland importiert. Landesweite Lieferung.',
    'footer.company.title': 'Unternehmen',
    'footer.company.about': 'Über Uns',
    'footer.company.b2b': 'B2B Kunden',
    'footer.company.policy': 'Versandbedingungen',
    'footer.contact.title': 'Kontakt',
    'footer.contact.hotline': 'Hotline: +84 91 531 2166',
    'footer.contact.time': 'Mo - So (9:00 - 21:00)',
    'footer.contact.email': 'info@biathaytu.com',
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
