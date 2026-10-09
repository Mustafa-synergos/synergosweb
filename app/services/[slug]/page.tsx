import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getMediaUrl, getServiceBySlug, getServices } from '@/lib/strapi';
import { mapServiceDataToService, resolveServiceSections } from '@/lib/map-service';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import ServiceDetail from '@/components/services/ServiceDetail';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const apiServices = await getServices();
  return apiServices
    .map((service) => {
      const raw = service.slug ?? service.Slug ?? '';
      return { slug: raw.startsWith('/services/') ? (raw.split('/').pop() ?? raw) : raw };
    })
    .filter((item) => Boolean(item.slug));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const apiService = await getServiceBySlug(slug);

  if (!apiService) {
    return {
      title: 'Services | Synergos',
      description:
        'Explore a range of services designed to help brands grow and evolve.',
    };
  }

  const title = `${apiService.title ?? apiService.Title ?? 'Services'} | Services | Synergos`;
  const description =
    apiService.shortDescription ?? apiService.Description ??
    'Explore a range of services designed to help brands grow and evolve.';
  const image =
    getMediaUrl(apiService.heroImage) ??
    getMediaUrl(apiService.thumbnail) ??
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/services/${slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const apiService = await getServiceBySlug(slug);

  if (!apiService) {
    notFound();
  }

  const service = mapServiceDataToService(apiService);
  const detail = service.detail;

  if (!detail) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ServiceDetail
        title={service.title}
        detail={detail}
        sections={resolveServiceSections(apiService)}
      />
      <Footer />
    </main>
  );
}
