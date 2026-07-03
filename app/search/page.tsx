import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  if (query) {
    return {
      title: `Search: ${query} | Synergos`,
      description: `Search results for "${query}" on Synergos.`,
    };
  }

  return {
    title: 'Search | Synergos',
    description: 'Search the Synergos website.',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto max-w-[1280px] px-4 pb-24 pt-32 sm:px-8 lg:px-0 lg:pt-36">
        <h1 className="type-h2 font-normal text-white">Search</h1>

        {query ? (
          <>
            <p className="type-p mt-6 text-[#AEAEAE]">
              Results for &ldquo;{query}&rdquo; are coming soon. In the meantime, browse our
              resources and services.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:text-white"
              >
                Browse resources
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:text-white"
              >
                What we offer
              </Link>
            </div>
          </>
        ) : (
          <p className="type-p mt-6 text-[#AEAEAE]">
            Enter a search term using the search icon in the header.
          </p>
        )}
      </section>
      <Footer />
    </main>
  );
}
