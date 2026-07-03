import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

function getSafeRedirectPath(path: string | null) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return '/?preview=true';
  }

  const [pathname, query = ''] = path.split('?');

  if (pathname.startsWith('/api/')) {
    return '/?preview=true';
  }

  const params = new URLSearchParams(query);
  params.set('preview', 'true');
  params.delete('secret');

  const search = params.toString();
  return search ? `${pathname}?${search}` : `${pathname}?preview=true`;
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const redirectTo = request.nextUrl.searchParams.get('redirect');

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(getSafeRedirectPath(redirectTo));
}
