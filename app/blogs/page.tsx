import type { Metadata } from 'next';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import BlogListingSection from '@/components/blog/BlogListingSection';
import { getBlogsPageEntry } from '@/lib/strapi';
import type { BlogsPageEntryData } from '@/types/blog';
import type { BlogListingSectionData } from '@/types/blog-sections';
import type { PageHeroSectionData } from '@/types/page-hero';

// Listing copy is driven by the single `blogs-page` entry when present.
// These fallbacks render ONLY when the entry cannot be fetched at all.
const FALLBACK_SECTION: BlogListingSectionData = {
  __component: 'pages.blog-listing-section',
  HeroHeading: 'BLOGS',
  SectionHeading: 'LATEST',
  BannerVectorPath: '/images/blog/banner-vector.png',
  DotBackgroundPath: '/images/blog/background-dot.png',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const entry = await getBlogsPageEntry();
    const seo = entry?.SeoInfo;

    if (seo && (seo.MetaTitle || seo.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? 'Blogs | Synergos',
        description: seo.MetaDescription ?? undefined,
      };
    }
  } catch {
    // fall through
  }

  return {
    title: 'Blogs | Synergos',
    description:
      'Discover the brands and organisations that trust Synergos to grow their digital presence.',
  };
}

/**
 * Map the blogs-page `Body` Dynamic Zone onto the listing section shape the
 * existing `BlogListingSection` renders. Bands are matched by `__component`
 * (never position); unknown bands warn (dev) and are skipped.
 */
function toListingSection(entry: BlogsPageEntryData | null): BlogListingSectionData {
  if (!entry?.Body?.length) return FALLBACK_SECTION;

  let hero: PageHeroSectionData | null = null;
  let latestHeading: string | null = null;

  for (const section of entry.Body) {
    if (section.__component === 'pages.page-hero-section') {
      hero = section as PageHeroSectionData;
    } else if (section.__component === 'pages.latest') {
      const heading =
        'Heading' in section && typeof section.Heading === 'string'
          ? section.Heading.trim()
          : '';
      if (heading) latestHeading = heading;
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Blogs] Unknown Dynamic Zone component "${section.__component}" — skipping.`,
      );
    }
  }

  const heroHeading =
    hero?.Heading && hero.Heading.trim()
      ? hero.Heading
      : FALLBACK_SECTION.HeroHeading;

  return {
    __component: 'pages.blog-listing-section',
    HeroHeading: heroHeading,
    SectionHeading: latestHeading ?? FALLBACK_SECTION.SectionHeading,
    BannerVector: hero?.HeroVector?.url
      ? { url: hero.HeroVector.url, alternativeText: null }
      : null,
    BannerVectorPath: FALLBACK_SECTION.BannerVectorPath,
    DotBackgroundPath: FALLBACK_SECTION.DotBackgroundPath,
  };
}

export default async function BlogListingPage() {
  let entry: BlogsPageEntryData | null = null;

  try {
    entry = await getBlogsPageEntry();
  } catch (error) {
    console.error('Failed to load blogs page entry from Strapi:', error);
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <BlogListingSection data={toListingSection(entry)} />
      <Footer />
    </main>
  );
}
