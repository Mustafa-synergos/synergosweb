import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import SmoothScroll from '../components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Synergos | Collaboration Platform',
  description: 'A modern collaboration and services platform built with Next.js and Strapi.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/wsy2gno.css" />
      </head>
      <body>
        <SmoothScroll />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
