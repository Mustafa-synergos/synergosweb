import type { Metadata } from 'next';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceListing from '@/components/services/ServiceListing';

export const metadata: Metadata = {
  title: 'Services | Synergos',
  description:
    'Explore a range of services designed to help brands grow and evolve. Web development, social media, SEO, performance marketing, and more.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ServiceHero />
      <ServiceListing />
      <Footer />
    </main>
  );
}
