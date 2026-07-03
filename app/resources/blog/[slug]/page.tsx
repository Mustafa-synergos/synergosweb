import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BlogDetailHero from '@/components/blog/BlogDetailHero';
import BlogDetailContent from '@/components/blog/BlogDetailContent';
import { getBlogBySlug, getBlogs } from '@/lib/strapi';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((b) => ({ slug: b.Slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) return {};
    return {
      title: blog.SeoInfo?.MetaTitle ?? `${blog.Title} | Synergos`,
      description: blog.SeoInfo?.MetaDescription ?? blog.Excerpt ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let blog, allBlogs;
  try {
    [blog, allBlogs] = await Promise.all([
      getBlogBySlug(slug),
      getBlogs(),
    ]);
  } catch {
    notFound();
  }

  if (!blog) notFound();

  const related = (allBlogs ?? [])
    .filter((b) => b.Slug !== slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <Navbar />
      <BlogDetailHero blog={blog} />
      <BlogDetailContent blog={blog} related={related} />
      <Footer />
    </main>
  );
}
