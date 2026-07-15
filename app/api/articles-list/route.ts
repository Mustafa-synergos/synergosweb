import { NextRequest, NextResponse } from 'next/server';
import { FALLBACK_ARTICLES } from '@/data/articles';
import { getArticlesPaginated, getArticlesOffset } from '@/lib/strapi';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') ?? undefined;
  const fallback = category
    ? FALLBACK_ARTICLES.filter((article) => article.Category === category)
    : FALLBACK_ARTICLES;

  function mergeWithFallback<T extends typeof FALLBACK_ARTICLES>(articles: T) {
    const seen = new Set(articles.map((article) => article.Slug));
    return [
      ...articles,
      ...fallback.filter((article) => !seen.has(article.Slug)),
    ];
  }

  try {
    const startParam = searchParams.get('start');

    if (startParam !== null) {
      const start = Number(startParam);
      const limit = Number(searchParams.get('limit') ?? 9);
      const result = await getArticlesOffset(start, limit, category);
      const merged = mergeWithFallback(result.data);
      return NextResponse.json({
        data: merged.slice(start, start + limit),
        total: merged.length,
      });
    }

    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('pageSize') ?? 9);
    const result = await getArticlesPaginated(page, pageSize, category);
    const merged = mergeWithFallback(result.data ?? []);
    const start = (page - 1) * pageSize;
    return NextResponse.json({
      data: merged.slice(start, start + pageSize),
      total: merged.length,
    });
  } catch {
    const startParam = searchParams.get('start');

    if (startParam !== null) {
      const start = Number(startParam);
      const limit = Number(searchParams.get('limit') ?? 9);
      return NextResponse.json({
        data: fallback.slice(start, start + limit),
        total: fallback.length,
      });
    }

    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('pageSize') ?? 9);
    const start = (page - 1) * pageSize;

    return NextResponse.json({
      data: fallback.slice(start, start + pageSize),
      total: fallback.length,
    });
  }
}
