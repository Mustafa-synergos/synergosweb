import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import CaseStudyDetail from '@/components/case-studies/CaseStudyDetail';
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/strapi';
import { getMediaUrl } from '@/lib/strapi-media';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const caseStudies = await getCaseStudies();
    return caseStudies
      .map((item) => ({ slug: item.Slug }))
      .filter((item) => Boolean(item.slug));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const caseStudy = await getCaseStudyBySlug(slug);
    if (!caseStudy) return { title: 'Case Study | Synergos' };

    const seo = caseStudy.SeoInfo;
    const title = seo?.MetaTitle ?? `${caseStudy.Title} | Synergos`;
    const description = seo?.MetaDescription ?? caseStudy.Excerpt ?? undefined;
    const image =
      getMediaUrl(seo?.Image) ?? getMediaUrl(caseStudy.FeaturedImage) ?? undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/case-studies/${slug}`,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return { title: 'Case Study | Synergos' };
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let caseStudy;
  try {
    caseStudy = await getCaseStudyBySlug(slug);
  } catch (error) {
    console.error(`Failed to load case study "${slug}" from Strapi:`, error);
  }

  if (!caseStudy) {
    notFound();
  }

  const schemaScripts = (caseStudy.SeoInfo?.Schema ?? [])
    .filter((item) => item?.Schema)
    .map((item, index) => (
      <script
        key={`schema-${index}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(item.Schema) }}
      />
    ));

  return (
    <main className="min-h-screen bg-black text-white">
      {schemaScripts}
      <Navbar />
      <CaseStudyDetail caseStudy={caseStudy} />
      <Footer />
    </main>
  );
}
