import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-serif',
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
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
