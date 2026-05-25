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
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
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
            start: () => `top+=${(index - 1) * window.innerHeight} top`,
            end: () => `top+=${index * window.innerHeight} top`,
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
          0
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
          0
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
            0
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
            services.length - 1
          );
          setActiveIndex(idx);
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToCard = (index: number) => {
    if (!sectionRef.current) return;
    const sectionTop =
      sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const targetScroll = sectionTop + index * window.innerHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#050505]">
      {/* DOTS */}
      <InteractiveDots variant="dark" />

      <div className="relative z-10">
        {/* HERO */}
        <div className="relative min-h-[50vh] flex items-center px-6 lg:px-16 xl:px-24 pt-20">
          <div className="max-w-7xl mx-auto w-full relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* LEFT - FULL WIDTH */}
              <div className="lg:col-span-12">
                <div className="mb-6">
                  <span
                    className="text-[#ff3b30] uppercase text-[18px] lg:text-[28px]"
                    style={{
                      fontFamily: '"clother", sans-serif;',
                    }}
                  >
                    Six Thrusters, One Engine
                  </span>
                </div>

                <h1
                  className="text-white mb-8 uppercase"
                  style={{
                    fontFamily: '"clother", sans-serif;',
                    fontWeight: 700,
                  }}
                >
                  <span className="block lg:hidden text-[38px] leading-[40px]">
                    SIX THINGS WE
                  </span>

                  <span className="block lg:hidden text-[38px] leading-[40px]">
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
                  className="text-white/50 max-w-xl mb-10 text-base lg:text-lg"
                  style={{
                    fontFamily: '"clother", sans-serif;',
                    fontWeight: 700,
                    lineHeight: "24px",
                  }}
                >
                  Each capability is a thruster.
                  Together, they are the engine
                  that takes brands from the
                  launchpad to orbit.
                </p>

                <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
              </div>
            </div>

           
          </div>
           {/* ORBIT IMAGE - OUTSIDE CONTAINER ON RIGHT */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 xl:right-0">
              <Image
                src="/images/six-things-orbital.png"
                alt="Six Things Orbital"
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>
        </div>

        {/* CINEMATIC STACKED CARDS */}
        <div
          ref={sectionRef}
          className="relative w-full"
          style={{
            height: `${services.length * 100}vh`,
          }}
        >
          <div
            className="sticky top-0 left-0 w-full h-screen"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="absolute inset-0 w-full h-screen flex items-center justify-center will-change-transform"
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
                    w-[361px]
                    lg:w-[1280px]
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
                    <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-12">
                      {/* LEFT */}
                      <div className="flex-1">
                        {/* NUMBER */}
                        <div
                          className="mb-10 tracking-tight leading-none"
                          style={{
                            fontFamily: '"clother", sans-serif;',
                            fontWeight: 300,
                            fontSize: "28px",
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
                            fontFamily: '"clother", sans-serif;',
                            fontWeight: 400,
                            fontSize: "24px",
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
                      <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                        <div className="relative w-[500px] h-[350px] lg:w-[500px] lg:h-[350px] xl:w-[500px] xl:h-[350px] opacity-60">
                          <img
                            src={service.illustration}
                            alt={service.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* SQUARE NAVIGATION — Desktop: vertical right of card */}
            <div
              className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3"
              style={{ left: "calc(50% + 640px + 32px)" }}
            >
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => scrollToCard(index)}
                  aria-label={`Go to ${service.title}`}
                  className={`
                    w-2 h-2 transition-all duration-300
                    ${
                      index === activeIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/60"
                    }
                  `}
                />
              ))}
            </div>

            {/* SQUARE NAVIGATION — Mobile: horizontal bottom */}
            <div className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => scrollToCard(index)}
                  aria-label={`Go to ${service.title}`}
                  className={`
                    w-2 h-2 transition-all duration-300
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