import Image from 'next/image';
import { getMediaUrl } from '@/lib/strapi-media';
import type { BlogData } from '@/types/blog';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type Props = {
  blog: BlogData;
};

export default function BlogDetailHero({ blog }: Props) {
  const imageUrl = blog.FeaturedImage
    ? getMediaUrl(blog.FeaturedImage)
    : null;

  return (
    <section className="relative bg-[#111111] pt-48">
      <div className="mx-auto max-w-[1280px] bg-white/5 rounded-[20px] overflow-hidden ">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left: meta + title */}
          <div className="flex flex-col justify-center py-8 lg:py-14 px-6 sm:px-8 lg:px-8">
            {blog.Category && (
              <span className="mb-4 inline-block w-fit  bg-[#000000]/50 text-[#EB2127] rounded-full px-3 py-1 border  border-[#4C4C4C]  text-[11px] font-medium tracking-wide ">
                {blog.Category}
              </span>
            )}
            <h1 className="font-clother text-[28px] normal-case font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-[36px] lg:text-[44px]">
              {blog.Title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-[13px] text-white/40">
              {blog.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <img src="/images/blog/calendar.svg" alt="" className="h-3.5 w-3.5 opacity-60" />
                  {formatDate(blog.publishedAt)}
                </span>
              )}
              {blog.ReadTime && (
                <span className="flex items-center gap-1.5">
                  <img src="/images/blog/time.png" alt="" className="h-3.5 w-3.5 opacity-60" />
                  {blog.ReadTime}
                </span>
              )}
            </div>
          </div>

          {/* Right: featured image */}
          {imageUrl ? (
            <div className="relative h-[260px] w-full overflow-hidden sm:h-[320px] lg:h-[380px]">
              <Image
                src={imageUrl}
                alt={blog.FeaturedImage?.alternativeText ?? blog.Title}
                fill
                className="object-cover"
                unoptimized={imageUrl.startsWith('http')}
                priority
              />
            </div>
          ) : (
            <div className="hidden h-[380px] w-full  bg-white/5 lg:block" />
          )}
        </div>
      </div>

     
    </section>
  );
}
