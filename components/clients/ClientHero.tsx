import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';

export default function ClientHero() {
  const heroData: PageHeroSectionData = {
    __component: 'pages.page-hero-section',
    Heading: 'WHO WE\nWORK WITH',
    HeadingLayout: 'multiline',
    HeadingClassName:
      "font-['clother',sans-serif] text-[36px] font-bold uppercase leading-[42px] tracking-normal sm:text-[52px] sm:leading-[70px] lg:text-[80px] lg:leading-[90px]",
    HeroVectorPath: '/images/Client/who-we-work.svg',
    BannerTopPath: '/images/page-hero/banner-vector-right.png',
    BannerBottomPath: '/images/page-hero/banner-vector-left.png',
    ShowScrollIndicator: true,
  };

  return <PageHeroSection data={heroData} />;
}
