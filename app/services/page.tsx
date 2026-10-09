import type { Metadata } from 'next';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceListing from '@/components/services/ServiceListing';
import { getPageBySlug, getServices, getMediaUrl } from '@/lib/strapi';
import type { PageSection } from '@/types/page';
import type { ServiceData } from '@/types/service';
import type { RichTextBlockNode } from '@/types/rich-text';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPageBySlug('services');
    const seo = page?.SeoInfo;

    if (seo?.MetaTitle || seo?.MetaDescription) {
      return {
        title: seo.MetaTitle ?? page?.Title ?? 'Services | Synergos',
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (page?.Title) {
      return { title: `${page.Title} | Synergos` };
    }
  } catch {
    // fall through
  }

  return {
    title: 'Services | Synergos',
    description:
      'Explore a range of services designed to help brands grow and evolve. Web development, social media, SEO, performance marketing, and more.',
  };
}

type ServiceListItem = {
  id: number;
  number: string;
  title: string;
  description: string;
  illustration: string;
  slug: string;
};

function normalizeSlug(slug: string) {
  return slug.startsWith('/services/') ? slug : `/services/${slug}`;
}

function blockText(value?: string | RichTextBlockNode[] | null): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  return value
    .map((block) => {
      if (block.type === 'list') {
        return block.children
          .map((item) => item.children.map((child) => ('text' in child ? child.text : child.children.map((c) => c.text).join(''))).join(''))
          .join('\n');
      }

      return block.children
        .map((child) => ('text' in child ? child.text : child.children.map((c) => c.text).join('')))
        .join('');
    })
    .filter(Boolean)
    .join('\n\n');
}

function mapApiService(service: ServiceData, index: number): ServiceListItem {
  const id = typeof service.id === 'number' ? service.id : index;
  const slug = service.slug ?? service.Slug ?? '';
  return {
    id,
    number: service.Number ?? (service.order ? String(service.order).padStart(2, '0') : String(index + 1).padStart(2, '0')),
    title: service.title ?? service.Title ?? '',
    description: service.shortDescription ?? blockText(service.description) ?? service.Description ?? '',
    illustration:
      getMediaUrl(service.thumbnail) ??
      getMediaUrl(service.Illustration) ??
      service.Illustration?.url ??
      '/images/Service%20listing/icon-btn.svg',
    slug: normalizeSlug(slug),
  };
}

function findHeroSection(sections: PageSection[] | null | undefined) {
  return (sections ?? []).find(
    (section): section is Extract<PageSection, { __component: 'pages.page-hero-section' }> =>
      section.__component === 'pages.page-hero-section',
  );
}

export default async function ServicesPage() {
  const [servicePage, apiServices] = await Promise.all([
    getPageBySlug('services').catch((error) => {
      console.error('Failed to load services page from Strapi:', error);
      return null;
    }),
    getServices().catch((error) => {
      console.error('Failed to load services from Strapi:', error);
      return [] as ServiceData[];
    }),
  ]);

  if (apiServices.length === 0) {
    console.error('[STRAPI SERVICES] API returned zero services.');
  }

  const serviceList: ServiceListItem[] = apiServices.map(mapApiService);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ServiceHero data={findHeroSection(servicePage?.Sections)} />
      <ServiceListing services={serviceList} />
      <Footer />
    </main>
  );
}
