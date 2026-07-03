export type StrapiPublicationStatus = 'draft' | 'published';

export type PreviewContentUid =
  | 'api::page.page'
  | 'api::blog.blog'
  | 'api::case-study.case-study';

export function getPreviewPathFromUid(
  uid: string | null | undefined,
  slug: string | null | undefined
): string | null {
  switch (uid) {
    case 'api::page.page':
      if (slug === 'home') return '/';
      return slug ? `/${slug}` : null;
    case 'api::blog.blog':
      return slug ? `/blog/${slug}` : '/blog';
    case 'api::case-study.case-study':
      return slug ? `/case-studies/${slug}` : '/case-studies';
    default:
      return null;
  }
}
