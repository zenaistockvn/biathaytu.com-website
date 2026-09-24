import type { Metadata } from 'next';
import { preload } from 'react-dom';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import './fonts.css';

// Theo web chính hãng benediktiner-weissbier.de: Copperplate cho tiêu đề, Barlow Condensed cho chữ.
// Copperplate không có ký tự tiếng Việt nên thay bằng Roboto Serif bản rộng 125%, gần nhất về
// độ rộng và nét (tự phục vụ bản đã cắt gọn, xem fonts.css). Barlow bản thường cho đoạn văn dài,
// Barlow Condensed cho menu, nút, nhãn. Chỉ nạp những độ đậm web thực sự dùng.
const barlow = Barlow({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-sans',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-condensed',
});

const BASE_URL = 'https://www.biathaytu.com.vn';

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
  // Tiêu đề lớn đầu trang dùng font này nên tải sớm, cùng lúc với CSS.
  preload('/fonts/roboto-serif-w125-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  preload('/fonts/roboto-serif-w125-vietnamese.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  return (
    <html lang="vi" suppressHydrationWarning className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
