import type { Metadata } from 'next';
import CmsPage, { buildCmsPageMetadata } from '@/components/shared/CmsPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('blog');
}

export default function BlogListingPage() {
  return <CmsPage slug="blog" className="min-h-screen bg-[#0f0f0f] text-white" />;
}
