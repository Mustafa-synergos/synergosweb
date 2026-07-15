'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleCard from '@/components/articles/ArticleCard';
import InteractiveDots from '@/components/home/InteractiveDots';
import type { ArticleData } from '@/types/article';

type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };

type Props = {
  initialArticles: ArticleData[];
  initialMeta: PaginationMeta;
  categories: string[];
};

const LOAD_MORE_SIZE = 9;
const INITIAL_SIZE = 9;

export default function ArticleListingContent({ initialArticles, initialMeta, categories }: Props) {
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles);
  const [total, setTotal] = useState(initialMeta.total);
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasMore = articles.length < total;
  const featured = articles.slice(0, 2);
  const rest = articles.slice(2);

  async function fetchOffset(start: number, limit: number, category: string, append: boolean) {
    const params = new URLSearchParams({ start: String(start), limit: String(limit) });
    if (category) params.set('category', category);
    const res = await fetch(`/api/articles-list?${params.toString()}`);
    if (!res.ok) return;
    const json = await res.json();
    const incoming: ArticleData[] = json.data ?? [];
    setArticles((prev) => (append ? [...prev, ...incoming] : incoming));
    setTotal(json.total ?? 0);
  }

  function handleCategory(cat: string) {
    setCategoryOpen(false);
    const next = cat === activeCategory ? '' : cat;
    setActiveCategory(next);
    startTransition(() => { fetchOffset(0, INITIAL_SIZE, next, false); });
  }

  function handleLoadMore() {
    startTransition(() => { fetchOffset(articles.length, LOAD_MORE_SIZE, activeCategory, true); });
  }

  return (
    <section className="relative bg-[#0f0f0f]">
      <div className="pointer-events-none">
        <InteractiveDots variant="dark" />
      </div>

      {/* Heading block */}
      {/* Featured block */}
<div className="bg-white/[0.04]">
  <div className="mx-auto max-w-[1280px] px-6 pb-10 pt-14 sm:px-8 sm:pb-12 sm:pt-16 lg:px-0 lg:pb-14 lg:pt-20">

    {/* Heading + filter */}
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <h2 className="font-clother text-[80px] font-bold leading-none tracking-[-0.03em] text-white sm:text-[100px] lg:text-[130px]">
        LATEST
      </h2>

      {categories.length > 0 && (
        <div className="relative mb-2 shrink-0 sm:mb-3">
          <button
            onClick={() => setCategoryOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[12px] font-light text-white/50 transition hover:border-white/30 hover:text-white/80 sm:px-5 sm:py-2.5 sm:text-[13px]"
          >
            <span>{activeCategory || 'Choose category'}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[11px] leading-none">
              {categoryOpen ? '×' : '+'}
            </span>
          </button>

          <AnimatePresence>
            {categoryOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-30 mt-2 min-w-[190px] overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] py-1 shadow-2xl"
              >
                {activeCategory && (
                  <li>
                    <button
                      onClick={() => handleCategory('')}
                      className="w-full px-4 py-2.5 text-left text-[12px] text-white/35 hover:bg-white/5 hover:text-white/70"
                    >
                      All categories
                    </button>
                  </li>
                )}

                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategory(cat)}
                      className={`w-full px-4 py-2.5 text-left text-[12px] transition hover:bg-white/5 hover:text-white ${
                        activeCategory === cat
                          ? 'text-[#ff5c5c]'
                          : 'text-white/55'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>

    {/* Top 2 Featured Articles */}
    <div
      className={`grid grid-cols-1 gap-4 transition-opacity duration-150 sm:grid-cols-2 ${
        isPending && !articles.length ? 'opacity-30' : ''
      }`}
    >
      {featured.map((article, i) => (
        <ArticleCard
          key={article.documentId ?? article.Slug}
          article={article}
          index={i}
        />
      ))}
    </div>

  </div>
</div>

      {/* Rest of articles */}
      <div className="relative bg-[#0f0f0f]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0f0f0f] to-transparent" />

        <div className="relative mx-auto max-w-[1280px] px-6 pb-28 pt-6 sm:px-8 sm:pt-8 lg:px-0 lg:pt-10">
          <div className={`transition-opacity duration-150 ${isPending && !articles.length ? 'opacity-30' : ''}`}>

            {articles.length === 0 && (
              <p className="py-24 text-center font-clother text-[15px] text-white/30">
                No articles found.
              </p>
            )}

            {articles.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, i) => (
                  <ArticleCard key={article.documentId ?? article.Slug} article={article} index={i} />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="mt-14 flex items-center gap-5 sm:mt-16">
                <div className="h-px flex-1 bg-white/15" />
                <button
                  onClick={handleLoadMore}
                  disabled={isPending}
                  className="flex shrink-0 items-center gap-2 text-[13px] font-light text-white/50 underline underline-offset-4 transition hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[14px]"
                >
                  {isPending ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white/70" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path d="M22.999 14.9799C23.0391 12.3306 21.8427 10.3362 19.5393 9.21604C17.9042 8.39369 15.433 7.69345 11.996 7.08108C8.86914 6.52329 6.25016 5.69261 4.20842 4.61218C2.05086 3.49013 0.672982 1.98973 0 0V16.3554C0 18.3683 1.60859 20 3.59289 20H19.0769C19.967 19.8659 20.7302 19.5578 21.3494 19.074C22.4163 18.2915 22.9771 16.9095 22.9981 14.9799H22.999Z" fill="#FF0000"/>
                      </svg>
                      Load More
                    </>
                  )}
                </button>
                <div className="h-px flex-1 bg-white/15" />
              </div>
            )}

            {!hasMore && articles.length > 0 && total > INITIAL_SIZE && (
              <div className="mt-14 flex items-center gap-5 sm:mt-16">
                <div className="h-px flex-1 bg-white/10" />
                <span className="shrink-0 text-[12px] text-white/20">All articles loaded</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
