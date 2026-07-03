export type ArticleListingSectionData = {
  __component: 'pages.article-listing-section';
  id?: number;
  HeroHeading: string;
  SectionHeading: string;
  BannerVector?: { url: string; alternativeText?: string | null } | null;
  BannerVectorPath?: string | null;
  DotBackground?: { url: string } | null;
  DotBackgroundPath?: string | null;
};
