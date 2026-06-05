"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
  {
    id: "01",
    title: "UPLOAD YOUR",
    italic: "ARTWORK",
    desc: "Take clear photos and upload artwork easily.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "VERIFY YOUR",
    italic: "COLLECTION",
    desc: "Professional verification before listing publicly.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "SELL TO",
    italic: "BUYERS",
    desc: "Connect directly with collectors worldwide.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "TRACK YOUR",
    italic: "SALES",
    desc: "Monitor views, engagement and sales history.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function StickyCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const totalCards = cards.length;

      // Each card gets a dedicated scroll segment
      // The section height is determined by how many cards we have
      // Each transition between cards takes 100vh of scroll distance
      cards.forEach((card, index) => {
        if (index === 0) return;

        // Position all cards after the first off-screen below
        gsap.set(card, {
          yPercent: 100,
          scale: 1,
          opacity: 1,
        });
      });

      // Set transform origin for scale-down effect on all cards
      cards.forEach((card) => {
        gsap.set(card, { transformOrigin: "center center" });
      });

      // For each card after the first, create the overlay animation
      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCard = cards[index - 1];

        // Timeline: incoming card rises up while previous card shrinks
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${(index - 1) * window.innerHeight} top`,
            end: () => `top+=${index * window.innerHeight} top`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Incoming card slides up from bottom to cover viewport
        tl.to(
          card,
          {
            yPercent: 0,
            ease: "none",
            duration: 1,
          },
          0
        );

        // Previous card scales down and fades slightly — feels like it tucks behind
        tl.to(
          prevCard,
          {
            scale: 0.92,
            opacity: 0.5,
            ease: "none",
            duration: 1,
          },
          0
        );
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{
        // Total scroll height: first card viewport + one viewport per transition
        height: `${cardsData.length * 100}vh`,
      }}
    >
      {/* Sticky container that pins all cards in viewport */}
      <div className="sticky top-0 left-0 w-full h-screen">
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className="stack-card absolute inset-0 w-full h-screen flex items-center md:items-center lg:items-center  pt-16 md:pt-0 lg:pt-0 justify-center will-change-transform"
            style={{
              zIndex: index + 1,
            }}
          >
            <div className="w-[92%] h-[85vh] rounded-[30px] bg-[#111] border border-white/10 shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 h-full">
                {/* LEFT */}
                <div className="flex flex-col justify-between p-8 lg:p-16">
                  <div>
                    <span className="text-[90px] lg:text-[120px] text-lime-200 italic leading-none font-light !mb-0 lg:!mb-2">
                      {card.id}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-white text-5xl lg:text-7xl leading-none uppercase font-semibold tracking-tight">
                      {card.title}
                      <br />
                      <span className="italic lowercase text-neutral-300 font-light !mb-0 lg:!mb-2">
                        {card.italic}
                      </span>
                    </h2>

                    <p className="text-white/60 mt-6 max-w-md text-lg">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="relative h-[300px] lg:h-full rounded-r-[30px] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111]/30" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}