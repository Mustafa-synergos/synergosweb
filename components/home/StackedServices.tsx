"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { services, type Service } from "../../data/services";
import InteractiveDots from "../InteractiveDots";
import PremiumCTA from "../PremiumCTA";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll distance per card on desktop, as a fraction of one viewport height.
 * Lower = cards switch faster on scroll. 1 = one full screen per card.
 */
const STEP_FACTOR = 1;

/** Tuning for how the "passed" card peeks above the active one. */
const PEEK = {
  lift: 12, // % the previous card lifts upward
  scaleDrop: 0.08, // how much it shrinks
  opacity: 0.45, // resting opacity of the peeking card
  blur: 1.5, // px blur of the peeking card
  rotateX: 6, // subtle backward tilt
  depth: 80, // z translation into the screen
};

/** Minimum swipe distance (px) to trigger a slide on touch devices. */
const SWIPE_THRESHOLD = 45;

export default function StackedServices() {
  const heroRef = useRef<HTMLDivElement>(null);
  const dotsViewportRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const count = services.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Decide which experience to render.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* =========================================================
     DESKTOP — scroll-driven stacking
  ========================================================= */
  useEffect(() => {
    if (!isDesktop) return;
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length || !sectionRef.current) return;

    let lastIdx = -1;

    const ctx = gsap.context(() => {
      // Matches the original SixThingsSection: incoming card rises from the
      // bottom, the previous card folds backward into depth (origin bottom).
      const applyStack = (activeFloat: number) => {
        cards.forEach((card, i) => {
          const d = activeFloat - i;
          const t = Math.min(Math.max(d, 0), 1); // fold progress for prev card

          let yPercent = 0;
          let scale = 1;
          let scaleY = 1;
          let opacity = 1;
          let blur = 0;
          let rotateX = 0;
          let rotateZ = 0;
          let skewX = 0;
          let z = 0;

          if (d <= -1) {
            // Future card waiting just below the viewport.
            yPercent = 100;
          } else if (d <= 0) {
            // Rising up to take over the viewport.
            yPercent = -d * 100;
          } else if (d <= 1) {
            // Previous card folds backward into depth.
            scale = 1 - 0.06 * t;
            scaleY = 1 - 0.04 * t;
            rotateX = 14 * t;
            rotateZ = 0.6 * t;
            skewX = 0.5 * t;
            z = -100 * t;
            opacity = 1 - 0.6 * t;
            blur = 2 * t;
          } else {
            // Older cards hidden behind the stack.
            scale = 0.94;
            scaleY = 0.96;
            rotateX = 14;
            z = -100;
            opacity = 0;
            blur = 2;
          }

          gsap.set(card, {
            yPercent,
            scale,
            scaleY,
            rotateX,
            rotateZ,
            skewX,
            z,
            opacity,
            filter: blur ? `blur(${blur}px)` : "none",
            transformOrigin: "center bottom",
            transformPerspective: 1200,
          });
        });
      };

      applyStack(0);

      const proxy = { p: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.to(proxy, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          const activeFloat = proxy.p * (count - 1);
          applyStack(activeFloat);
          const idx = Math.round(activeFloat);
          if (idx !== lastIdx) {
            lastIdx = idx;
            setActiveIndex(idx);
          }
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    // Lazy-loaded sections above this one change the page height after mount,
    // which leaves ScrollTrigger with stale positions (cards look hidden until
    // you scroll far past). Re-measure as the layout settles.
    const refresh = () => ScrollTrigger.refresh();
    const rafId = requestAnimationFrame(refresh);
    const settleTimer = window.setTimeout(refresh, 500);
    window.addEventListener("load", refresh);

    let debounce: number | undefined;
    const ro = new ResizeObserver(() => {
      if (debounce) window.clearTimeout(debounce);
      debounce = window.setTimeout(refresh, 150);
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      if (debounce) window.clearTimeout(debounce);
      window.removeEventListener("load", refresh);
      ro.disconnect();
      ctx.revert();
    };
  }, [isDesktop, count]);

  /* =========================================================
     MOBILE / TABLET — swipeable slider
  ========================================================= */
  const goTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), count - 1);

    if (isDesktop) {
      const section = sectionRef.current;
      if (!section) return;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;
      const ratio = count > 1 ? clamped / (count - 1) : 0;
      window.scrollTo({
        top: start + (end - start) * ratio,
        behavior: "smooth",
      });
      return;
    }

    setActiveIndex(clamped);
  };

  // Vertical swipe to change cards. We lock the page scroll only while moving
  // between cards, and release it at the first/last card so the user can scroll
  // out of the section. preventDefault needs a non-passive listener.
  useEffect(() => {
    if (isDesktop) return;
    const el = sliderRef.current;
    if (!el) return;

    let startY = 0;
    let decided = false;
    let consuming = false;
    let dy = 0;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      decided = false;
      consuming = false;
      dy = 0;
    };

    const onMove = (e: TouchEvent) => {
      dy = e.touches[0].clientY - startY;

      if (!decided && Math.abs(dy) > 8) {
        decided = true;
        const goingNext = dy < 0; // swipe up → next
        consuming = goingNext
          ? activeIndexRef.current < count - 1
          : activeIndexRef.current > 0;
      }

      // Block the page from scrolling while we're moving between cards.
      if (decided && consuming) e.preventDefault();
    };

    const onEnd = () => {
      if (consuming && Math.abs(dy) >= SWIPE_THRESHOLD) {
        if (dy < 0) setActiveIndex((i) => Math.min(i + 1, count - 1));
        else setActiveIndex((i) => Math.max(i - 1, 0));
      }
      decided = false;
      consuming = false;
      dy = 0;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [isDesktop, count]);

  // Discrete transform for slider cards (CSS-transitioned).
  const sliderStyle = (i: number): React.CSSProperties => {
    const d = activeIndex - i;

    let translateY = 0;
    let scale = 1;
    let opacity = 1;
    let blur = 0;
    let rotateX = 0;
    let z = 0;

    if (d === 0) {
      // active
    } else if (d === 1) {
      translateY = -PEEK.lift;
      scale = 1 - PEEK.scaleDrop;
      opacity = PEEK.opacity;
      blur = PEEK.blur;
      rotateX = PEEK.rotateX;
      z = -PEEK.depth;
    } else if (d < 0) {
      // upcoming card waiting below
      translateY = 100;
      opacity = 0;
    } else {
      // older cards hidden behind
      translateY = -PEEK.lift;
      scale = 1 - PEEK.scaleDrop;
      opacity = 0;
      rotateX = PEEK.rotateX;
      z = -PEEK.depth;
    }

    return {
      zIndex: i,
      opacity,
      filter: blur ? `blur(${blur}px)` : "none",
      transform: `translateY(${translateY}%) translateZ(${z}px) rotateX(${rotateX}deg) scale(${scale})`,
      transformOrigin: "center top",
      transition:
        "transform 0.6s cubic-bezier(0.76,0,0.24,1), opacity 0.6s ease, filter 0.6s ease",
      willChange: "transform, opacity",
    };
  };

  return (
    <section className="relative bg-[#050505] text-white">
      {/* HERO */}
      <div ref={heroRef} className="relative flex items-center overflow-hidden px-6 lg:px-16 xl:px-24 pt-20 md:pt-10">
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <InteractiveDots variant="dark" containerRef={heroRef} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
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

          <h1
            className="text-white !mt-0 !mb-0 lg:!mb-2 uppercase"
            style={{ fontFamily: '"clother", sans-serif', fontWeight: 700 }}
          >
            <span className="block text-[38px] leading-[40px] md:text-[80px] md:leading-[80px] lg:hidden">
              SIX THINGS WE
            </span>
            <span className="block text-[38px] leading-[40px] md:text-[80px] md:leading-[80px] lg:hidden">
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
            className="text-white max-w-[850px] mb-4 md:mb-2 lg:mb-10"
            style={{
              fontFamily: '"clother", sans-serif',
              fontWeight: 200,
              lineHeight: "1.5",
              fontSize: "18px",
            }}
          >
            Each capability is a thruster. Together, they are the engine that
            takes brands from the launchpad to orbit.
          </p>

          <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
        </div>

        {/* ORBIT IMAGE */}
       <div className="hidden lg:block absolute z-10 right-0 top-1/2 -translate-y-1/2 xl:right-0">
                   <Image
                     src="/images/six-things-orbital.svg"
                     alt="Six Things Orbital"
                     width={400}
                     height={400}
                     className="w-full h-full object-contain opacity-40"
                   />
                 </div>
      </div>

      {/* STACKED CARDS */}
      {isDesktop ? (
        /* ---------- DESKTOP: scroll-driven ---------- */
        <div
          ref={sectionRef}
          className="relative w-full"
          style={{ height: `${100 + (count - 1) * 100 * STEP_FACTOR}svh` }}
        >
          <div
            ref={dotsViewportRef}
            className="sticky top-0 left-0 h-[100svh] w-full overflow-hidden"
            style={{ perspective: "1300px", transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 z-[1] pointer-events-none">
              <InteractiveDots variant="dark" containerRef={dotsViewportRef} />
            </div>

            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6 lg:px-16 py-5 sm:py-6 will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <ServiceCard service={service} />
              </div>
            ))}

            <DotNav
              count={count}
              activeIndex={activeIndex}
              onSelect={goTo}
              labelFor={(i) => services[i].title}
            />
          </div>
        </div>
      ) : (
        /* ---------- MOBILE / TABLET: swipeable slider ---------- */
        <div
          ref={sliderRef}
          className="relative w-full overflow-hidden px-4 pb-16 pt-14 sm:px-6"
          style={{ perspective: "1300px", transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <InteractiveDots variant="dark" containerRef={sliderRef} />
          </div>

          {/* Single-cell grid: container hugs the tallest card, cards overlap */}
          <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="col-start-1 row-start-1"
                style={sliderStyle(index)}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <DotNav
            count={count}
            activeIndex={activeIndex}
            onSelect={goTo}
            labelFor={(i) => services[i].title}
          />
        </div>
      )}
    </section>
  );
}

/* =========================================================
   CARD VISUAL (shared by both modes)
========================================================= */
function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      className="
        relative
        w-full max-w-[1280px]
        h-auto lg:min-h-[400px]
        rounded-[15px] border border-white/10 bg-[#1B1B1B]
      "
      style={{ boxShadow: "0 30px 80px rgba(0,0,0,.55)" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[15px] bg-gradient-to-br from-white/[0.04] to-transparent" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col md:flex-row items-start gap-5 lg:gap-12">
          {/* LEFT */}
          <div className="flex-1">
            <div
              className="mb-2 lg:mb-10 leading-none tracking-tight"
              style={{
                fontFamily: '"clother", sans-serif',
                fontWeight: 300,
                color: "#AEAEAE",
              }}
            >
              <span
                className="hidden lg:inline"
                style={{ fontSize: "42px", lineHeight: "50px" }}
              >
                {service.number}
              </span>
              <span
                className="lg:hidden"
                style={{ fontSize: "24px", lineHeight: "32px" }}
              >
                {service.number}
              </span>
            </div>

            <h3
              className="mb-4 uppercase leading-tight lg:normal-case"
              style={{ fontFamily: '"clother", sans-serif', color: "#AEAEAE" }}
            >
              <span
                className="hidden lg:inline"
                style={{ fontWeight: 300, fontSize: "42px", lineHeight: "50px" }}
              >
                {service.title}
              </span>
              <span
                className="lg:hidden"
                style={{ fontWeight: 400, fontSize: "22px", lineHeight: "32px" }}
              >
                {service.title}
              </span>
            </h3>

            <p className="mb-6 max-w-xl text-base font-light leading-relaxed text-white/60 lg:text-lg">
              {service.description}
            </p>

            <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
          </div>

          {/* RIGHT */}
          <div className="flex w-full max-w-[220px] shrink-0 justify-center sm:max-w-[260px] md:w-[280px] md:max-w-none lg:w-auto lg:justify-end">
            <div className="relative opacity-60">
              <Image
                src={service.illustration}
                alt={service.title}
                width={400}
                height={400}
                className="h-auto w-full max-h-[180px] object-contain sm:max-h-[200px] md:max-h-[240px] lg:max-h-[360px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   DOT NAVIGATION (shared by both modes)
========================================================= */
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
    <div
      className="absolute z-50 flex items-center
        left-1/2 bottom-5 -translate-x-1/2 flex-row gap-2.5
        lg:left-auto lg:right-10 lg:top-1/2 lg:bottom-auto lg:-translate-x-0 lg:-translate-y-1/2 lg:flex-col lg:gap-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          aria-label={`Go to ${labelFor(index)}`}
          aria-current={index === activeIndex}
          className={`rounded-full transition-all duration-300 ${
            index === activeIndex
              ? "h-2.5 w-2.5 bg-white"
              : "h-2 w-2 bg-white/30 hover:bg-white/60"
          }`}
        />
      ))}
    </div>
  );
}
