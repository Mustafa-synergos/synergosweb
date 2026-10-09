import type { Metadata } from 'next';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ClientHero from '@/components/clients/ClientHero';
import ClientListing from '@/components/clients/ClientListing';
import { getClientSection, getClientCategories, getClients } from '@/lib/strapi';
import type { ClientFilterOption } from '@/types/client';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const section = await getClientSection();
    const seo = section?.seo;

    if (seo && (seo.MetaTitle || seo.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? 'Clients | Synergos',
        description: seo.MetaDescription ?? undefined,
      };
    }
  } catch {
    // fall through
  }

  return {
    title: 'Clients | Synergos',
    description:
      'Discover the brands and organisations that trust Synergos to grow their digital presence.',
  };
}

export default async function ClientsPage() {
  const [section, categories, clientsData] = await Promise.all([
    getClientSection().catch(() => null),
    getClientCategories().catch(() => []),
    getClients().catch(() => ({ clients: [], total: 0 })),
  ]);

  const filterOptions: ClientFilterOption[] = [
    { label: 'All', value: 'all' },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug,
    })),
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ClientHero data={section?.hero} />
      <ClientListing
        heading={section?.heading ?? 'TRUSTED BY'}
        description={section?.description ?? null}
        categories={filterOptions}
        clients={clientsData.clients}
        postCount={clientsData.total}
      />
      <Footer />
    </main>
  );
}
