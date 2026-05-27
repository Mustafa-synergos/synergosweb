import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import { getProjectBySlug, strapiBase } from '../../../lib/strapi';

function resolveMedia(url?: string) {
  if (!url) return '/';
  return url.startsWith('http') ? url : `${strapiBase}${url}`;
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${strapiBase}/api/projects?fields[0]=slug&pagination[limit]=50`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return data.data?.map((item: any) => ({ slug: item.attributes.slug })) || [];
  } catch (error) {
    console.warn('Failed to fetch projects during build. Backend may not be running.');
    return [];
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  let item;
  try {
    const response = await getProjectBySlug(params.slug);
    item = response.data?.[0];
  } catch (error) {
    console.warn('Failed to fetch project during build. Backend may not be running.');
    return notFound();
  }
  if (!item) return notFound();

  const project = item.attributes;
  const cover = project.cover_image?.data?.attributes?.url;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Project story</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{project.title}</h1>
            <p className="mt-6 text-slate-300 leading-[1.5]">{project.description}</p>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-slate-800">
                {cover ? (
                  <Image src={resolveMedia(cover)} alt={project.title} fill className="object-cover" />
                ) : null}
              </div>
              <div className="rounded-[2rem] bg-slate-950/70 p-8 shadow-soft">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Key details</p>
                <div className="mt-6 space-y-4 text-slate-300">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tags</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(project.tags || []).map((tag: string) => (
                        <span key={tag} className="rounded-full bg-slate-900/80 px-3 py-1 text-sm text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">External link</p>
                    <a href={project.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sky-300 transition hover:text-sky-200">
                      View project details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
