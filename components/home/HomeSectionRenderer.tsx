'use client';

import dynamic from 'next/dynamic';

import Hero from '@/components/home/Hero';
import WhoWeAre from '@/components/home/WhoWeAre';
import type { HomePageSection } from '@/types/home-sections';

const AmbitionSection = dynamic(() => import('@/components/home/AmbitionSection'), {
  ssr: false,
});
const SynergyEngine = dynamic(() => import('@/components/home/SynergyEngine'), {
  ssr: false,
});
const StackedServices = dynamic(() => import('@/components/home/StackedServices'), {
  ssr: false,
});
const ExponentialImpactSection = dynamic(
  () => import('@/components/home/ExponentialImpactSection'),
  { ssr: false }
);
const BrandsThatTrustUs = dynamic(
  () => import('@/components/home/BrandsThatTrustUs'),
  { ssr: false }
);
const LatestFromSynergos = dynamic(
  () =>
    import('@/components/home/LatestFromSynergos').then((m) => ({
      default: m.LatestFromSynergos,
    })),
  { ssr: false }
);
const Testimonials = dynamic(
  () =>
    import('@/components/home/Testimonials').then((m) => ({
      default: m.Testimonials,
    })),
  { ssr: false }
);
const BeforeFooterCTA = dynamic(() => import('@/components/home/BeforeFooterCTA'), {
  ssr: false,
});

type HomeSectionRendererProps = {
  section: HomePageSection;
};

export default function HomeSectionRenderer({ section }: HomeSectionRendererProps) {
  switch (section.__component) {
    case 'pages.hero-section':
      return <Hero data={section} />;
    case 'pages.who-we-are-section':
      return <WhoWeAre data={section} />;
    case 'pages.ambition-section':
      return <AmbitionSection data={section} />;
    case 'pages.synergy-engine-section':
      return <SynergyEngine data={section} />;
    case 'pages.services-section':
      return <StackedServices data={section} />;
    case 'pages.exponential-impact-section':
      return <ExponentialImpactSection data={section} />;
    case 'pages.brands-section':
      return <BrandsThatTrustUs data={section} />;
    case 'pages.latest-posts-section':
      return <LatestFromSynergos data={section} />;
    case 'pages.testimonials-section':
      return <Testimonials data={section} />;
    case 'pages.before-footer-cta-section':
      return <BeforeFooterCTA data={section} />;
    default:
      return null;
  }
}
