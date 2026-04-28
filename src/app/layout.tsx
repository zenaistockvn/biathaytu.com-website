import type { Metadata } from 'next';
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
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
