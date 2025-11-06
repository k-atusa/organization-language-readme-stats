import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Organization Language Stats',
  description: 'GitHub organization language statistics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
