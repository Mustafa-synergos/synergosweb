import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import WorkDetail from '@/components/work/WorkDetail';
import { getProjectBySlug } from '@/data/work';
import { fetchPortfolioProjects } from '@/lib/portfolio-api';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await fetchPortfolioProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await fetchPortfolioProjects();
  const project = getProjectBySlug(slug, projects);

  return {
    title: project ? `${project.title} | Our Work | Synergos` : 'Our Work | Synergos',
    description: project?.description,
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await fetchPortfolioProjects();
  const project = getProjectBySlug(slug, projects);

  if (!project) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <WorkDetail project={project} projects={projects} />
      <Footer />
    </main>
  );
}
