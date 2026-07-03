'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ArticleData } from '@/types/article';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function CategoryPill({ category }: { category: string }) {
  return (
    <span className="inline-block w-fit rounded-full border border-[#4C4C4C] px-3 py-[3px] font-clother text-[16px] font-medium tracking-wide text-[#EB2127]">
      {category}
    </span>
  );
}

type Props = {
  article: ArticleData;
  index?: number;
  hideExcerpt?: boolean;
};

export default function ArticleCard({ article, index = 0, hideExcerpt = false }: Props) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.36) }}
    >
      <Link
        href={`/resources/article/${article.Slug}`}
        className="group flex h-full min-h-[180px] flex-col justify-between rounded-[6px] border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.05] sm:p-6"
      >
        {/* Top: category + title + excerpt */}
        <div className="flex flex-col gap-2.5">
          {article.Category && <CategoryPill category={article.Category} />}

          <h3 className="font-clother text-[20px] normal-case leading-[1.5] text-white line-clamp-3 sm:text-[16px]">
            {article.Title}
          </h3>

          {!hideExcerpt && article.Excerpt && (
            <p className="mt-2 line-clamp-2 font-clother text-[18px] font-light leading-[1.3] text-white/45">
              {article.Excerpt}
            </p>
          )}
        </div>

        {/* Bottom: date + arrow */}
        <div className="mt-5 flex items-center justify-between">
          <span className="font-clother text-[18px] font-light tracking-wide text-white/35">
            {formatDate(article.publishedAt)}
          </span>

          <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="white"/>
              <path d="M16.9278 11.8731C17.2149 12.1801 17.2149 12.6772 16.9278 12.9841L13.2544 16.9127C13.1109 17.0661 12.9228 17.1429 12.7349 17.1429C12.547 17.1429 12.359 17.0661 12.2155 16.9127C11.9284 16.6056 11.9284 16.1085 12.2155 15.8016L14.6349 13.2143H7.59211C7.18638 13.2143 6.85742 12.8629 6.85742 12.4286C6.85742 11.9943 7.18638 11.6429 7.59211 11.6429H14.6349L12.2155 9.05549C11.9284 8.74847 11.9284 8.25131 12.2155 7.94448C12.5026 7.63766 12.9675 7.63747 13.2544 7.94448L16.9278 11.8731Z" fill="black"/>
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
