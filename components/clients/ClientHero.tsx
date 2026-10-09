import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';

const FALLBACK_HERO: PageHeroSectionData = {
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

export default function ClientHero({
  data,
}: {
  /** CMS hero band (`pages.page-hero-section` from the section entry's `body`). */
  data?: PageHeroSectionData | null;
}) {
  if (!data) return <PageHeroSection data={FALLBACK_HERO} />;

  // CMS copy wins; null CMS design paths fall back to the existing assets
  // (null must never override a fallback path with nothing).
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
