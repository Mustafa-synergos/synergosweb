import Image from 'next/image';

import { getMediaUrl } from '@/lib/strapi-media';
import { getTitleLines } from '@/lib/heading';
import {
  DEFAULT_PAGE_HERO_SECTION,
  type PageHeroSectionData,
} from '@/types/page-hero';

type PageHeroSectionProps = {
  data?: PageHeroSectionData | null;
};

function ScrollIndicator() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-10 left-0 z-30 sm:bottom-[10%]"
    >
      <div className="relative h-16 w-[32px] sm:h-28 sm:w-[58px]">
        <div className="absolute left-1/2 top-0 z-10 h-full w-px -translate-x-1/2 bg-white/50" />
        <div className="absolute left-1/2 top-[15px] z-0 size-[32px] -translate-x-1/2 rounded-full bg-[#ff202a] sm:top-[27px] sm:size-[58px]" />
        <div className="absolute bottom-0 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[3px] border-t-[5px] border-x-transparent border-t-white sm:border-x-[4px] sm:border-t-[6px]" />
      </div>
    </div>
  );
}

function HeroVector({
  src,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      className={className}
      sizes={sizes}
      unoptimized={src.startsWith('http')}
    />
  );
}

export default function PageHeroSection({ data }: PageHeroSectionProps) {
  const content = data ?? DEFAULT_PAGE_HERO_SECTION;
  const titleLines = getTitleLines(content.Heading, content.HeadingLayout ?? 'multiline');
  const isMultiline = titleLines.length > 1;
  const heroVectorUrl =
    getMediaUrl(content.HeroVector) ??
    content.HeroVectorPath ??
    '/images/privacy-policy/privacy-policy-vector.webp';
  const bannerTopUrl =
    getMediaUrl(content.BannerTop) ??
    content.BannerTopPath ??
    '/images/page-hero/banner-vector-right.png';
  const bannerBottomUrl =
    getMediaUrl(content.BannerBottom) ??
    content.BannerBottomPath ??
    '/images/page-hero/banner-vector-left.png';
  const showScrollIndicator = content.ShowScrollIndicator !== false;

  return (
    <section className="relative overflow-hidden bg-[#171717] text-white">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 h-[55%] w-[58%] max-w-[640px] opacity-100 sm:h-[60%] sm:w-[52%] lg:h-[65%] lg:w-[48%]"
        style={{
          backgroundImage: `url('${bannerTopUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[50%] w-[50%] max-w-[620px] opacity-100 sm:h-[55%] sm:w-[52%] lg:h-[60%] lg:w-[46%]"
        style={{
          backgroundImage: `url('${bannerBottomUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <div className="relative min-h-[min(88vh,720px)] pb-24 pt-28 sm:pb-20 sm:pt-32 lg:min-h-[680px] lg:pb-24 lg:pt-36">
          <div className="relative z-20 max-w-full">
            <h1
              className={`type-h1-hero text-white ${
                isMultiline
                  ? ''
                  : 'max-sm:whitespace-normal max-sm:break-words sm:whitespace-nowrap'
              }`}
            >
              {titleLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={isMultiline ? 'block' : undefined}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>

          {showScrollIndicator && <ScrollIndicator />}

          {/* Mobile: illustration in lower half, slightly right of center */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[15%] left-1/2 z-10 h-[min(42vh,340px)] w-[min(84vw,360px)] -translate-x-[45%] sm:hidden"
          >
            <HeroVector
              src={heroVectorUrl}
              className="object-contain object-bottom object-center"
              sizes="84vw"
              priority
            />
          </div>

          {/* Desktop: illustration anchored bottom-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-10 hidden h-[min(58vh,500px)] w-[min(58vw,640px)] max-w-none translate-x-[4%] sm:block lg:h-[480px] lg:w-[580px] lg:translate-x-0"
          >
            <HeroVector
              src={heroVectorUrl}
              className="object-contain object-bottom object-right"
              sizes="(min-width: 1024px) 580px, 58vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
