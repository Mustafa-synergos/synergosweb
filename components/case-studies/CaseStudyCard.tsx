'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CaseStudyData } from '@/types/case-study';

type Props = {
  caseStudy: CaseStudyData;
  index?: number;
};

export default function CaseStudyCard({ caseStudy, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.36) }}
    >
      <Link
        href={`/case-studies/${caseStudy.Slug}`}
        className="group flex h-full min-h-[180px] flex-col justify-between rounded-[6px] border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.05] sm:p-6"
      >
        {/* Top: title + excerpt */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[20px] normal-case leading-[1.5] text-white sm:text-[18px]">
            {caseStudy.Title}
          </h3>

          {caseStudy.Excerpt && (
            <p className="mt-2 line-clamp-3 text-[18px] font-light leading-[1.3]  text-white/45">
              {caseStudy.Excerpt}
            </p>
          )}
        </div>

        {/* Bottom: TAKE A LOOK */}
        <div className="mt-5 flex items-center gap-2">
          <svg
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M22.999 14.9799C23.0391 12.3306 21.8427 10.3362 19.5393 9.21604C17.9042 8.39369 15.433 7.69345 11.996 7.08108C8.86914 6.52329 6.25016 5.69261 4.20842 4.61218C2.05086 3.49013 0.672982 1.98973 0 0V16.3554C0 18.3683 1.60859 20 3.59289 20H19.0769C19.967 19.8659 20.7302 19.5578 21.3494 19.074C22.4163 18.2915 22.9771 16.9095 22.9981 14.9799H22.999Z"
              fill="#FF0000"
            />
          </svg>
          <span className="text-[13px] font-semibold uppercase tracking-wider text-white/80 transition-colors group-hover:text-white">
            TAKE A LOOK
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
