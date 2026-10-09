import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import DynamicPageSections from '@/components/shared/DynamicPageSections';
import { getPageBySlug } from '@/lib/strapi';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPageBySlug('resources');
    const seo = page?.SeoInfo;

    if (seo?.MetaTitle || seo?.MetaDescription) {
      return {
        title: seo.MetaTitle ?? 'Resources | Synergos',
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (page?.Title) {
      return { title: `${page.Title} | Synergos` };
    }
  } catch {
    // fall through
  }

  return {
    title: 'Resources | Synergos',
    description:
      'Explore Synergos case studies and blogs — proof of work and perspectives from the team.',
  };
}

const CARDS = [
  {
    title: 'Case Studies',
    description:
      'Real engagements, real outcomes — see how Synergos moves metrics for brands.',
    href: '/case-studies',
  },
  {
    title: 'Blogs',
    description:
      'Perspectives from the Synergos team on marketing, branding, and digital strategy.',
    href: '/blogs',
  },
];

export default async function ResourcesPage() {
  let sections = null;

  try {
    const page = await getPageBySlug('resources');
    if (page?.Sections?.length) {
      sections = page.Sections;
    }
  } catch (error) {
    console.error('Failed to load resources page from Strapi:', error);
  }

  // CMS-designed page (hero + blogs + case studies) wins when present;
  // the static hub below stays as the offline fallback.
  if (sections) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] text-white">
        <Navbar />
        <DynamicPageSections sections={sections} />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-8 lg:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-0 h-[65%] w-[48%] max-w-[30%] opacity-100"
          style={{
            backgroundImage: "url('/images/page-hero/banner-vector-right.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top right',
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1280px]">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.25em] text-[#ff202a]">
            Resources
          </p>
          <h1 className="mb-4 text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none">
            Learn from our work
          </h1>
          <p className="mb-10 max-w-[640px] text-[16px] leading-[26px] text-white/60 lg:text-[18px]">
            Case studies with measurable outcomes, plus blogs with practical
            thinking you can apply.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex min-h-[180px] flex-col justify-between rounded-[6px] border border-white/[0.08] p-5 transition-all duration-300 hover:border-white/[0.18] sm:p-6"
              >
                <div>
                  <h2 className="mb-2 text-[24px] font-normal uppercase leading-[36px] text-[#AEAEAE] transition-colors group-hover:text-white lg:text-[28px]">
                    {card.title}
                  </h2>
                  <p className="text-[16px] leading-[24px] text-white/50">
                    {card.description}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#ff202a]">
                  Explore
                  <img
                    src="/images/blog/arrow-2.svg"
                    alt=""
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
