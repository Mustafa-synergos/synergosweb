import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';
import { getMediaUrl } from '@/lib/strapi-media';
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/strapi';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const caseStudies = await getCaseStudies();
    return caseStudies
      .map((item) => ({ slug: item.Slug }))
      .filter((item) => Boolean(item.slug));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const caseStudy = await getCaseStudyBySlug(slug);
    const seo = caseStudy?.SeoInfo;

    if (caseStudy && (seo?.MetaTitle || seo?.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? caseStudy.Title,
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (caseStudy?.Title) {
      return { title: `${caseStudy.Title} | Synergos` };
    }
  } catch {
    // fall through
  }

  return { title: 'Case Study | Synergos' };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let caseStudy = null;

  try {
    caseStudy = await getCaseStudyBySlug(slug);
  } catch (error) {
    console.error(`Failed to load case study "${slug}" from Strapi:`, error);
  }

  if (!caseStudy) {
    notFound();
  }

  const heroData: PageHeroSectionData = {
    __component: 'pages.page-hero-section',
    Heading: caseStudy.Title,
    HeadingLayout: 'single',
    HeroVectorPath: getMediaUrl(caseStudy.FeaturedImage) ?? '/images/about/banner-vector-1.png',
    BannerTopPath: '/images/page-hero/banner-vector-right.png',
    BannerBottomPath: '/images/page-hero/banner-vector-left.png',
    ShowScrollIndicator: false,
  };

  const featuredImageUrl = getMediaUrl(caseStudy.FeaturedImage);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHeroSection data={heroData} />

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-8 sm:px-8">
        {caseStudy.Category && (
          <p className="text-sm uppercase tracking-[0.28em] text-[#ff202a]">
            {caseStudy.Category}
          </p>
        )}

        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{caseStudy.Title}</h1>

        {caseStudy.Excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-[#AEAEAE]">{caseStudy.Excerpt}</p>
        )}

        {featuredImageUrl && (
          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-[16px]">
            <Image
              src={featuredImageUrl}
              alt={caseStudy.FeaturedImage?.alternativeText ?? caseStudy.Title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 896px, 90vw"
              unoptimized={featuredImageUrl.startsWith('http')}
              priority
            />
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
