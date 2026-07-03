import 'server-only';

import { draftMode, headers } from 'next/headers';

import type { StrapiPublicationStatus } from '@/lib/preview';

export async function getPreviewContext() {
  const { isEnabled } = await draftMode();
  const requestHeaders = await headers();
  const isPreviewMode = requestHeaders.get('x-preview-mode') === 'true';
  const isPreviewAuthenticated =
    requestHeaders.get('x-preview-authenticated') === 'true';

  const isPreview = isEnabled || (isPreviewMode && isPreviewAuthenticated);

  return {
    isPreview,
    status: (isPreview ? 'draft' : 'published') as StrapiPublicationStatus,
  };
}
