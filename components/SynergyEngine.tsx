'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveDots from './InteractiveDots';

gsap.registerPlugin(ScrollTrigger);

const engineCards = [
  {
    title: 'STRATEGY',
    description: 'The compass. Before ignition, there must be sight. We excavate the deeper truths buried in data, behaviour, and market friction. Strategy answers the fundamental question:',
    question: 'why?',
    icon: (
      <img 
        src="/images/strategy.svg" 
        alt="Strategy" 
        className="w-full h-full max-w-full object-contain"
      />
    )
  },
  {
    title: 'STORYTELLING',
    description: 'The fuel. A strategy without narrative is a map without roads. We craft stories that burrow into memory — digital, film, offline — each channel speaking in the same voice. Storytelling answers the question that matters most:',
    question: 'how will they feel?',
    icon: (
      <img 
        src="/images/Storytelling.svg" 
        alt="Storytelling" 
        className="w-full h-full max-w-full object-contain"
      />
    )
  },
  {
    title: 'DELIVERY',
    description: 'The thrust. A vision without velocity remains a dream. From SEO to performance marketing, from social media to studio production. Delivery answers the question:',
    question: 'what happens now?',
    icon: (
      <img 
        src="/images/Delivery.svg" 
        alt="Delivery" 
        className="w-full h-full max-w-full object-contain"
      />
    )
  },
  // {
  //   title: 'PRODUCTION',
  //   description: 'Turning vision into high-impact visual assets and experiences.',
  //   question: 'how will they feel?',
  //   icon: (
  //     <img 
  //       src="/images/Storytelling and identity.png" 
  //       alt="Production" 
  //       className="w-full h-full max-w-full object-contain"
  //     />
  //   )
  // }
];

export default function SynergyEngine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const deskVectorRef = useRef<HTMLDivElement>(null);
  const deskHeadingRef = useRef<HTMLDivElement>(null);
  const deskCardsRef = useRef<HTMLDivElement>(null);
  const mobHeadingRef = useRef<HTMLDivElement>(null);
  const mobCardsRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {


 
    const elements = document.querySelectorAll(
      '.responsive-clother-paragraph'
    ) as NodeListOf<HTMLElement>;

    let maxHeight = 0;

    elements.forEach((el) => {
      el.style.height = 'auto';
      maxHeight = Math.max(maxHeight, el.offsetHeight);
    });

    elements.forEach((el) => {
      el.style.height = `${maxHeight}px`;
    });



    const ctx = gsap.context(() => {
      /* ================================================================
         DESKTOP — Cinematic staged scroll: ENTER → PIN → HOLD → SLIDE
         ================================================================ */
      if (window.innerWidth >= 1024) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=250%',
            scrub: 0.5,
            pin: true,
            anticipatePin: 0.5,
            pinSpacing: true,
          }
        });

        /* ── STAGE 1 : HOLD (0 % → 10 %)
           Pinned, static. Only CSS float. No GSAP motion. */

        /* ── STAGE 2 : SLIDE (10 % → 90 %)
           Entire composition drifts left across viewport.
           All 3 elements participate with individual parallax. */

        // Container — master leftward drift
        tl.fromTo(containerRef.current,
          { x: 0 },
          { x: -900, duration: 0.8, ease: 'power1.inOut' },
          0.1
        );

        // Vector — counter-drift (heavier, stays in frame longer)
        tl.fromTo(deskVectorRef.current,
          { x: 0 },
          { x: -550, duration: 0.8, ease: 'power1.inOut' },
          0.1
        );

        // Heading — drifts left with container
        tl.fromTo(deskHeadingRef.current,
          { x: 0 },
          { x: -650, duration: 0.8, ease: 'power1.inOut' },
          0.1
        );

        // Cards — fastest drift, traverse from right to center
        tl.fromTo(deskCardsRef.current,
          { x: 0 },
          { x: -500, duration: 0.8, ease: 'power1.inOut' },
          0.1
        );
      }

      /* ================================================================
         MOBILE / TABLET — Vertical scroll with staggered reveals
         ================================================================ */
      else {
        gsap.fromTo(mobHeadingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 1, ease: 'power2.out',
            scrollTrigger: {
              trigger: mobHeadingRef.current,
              start: 'top 85%', end: 'top 60%',
              scrub: 0.5,
            }
          }
        );

        const slider = mobileSliderRef.current;
        if (slider) {
          const cardElements = slider.children;
          if (cardElements.length > 0) {
            gsap.fromTo(cardElements,
              { opacity: 0, x: 60 },
              {
                opacity: 1, x: 0,
                duration: 0.8, stagger: 0.15, ease: 'power2.out',
                scrollTrigger: {
                  trigger: mobCardsRef.current,
                  start: 'top 85%', end: 'bottom 60%',
                  scrub: 0.5,
                }
              }
            );
          }
        }
      }

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
    }, sectionRef);

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mobile carousel scroll tracking
  useEffect(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const cardWidth = slider.offsetWidth * 0.88;
      const index = Math.round(slider.scrollLeft / cardWidth);
      setActiveCard((prev) => (prev !== index ? index : prev));
    };

    slider.addEventListener('scroll', handleScroll);
    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] lg:min-h-screen overflow-hidden" style={{ backgroundColor: '#FF0000' }}>

      {/* ── Interactive Dots Background ── */}
      <InteractiveDots variant="red" />

      {/* ── Ambient glow ── */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl pointer-events-none"  />

      {/* ==============================================================
          DESKTOP — Single-viewport tight composition (no gaps)
          ============================================================== */}
      <div className="hidden lg:block h-screen overflow-hidden">
        <div ref={containerRef} className="h-full flex items-center px-6 lg:px-8">
          <div className="flex items-center gap-20 xl:gap-24 w-full max-w-7xl mx-auto">

            {/* ── Vector ── */}
            <div ref={deskVectorRef} className="jsx-96a4049c8728edbe relative flex-shrink-0 animate-float" style={{ width: '564px', height: '397px', left: '-50px', top: '-18px' }}>
              <Image
                src="/images/Frame 71.png"
                alt="Synergy Engine Vector"
                width={564}
                height={397}
                className="w-full h-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full -z-10" />
            </div>

            {/* ── Heading ── */}
            <div ref={deskHeadingRef} className="flex-shrink-0">
              <h2 className="responsive-synergy-heading text-white mb-4">
                THE
                <br />
                SYNERGY
                <br />
                ENGINE
              </h2>
              <p className="synergy-select-text text-white/90 hidden md:block mt-2" style={{ textTransform: 'none' , letterSpacing: '0.01em' }}>
                Three Pillars, Always Together:
              </p>
            </div>

            {/* ── Cards (all 4, tight) ── */}
            <div ref={deskCardsRef} className="flex gap-6 xl:gap-8 flex-shrink-0 will-change-transform">
              {engineCards.map((card, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[480px] h-[730px] rounded-[28px] shadow-2xl p-7 xl:p-8 flex flex-col transition-all duration-500 hover:scale-[1.02] relative overflow-hidden" style={{ backgroundColor: '#171717' }}
                >
                  {/* Interactive Dots Background */}
                  <InteractiveDots variant="card" className="rounded-[28px]" />
                  {/* Content overlay */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Icon — large top placement with fixed height */}
                    <div className="h-[450px] flex items-start justify-center pt-2">
                      <div className="w-full h-full max-w-[350px] flex items-center justify-center">
                        {card.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-shrink-0 flex flex-col justify-between h-[180px]">
                      <div>
                        <h3 className="responsive-clother-h3 text-white mb-3">
                          {card.title}
                        </h3>
                        <p className="responsive-clother-paragraph max-h-[120px]">
                          {card.description}
                        </p>
                      </div>
                      <a href='#' className="responsive-clother-red-span text-red-500 lowercase mt-3">
                        {card.question}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ==============================================================
          MOBILE / TABLET — Vertical stack layout with carousel
          ============================================================== */}
      <div className="lg:hidden relative z-20 py-8 px-4 sm:px-6 pb-16">
        {/* Heading - Left aligned at top */}
        <div ref={mobHeadingRef} className="relative mb-8">
          <h2 className="responsive-synergy-heading text-white text-left">
            THE
            <br />
            SYNERGY
            <br />
            ENGINE
          </h2>
        </div>

        {/* Cards Carousel */}
        <div ref={mobCardsRef} className="relative">
          <div
            ref={mobileSliderRef}
            data-lenis-prevent
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 hide-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {engineCards.map((card, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[88vw] snap-center rounded-2xl p-5 flex flex-col relative z-10 overflow-hidden h-[450px] lg:h-[520px] mr-4 last:mr-0"
                style={{ backgroundColor: '#171717' }}
              >
                {/* Interactive Dots Background */}
                <InteractiveDots variant="card" className="rounded-2xl" />
                {/* Content overlay */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="h-[200px] flex-shrink-0 flex items-center justify-center pt-2">
                    <div className="w-full h-full max-w-[180px] flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-white text-xl font-bold flex-shrink-0">
                      {card.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed flex-1 overflow-hidden">
                      {card.description}
                    </p>
                    <a href="#" className="text-red-500 text-sm lowercase flex-shrink-0">
                      {card.question}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {engineCards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  mobileSliderRef.current?.scrollTo({
                    left: index * (window.innerWidth * 0.88),
                    behavior: 'smooth',
                  });
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeCard === index
                    ? 'w-6 bg-white'
                    : 'w-2 bg-gray-500'
                } h-2`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
