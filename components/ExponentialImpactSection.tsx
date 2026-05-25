'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UnifiedSectionWrapper from './layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading, ContentBlock } from './layout/EditorialContentGrid';
import PremiumCTA from './PremiumCTA';
import InteractiveDots from './InteractiveDots';

gsap.registerPlugin(ScrollTrigger);

export default function ExponentialImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const vectorOverlayRef = useRef<HTMLDivElement>(null);
  const contentLeftRef = useRef<HTMLDivElement>(null);
  const contentRightRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label animation
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1,
          }
        }
      );

      // Heading stagger animation
      gsap.fromTo(headingRef.current?.children || [],
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          }
        }
      );

      // Vector overlay parallax
      gsap.fromTo(vectorOverlayRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );

      // Subtle parallax motion for vector overlay
      gsap.to(vectorOverlayRef.current, {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });

      // Left content animation
      gsap.fromTo(contentLeftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentLeftRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          }
        }
      );

      // Right content animation
      gsap.fromTo(contentRightRef.current,
        { opacity: 0, x: 50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRightRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          }
        }
      );

      // CTA button hover effect handled by CSS
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <UnifiedSectionWrapper background="custom" id="exponential-impact" customBgColor="bg-[#171717]">
      <InteractiveDots variant="dark" />
      <EditorialContentGrid>
        <SectionHeader
          label="Exponential Impact"
          heading={
            <div className="relative">
              {/* Background image behind heading */}
              <img
                src="/images/exponential-impact-vector-1.webp"
                alt="Impact vector background"
                className="absolute inset-0 w-full h-full object-contain opacity-100 -z-10 transform scale-150"
              />
              <EditorialHeading size="large">
                EXPONENTIAL
                <br />
                IMPACT.
              </EditorialHeading>
            </div>
          }
          description="Building brands takes skill. It is a balance of craft and patience, where expertise shapes outcomes through careful, deliberate decisions. We evaluate every piece through a magnifying lens, ensuring nothing goes missing. When focus is razor sharp and thinking is ten steps ahead, critical velocity is inevitable."
          cta={
            <PremiumCTA title="EXPLORE IMPACT" hoverTitle="EXPLORE IMPACT" />
          }
        />

        {/* Two-column content layout - PERFECTLY ALIGNED */}
        <ContentBlock size="full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">
            
            {/* LEFT SIDE: Extended content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-clother-black font-bold text-[24px] lg:text-[44px] leading-[32px] lg:leading-[52px] tracking-normal text-white uppercase">
                Impact Shaping Voices
              </h2>
              
              <p className="text-gray-400 font-clother font-normal text-[16px] lg:text-[18px] leading-[24px] lg:leading-[26px] tracking-normal">
               Each brand is unique. Each trajectory upwards is a singular journey. As a one-stop solutions partner, we fine-tune every single aspect, setting up a blueprint that considers identity, market, barriers, and narrative. No two stories are alike. Everyone deserves their own script.
              </p>

              {/* <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full" />
                  </div>
                  <span className="text-white font-medium">Strategic Excellence</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-white font-medium">Creative Innovation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-white font-medium">Measurable Results</span>
                </div>
              </div> */}
            </motion.div>

            {/* RIGHT SIDE: Vector graphics */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="relative flex justify-end items-end"
            >
              <div className="relative w-full max-w-lg">
                {/* Main vector */}
                <img
                  src="/images/exponential-impact-vector-2.webp"
                  alt="Particle wave effect"
                  className="w-full h-auto object-contain relative z-10"
                />
              </div>
            </motion.div>
          </div>
        </ContentBlock>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
}
