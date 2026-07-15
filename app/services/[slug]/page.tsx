import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { services } from '@/data/services';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import ServiceDetail from '@/components/services/ServiceDetail';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services
    .filter((service): service is typeof service & { slug: string } =>
      Boolean(service.slug && service.slug.startsWith('/services/'))
    )
    .map((service) => ({ slug: service.slug.split('/').pop() ?? service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find(
    (s) => s.slug === `/services/${slug}` || s.slug?.split('/').pop() === slug
  );

  return {
    title: service ? `${service.title} | Services | Synergos` : 'Services | Synergos',
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const service = services.find(
    (s) => s.slug === `/services/${slug}` || s.slug?.split('/').pop() === slug
  );

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ServiceDetail service={service} />
      <Footer />
    </main>
  );
}
