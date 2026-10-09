import { getArticlesPaginated, getArticleCategories } from '@/lib/strapi';
import ArticleHero from '@/components/articles/ArticleHero';
import ArticleListingContent from '@/components/articles/ArticleListingContent';
import type { ArticleData } from '@/types/article';
import type { ArticleListingSectionData } from '@/types/article-sections';

type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };

type Props = {
  data?: ArticleListingSectionData | null;
};

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
  let meta: PaginationMeta = { page: 1, pageSize: 9, pageCount: 1, total: 0 };
  let categories: string[] = [];

  try {
    const [result, cats] = await withTimeout(
      Promise.all([
        getArticlesPaginated(1, 9),
        getArticleCategories(),
      ])
    );
    articles = result.data ?? [];
    meta = result.meta?.pagination ?? meta;
    categories = [...new Set([
      ...cats,
      ...articles.map((article) => article.Category).filter((category): category is string => Boolean(category)),
    ])].sort();
  } catch {
    // render empty state
  }

  return (
    <>
      <ArticleHero data={data} />
      <ArticleListingContent
        initialArticles={articles}
        initialMeta={meta}
        categories={categories}
        sectionHeading={data?.SectionHeading ?? 'LATEST'}
      />
    </>
  );
}
