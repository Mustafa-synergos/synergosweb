import { getArticlesPaginated, getArticleCategories } from '@/lib/strapi';
import ArticleHero from '@/components/articles/ArticleHero';
import ArticleListingContent from '@/components/articles/ArticleListingContent';
import type { ArticleData } from '@/types/article';
import type { ArticleListingSectionData } from '@/types/article-sections';

type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };

type Props = {
  data?: ArticleListingSectionData | null;
};

export default async function ArticleListingSection({ data }: Props = {}) {
  let articles: ArticleData[] = [];
  let meta: PaginationMeta = { page: 1, pageSize: 11, pageCount: 1, total: 0 };
  let categories: string[] = [];

  try {
    const [result, cats] = await Promise.all([
      getArticlesPaginated(1, 11),
      getArticleCategories(),
    ]);
    articles = result.data ?? [];
    meta = result.meta?.pagination ?? meta;
    categories = cats;
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
      />
    </>
  );
}
