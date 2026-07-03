import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import {
  getItemTag,
  getListTag,
  getPathsForContent,
  type RevalidateContentType,
} from '@/lib/cache-tags';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RevalidateBody = {
  secret?: string;
  type?: RevalidateContentType;
  slug?: string | null;
  tags?: string[];
};

const CONTENT_TYPES = new Set<RevalidateContentType>([
  'page',
  'blog',
  'case-study',
  'career',
]);

function safeRevalidateTag(tag: string, errors: string[]) {
  try {
    revalidateTag(tag);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`tag:${tag} — ${message}`);
    return false;
  }
}

function safeRevalidatePath(path: string, errors: string[]) {
  try {
    revalidatePath(path, 'page');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`path:${path} — ${message}`);
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: RevalidateBody = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const secret =
    request.nextUrl.searchParams.get('secret') ?? body.secret ?? '';
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      {
        message:
          'REVALIDATE_SECRET is not set in frontend .env.local. Add it and restart Next.js.',
      },
      { status: 500 }
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const revalidatedTags = new Set<string>();
  const revalidatedPaths = new Set<string>();
  const errors: string[] = [];

  if (body.tags?.length) {
    for (const tag of body.tags) {
      if (tag && safeRevalidateTag(tag, errors)) {
        revalidatedTags.add(tag);
      }
    }
  }

  if (body.type && CONTENT_TYPES.has(body.type)) {
    const listTag = getListTag(body.type);
    if (safeRevalidateTag(listTag, errors)) {
      revalidatedTags.add(listTag);
    }

    if (body.slug) {
      const itemTag = getItemTag(body.type, body.slug);
      if (safeRevalidateTag(itemTag, errors)) {
        revalidatedTags.add(itemTag);
      }
    }

    for (const path of getPathsForContent(body.type, body.slug)) {
      if (safeRevalidatePath(path, errors)) {
        revalidatedPaths.add(path);
      }
    }
  }

  if (!revalidatedTags.size && !revalidatedPaths.size) {
    return NextResponse.json(
      {
        message: 'No cache entries were cleared',
        errors,
        hint:
          process.env.NODE_ENV === 'development'
            ? 'Try stopping Next.js, delete the frontend/.next folder, and run npm run dev again.'
            : undefined,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    revalidated: true,
    tags: [...revalidatedTags],
    paths: [...revalidatedPaths],
    warnings: errors.length ? errors : undefined,
    now: Date.now(),
  });
}
