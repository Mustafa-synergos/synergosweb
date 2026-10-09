import 'server-only';

import { draftMode, headers } from 'next/headers';

import type { StrapiPublicationStatus } from '@/lib/preview';

export async function getPreviewContext() {
  // During `next build` prerendering (and ISR revalidation without a request
  // context) `draftMode()`/`headers()` throw a DynamicServerError. Callers
  // catch that and fall back to `null`, which bakes an EMPTY page shell into
  // the static output (no fallback exists for e.g. `home`). Defaulting to
  // `published` here lets the prerender fetch real content instead.
  // Real preview requests always have a request context, so preview mode is
  // unaffected.
  try {
    const { isEnabled } = await draftMode();
    const requestHeaders = await headers();
    const isPreviewMode = requestHeaders.get('x-preview-mode') === 'true';
    const isPreviewAuthenticated =
      requestHeaders.get('x-preview-authenticated') === 'true';

    // Treat the request as a preview whenever draft mode is enabled OR the
    // middleware flagged it via the `?preview=true` query param (set by the
    // /api/preview redirect). This keeps the Strapi preview working without
    // requiring the caller to also supply the preview secret.
    const isPreview = isEnabled || isPreviewMode;

    return {
      isPreview,
      status: (isPreview ? 'draft' : 'published') as StrapiPublicationStatus,
    };
  } catch {
    return {
      isPreview: false,
      status: 'published' as StrapiPublicationStatus,
    };
  }
}
