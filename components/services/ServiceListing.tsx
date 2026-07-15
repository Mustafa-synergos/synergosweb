'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { services } from '@/data/services';
import InteractiveDots from '@/components/home/InteractiveDots';

function ExploreLink({ href }: { href?: string }) {
  const content = (
    <span className="group inline-flex items-center gap-3 font-['clother',sans-serif] text-[18px] font-normal uppercase leading-[14px] tracking-normal text-white transition-colors hover:text-white">
      <span className="relative h-[20px] w-[23px] shrink-0">
        <Image
          src="/images/Service%20listing/icon-btn.svg"
          alt=""
          fill
          className="object-contain"
          sizes="23px"
        />
      </span>
      EXPLORE
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group">
        {content}
      </Link>
    );
  }

  return <span className="group cursor-default">{content}</span>;
}

function DotNav({
  count,
  activeIndex,
  onSelect,
  labelFor,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  labelFor: (index: number) => string;
}) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSelect(index);
          }}
          aria-label={`Go to ${labelFor(index)}`}
          aria-current={index === activeIndex ? 'true' : undefined}
          className={`relative rounded-full transition-all duration-300 before:absolute before:-inset-3 before:content-[''] ${
            index === activeIndex
              ? 'h-2.5 w-2.5 bg-white'
              : 'h-2 w-2 bg-white/30 hover:bg-white/60'
          }`}
        />
      ))}
    </div>
  );
}

export default function ServiceListing() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          const idx = Number(visible.target.getAttribute('data-index'));
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root: container, threshold: 0.5 }
    );

    Array.from(container.children).forEach((child) => {
      if (child instanceof HTMLElement && child.hasAttribute('data-index')) {
        observer.observe(child);
      }
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), services.length - 1);
    setActiveIndex(clamped);

    const container = carouselRef.current;
    const card = cardRefs.current[clamped];
    if (!container || !card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#050505] py-16 text-white sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="dark" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 z-0 hidden h-[200px] w-[340px] opacity-100 sm:-right-10 sm:top-10 sm:h-[250px] sm:w-[420px] lg:right-0 lg:top-16 lg:block lg:h-[329px] lg:w-[551px]"
      >
        <Image
          src="/images/Service%20listing/Vector-1.svg"
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="(min-width: 1024px) 551px, 420px"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <div className="mb-12 max-w-2xl sm:mb-16 lg:mb-20">
          <span className="mb-4 block font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-[#ff202a] sm:text-[20px] sm:leading-[100%] lg:text-[28px]">
            Six Thrusters, One Engine
          </span>

          <h2 className="mb-6 font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white sm:text-[80px] sm:leading-[82px] lg:text-[134px] lg:leading-[134px]">
            Built for Growth
          </h2>

          <p className="max-w-[720px] font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-[#AEAEAE] sm:text-[18px] sm:leading-[26px]">
            Explore a range of services designed to help brands grow and evolve.
            We combine creativity, strategy, and technology to build meaningful
            solutions.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-[repeat(3,413px)] lg:gap-5"
          role="list"
          aria-label="Services"
        >
          {services.map((service, index) => (
            <article
              key={service.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              data-index={index}
              className="group relative flex w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-transparent bg-[#1B1B1B] p-5 transition-all duration-300 hover:border hover:border-[#ff202a] hover:shadow-[0_8px_20px_rgba(255,32,42,0.2)] sm:w-auto sm:p-6"
              role="listitem"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/[0.04] to-transparent" />

              <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-[#ff202a]/10 from-0% to-transparent to-40% opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-1 flex-col">
                <span className="mb-0 font-['clother',sans-serif] text-2xl font-light text-[#AEAEAE] sm:text-[28px]">
                  {service.number}
                </span>

                <div className="mb-4 flex flex-1 items-center justify-center">
                  <div className="relative h-[174.61px] w-full max-w-[285px] opacity-100 lg:h-[179px] lg:max-w-[245px]">
                    <Image
                      src={service.illustration}
                      alt={service.title}
                      fill
                      className="object-contain object-center"
                      sizes="(min-width: 1024px) 245px, (min-width: 640px) 285px, 85vw"
                    />
                  </div>
                </div>

                <h3 className="mb-3 font-['clother',sans-serif] text-[20px] font-normal leading-[32px] tracking-normal text-white">
                  {service.title}
                </h3>

                <p className="mb-6 flex-1 text-[16px] font-normal leading-[24px] tracking-normal text-[#AEAEAE]">
                  {service.description}
                </p>

                <ExploreLink href={service.slug} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex justify-center sm:hidden">
          <DotNav
            count={services.length}
            activeIndex={activeIndex}
            onSelect={goTo}
            labelFor={(i) => services[i].title}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-0 h-[260px] w-[260px] opacity-60 sm:h-[320px] sm:w-[320px] lg:-right-10 lg:bottom-0 lg:h-[420px] lg:w-[420px]"
      >
        <Image
          src="/images/Service%20listing/Vector-2.svg"
          alt=""
          fill
          className="object-contain object-bottom object-right"
          sizes="(min-width: 1024px) 420px, 320px"
        />
      </div>
    </section>
  );
}
