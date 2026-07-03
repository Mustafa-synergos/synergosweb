import type { Metadata } from 'next';

import CmsPage, { buildCmsPageMetadata } from '@/components/shared/CmsPage';
import { getPages } from '@/lib/strapi';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const pages = await getPages();
    return pages
      .map((page) => ({ slug: page.Slug }))
      .filter((page) => page.slug && page.slug !== 'home');
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildCmsPageMetadata(slug);
}

export default async function StrapiPage({ params }: PageProps) {
  const { slug } = await params;
  return <CmsPage slug={slug} />;
}
