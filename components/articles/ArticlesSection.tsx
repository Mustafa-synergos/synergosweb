import { getArticles } from '@/lib/strapi';
import ArticleCard from '@/components/articles/ArticleCard';
import CTA from '@/components/shared/CTA';
import DotsSection from '@/components/shared/DotsSection';

type ArticlesSectionProps = {
  data?: {
    Heading?: string | null;
    CTAText?: string | null;
    CTALink?: string | null;
    PostCount?: number | null;
  } | null;
};

export default async function ArticlesSection({ data }: ArticlesSectionProps = {}) {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  const heading = data?.Heading ?? 'ARTICLES';
  const ctaText = data?.CTAText ?? 'EXPLORE MORE';
  const ctaLink = data?.CTALink ?? '/resources/articles';
  const postCount = data?.PostCount ?? 4;

  try {
    const all = await getArticles();
    articles = all.slice(0, postCount);
  } catch {
    // render empty state
  }

  return (
    <DotsSection className="bg-[#171717] py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-0">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none text-white">
            {heading}
          </h2>
          <CTA displayText={ctaText} hoverText={ctaText} link={ctaLink} />
        </div>

        {/* Article list */}
        {articles.length > 0 ? (
          <div className="border-t border-white/10">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.documentId ?? article.id ?? i}
                article={article}
                index={i}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-white/40">No articles available.</p>
        )}
      </div>
    </DotsSection>
  );
}
