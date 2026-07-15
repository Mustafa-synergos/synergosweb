import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const strapiOrigin =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ??
  'http://localhost:1337';

function withFrameAncestors(response: NextResponse) {
  response.headers.set(
    'Content-Security-Policy',
    `frame-ancestors 'self' ${strapiOrigin}`
  );
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const preview = searchParams.get('preview');
  const secret = searchParams.get('secret');
  const previewSecret = process.env.PREVIEW_SECRET;

  const requestHeaders = new Headers(request.headers);

  if (preview === 'true') {
    requestHeaders.set('x-preview-mode', 'true');

    if (secret && secret === previewSecret) {
      requestHeaders.set('x-preview-authenticated', 'true');
    }
  }

  return withFrameAncestors(
    NextResponse.next({
      request: { headers: requestHeaders },
    })
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|api/).*)'],
};
