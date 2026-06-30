import { Suspense } from 'react';
import '../web.css';
import WebHeader from './components/WebHeader';
import WebFooter from './components/WebFooter';
import Toast from './components/Toast';
import FloatingZaloCTA from './components/FloatingZaloCTA';
import FootballCampaignPopup from './components/FootballCampaignPopup';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollRevealObserver from './components/ScrollRevealObserver';
import FacebookPixel from './components/FacebookPixel';
import FacebookMessengerChat from './components/FacebookMessengerChat';
import { LanguageProvider } from './context/LanguageContext';
import JsonLd, { getOrganizationSchema, getWebsiteSchema } from './components/JsonLd';
import type { Metadata } from 'next';

const BASE_URL = 'https://www.biathaytu.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    template: '%s | Bia Thầy Tu',
  },
  description: 'Bia Thầy Tu Benediktiner Weissbier — bia lúa mì Đức nhập khẩu chính hãng từ Tu Viện Ettal, Bavaria. Đạt giải iTQi 3 Sao 2022. Chuẩn Luật Tinh Khiết 1516. Giao hàng toàn quốc.',
  keywords: [
    'bia đức', 'bia nhập khẩu', 'bia thầy tu', 'benediktiner', 'bia weissbier',
    'bia lúa mì đức', 'bia đen đức', 'german beer vietnam', 'bia đức chính hãng',
    'benediktiner weissbier', 'bia tu viện', 'monastery beer', 'bia cao cấp',
    'bia đức hà nội', 'mua bia đức', 'bia đức giá sỉ', 'đại lý bia đức',
  ],
  alternates: {
    canonical: BASE_URL,
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
    description: 'Thưởng thức bia lúa mì Đức từ Tu Viện Ettal 400 năm. Đạt giải iTQi 3 Sao. 100% nhập khẩu nguyên chai. Giao toàn quốc.',
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
    <div className="web-app">
      <LanguageProvider>
        {/* Structured Data for AI / Search Engines */}
        <JsonLd type="organization" data={getOrganizationSchema()} />
        <JsonLd type="website" data={getWebsiteSchema()} />
        <WebHeader />
        <main>{children}</main>
        <WebFooter />
        <FloatingZaloCTA />
        <FootballCampaignPopup />
        <MobileBottomNav />
        <Toast />
        <ScrollRevealObserver />
        <Suspense fallback={null}>
          <FacebookPixel />
          <FacebookMessengerChat />
        </Suspense>
      </LanguageProvider>
    </div>
  );
}
