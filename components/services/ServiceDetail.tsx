import Image from 'next/image';
import Link from 'next/link';

import type { Service } from '@/data/services';
import PageHeroSection from '@/components/shared/PageHeroSection';
import type { PageHeroSectionData } from '@/types/page-hero';

type ServiceDetailProps = {
  service: Service;
};

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const heroData: PageHeroSectionData = {
    __component: 'pages.page-hero-section',
    Heading: service.title,
    HeadingLayout: 'single',
    HeroVectorPath: service.illustration,
    BannerTopPath: '/images/page-hero/banner-vector-right.png',
    BannerBottomPath: '/images/page-hero/banner-vector-left.png',
    ShowScrollIndicator: false,
  };

  return (
    <>
      <PageHeroSection data={heroData} />

      <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-20 lg:py-28">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
          <div className="mb-12 flex items-center justify-between sm:mb-16 lg:mb-20">
            <span className="text-[16px] font-normal leading-[24px] text-[#ff202a] sm:text-[20px] lg:text-[28px]">
              {service.number}
            </span>
            <Link
              href="/services"
              className="text-[13px] font-light text-white/50 underline underline-offset-4 transition hover:text-white/80 sm:text-[14px]"
            >
              Back to Services
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-square max-w-[500px]">
              <Image
                src={service.illustration}
                alt={service.title}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 500px, 90vw"
                unoptimized={service.illustration.startsWith('http')}
              />
            </div>

            <div className="max-w-2xl">
              <h1 className="font-['clother',sans-serif] text-[32px] font-bold uppercase leading-[1.1] text-white sm:text-[48px] lg:text-[60px]">
                {service.title}
              </h1>
              <p className="mt-6 font-['clother',sans-serif] text-[16px] font-normal leading-[26px] text-[#AEAEAE] sm:text-[18px] sm:leading-[28px]">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
