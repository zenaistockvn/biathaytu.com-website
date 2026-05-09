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

export const metadata: Metadata = {
  title: 'AMC × Bia Thầy Tu — AI Marketing Center',
  description: 'Hệ thống sản xuất content marketing thông minh cho Bia Thầy Tu — Premium German Beer',
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
