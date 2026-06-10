"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { services } from "../../data/services";
import { scrollToY } from "../../lib/lenis-instance";
import { createIndexTracker } from "../../lib/scroll-utils";
import InteractiveDots from "../InteractiveDots";
import PremiumCTA from "../PremiumCTA";

gsap.registerPlugin(ScrollTrigger);

type Service = (typeof services)[number];

const StackCard = memo(function StackCard({ service }: { service: Service }) {
  return (
    <div
      className="
        relative
        bg-[#1B1B1B]
        border
        border-[1px]
        border-white/10
        rounded-[15px]
        shadow-2xl
        h-[627px]
        lg:w-[1280px]
        md:w-[770px]
        md:h-[330px]
        lg:h-auto
        lg:min-h-[400px]
        overflow-visible
        gpu-layer
      "
      style={{
        boxShadow: "0 30px 80px rgba(0,0,0,.55)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row md:flex-row items-start gap-5 lg:gap-12">
          <div className="flex-1">
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
                style={{ fontSize: "42px", lineHeight: "50px" }}
              >
                {service.number}
              </span>
              <span className="lg:hidden">{service.number}</span>
            </div>

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

            <p className="text-white/60 text-base lg:text-lg leading-relaxed mb-4 max-w-xl font-light">
              {service.description}
            </p>

            <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
          </div>

          <div className="w-full md:w-[280px] lg:w-auto flex justify-center lg:justify-end">
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
  );
});

const DotNav = memo(function DotNav({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3"
      style={{ left: "calc(50% + 640px + 32px)" }}
    >
      {services.map((service, index) => (
        <button
          key={service.id}
          onClick={() => onSelect(index)}
          aria-label={`Go to ${service.title}`}
          aria-current={index === activeIndex ? "true" : undefined}
          className={`
            w-2 h-2 rounded-full transition-opacity duration-300
            ${
              index === activeIndex
                ? "bg-white opacity-100"
                : "bg-white/30 opacity-60 hover:opacity-80"
            }
          `}
        />
      ))}
    </div>
  );
});

export default function Sticky3DStackCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dotsViewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.innerWidth < 1024;

      cards.forEach((card, index) => {
        gsap.set(card, {
          transformOrigin: "center center",
          transformPerspective: isMobile ? 800 : 1200,
          force3D: true,
        });

        if (index === 0) return;

        gsap.set(card, {
          yPercent: 100,
          scale: 1,
          opacity: 1,
        });
      });

      const prevCardProps = isMobile
        ? {
            scale: 0.97,
            opacity: 0.35,
            transformOrigin: "center bottom",
            force3D: true,
            ease: "none" as const,
            duration: 1,
          }
        : {
            scale: 0.94,
            scaleY: 0.96,
            rotateX: 12,
            rotateZ: 0.4,
            z: -80,
            opacity: 0.4,
            transformOrigin: "center bottom",
            force3D: true,
            ease: "none" as const,
            duration: 1,
          };

      const scrubAmount = isReducedMotion ? true : isMobile ? 0.3 : 0.5;

      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCard = cards[index - 1];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${(index - 1) * window.innerHeight} top`,
            end: () => `top+=${index * window.innerHeight} top`,
            scrub: scrubAmount,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        tl.to(
          card,
          {
            yPercent: 0,
            force3D: true,
            ease: "none",
            duration: 1,
          },
          0
        );

        tl.to(prevCard, prevCardProps, 0);

        for (let i = 0; i < index - 1; i++) {
          tl.to(
            cards[i],
            {
              opacity: 0,
              force3D: true,
              ease: "none",
              duration: 1,
            },
            0
          );
        }
      });

      const updateActiveIndex = createIndexTracker(setActiveIndex);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * services.length),
            services.length - 1
          );
          updateActiveIndex(idx);
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToCard = useCallback((index: number) => {
    if (!sectionRef.current) return;
    const sectionTop =
      sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const targetScroll = sectionTop + index * window.innerHeight;
    scrollToY(targetScroll);
  }, []);

  return (
    <section className="relative bg-[#050505]">
      <div className="relative z-10">
        {/* HERO */}
        <div
          className="relative min-h-auto md:min-h-[50vh] md:min-h-fit flex items-center px-6 lg:px-16 xl:px-24 pt-20 md:pt-10 md:items-center"
        >
          <div className="max-w-7xl mx-auto w-full relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
                    style={{ fontSize: "134px", lineHeight: "134px" }}
                  >
                    SIX THINGS WE
                  </span>
                  <span
                    className="hidden lg:block"
                    style={{ fontSize: "134px", lineHeight: "134px" }}
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
          className="relative w-full md:min-w-full"
          style={{ height: `${services.length * 100}vh` }}
        >
          <div
            ref={dotsViewportRef}
            className="sticky top-0 left-0 w-full h-screen md:pt-2 stack-perspective"
          >
            <div className="absolute inset-0 z-[1] pointer-events-none">
              <InteractiveDots
                variant="dark"
                containerRef={dotsViewportRef}
              />
            </div>

            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="absolute inset-0 w-full h-screen flex items-center justify-center md:pt-0 lg:pt-0 gpu-layer"
                style={{ zIndex: index + 1 }}
              >
                <StackCard service={service} />
              </div>
            ))}

            <DotNav activeIndex={activeIndex} onSelect={scrollToCard} />
          </div>
        </div>
      </div>
    </section>
  );
}
