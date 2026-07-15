import type { Metadata } from 'next';

import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Case Studies | Synergos',
    description:
      'Explore how Synergos helps brands grow through strategy, storytelling, and delivery.',
  };
}

const HERO_DATA: PageHeroSectionData = {
  __component: 'pages.page-hero-section',
  Heading: 'CASE\nSTUDIES',
  HeadingLayout: 'multiline',
  HeroVectorPath: '/images/about/banner-vector-1.png',
  BannerTopPath: '/images/page-hero/banner-vector-right.png',
  BannerBottomPath: '/images/page-hero/banner-vector-left.png',
  ShowScrollIndicator: true,
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <PageHeroSection data={HERO_DATA} />
      <CaseStudiesSection showCta={false} limit={100} />
      <Footer />
    </main>
  );
}
