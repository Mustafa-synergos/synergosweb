import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';

export default function ServiceHero() {
  const heroData: PageHeroSectionData = {
    __component: 'pages.page-hero-section',
    Heading: 'SOLUTIONS DESIGNED\nFOR YOUR GROWTH',
    HeadingLayout: 'multiline',
    HeadingClassName:
      "font-['clother',sans-serif] text-[36px] font-bold uppercase leading-[42px] tracking-normal sm:text-[52px] sm:leading-[70px] lg:text-[80px] lg:leading-[90px]",
    HeroVectorPath: '/images/Service%20listing/hero-vector.svg',
    BannerTopPath: '/images/page-hero/banner-vector-right.png',
    BannerBottomPath: '/images/page-hero/banner-vector-left.png',
    ShowScrollIndicator: true,
  };

  return <PageHeroSection data={heroData} />;
}
