import { NextRequest, NextResponse } from 'next/server';
import { getBlogsPaginated, getBlogsOffset } from '@/lib/strapi';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') ?? undefined;

  try {
    const startParam = searchParams.get('start');

    if (startParam !== null) {
      const start = Number(startParam);
      const limit = Number(searchParams.get('limit') ?? 9);
      const result = await getBlogsOffset(start, limit, category);
      return NextResponse.json(result);
    }

    // fallback: page-based (used only by category filter reset)
    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('pageSize') ?? 11);
    const result = await getBlogsPaginated(page, pageSize, category);
    return NextResponse.json({
      data: result.data,
      total: result.meta?.pagination?.total ?? 0,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
