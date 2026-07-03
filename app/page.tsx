import type { Metadata } from 'next';

import CmsPage, { buildCmsPageMetadata } from '@/components/shared/CmsPage';
import { getPageBySlug } from '@/lib/strapi';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('home');
}

export default async function HomePage() {
  let page = null;

  try {
    page = await getPageBySlug('home');
  } catch (error) {
    console.error('Failed to load home page from Strapi:', error);
  }

  return (
    <CmsPage
      slug="home"
      prefetchedPage={page}
      className="relative min-h-screen bg-black text-white"
    />
  );
}
