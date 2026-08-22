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
import ContactTracking from './components/ContactTracking';
import { LanguageProvider } from './context/LanguageContext';
import JsonLd, { getOrganizationSchema, getWebsiteSchema } from './components/JsonLd';
import { BRAND } from '@/lib/brand';
import type { Metadata } from 'next';

const BASE_URL = BRAND.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    template: '%s | Bia Thầy Tu',
  },
  description: 'Khám phá Bia Thầy Tu Benediktiner: câu chuyện Ettal, hương vị bia Đức, cách thưởng thức và tư vấn chính hãng tại Việt Nam.',
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
    description: 'Khám phá Benediktiner Weissbier: câu chuyện Ettal, hương vị, cách thưởng thức và tư vấn chính hãng tại Việt Nam.',
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
    title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Thông tin Benediktiner, Bia Thầy Tu và bia Đức nhập khẩu chính hãng do German Taste phân phối tại Việt Nam.',
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
        <ContactTracking />
        <Suspense fallback={null}>
          <FacebookPixel />
          <FacebookMessengerChat />
        </Suspense>
        <CookieConsent />
        <AgeVerificationGate />
        <MobileUxEnhancer />
      </LanguageProvider>
    </div>
  );
}
