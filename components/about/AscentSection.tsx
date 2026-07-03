'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import InteractiveDots from '@/components/home/InteractiveDots';
import { DEFAULT_ASCENT } from '@/lib/about-defaults';
import { getTitleLines } from '@/lib/heading';
import { getMediaUrl } from '@/lib/strapi-media';
import type { AscentSectionData } from '@/types/about-sections';

type AscentSectionProps = {
  data?: AscentSectionData | null;
};

export default function AscentSection({ data }: AscentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content = data ?? DEFAULT_ASCENT;
  const headingLines = getTitleLines(content.Heading, 'multiline');
  const diagramUrl =
    getMediaUrl(content.Diagram) ?? content.DiagramPath ?? DEFAULT_ASCENT.DiagramPath!;
  const backgroundUrl =
    getMediaUrl(content.BackgroundVector) ??
    content.BackgroundVectorPath ??
    DEFAULT_ASCENT.BackgroundVectorPath!;
  const paragraphThree =
    content.ParagraphThree ??
    DEFAULT_ASCENT.ParagraphThree ??
    'Line all six up around the consumer, and ascent stops being a matter of luck. It becomes a matter of design.';

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#ff0000] px-6 py-16 sm:px-8 lg:py-28"
    >
      <InteractiveDots variant="red" containerRef={sectionRef} />

      

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <span className="font-clother text-[18px] font-normal capitalize text-white lg:text-[28px]">
            {content.Eyebrow}
          </span>
          <div className="relative">
          <h2 className="responsive-large-h2 mt-4 text-white lg:mt-6">
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[90%] top-0 z-[2] aspect-[1.6/1] w-[65%]"
      >
        
        <Image
          src={backgroundUrl}
          alt=""
          fill
          className="object-contain object-right-top"
          unoptimized={backgroundUrl.startsWith('http')}
        />
      </div>
      </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 items-end gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6 lg:max-w-xl lg:space-y-8 lg:pb-4"
          >
            <p className="font-clother text-[16px] font-light leading-relaxed text-white lg:text-[18px]">
              {content.ParagraphOne}
            </p>
            <p className="font-clother text-[16px] font-light leading-relaxed text-white lg:text-[18px]">
              {content.ParagraphTwo}
            </p>
            <p className="font-clother text-[16px] font-light leading-relaxed text-white lg:text-[18px]">
              {paragraphThree}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            viewport={{ once: true }}
            className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto lg:max-w-none"
          >
            <div className="overflow-hidden rounded-[28px]  lg:rounded-[32px] ">
              <div className="relative aspect-[5/4] w-full">
                <Image
                  src={diagramUrl}
                  alt="Synergos growth system diagram"
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 560px, 90vw"
                  unoptimized={diagramUrl.startsWith('http')}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
