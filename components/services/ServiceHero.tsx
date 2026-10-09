import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';

const FALLBACK_HERO: PageHeroSectionData = {
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

export default function ServiceHero({
  data,
}: {
  /** CMS hero band (the service `page` entry's `Sections`, UID-matched). */
  data?: PageHeroSectionData | null;
}) {
  if (!data) return <PageHeroSection data={FALLBACK_HERO} />;

  return (
    <PageHeroSection
      data={{
        ...FALLBACK_HERO,
        Heading:
          typeof data.Heading === 'string' && data.Heading.trim()
            ? data.Heading
            : FALLBACK_HERO.Heading,
        HeadingLayout: data.HeadingLayout ?? FALLBACK_HERO.HeadingLayout,
        HeroVector: data.HeroVector ?? null,
        HeroVectorPath: data.HeroVectorPath ?? FALLBACK_HERO.HeroVectorPath,
        BannerTop: data.BannerTop ?? null,
        BannerTopPath: data.BannerTopPath ?? FALLBACK_HERO.BannerTopPath,
        BannerBottom: data.BannerBottom ?? null,
        BannerBottomPath:
          data.BannerBottomPath ?? FALLBACK_HERO.BannerBottomPath,
        ShowScrollIndicator:
          data.ShowScrollIndicator ?? FALLBACK_HERO.ShowScrollIndicator,
      }}
    />
  );
}
