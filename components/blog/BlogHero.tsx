import InteractiveDots from '@/components/home/InteractiveDots';
import { getMediaUrl } from '@/lib/strapi-media';
import type { BlogListingSectionData } from '@/types/blog-sections';

type Props = {
  data?: BlogListingSectionData | null;
};

export default function BlogHero({ data }: Props) {
  const heading = data?.HeroHeading ?? 'BLOGS';

  const bannerUrl = data?.BannerVector
    ? getMediaUrl(data.BannerVector)
    : (data?.BannerVectorPath ?? '/images/blog/banner-vector.png');

  const dotUrl = data?.DotBackground
    ? getMediaUrl(data.DotBackground)
    : (data?.DotBackgroundPath ?? '/images/blog/background-dot.png');

  return (
    <section className="relative min-h-[340px] overflow-hidden bg-[#0f0f0f] pt-24 sm:min-h-[400px] lg:min-h-[460px]">
      <InteractiveDots variant="dark" />

      {/* Pen / hand line-art — top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden w-[42%] max-w-[560px] sm:block lg:w-[38%]"
      >
        <img
          src={bannerUrl ?? '/images/blog/banner-vector.png'}
          alt=""
          className="h-full w-full object-contain object-top opacity-60"
        />
      </div>

      {/* Dot circle + red pin — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-[6%] hidden sm:block lg:bottom-10 lg:left-[5%]"
      >
        <div className="relative">
          <img
            src={dotUrl ?? '/images/blog/background-dot.png'}
            alt=""
            className="h-[180px] w-[180px] object-contain opacity-25 lg:h-[230px] lg:w-[230px]"
          />
          <span className="absolute left-[46%] top-[44%] block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-[0_0_14px_5px_rgba(220,38,38,0.45)]" />
        </div>
      </div>

      {/* Page heading */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
        <h1 className="font-clother text-[52px] font-bold leading-none tracking-[-0.02em] text-white sm:text-[68px] lg:text-[96px]">
          {heading}
        </h1>
      </div>
    </section>
  );
}
