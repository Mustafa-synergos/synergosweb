import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ArticleDetail from '@/components/articles/ArticleDetail';
import { getArticleBySlug, getArticles } from '@/lib/strapi';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((article) => ({ slug: article.Slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return {};
    return {
      title: article.SeoInfo?.MetaTitle ?? `${article.Title} | Synergos`,
      description: article.SeoInfo?.MetaDescription ?? article.Excerpt ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof getArticleBySlug>> | null = null;
  let allArticles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    [article, allArticles] = await Promise.all([
      getArticleBySlug(slug),
      getArticles(),
    ]);
  } catch {
    // keep defaults
  }

  if (!article) notFound();

  const related = (allArticles ?? [])
    .filter((item) => item.Slug !== slug)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <Navbar />
      <ArticleDetail article={article} related={related} />
      <Footer />
    </main>
  );
}
