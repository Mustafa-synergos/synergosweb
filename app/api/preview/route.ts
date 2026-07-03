import { NextRequest, NextResponse } from 'next/server';

import { getPreviewPathFromUid } from '@/lib/preview';

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const url = searchParams.get('url');
  const uid = searchParams.get('uid');
  const slug = searchParams.get('slug');

  const pathname =
    url ?? getPreviewPathFromUid(uid, slug) ?? (slug ? `/${slug}` : '/');

  const target = request.nextUrl.clone();
  target.pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  target.search = '';
  target.searchParams.set('preview', 'true');

  if (secret) {
    target.searchParams.set('secret', secret);
  }

  return NextResponse.redirect(target);
}
