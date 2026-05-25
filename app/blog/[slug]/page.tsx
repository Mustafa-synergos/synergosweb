import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import { getPostBySlug, strapiBase } from '../../../lib/strapi';

function resolveMedia(url?: string) {
  if (!url) return '/';
  return url.startsWith('http') ? url : `${strapiBase}${url}`;
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${strapiBase}/api/blog-posts?fields[0]=slug&pagination[limit]=50`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return data.data?.map((item: any) => ({ slug: item.attributes.slug })) || [];
  } catch (error) {
    console.warn('Failed to fetch blog posts during build. Backend may not be running.');
    return [];
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let item;
  try {
    const response = await getPostBySlug(params.slug);
    item = response.data?.[0];
  } catch (error) {
    console.warn('Failed to fetch blog post during build. Backend may not be running.');
    return notFound();
  }
  if (!item) return notFound();

  const post = item.attributes;
  const cover = post.cover_image?.data?.attributes?.url;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Blog post</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-400">Published {new Date(post.publishedAt).toLocaleDateString()}</p>
            <div className="mt-10 rounded-[2rem] overflow-hidden bg-slate-950/70 shadow-lg">
              {cover ? <Image src={resolveMedia(cover)} alt={post.title} width={1200} height={600} className="h-[420px] w-full object-cover" /> : null}
            </div>
            <article className="mt-10 max-w-none space-y-6 text-slate-300">
              <div dangerouslySetInnerHTML={{ __html: post.content || '<p contenteditable="false">No content yet.</p>' }} />
            </article>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
