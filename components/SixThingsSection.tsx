'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UnifiedSectionWrapper from './layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading } from './layout/EditorialContentGrid';
import PremiumCTA from './PremiumCTA';

gsap.registerPlugin(ScrollTrigger);

interface Card {
  id: number;
  number: string;
  title: string;
  description: string;
}

const cardsData: Card[] = [
  {
    id: 1,
    number: '01',
    title: 'Strategy & Research',
    description: 'The foundation of every flight plan. We conduct deep market and competitive analysis, map consumer behaviour and purchase intent, define brand positioning and architecture, and set the campaign goals that make the trajectory clear.'
  },
  {
    id: 2,
    number: '02',
    title: 'Strategic R&D Research',
    description: 'The foundation of every flight plan. We conduct deep market and competitive analysis, map consumer behaviour and purchase intent, define brand positioning and architecture, and set the campaign goals that make the trajectory clear.'
  },
  {
    id: 3,
    number: '03',
    title: 'Brand Identity',
    description: 'Creating distinctive brand systems that resonate deeply with your audience. From logo to language, we craft memorable experiences that stand out.'
  },
  {
    id: 4,
    number: '04',
    title: 'Digital Experience',
    description: 'Designing immersive digital platforms that engage and convert. We create experiences that feel intuitive and delightful across all touchpoints.'
  },
  {
    id: 5,
    number: '05',
    title: 'Content Strategy',
    description: 'Developing strategic content that tells your story and drives action. We craft narratives that connect authentically with your audience.'
  },
  {
    id: 6,
    number: '06',
    title: 'Performance Marketing',
    description: 'Implementing data-driven marketing that delivers measurable results. We optimize every touchpoint for maximum impact and ROI.'
  }
];

export default function SixThingsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content animations
      if (heroContentRef.current) {
        const heroElements = heroContentRef.current.children[0]?.children || [];
        gsap.fromTo(heroElements,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Cards layered animation setup
      const cards = cardsRef.current.filter(Boolean);
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Initial card positions
      cards.forEach((card, index) => {
        if (card) {
          const mobileOffset = isMobile ? 30 : 40;
          const mobileScale = isMobile ? 0.08 : 0.05;
          const mobileOpacity = isMobile ? 0.2 : 0.15;
          const mobileX = isMobile ? 0 : 20;
          
          gsap.set(card, {
            zIndex: cards.length - index,
            scale: 1 - (index * mobileScale),
            opacity: 1 - (index * mobileOpacity),
            y: index * mobileOffset,
            x: index * mobileX
          });
        }
      });

      // ScrollTrigger for card animations
      ScrollTrigger.create({
        trigger: cardsContainerRef.current,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalCards = cards.length;
          const cardProgress = progress * (totalCards - 1);
          const currentCard = Math.floor(cardProgress);
          const nextCardProgress = cardProgress - currentCard;
          
          // Check screen size for responsive behavior
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

          cards.forEach((card, index) => {
            if (!card) return;

            if (index < currentCard) {
              // Cards that have passed - move them up and fade
              const mobileY = isMobile ? -80 : -100;
              const mobileX = isMobile ? 0 : -50;
              
              gsap.to(card, {
                scale: isMobile ? 0.85 : 0.9,
                opacity: 0.3,
                y: mobileY,
                x: mobileX,
                duration: 0.5,
                ease: 'power2.inOut'
              });
            } else if (index === currentCard) {
              // Current active card
              gsap.to(card, {
                scale: 1,
                opacity: 1,
                y: 0,
                x: 0,
                duration: 0.5,
                ease: 'power2.inOut'
              });
            } else if (index === currentCard + 1) {
              // Next card peeking
              const mobileY = isMobile ? 30 : 40;
              const mobileX = isMobile ? 0 : 20;
              const mobileScale = isMobile ? 0.9 : 0.95;
              
              gsap.to(card, {
                scale: mobileScale,
                opacity: 0.8,
                y: mobileY,
                x: mobileX,
                duration: 0.5,
                ease: 'power2.inOut'
              });
            } else {
              // Cards behind
              const offset = (index - currentCard - 1);
              const mobileY = isMobile ? 50 : 60;
              const mobileX = isMobile ? 0 : 40;
              const mobileScale = isMobile ? 0.07 : 0.05;
              const mobileOpacity = isMobile ? 0.18 : 0.15;
              
              gsap.to(card, {
                scale: 1 - (offset * mobileScale) - (isMobile ? 0.15 : 0.1),
                opacity: 1 - (offset * mobileOpacity) - 0.2,
                y: mobileY + (offset * (isMobile ? 30 : 40)),
                x: mobileX + (offset * (isMobile ? 0 : 20)),
                duration: 0.5,
                ease: 'power2.inOut'
              });
            }
          });

          setActiveCard(currentCard);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (index: number) => {
    const cards = cardsRef.current.filter(Boolean);
    const isMobile = window.innerWidth < 768;
    
    cards.forEach((card, i) => {
      if (!card) return;

      if (i < index) {
        const mobileY = isMobile ? -80 : -100;
        const mobileX = isMobile ? 0 : -50;
        
        gsap.to(card, {
          scale: isMobile ? 0.85 : 0.9,
          opacity: 0.3,
          y: mobileY,
          x: mobileX,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      } else if (i === index) {
        gsap.to(card, {
          scale: 1,
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      } else if (i === index + 1) {
        const mobileY = isMobile ? 30 : 40;
        const mobileX = isMobile ? 0 : 20;
        const mobileScale = isMobile ? 0.9 : 0.95;
        
        gsap.to(card, {
          scale: mobileScale,
          opacity: 0.8,
          y: mobileY,
          x: mobileX,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      } else {
        const offset = (i - index - 1);
        const mobileY = isMobile ? 50 : 60;
        const mobileX = isMobile ? 0 : 40;
        const mobileScale = isMobile ? 0.07 : 0.05;
        const mobileOpacity = isMobile ? 0.18 : 0.15;
        
        gsap.to(card, {
          scale: 1 - (offset * mobileScale) - (isMobile ? 0.15 : 0.1),
          opacity: 1 - (offset * mobileOpacity) - 0.2,
          y: mobileY + (offset * (isMobile ? 30 : 40)),
          x: mobileX + (offset * (isMobile ? 0 : 20)),
          duration: 0.8,
          ease: 'power2.inOut'
        });
      }
    });

    setActiveCard(index);
  };

  return (
    <UnifiedSectionWrapper background="darker" id="six-things">
      <EditorialContentGrid>
        <SectionHeader
          label="Six Thrusters, One Engine"
          heading={
            <EditorialHeading size="large">
              SIX THINGS WE ARE
              <br />
              GOOD AT.
            </EditorialHeading>
          }
          description="Each capability is a thruster. Together, they are the engine that takes brands from the launchpad to orbit."
          cta={
            <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
          }
        />
        
        {/* Cards Section - PERFECTLY ALIGNED */}
        <div className="relative min-h-[600px] lg:min-h-[800px] flex items-center justify-center">
          {/* Pagination Indicators */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block">
            <div className="flex flex-col space-y-2">
              {cardsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-3 h-3 transition-all duration-300 ${
                    activeCard === index 
                      ? 'bg-white' 
                      : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Layered Cards */}
          <div className="relative w-full max-w-4xl mx-auto">
            {cardsData.map((card, index) => (
              <motion.div
                key={card.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="absolute w-full px-4 lg:px-0"
                onClick={() => handleCardClick(index)}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: activeCard === index ? 1 : 0.3,
                  scale: activeCard === index ? 1 : 0.95
                }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl lg:rounded-3xl p-6 lg:p-12 shadow-2xl min-h-[400px] max-h-[800px]">
                  <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-4 lg:space-y-6">
                      {/* Card Number */}
                      <div className="text-4xl lg:text-6xl font-bold text-white opacity-20">
                        {card.number}
                      </div>

                      {/* Card Title */}
                      <h3 className="text-xl lg:text-3xl font-bold text-white leading-tight">
                        {card.title}
                      </h3>

                      {/* Card Description */}
                      <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
                        {card.description}
                      </p>

                      {/* Explore Button */}
                      <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
                    </div>

                    {/* Right Illustration */}
                    <div className="hidden lg:flex items-center justify-center">
                      <div className="w-32 h-32 lg:w-48 lg:h-48 flex items-center justify-center">
                        <svg className="w-24 h-24 lg:w-32 lg:h-32 text-white/30" viewBox="0 0 200 200">
                          {/* Hand holding chess king */}
                          <path d="M60 140 Q60 120 70 110 L75 105 Q80 100 85 100 L90 100 Q95 100 100 105 L105 110 Q110 115 110 120 L110 140 Q110 145 105 150 L95 150 Q90 150 85 145 L80 140 Q75 135 70 130 L65 125 Q60 120 60 140" fill="none" stroke="currentColor" strokeWidth="2"/>
                          {/* Chess King */}
                          <path d="M100 40 L100 70 M85 55 L115 55 M90 45 L110 45 M95 35 L105 35 M100 25 L100 30 M95 70 L105 70 L105 80 L95 80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                          {/* Cross on top */}
                          <path d="M100 20 L100 30 M95 25 L105 25" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
}
