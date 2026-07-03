import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DynamicCareerSections from '@/components/career/DynamicCareerSections';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import { getCareerBySlug, getCareers } from '@/lib/strapi';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const careers = await getCareers();
    return careers
      .map((item) => ({ slug: item.Slug }))
      .filter((item) => Boolean(item.slug));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const career = await getCareerBySlug(slug);
    const seo = career?.SeoInfo;

    if (career && (seo?.MetaTitle || seo?.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? career.Title,
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (career?.Title) {
      return { title: `${career.Title} | Careers | Synergos` };
    }
  } catch {
    // fall through
  }

  return { title: 'Career | Synergos' };
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let career = null;

  try {
    career = await getCareerBySlug(slug);
  } catch (error) {
    console.error(`Failed to load career "${slug}" from Strapi:`, error);
  }

  if (!career) {
    notFound();
  }

  return (
    <main className="bg-black text-white">
      <Navbar />
      <DynamicCareerSections
        sections={career.Sections}
        careerTitle={career.Title}
        careerSlug={career.Slug}
      />
      <Footer />
    </main>
  );
}
