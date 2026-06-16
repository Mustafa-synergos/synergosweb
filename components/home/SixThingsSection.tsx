"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { services } from "../../data/services";
import InteractiveDots from "../InteractiveDots";
import PremiumCTA from "../PremiumCTA";

gsap.registerPlugin(ScrollTrigger);

export default function Sticky3DStackCards() {
  const heroDotsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dotsViewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardScrollDistance, setCardScrollDistance] = useState(0);

  useEffect(() => {
    const getCardScrollDistance = () => {
      if (window.innerWidth >= 1024) return window.innerHeight;
      if (window.innerWidth >= 768) {
        return Math.min(window.innerHeight * 0.58, 460);
      }
      return window.innerHeight;
    };

    const updateCardScrollDistance = () => {
      setCardScrollDistance(getCardScrollDistance());
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    updateCardScrollDistance();
    window.addEventListener("resize", updateCardScrollDistance);

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);

      // Set initial states
      cards.forEach((card, index) => {
        gsap.set(card, {
          transformOrigin: "center center",
          transformPerspective: 1200,
        });

        if (index === 0) return;

        gsap.set(card, {
          yPercent: 100,
          scale: 1,
          opacity: 1,
        });
      });

      // Scroll-driven cinematic transitions
      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCard = cards[index - 1];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${(index - 1) * getCardScrollDistance()} top`,
            end: () => `top+=${index * getCardScrollDistance()} top`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Incoming card rises from bottom to take over viewport
        tl.to(
          card,
          {
            yPercent: 0,
            ease: "none",
            duration: 1,
          },
          0,
        );

        // Previous card folds backward into depth
        tl.to(
          prevCard,
          {
            scale: 0.94,
            scaleY: 0.96,
            rotateX: 14,
            rotateZ: 0.6,
            skewX: 0.5,
            z: -100,
            opacity: 0.4,
            filter: "blur(2px)",
            transformOrigin: "center bottom",
            ease: "none",
            duration: 1,
          },
          0,
        );

        // Hide all older cards so only the active + immediate previous are visible
        for (let i = 0; i < index - 1; i++) {
          tl.to(
            cards[i],
            {
              opacity: 0,
              ease: "none",
              duration: 1,
            },
            0,
          );
        }
      });

      // Progress tracker for dot navigation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: false,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * services.length),
            services.length - 1,
          );
          setActiveIndex(idx);
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      window.removeEventListener("resize", updateCardScrollDistance);
      ctx.revert();
    };
  }, []);

  const scrollToCard = (index: number) => {
    if (!sectionRef.current) return;
    const sectionTop =
      sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const targetScroll = sectionTop + index * (cardScrollDistance || window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };
  // const [isDesktop, setIsDesktop] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsDesktop(window.innerWidth >= 1024);
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
  return (
    <section className="relative bg-[#050505]">
      <div className="relative z-10">
        {/* HERO */}
        <div
          ref={heroDotsRef}
          className="relative min-h-auto md:min-h-[50vh] md:min-h-fit flex items-center px-6 lg:px-16 xl:px-24 pt-20 md:pt-10 md:items-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <InteractiveDots containerRef={heroDotsRef} variant="dark" />
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ">
              {/* LEFT - FULL WIDTH */}
              <div className="lg:col-span-12">
                <div className="!mb-0 lg:!mb-0">
                  <span
                    className="text-[#ff3b30] text-[18px] md:text-[20px] lg:text-[28px]"
                    style={{
                      fontFamily: '"clother", sans-serif',
                      fontWeight: 400,
                      textTransform: "capitalize",
                    }}
                  >
                    Six Thrusters, One Engine
                  </span>
                </div>

                <h1
                  className="text-white !mb-0 lg:!mb-2 !mt-0 lg:!mt-0 uppercase"
                  style={{
                    fontFamily: '"clother", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  <span className="block md:text-[80px] md:leading-[80px] lg:hidden text-[38px] leading-[40px]">
                    SIX THINGS WE
                  </span>

                  <span className="block md:text-[80px] md:leading-[80px] lg:hidden text-[38px] leading-[40px]">
                    ARE GOOD AT.
                  </span>

                  <span
                    className="hidden lg:block"
                    style={{
                      fontSize: "134px",
                      lineHeight: "134px",
                    }}
                  >
                    SIX THINGS WE
                  </span>

                  <span
                    className="hidden lg:block"
                    style={{
                      fontSize: "134px",
                      lineHeight: "134px",
                    }}
                  >
                    ARE GOOD AT.
                  </span>
                </h1>

                <p
                  className="text-white max-w-[850px] mb-4 md:mb-2 lg:mb-10 text-base lg:text-lg"
                  style={{
                    fontFamily: '"clother", sans-serif',
                    fontWeight: 200,
                    lineHeight: "1.5",
                    fontStyle: "normal",
                    fontSize: "18px",
                  }}
                >
                  Each capability is a thruster. Together, they are the engine
                  that takes brands from the launchpad to orbit.
                </p>

                <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
              </div>
            </div>
          </div>
          {/* ORBIT IMAGE - OUTSIDE CONTAINER ON RIGHT */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 xl:right-0 z-10">
            <Image
              src="/images/six-things-orbital.svg"
              alt="Six Things Orbital"
              width={400}
              height={400}
              className="w-full h-full object-contain opacity-40"
            />
          </div>
        </div>

        {/* CINEMATIC STACKED CARDS */}
        <div
          ref={sectionRef}
          className="relative w-full md:min-w-full"
          style={{
            height: cardScrollDistance
              ? `calc(100vh + ${(services.length - 1) * cardScrollDistance}px)`
              : `${services.length * 100}vh`,
            // height: `${(services.length - 1) * 110}vh`
            // height: `${(services.length - 1) * (isDesktop ? 110 : 70)}vh`,
            // height: `${services.length * 100 - 100}vh`,
          
          }}
        >
          <div
            ref={dotsViewportRef}
            className="sticky top-0 left-0 w-full h-screen md:pt-0"
            style={{
              perspective: "1280px",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <InteractiveDots containerRef={dotsViewportRef} variant="dark" />
            </div>

            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="absolute inset-0 w-full h-screen md:h-auto flex items-center  md:items-center
lg:items-center
justify-center
md:py-6
lg:py-0

                justify-center will-change-transform"
                style={{
                  zIndex: index + 1,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="
                    relative
                    bg-[#1B1B1B]
                    border
                    border-[1px]
                    border-white/10
                    rounded-[15px]
                    shadow-2xl
                    w-full
                    max-w-[1280px]
                    lg:max-w-[1280px]
                    md:w-full
                    md:max-w-[800px]
                    h-[627px]
                    md:h-auto
                    md:min-h-[330px]
                    lg:h-auto
                    lg:min-h-[400px]
                    overflow-visible
                  "
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 30px 80px rgba(0,0,0,.55)",
                  }}
                >
                  {/* glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                  <div className="relative z-10 p-8">
                    <div
                      className="flex flex-col lg:flex-row md:flex-row
                    items-start gap-5 lg:gap-12"
                    >
                      {/* LEFT */}
                      <div className="flex-1">
                        {/* NUMBER */}
                        <div
                          className="mb-2 lg:mb-10 tracking-tight leading-none"
                          style={{
                            fontFamily: '"clother", sans-serif',
                            fontWeight: 300,
                            fontSize: "24px",
                            lineHeight: "32px",
                            color: "#AEAEAE",
                          }}
                        >
                          <span
                            className="hidden lg:inline"
                            style={{
                              fontSize: "42px",
                              lineHeight: "50px",
                            }}
                          >
                            {service.number}
                          </span>

                          <span className="lg:hidden">{service.number}</span>
                        </div>

                        {/* TITLE */}
                        <h3
                          className="mb-4 leading-tight uppercase lg:normal-case"
                          style={{
                            fontFamily: '"clother", sans-serif',
                            fontWeight: 400,
                            fontSize: "22px",
                            lineHeight: "32px",
                            color: "#AEAEAE",
                          }}
                        >
                          <span
                            className="hidden lg:inline"
                            style={{
                              fontWeight: 300,
                              fontSize: "42px",
                              lineHeight: "50px",
                              textTransform: "none",
                            }}
                          >
                            {service.title}
                          </span>

                          <span className="lg:hidden">{service.title}</span>
                        </h3>

                        {/* DESC */}
                        <p className="text-white/60 text-base lg:text-lg leading-relaxed mb-4 max-w-xl font-light">
                          {service.description}
                        </p>

                        {/* BUTTON */}
                        <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
                      </div>

                      {/* RIGHT */}
                      <div
                        className="w-full md:w-[280px]
                      lg:w-auto flex justify-center lg:justify-end"
                      >
                        <div className="relative opacity-60">
                          <Image
                            src={service.illustration}
                            alt={service.title}
                            width={400}
                            height={400}
                            className="w-full h-auto object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* SQUARE NAVIGATION — Desktop: vertical right of card */}
            <div className="hidden md:hidden lg:flex absolute top-1/2 right-20 -translate-y-1/3 z-50 flex-col items-center gap-3">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => scrollToCard(index)}
                  aria-label={`Go to ${service.title}`}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${
                      index === activeIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/60"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
