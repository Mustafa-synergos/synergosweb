import type { Metadata } from 'next';

import CmsPage, { buildCmsPageMetadata } from '@/components/shared/CmsPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('careers');
}

export default function CareersPage() {
  return <CmsPage slug="careers" className="bg-black text-white" />;
}
