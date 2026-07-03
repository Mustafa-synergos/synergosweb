'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import InteractiveDots from '@/components/home/InteractiveDots';

import { DEFAULT_STORY_OF_FLIGHT } from '@/lib/about-defaults';
import { getTitleLines } from '@/lib/heading';
import { getMediaUrl } from '@/lib/strapi-media';
import CTA from '@/components/shared/CTA';
import type { StoryOfFlightSectionData } from '@/types/about-sections';
import DecorativeVectorImage from '@/components/shared/DecorativeVectorImage';
const decorativeUrl = '/images/foter-vector.svg';
type StoryOfFlightSectionProps = {
  data?: StoryOfFlightSectionData | null;
};

export default function StoryOfFlightSection({ data }: StoryOfFlightSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content = data ?? DEFAULT_STORY_OF_FLIGHT;
  const headingLines = getTitleLines(content.Heading, 'multiline');
  const illustrationUrl =
    getMediaUrl(content.Illustration) ??
    content.IllustrationPath ??
    DEFAULT_STORY_OF_FLIGHT.IllustrationPath!;
  const backgroundUrl =
    getMediaUrl(content.BackgroundVector) ??
    content.BackgroundVectorPath ??
    DEFAULT_STORY_OF_FLIGHT.BackgroundVectorPath!;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-6 py-16 sm:px-8 lg:py-28"
    >
      <InteractiveDots variant="dark" containerRef={sectionRef} />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h2 className="responsive-large-h2 text-white">
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-3xl font-clother text-[18px] font-light leading-relaxed text-white/90 lg:mt-8 lg:text-[22px]">
            {content.Subtitle}
          </p>


          <DecorativeVectorImage
            src={decorativeUrl}
            className="hidden lg:block absolute -right-8 top-0 h-[min(42vw,420px)] w-[min(42vw,420px)]"
            delay={0.3}
          />

        </motion.div>

        <div className="mt-0 sm:mt-12 grid grid-cols-1 items-center gap-0 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full max-w-[380px] lg:max-w-[500px]">
              <Image
                src={illustrationUrl}
                alt="Hands passing a crafted object — a story of flight"
                fill
                className="object-contain object-left"
                sizes="(min-width: 1024px) 500px, 80vw"
                unoptimized={illustrationUrl.startsWith('http')}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true }}
            className="space-y-6 lg:pt-4"
          >
            <p className="responsive-clother-paragraph  text-white/85">
              {content.ParagraphOne}
            </p>
            <p className="responsive-clother-paragraph  text-white/80">
              {content.ParagraphTwo}
            </p>

            <div className="flex flex-wrap gap-4 pt-4 lg:gap-5 lg:pt-6">
              {content.PrimaryCTA && <CTA data={content.PrimaryCTA} />}
              {content.SecondaryCTA && <CTA data={content.SecondaryCTA} />}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
