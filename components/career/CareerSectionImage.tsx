import Image from 'next/image';
import { getMediaUrl } from '@/lib/strapi-media';
import type { CareerSectionImageData } from '@/types/career-sections';

type CareerSectionImageProps = {
  data?: CareerSectionImageData | null;
};

export default function CareerSectionImage({ data }: CareerSectionImageProps) {
  const imageUrl =
    getMediaUrl(data?.Image) ?? data?.ImagePath ?? '/images/career/image-1.webp';
  const altText = data?.AltText ?? 'Career section image';

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] p-4">
      <Image
        src={imageUrl}
        alt={altText}
        width={720}
        height={560}
        className="h-full w-full object-cover"
        unoptimized={imageUrl.startsWith('http')}
      />
    </div>
  );
}
