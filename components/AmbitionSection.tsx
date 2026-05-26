'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveDots from './InteractiveDots';

gsap.registerPlugin(ScrollTrigger);

export default function AmbitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [activeHeading, setActiveHeading] = useState(1);
  
  // Desktop refs (for GSAP animation)
  const desktopHeading1Ref = useRef<HTMLHeadingElement>(null);
  const desktopHeading2Ref = useRef<HTMLHeadingElement>(null);
  const desktopHeading3Ref = useRef<HTMLHeadingElement>(null);
  const desktopHeading4Ref = useRef<HTMLHeadingElement>(null);
  
  // Mobile refs (for static layout)
  const mobileHeading1Ref = useRef<HTMLHeadingElement>(null);
  const mobileHeading2Ref = useRef<HTMLHeadingElement>(null);
  const mobileHeading3Ref = useRef<HTMLHeadingElement>(null);
  const mobileHeading4Ref = useRef<HTMLHeadingElement>(null);

  // Mobile floating logo ref
  const mobileLogoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const h1 = desktopHeading1Ref.current;
    const h2 = desktopHeading2Ref.current;
    const h3 = desktopHeading3Ref.current;
    const h4 = desktopHeading4Ref.current;

    if (!container || !logo || !h1 || !h2 || !h3 || !h4) return;

    // Calculate container-relative position for a target heading
    // Logo positions to the left of the heading with gap-4 (16px) spacing
    // const getLogoPosition = (heading: HTMLElement) => {
    //   const containerRect = container.getBoundingClientRect();
    //   const headingRect = heading.getBoundingClientRect();
    //   const logoWidth = logo.offsetWidth;
    //   const logoHeight = logo.offsetHeight;
      
    //   // Position logo to the left of the heading text with gap-4 spacing
    //   // Vertically center with the entire heading text (including multi-line)
    //   const x = headingRect.left - containerRect.left - logoWidth - 16; // 16px = gap-4
    //   const y = headingRect.top - containerRect.top + (headingRect.height / 2) - (logoHeight / 2);
      
    //   return { x, y };
    // };
    const getLogoPosition = (heading: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const headingRect = heading.getBoundingClientRect();

  const logoWidth = logo.offsetWidth;
  const logoHeight = logo.offsetHeight;

  // Read actual line-height from heading
  const computedStyle = window.getComputedStyle(heading);
  const lineHeight = parseFloat(computedStyle.lineHeight);

  // Left alignment with spacing
  const x =
    headingRect.left -
    containerRect.left -
    logoWidth -
    24;

  // Align logo to FIRST text line center
  const y =
    headingRect.top -
    containerRect.top +
    (lineHeight / 2) -
    (logoHeight / 2);

  return { x, y };
};

    // Get initial position (beside first heading)
    const pos1 = getLogoPosition(h1);
    gsap.set(logo, { x: pos1.x, y: pos1.y });

    // Calculate target positions
    const pos2 = getLogoPosition(h2);
    const pos3 = getLogoPosition(h3);
    const pos4 = getLogoPosition(h4);

    // Create GSAP timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          // Determine which heading is active based on timeline progress
          if (progress < 0.33) {
            setActiveHeading(1);
          } else if (progress < 0.66) {
            setActiveHeading(2);
          } else if (progress < 1) {
            setActiveHeading(3);
          } else {
            setActiveHeading(4);
          }
        }
      }
    });

    // Animate logo through positions
    tl.to(logo, {
      x: pos2.x,
      y: pos2.y,
      duration: 1,
      force3D: true,
      ease: 'power2.inOut'
    })
    .to(logo, {
      x: pos3.x,
      y: pos3.y,
      duration: 1,
      force3D: true,
      ease: 'power2.inOut'
    })
    .to(logo, {
      x: pos4.x,
      y: pos4.y,
      duration: 1,
      force3D: true,
      ease: 'power2.inOut'
    });

    // Recalculate on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      
      const newPos1 = getLogoPosition(h1);
      const newPos2 = getLogoPosition(h2);
      const newPos3 = getLogoPosition(h3);
      const newPos4 = getLogoPosition(h4);

      gsap.set(logo, { x: newPos1.x, y: newPos1.y });
      tl.seek(0).clear()
        .to(logo, { x: newPos2.x, y: newPos2.y, duration: 1, ease: 'power2.inOut' })
        .to(logo, { x: newPos3.x, y: newPos3.y, duration: 1, ease: 'power2.inOut' })
        .to(logo, { x: newPos4.x, y: newPos4.y, duration: 1, ease: 'power2.inOut' });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Mobile-only floating logo effect
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(max-width: 767px)', () => {
      const mobileContainer = containerRef.current;
      const mobileLogo = mobileLogoRef.current;
      const mh1 = mobileHeading1Ref.current;
      const mh2 = mobileHeading2Ref.current;
      const mh3 = mobileHeading3Ref.current;
      const mh4 = mobileHeading4Ref.current;

      if (!mobileContainer || !mobileLogo || !mh1 || !mh2 || !mh3 || !mh4) return;

      // Calculate logo position from heading element — responsive to any screen width
      const getMobileLogoPosition = (heading: HTMLElement) => {
        const containerRect = mobileContainer.getBoundingClientRect();
        const headingRect = heading.getBoundingClientRect();
        const logoWidth = mobileLogo.offsetWidth;
        const logoHeight = mobileLogo.offsetHeight;

        // x: sit inside the pl-16 (64px) padding area of the heading
        // Logo is 48px (w-12), center it in that 64px space
        const x = headingRect.left - containerRect.left + (64 - logoWidth) / 2;

        // y: vertically center logo with the entire heading block
        const y = headingRect.top - containerRect.top + (headingRect.height / 2) - (logoHeight / 2);

        return { x, y };
      };

      const pos1 = getMobileLogoPosition(mh1);
      const pos2 = getMobileLogoPosition(mh2);
      const pos3 = getMobileLogoPosition(mh3);
      const pos4 = getMobileLogoPosition(mh4);

      gsap.set(mobileLogo, { x: pos1.x, y: pos1.y });

      const mTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainer,
          start: 'top center',
          end: 'bottom center',
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress < 0.33) setActiveHeading(1);
            else if (progress < 0.66) setActiveHeading(2);
            else if (progress < 1) setActiveHeading(3);
            else setActiveHeading(4);
          },
        },
      });

      mTl.to(mobileLogo, {
        x: pos2.x,
        y: pos2.y,
        duration: 1,
        force3D: true,
        ease: 'power2.inOut',
      })
      .to(mobileLogo, {
        x: pos3.x,
        y: pos3.y,
        duration: 1,
        force3D: true,
        ease: 'power2.inOut',
      })
      .to(mobileLogo, {
        x: pos4.x,
        y: pos4.y,
        duration: 1,
        force3D: true,
        ease: 'power2.inOut',
      });

      const handleResize = () => {
        ScrollTrigger.refresh();
        const newPos1 = getMobileLogoPosition(mh1);
        const newPos2 = getMobileLogoPosition(mh2);
        const newPos3 = getMobileLogoPosition(mh3);
        const newPos4 = getMobileLogoPosition(mh4);
        gsap.set(mobileLogo, { x: newPos1.x, y: newPos1.y });
        mTl.seek(0).clear()
          .to(mobileLogo, { x: newPos2.x, y: newPos2.y, duration: 1, ease: 'power2.inOut' })
          .to(mobileLogo, { x: newPos3.x, y: newPos3.y, duration: 1, ease: 'power2.inOut' })
          .to(mobileLogo, { x: newPos4.x, y: newPos4.y, duration: 1, ease: 'power2.inOut' });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        mTl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="relative min-h-[80vh] lg:min-h-[140vh] overflow-hidden pt-20 pb-0 lg:pb-40 lg:pt-0" style={{ backgroundColor: '#171717' }}>
      {/* Interactive Dots Background */}
      <InteractiveDots variant="dark" />

      {/* Vector Image separating sections - hidden on mobile, outside container, flush-left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="hidden md:block  left-0 top-0 z-10"
        style={{ transform: 'translateY(var(--tw-translate-y, 0px))' }}
      >
        <img
          src="/images/who-we-are-vector.webp"
          alt="Who We Are Vector"
          className="w-auto h-[400px] object-contain"
        />
      </motion.div>

      {/* Content Wrapper - z-index to sit above canvas */}
      <div className="relative z-10 px-6 lg:px-8">

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto min-h-[100vh] flex flex-col justify-between">
        {/* Shared Logo - Absolutely positioned inside container */}
        <img 
          ref={logoRef}
          src="/images/white-logo.webp" 
          alt="Logo" 
          className="absolute w-16 h-16 hidden md:block will-change-transform"
          style={{ pointerEvents: 'none' }}
        />
        <img 
          ref={mobileLogoRef}
          src="/images/white-logo.webp" 
          alt="Logo" 
          className="absolute w-12 h-12 md:hidden will-change-transform"
          style={{ pointerEvents: 'none' }}
        />
        {/* Vector Image separating sections - hidden on mobile */}
        {/* <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="mb-2 hidden md:block"
          style={{ transform: 'translateY(var(--tw-translate-y, 0px))' }}
        >
          <img 
            src="/images/who-we-are-vector.webp" 
            alt="Who We Are Vector" 
            className="w-auto h-[400px] object-contain"
          />
        </motion.div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-4 gap-y-64 md:gap-y-72">
          {/* Mobile: Stacked vertical layout with floating logo */}
          <div className="md:hidden space-y-32 flex flex-col items-center">
            {/* First line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h3 ref={mobileHeading1Ref} className={`${activeHeading === 1 ? 'text-white' : 'text-grey'} uppercase block max-w-[300px] mx-auto pl-16 text-left transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '17px', lineHeight: '20px', letterSpacing: '0%' }}>
                YOU BRING THE AMBITION.
              </h3>
            </motion.div>

            {/* Second line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h3 ref={mobileHeading2Ref} className={`${activeHeading === 2 ? 'text-white' : 'text-grey'} uppercase block max-w-[300px] mx-auto pl-16 text-left transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '17px', lineHeight: '20px', letterSpacing: '0%' }}>
                WE BRING THE COMPASS,<br />THE FUEL, AND THE THRUST.
              </h3>
            </motion.div>

            {/* Third line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h3 ref={mobileHeading3Ref} className={`${activeHeading === 3 ? 'text-white' : 'text-grey'} uppercase block max-w-[300px] mx-auto pl-16 text-left transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '17px', lineHeight: '20px', letterSpacing: '0%' }}>
                WE ARE NOT HERE FOR<br />ONE CAMPAIGN.
              </h3>
            </motion.div>

            {/* Fourth line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h3 ref={mobileHeading4Ref} className={`${activeHeading === 4 ? 'text-white' : 'text-grey'} uppercase block max-w-[300px] mx-auto pl-16 text-left transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '17px', lineHeight: '20px', letterSpacing: '0%' }}>
                WE ARE BUILT FOR<br />THE LONG HAUL.
              </h3>
            </motion.div>
          </div>

          {/* Desktop: Original two-column layout */}
          <div className="hidden md:contents">
            {/* Top Row - "YOU BRING THE AMBITION" (Left) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:col-start-1 md:row-start-1"
            >
              <h3 ref={desktopHeading1Ref} className={`${activeHeading === 1 ? 'text-white' : 'text-grey'} uppercase max-w-xs transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '40px', lineHeight: '48px', letterSpacing: '0%' }}>
                YOU BRING THE AMBITION.
              </h3>
            </motion.div>

            {/* Middle Row - "WE BRING THE COMPASS..." (Right) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="md:col-start-2 md:row-start-2 md:justify-self-end text-right md:text-left"
            >
              <h3 ref={desktopHeading2Ref} className={`${activeHeading === 2 ? 'text-white' : 'text-grey'} uppercase max-w-sm ml-auto md:ml-0 transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '40px', lineHeight: '48px', letterSpacing: '0%' }}>
                WE BRING THE COMPASS,<br />
                THE FUEL, AND THE THRUST.
              </h3>
            </motion.div>

            {/* Bottom Row - "WE ARE NOT HERE..." (Left) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="md:col-start-1 md:row-start-3"
            >
              <h3 ref={desktopHeading3Ref} className={`${activeHeading === 3 ? 'text-white' : 'text-grey'} uppercase max-w-sm transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '40px', lineHeight: '48px', letterSpacing: '0%' }}>
                WE ARE NOT HERE FOR<br />
                ONE CAMPAIGN.
              </h3>
            </motion.div>

            {/* "WE ARE BUILT FOR THE LONG HAUL" (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="md:col-start-2 md:row-start-4 md:justify-self-end"
            >
              <h3 ref={desktopHeading4Ref} className={`${activeHeading === 4 ? 'text-white' : 'text-grey'} uppercase max-w-sm ml-auto md:ml-0 transition-colors duration-300`} style={{ fontFamily: 'clother', fontWeight: 400, fontStyle: 'normal', fontSize: '40px', lineHeight: '48px', letterSpacing: '0%' }}>
                WE ARE BUILT FOR<br />
                THE LONG HAUL.
              </h3>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
