import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import DynamicPageSections from '@/components/shared/DynamicPageSections';
import { getPreviewContext } from '@/lib/preview-server';
import { getPageBySlug } from '@/lib/strapi';
import type { PageData, PageSection } from '@/types/page';
import { DEFAULT_THANK_YOU_SECTION } from '@/types/thank-you';
import type { BlogListingSectionData } from '@/types/blog-sections';

const DEFAULT_BLOG_SECTION: BlogListingSectionData = {
  __component: 'pages.blog-listing-section',
  HeroHeading: 'BLOGS',
  SectionHeading: 'LATEST',
  BannerVectorPath: '/images/blog/banner-vector.png',
  DotBackgroundPath: '/images/blog/background-dot.png',
};

const SECTION_FALLBACKS: Record<string, PageSection[]> = {
  'thank-you': [DEFAULT_THANK_YOU_SECTION],
  thankyou: [DEFAULT_THANK_YOU_SECTION],
  blog: [DEFAULT_BLOG_SECTION],
};

type CmsPageProps = {
  slug: string;
  className?: string;
  prefetchedPage?: PageData | null;
};

export async function buildCmsPageMetadata(slug: string): Promise<Metadata> {
  try {
    const page = await getPageBySlug(slug);
    const seo = page?.SeoInfo;

    if (page && (seo?.MetaTitle || seo?.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? page.Title,
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (page?.Title) {
      return { title: `${page.Title} | Synergos` };
    }
  } catch {
    // fall through
  }

  const fallback = SECTION_FALLBACKS[slug]?.[0];
  if (fallback && 'Message' in fallback) {
    return {
      title: 'Thank You | Synergos',
      description: fallback.Message,
    };
  }

  return { title: 'Synergos' };
}

export default async function CmsPage({
  slug,
  className = 'bg-black text-white',
  prefetchedPage = null,
}: CmsPageProps) {
  const { isPreview } = await getPreviewContext();
  let page = prefetchedPage;

  if (!page) {
    try {
      page = await getPageBySlug(slug);
    } catch (error) {
      console.error(`Failed to load page "${slug}" from Strapi:`, error);
    }
  }

  const sections = page?.Sections?.length
    ? page.Sections
    : SECTION_FALLBACKS[slug];

  if (!page && !sections?.length && slug !== 'home' && !isPreview) {
    notFound();
  }

  return (
    <main className={className}>
      <Navbar />
      <DynamicPageSections sections={sections} />
      <Footer />
    </main>
  );
}
