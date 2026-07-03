import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

type ExitPreviewPageProps = {
  searchParams: Promise<{ path?: string }>;
};

function getSafeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return '/';
  }

  return path;
}

export default async function ExitPreviewPage({ searchParams }: ExitPreviewPageProps) {
  const { path } = await searchParams;
  const draft = await draftMode();

  draft.disable();
  redirect(getSafeRedirectPath(path));
}
