import type { Metadata } from 'next';

import CmsPage, { buildCmsPageMetadata } from '@/components/shared/CmsPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('about');
}

export default function AboutPage() {
  return <CmsPage slug="about" className="bg-black text-white" />;
}
