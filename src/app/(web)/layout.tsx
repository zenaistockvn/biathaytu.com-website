import { Suspense } from 'react';
import '../web.css';
import '../mobile-overrides.css';
import '../brand-consistency.css';
import '../editorial-pages.css';
import WebHeader from './components/WebHeader';
import WebFooter from './components/WebFooter';
import Toast from './components/Toast';
import FloatingZaloCTA from './components/FloatingZaloCTA';
import MobileBottomNav from './components/MobileBottomNav';
import CatalogStickyNav from './components/CatalogStickyNav';
import ScrollRevealObserver from './components/ScrollRevealObserver';
import FacebookPixel from './components/FacebookPixel';
import FacebookMessengerChat from './components/FacebookMessengerChat';
import AgeVerificationGate from './components/AgeVerificationGate';
import MobileUxEnhancer from './components/MobileUxEnhancer';
import CookieConsent from './components/CookieConsent';
import { LanguageProvider } from './context/LanguageContext';
import JsonLd, { getOrganizationSchema, getWebsiteSchema } from './components/JsonLd';
import { POLICY_VERSION, STORAGE_KEYS } from '@/constants/compliance';
import type { Metadata } from 'next';

const BASE_URL = 'https://www.biathaytu.com';

const AGE_GATE_PREPAINT_SCRIPT = `
(function () {
  try {
    var path = window.location.pathname;
    var exempt = [
      '/chinh-sach-bao-mat',
      '/chinh-sach-cookie',
      '/chinh-sach-kiem-soat-do-tuoi',
      '/chua-du-tuoi'
    ].indexOf(path) !== -1;
    var ua = window.navigator.userAgent || '';
    var crawler = /(googlebot|google-inspectiontool|googleother|google-extended|storebot-google|adsbot-google|mediapartners-google|bingbot|bingpreview)/i.test(ua);
    var cookiePair = '${STORAGE_KEYS.AGE_VERIFIED}=' + encodeURIComponent('${POLICY_VERSION}');
    var verified = document.cookie.split(';').some(function (item) {
      return item.trim() === cookiePair;
    });

    if (!exempt && !crawler && !verified) {
      document.documentElement.setAttribute('data-age-gate', 'pending');
      var style = document.createElement('style');
      style.id = 'age-gate-prepaint-style';
      style.textContent = 'html[data-age-gate="pending"] body{background:#0D1911!important}html[data-age-gate="pending"] .web-app{visibility:hidden!important}';
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (error) {
    document.documentElement.setAttribute('data-age-gate', 'pending');
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bia Thầy Tu Benediktiner, Bia Đức Nhập Khẩu Chính Hãng',
    template: '%s | Bia Thầy Tu',
  },
  description: 'Khám phá Bia Thầy Tu Benediktiner: nguồn gốc Ettal, hơn 400 năm truyền thống, hương vị bia Đức và thông tin tư vấn tại Việt Nam.',
  keywords: [
    'bia đức nhập khẩu', 'bia nhập khẩu', 'bia thầy tu', 'benediktiner', 'bia weissbier',
    'bia lúa mì đức', 'bia đen đức', 'german beer vietnam', 'bia đức chính hãng',
    'benediktiner weissbier', 'bia tu viện', 'monastery beer', 'bia cao cấp',
    'bia đức hà nội', 'thông tin bia đức', 'bia đức cho horeca', 'đại lý bia đức',
  ],
  alternates: {
    languages: {
      'vi-VN': BASE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: BASE_URL,
    siteName: 'Bia Thầy Tu',
    title: 'Bia Thầy Tu Benediktiner, Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Khám phá Benediktiner Weissbier: nguồn gốc Ettal, hương vị, cách thưởng thức và thông tin tư vấn tại Việt Nam.',
    images: [
      {
        url: '/images/brand/benediktiner-official/home-hero.jpg',
        width: 1920,
        height: 969,
        alt: 'Benediktiner Weissbier trước khung cảnh Tu viện Ettal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner, Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Thông tin về Bia Thầy Tu, Benediktiner và bia Đức nhập khẩu chính hãng tại Việt Nam.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '9dWxOwmLmMviXrwSDtqj6bCmrwFaewSUQ6HY4K7ByPk',
  },
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: AGE_GATE_PREPAINT_SCRIPT }} />
      <div className="web-app">
        <LanguageProvider>
          <a href="#main-content" className="skip-link">Bỏ qua tới nội dung chính</a>
          <JsonLd type="organization" data={getOrganizationSchema()} />
          <JsonLd type="website" data={getWebsiteSchema()} />
          <WebHeader />
          <CatalogStickyNav />
          <main id="main-content">{children}</main>
          <WebFooter />
          <FloatingZaloCTA />
          <MobileBottomNav />
          <Toast />
          <ScrollRevealObserver />
          <Suspense fallback={null}>
            <FacebookPixel />
            <FacebookMessengerChat />
          </Suspense>
          <CookieConsent />
          <AgeVerificationGate />
          <MobileUxEnhancer />
        </LanguageProvider>
      </div>
    </>
  );
}
