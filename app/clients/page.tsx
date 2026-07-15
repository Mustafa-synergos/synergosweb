import type { Metadata } from 'next';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ClientHero from '@/components/clients/ClientHero';
import ClientListing from '@/components/clients/ClientListing';

export const metadata: Metadata = {
  title: 'Clients | Synergos',
  description:
    'Discover the brands and organisations that trust Synergos to grow their digital presence.',
};

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ClientHero />
      <ClientListing />
      <Footer />
    </main>
  );
}
