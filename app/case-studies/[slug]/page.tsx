import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/strapi';

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
    const seo = caseStudy?.SeoInfo;

    if (caseStudy && (seo?.MetaTitle || seo?.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? caseStudy.Title,
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (caseStudy?.Title) {
      return { title: `${caseStudy.Title} | Synergos` };
    }
  } catch {
    // fall through
  }

  return { title: 'Case Study | Synergos' };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let caseStudy = null;

  try {
    caseStudy = await getCaseStudyBySlug(slug);
  } catch (error) {
    console.error(`Failed to load case study "${slug}" from Strapi:`, error);
  }

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">Case Study</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{caseStudy.Title}</h1>
        </div>
      </section>
      <Footer />
    </main>
  );
}
