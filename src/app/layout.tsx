import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';

// Theo phong cách di sản tu viện sang trọng (tương tự Chimay, châu Âu cổ điển):
// Cormorant Garamond cho tiêu đề trang nhã, quý tộc; Plus Jakarta Sans cho nội dung & UI dễ đọc, ấm áp.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
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
    <html lang="vi" suppressHydrationWarning className={`${plusJakartaSans.variable} ${cormorantGaramond.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
