'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import InteractiveDots from '@/components/home/InteractiveDots';
import RichText from '@/components/shared/RichText';
import { getMediaUrl } from '@/lib/strapi-media';
import type { CareerSectionImageData } from '@/types/career-sections';
import type { RichTextBlockNode } from '@/types/rich-text';

type FooterContent = {
  LetsBuildHeading?: string | null;
  LetsBuildDescription?: string | null;
  SectionImage?: CareerSectionImageData | null;
  SectionImageTwo?: CareerSectionImageData | null;
  RightHeading?: string | null;
  RightContent?: RichTextBlockNode[] | null;
  DecorativeVectorPath?: string | null;
};

type CareersFooterSectionProps = {
  content: FooterContent;
};

const DEFAULT_RIGHT_CONTENT: RichTextBlockNode[] = [
  {
    type: 'list',
    format: 'unordered',
    children: [
      { type: 'list-item', children: [{ type: 'text', text: 'Passionate problem-solvers' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Creative thinkers with attention to detail' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Team players with strong communication' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'People eager to learn and grow' }] },
      { type: 'list-item', children: [{ type: 'text', text: 'Individuals who care about user experience and innovation' }] },
    ],
  },
];

const DEFAULT_RIGHT_HEADING = 'Build meaningful digital experiences with us';

export default function CareersFooterSection({ content }: CareersFooterSectionProps) {
  const heading = (content.LetsBuildHeading ?? "Let's build together").toUpperCase();
  const rightHeading = content.RightHeading ?? DEFAULT_RIGHT_HEADING;
  const rightContent = content.RightContent?.length ? content.RightContent : DEFAULT_RIGHT_CONTENT;

  const image1Url =
    getMediaUrl(content.SectionImage?.Image) ??
    content.SectionImage?.ImagePath ??
    '/images/career/image-1.webp';
  const image1Alt = content.SectionImage?.AltText ?? 'Career image';

  const image2Url =
    getMediaUrl(content.SectionImageTwo?.Image) ??
    content.SectionImageTwo?.ImagePath ??
    '/images/career/Career-.jpg';
  const image2Alt = content.SectionImageTwo?.AltText ?? 'Career team';

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <InteractiveDots variant="dark" />

      

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-8 sm:py-20 lg:px-0 lg:py-24">
        <div className="relative z-10 max-w-[1280px]">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="responsive-large-h2 text-white"
          >
            {heading}
          </motion.h2>

          {content.LetsBuildDescription && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-6 max-w-[480px] text-sm font-light leading-[1.8] text-[#B9B9B9] sm:text-[15px]"
            >
              {content.LetsBuildDescription}
            </motion.p>
          )}

          {/* Decorative vector — path-drawing animation on scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 w-[42%] opacity-60"
      >
        <svg
          viewBox="0 0 542 324"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <motion.path
            d="M0 324C6.18669 315.63 30.5329 279.943 75.8322 284.94C121.133 289.937 140.29 268.399 142.884 268.599C143.79 268.668 152.754 267.685 166.217 262.024C177.598 257.238 192.529 249.991 209.774 240.501C230.594 229.045 254.788 214.323 280.182 196.723C334.415 159.136 388.259 119.458 436.98 74.8769C454.623 58.7322 476.167 38.9513 483.252 15.3216C487.929 -0.279678 473.011 -1.46449 460.657 0.990665C442.374 4.62435 426.347 13.5444 409.791 21.6218C392.098 30.2526 374.676 39.3789 357.324 48.6952C355.836 49.4939 352.797 51.9767 351.024 51.9767C345.283 51.9767 337.134 46.9218 331.333 45.6829C315.677 42.341 299.297 42.6869 283.878 47.0739C223.829 64.1619 186.206 135.165 222.289 190.377C222.804 191.166 230.76 202.875 231.753 202.304C246.277 193.929 263.864 184.295 280.688 173.374C296.039 163.407 310.671 152.173 323.455 143.776C336.945 134.915 348.428 125.274 360.936 116.217C383.882 99.602 406.361 83.1441 418.943 54.6935C419.721 52.9339 420.472 51.0384 420.162 49.1405C419.582 45.5948 415.793 45.4061 412.952 45.5344C404.171 45.9332 374.371 67.5881 371.444 67.3227C368.617 64.5657 351.178 52.232 350.646 52.232C350.115 52.232 381.689 67.2774 391.134 93.2742C356.91 119.535 273.527 183.041 227.761 204.431C181.996 225.82 216.969 181.397 216.969 181.397C216.969 181.397 208.711 158.931 209.168 157.384C208.564 159.556 200.445 164.387 198.715 165.942C190.843 173.012 183.131 180.263 175.541 187.634C157.049 205.595 135.615 224.935 123.868 248.201C122.687 250.54 121.577 253.041 121.682 255.659C122.538 276.904 157.277 266.148 167.892 261.294C178.934 256.245 225.98 230.305 252.023 215.558C253.328 214.818 267.858 223.052 269.805 223.57C282.615 226.985 296.024 228.005 309.144 225.979C337.761 221.56 363.126 204.63 378.878 180.493C389.883 163.626 401.735 131.554 396.09 110.64C396.09 110.64 426.255 101.601 446.211 113.557C466.167 125.515 485.724 135.08 503.685 127.108C521.645 119.136 539.606 119.535 542 120.731"
            stroke="#AEAEAE"
            strokeMiterlimit="10"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.2 }}
            viewport={{ once: true }}
          />
        </svg>
      </div>
        </div>
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-20">

          {/* ── Left column ── */}
          <div>
          

            {/* Overlapping staggered images */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative mt-10 "
            >
              {/* Image 1 — left, tilted CCW */}
              <div className="w-[100%] -rotate-[4deg] overflow-hidden rounded-[20px]">
                <Image
                  src={image1Url}
                  alt={image1Alt}
                  width={600}
                  height={420}
                  className="w-full h-auto object-cover grayscale"
                  unoptimized={image1Url.startsWith('http')}
                />
              </div>

            
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div className="lg:pt-10">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}
              className="text-[20px] font-bold uppercase leading-[1.2] tracking-[0.01em] text-white sm:text-[22px] lg:text-[24px]"
            >
              {rightHeading}
            </motion.h3>

            <div className="mt-8">
              <RichText content={rightContent} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
