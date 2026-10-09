import type { Metadata } from 'next';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import PortfolioSection from '@/components/work/PortfolioSection';
import WorkHero from '@/components/work/WorkHero';

export const metadata: Metadata = {
  title: 'Our Work | Synergos',
  description:
    'Explore our portfolio of web & app development, branding, social media, brochures, paid ads, and video projects.',
};

export default function OurWorkPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <WorkHero />
      <PortfolioSection />
      <Footer />
    </main>
  );
}
