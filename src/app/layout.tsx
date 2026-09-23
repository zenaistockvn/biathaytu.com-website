import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed, Montserrat } from 'next/font/google';

// Theo tài liệu chiến dịch chính hãng Benediktiner (Copperplate Bold + Trade Gothic Condensed).
// Hai font gốc là font thương mại, không có dấu tiếng Việt; đây là bản gần nhất trên Google Fonts.
const barlow = Barlow({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-condensed',
});

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const BASE_URL = 'https://www.biathaytu.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Bia Thầy Tu, Bia Đức Nhập Khẩu Chính Hãng',
  description:
    'Khám phá Bia Thầy Tu Benediktiner: nguồn gốc Ettal, hơn 400 năm truyền thống, hương vị bia Đức và thông tin tư vấn tại Việt Nam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${barlow.variable} ${barlowCondensed.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
