import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AnchorWay | Medical Transportation Coordination',
  description: 'AI-powered healthcare transportation coordination, live tracking, and facility visibility.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
