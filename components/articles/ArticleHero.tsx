import PageHeroSection from '@/components/shared/PageHeroSection';
import { getMediaUrl } from '@/lib/strapi-media';
import type { ArticleListingSectionData } from '@/types/article-sections';
import type { PageHeroSectionData } from '@/types/page-hero';

type Props = {
  data?: ArticleListingSectionData | null;
};

export default function ArticleHero({ data }: Props) {
  const heroData: PageHeroSectionData = {
    __component: 'pages.page-hero-section',
    Heading: data?.HeroHeading ?? 'ARTICLES',
    HeadingLayout: 'single',
    HeroVectorPath:
      (data?.BannerVector ? getMediaUrl(data.BannerVector) : data?.BannerVectorPath) ??
      '/images/bulb-article.svg',
    BannerTopPath: '/images/page-hero/banner-vector-right.png',
    BannerBottomPath: '/images/page-hero/banner-vector-left.png',
    ShowScrollIndicator: true,
  };

  return <PageHeroSection data={heroData} />;
}
