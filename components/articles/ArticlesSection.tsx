import { getArticles } from '@/lib/strapi';
import ArticleCard from '@/components/articles/ArticleCard';
import CTA from '@/components/shared/CTA';
import DotsSection from '@/components/shared/DotsSection';

export default async function ArticlesSection() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    const all = await getArticles();
    articles = all.slice(0, 4);
  } catch {
    // render empty state
  }

  return (
    <DotsSection className="bg-[#171717] py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-0">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none text-white">
            ARTICLES
          </h2>
          <CTA displayText="EXPLORE MORE" hoverText="EXPLORE MORE" link="/resources/articles" />
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
