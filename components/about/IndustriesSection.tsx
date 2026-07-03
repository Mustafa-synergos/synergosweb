'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

import InteractiveDots from '@/components/home/InteractiveDots';
import { DEFAULT_INDUSTRIES } from '@/lib/about-defaults';
import { getTitleLines } from '@/lib/heading';
import CTA from '@/components/shared/CTA';
import type { IndustriesSectionData } from '@/types/about-sections';

type IndustriesSectionProps = {
  data?: IndustriesSectionData | null;
};

function IndustryRibbon({
  items,
  direction,
  textColor,
}: {
  items: string[];
  direction: 'left' | 'right';
  textColor: 'white' | 'black';
}) {
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden py-4 lg:py-5">
      <div
        className={`flex w-max items-center gap-10 whitespace-nowrap px-4 lg:gap-14 ${
          direction === 'left' ? 'about-marquee-left' : 'about-marquee-right'
        }`}
      >
        {track.map((item, index) => (
            <React.Fragment key={`${item}-${index}`}>
            <span
              className={`font-clother text-[16px] ${
                textColor === "white" ? "text-white" : "text-black"
              } font-bold uppercase tracking-[0.18em] sm:text-[18px] lg:text-[22px]`}
            >
              {item}
            </span>
        
            <span className={`dots-separator ${
                textColor === "white" ? "bg-white" : "bg-black"
              }`} ></span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function IndustriesSection({ data }: IndustriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content = data ?? DEFAULT_INDUSTRIES;
  const headingLines = getTitleLines(content.Heading, 'multiline');
  const rowOne =
    content.RowOne?.map((item) => item.Label) ??
    DEFAULT_INDUSTRIES.RowOne!.map((item) => item.Label);
  const rowTwo =
    content.RowTwo?.map((item) => item.Label) ??
    DEFAULT_INDUSTRIES.RowTwo!.map((item) => item.Label);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black pb-0 pt-16 sm:px-0 sm:pt-20 lg:pt-28"
    >
      <InteractiveDots variant="dark" containerRef={sectionRef} />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className=""
        >
          <span className="responsive-red-span">{content.Eyebrow}</span>
          <h2 className="responsive-large-h2 mt-4 text-white lg:mt-6">
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6  whitespace-pre-line font-clother text-[16px] font-light leading-relaxed text-white/80 lg:mt-8 lg:text-[18px]">
            {content.Description}
          </p>
          {content.CTA && (
            <div className="mt-8 lg:mt-10">
              <CTA data={content.CTA} />
            </div>
          )}
        </motion.div>
      </div>

      <div className="relative z-10 mt-14 mb-28 w-full lg:mt-20 lg:mb-40">
        <div className="-rotate-[12deg] bg-[#AEAEAE] w-[110%] translate-x-[-5%] sm:-rotate-[4deg] lg:-rotate-[4deg]  mt-16 mb-0 ">
          <IndustryRibbon items={rowOne} direction="left" textColor="black" />
        </div>
        <div className="-mt-16 rotate-[12deg] bg-[#ff0000]  w-[110%] translate-x-[-5%] sm:rotate-[4deg] lg:rotate-[4deg]  -mt-16 mb-8 ">
          <IndustryRibbon items={rowTwo} direction="right" textColor="white" />
        </div>
      </div>
    </section>
  );
}
