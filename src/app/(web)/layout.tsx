import { Suspense } from 'react';
import '../web.css';
import '../mobile-overrides.css';
import '../brand-consistency.css';
import WebHeader from './components/WebHeader';
import WebFooter from './components/WebFooter';
import Toast from './components/Toast';
import FloatingZaloCTA from './components/FloatingZaloCTA';
import MobileBottomNav from './components/MobileBottomNav';
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

// Runs before .web-app is parsed/painted. Human visitors without the current
// age-verification cookie see an opaque pre-paint screen, so site content never
// flashes before the client gate mounts. Google/Bing crawlers are explicitly
// bypassed and continue receiving the normal SSR/SSG content for SEO.
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
    default: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    template: '%s | Bia Thầy Tu',
  },
  description: 'Bia Thầy Tu Benediktiner Weissbier — bia Đức nhập khẩu chính hãng từ Tu Viện Ettal, Bavaria. Thông tin sản phẩm, nguồn gốc, hương vị, văn hóa bia Đức và tư vấn.',
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
    title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Khám phá Benediktiner Weissbier và các dòng bia Đức nhập khẩu chính hãng: nguồn gốc, hương vị, cách thưởng thức và thông tin tư vấn sản phẩm.',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Thông tin về Bia Thầy Tu, Benediktiner và bia Đức nhập khẩu chính hãng tại Việt Nam.',
    images: ['/images/sanh_bia_duc_cover.png'],
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

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: AGE_GATE_PREPAINT_SCRIPT }} />
      <div className="web-app">
        <LanguageProvider>
          <a href="#main-content" className="skip-link">Bỏ qua tới nội dung chính</a>
          <JsonLd type="organization" data={getOrganizationSchema()} />
          <JsonLd type="website" data={getWebsiteSchema()} />
          <WebHeader />
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
