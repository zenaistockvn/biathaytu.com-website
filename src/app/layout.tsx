import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed, Roboto_Serif } from 'next/font/google';

// Theo web chính hãng benediktiner-weissbier.de: Copperplate cho tiêu đề, Barlow Condensed cho chữ.
// Copperplate không có ký tự tiếng Việt nên thay bằng Roboto Serif bản rộng (trục wdth), gần nhất về
// độ rộng và nét. Barlow bản thường cho đoạn văn dài, Barlow Condensed cho menu, nút, nhãn.
const barlow = Barlow({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-condensed',
});

const robotoSerif = Roboto_Serif({
  subsets: ['latin', 'vietnamese'],
  axes: ['wdth'],
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
    <html lang="vi" suppressHydrationWarning className={`${barlow.variable} ${barlowCondensed.variable} ${robotoSerif.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
