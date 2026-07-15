import { getArticlesPaginated, getArticleCategories } from '@/lib/strapi';
import ArticleHero from '@/components/articles/ArticleHero';
import ArticleListingContent from '@/components/articles/ArticleListingContent';
import { FALLBACK_ARTICLES } from '@/data/articles';
import type { ArticleData } from '@/types/article';
import type { ArticleListingSectionData } from '@/types/article-sections';

type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };

type Props = {
  data?: ArticleListingSectionData | null;
};

function mergeWithFallbackArticles(articles: ArticleData[]) {
  const seen = new Set(articles.map((article) => article.Slug));
  return [
    ...articles,
    ...FALLBACK_ARTICLES.filter((article) => !seen.has(article.Slug)),
  ];
}

function withTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Articles request timed out')), ms);
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}

export default async function ArticleListingSection({ data }: Props = {}) {
  let articles: ArticleData[] = [];
  let meta: PaginationMeta = { page: 1, pageSize: 11, pageCount: 1, total: 0 };
  let categories: string[] = [];

  try {
    const [result, cats] = await withTimeout(
      Promise.all([
        getArticlesPaginated(1, 11),
        getArticleCategories(),
      ])
    );
    articles = result.data ?? [];
    meta = result.meta?.pagination ?? meta;
    categories = cats;
  } catch {
    // render empty state
  }

  const mergedArticles = mergeWithFallbackArticles(articles);
  articles = mergedArticles.slice(0, 9);
  meta = { page: 1, pageSize: 9, pageCount: Math.ceil(mergedArticles.length / 9), total: mergedArticles.length };
  categories = [...new Set([
    ...categories,
    ...mergedArticles.map((article) => article.Category).filter((category): category is string => Boolean(category)),
  ])].sort();

  return (
    <>
      <ArticleHero data={data} />
      <ArticleListingContent
        initialArticles={articles}
        initialMeta={meta}
        categories={categories}
      />
    </>
  );
}
