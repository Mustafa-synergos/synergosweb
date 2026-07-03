import type { Metadata } from 'next';
import { draftMode, headers } from 'next/headers';
import './globals.css';
import LivePreview from '@/components/shared/LivePreview';
import PreviewBanner from '@/components/shared/PreviewBanner';
import SmoothScroll from '../components/home/SmoothScroll';

export const metadata: Metadata = {
  title: 'Synergos | Collaboration Platform',
  description: 'A modern collaboration and services platform built with Next.js and Strapi.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const requestHeaders = await headers();
  const isPreview =
    isDraftMode || requestHeaders.get('x-preview-mode') === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/wsy2gno.css" />
      </head>
      <body>
        <SmoothScroll />
        <LivePreview />
        {isPreview && <PreviewBanner />}
        {children}
      </body>
    </html>
  );
}
