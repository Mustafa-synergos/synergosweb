import Image from 'next/image';

import CTA from '@/components/shared/CTA';
import { getMediaUrl } from '@/lib/strapi-media';
import {
  DEFAULT_THANK_YOU_SECTION,
  type ThankYouSectionData,
} from '@/types/thank-you';

type ThankYouSectionProps = {
  data?: ThankYouSectionData | null;
};

export default function ThankYouSection({ data }: ThankYouSectionProps) {
  const content = data ?? DEFAULT_THANK_YOU_SECTION;
  const backgroundUrl =
    getMediaUrl(content.BackgroundImage) ??
    '/images/thank-you/background-image.webp';
  const vectorOneUrl =
    getMediaUrl(content.VectorImage1) ?? '/images/thank-you/vector-1.webp';
  const vectorTwoUrl =
    getMediaUrl(content.VectorImage2) ?? '/images/thank-you/vector-2.webp';
  const useCmsBackground = backgroundUrl.startsWith('http');

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-white">
      <Image
        src={backgroundUrl}
        alt=""
        fill
        priority
        className="object-cover object-center lg:object-[62%_center]"
        sizes="100vw"
        unoptimized={useCmsBackground}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-0 h-[42%] w-[51%] max-w-[520px] sm:-right-4 lg:h-[48%] lg:w-[46%]"
        style={{
          backgroundImage: `url('${vectorOneUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-0 h-[38%] w-[50%] max-w-[480px] opacity-50 sm:-left-6 lg:h-[42%] lg:w-[40%]"
        style={{
          backgroundImage: `url('${vectorTwoUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-start justify-center px-6 pb-16 pt-24 sm:px-8 sm:pt-28 lg:min-h-[100svh] lg:items-center lg:justify-start lg:px-12 lg:pb-20 xl:px-20">
        <div className="w-full text-center lg:text-left">
          <h1 className="type-h1 text-center text-white">
            {content.Heading}
          </h1>

          <p className="type-p mx-auto mt-6 max-w-[480px] text-center text-white/85 sm:mt-8 lg:max-w-[1000px]">
            {content.Message}
          </p>

          <div className="relative z-20 mt-8 flex justify-center sm:mt-10 lg:justify-center">
            <CTA data={content.CTA} className="text-xs sm:text-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
