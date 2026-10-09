'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UnifiedSectionWrapper from '../layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading, ContentBlock } from '../layout/EditorialContentGrid';
import PremiumCTA from './PremiumCTA';
import CTA from '@/components/shared/CTA';
import InteractiveDots from './InteractiveDots';
import { getMediaUrl } from '@/lib/strapi-media';

function MultilineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

gsap.registerPlugin(ScrollTrigger);

interface LogoData {
  name: string;
  image: string;
  featured?: boolean;
}

const logos: LogoData[] = [
  // Top Row
  { name: 'stratasys', image: '/images/company-logos/stratasys-logo.webp' },
  { name: 'ltsct', image: '/images/company-logos/ltsct-logo.webp' },
  { name: 'danfriss', image: '/images/company-logos/danfriss-logo.webp' },
  { name: 'university', image: '/images/company-logos/the-university-logo.webp' },
  
  // Middle Row
  { name: 'tyco', image: '/images/company-logos/tyco-logo.webp'},
  { name: 'johnson', image: '/images/company-logos/johnson-logo.webp' },
  { name: 'bosch', image: '/images/company-logos/bosch-logo.webp' },
  
  // Bottom Row
  { name: 'veneta', image: '/images/company-logos/veneta-cucine-logo.webp' },
  { name: 'b-pac', image: '/images/company-logos/b-pac-logo.webp' },
  { name: 'parayon', image: '/images/company-logos/parayon-logo.webp' },
  { name: 'university-logo', image: '/images/company-logos/university.png' },
];

export default function BrandsThatTrustUs({
  data,
}: {
  data?: import('@/types/home-sections').BrandsSectionData;
}) {
  // CMS-driven logos (editor order); logo artwork falls back to the matching
  // static asset by name so entries without an uploaded logo still render.
  const staticByName = new Map(logos.map((l) => [l.name, l]));
  const items: LogoData[] =
    data?.Logos?.length
      ? data.Logos.map((entry, i) => {
          const fb =
            staticByName.get(entry.Name) ?? logos[i % logos.length];
          return {
            name: entry.Name || fb.name,
            image: getMediaUrl(entry.Logo) || fb.image,
            featured: entry.Featured ?? fb.featured,
          };
        })
      : logos;
  const label = data?.Label ?? 'Long-Haul Partners';
  const heading = data?.Heading ?? 'BRANDS THAT\nTRUST US.';
  const description = data?.Description ?? null;
  const sectionCta = data?.CTA;
  const logoAt = (i: number) => items[i];
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);

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

      // CTA button animation
      gsap.fromTo(ctaButtonRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaButtonRef.current,
            start: 'top 85%',
            end: 'top 65%',
            scrub: 1,
          }
        }
      );

      // Bubbles stagger reveal
      const bubbles = bubblesRef.current?.querySelectorAll('.logo-bubble');
      if (bubbles) {
        gsap.fromTo(bubbles,
          { opacity: 0, scale: 0.8, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bubblesRef.current,
              start: 'top 75%',
              end: 'top 45%',
              scrub: 1,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <UnifiedSectionWrapper background="custom" id="brands-trust-us" customBgColor="bg-[#FF0000]">
      <InteractiveDots variant="red" />
      <EditorialContentGrid>
        <SectionHeader
          label={label}
          labelColor="text-[#FFFFFF]"
          className="!mb-0 lg:!mb-6 mt-0 lg:mt-6"
          heading={
            <EditorialHeading size="large" className="mb-4">
              <MultilineText text={heading} />
            </EditorialHeading>
          }
          description={description ?? undefined}
          cta={
            sectionCta ? (
              <CTA data={sectionCta} displayText="PARTNER WITH US" hoverText="PARTNER WITH US" />
            ) : (
              <PremiumCTA  title="PARTNER WITH US" hoverTitle="PARTNER WITH US" />
            )
          }
        />

        {/* Logo Bubble Grid - PERFECTLY ALIGNED */}
        <ContentBlock size="full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="relative min-h-[500px] lg:min-h-[600px]"
          >
            {/* Logo Grid - Desktop: 3 Rows (4, 3, 4) | Mobile: 4 Rows (3, 3, 3, 2) */}
            <div className="space-y-12 lg:space-y-20">
              {/* Desktop Layout - Hidden on Mobile */}
              <div className="hidden lg:block space-y-20">
                {/* Top Row - 4 logos */}
                <div className="flex justify-between items-center px-6 max-w-7xl mx-auto">
                  {[0, 1, 2, 3].map((i) => {
                    const logo = logoAt(i);
                    if (!logo) return null;
                    return (
                      <motion.div
                        key={`${logo.name}-${i}`}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.23, 1, 0.32, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ transform: 'translateY(12px)' }}
                      >
                        <div className="relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3">
                          <img src={logo.image} alt={logo.name} className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" />
                        </div>
                        {logo.featured && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Middle Row - 3 logos */}
                <div className="flex justify-center items-center gap-20 max-w-5xl mx-auto">
                  {[4, 5, 6].map((i) => {
                    const logo = logoAt(i);
                    if (!logo) return null;
                    const rowStyle =
                      i === 4
                        ? { transform: 'translateX(-16px)' }
                        : i === 6
                          ? { transform: 'translateX(16px)' }
                          : undefined;
                    return (
                      <motion.div
                        key={`${logo.name}-${i}`}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: (i - 4) * 0.08, ease: [0.23, 1, 0.32, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        style={rowStyle}
                      >
                        <div className="relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3">
                          <img src={logo.image} alt={logo.name} className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" />
                        </div>
                        {logo.featured && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom Row - 4 logos */}
                <div className="flex justify-between items-center px-6 max-w-7xl mx-auto">
                  {[7, 8, 9, 10].map((i) => {
                    const logo = logoAt(i);
                    if (!logo) return null;
                    return (
                      <motion.div
                        key={`${logo.name}-${i}`}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: (i - 7) * 0.08, ease: [0.23, 1, 0.32, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <div className="relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3">
                          <img src={logo.image} alt={logo.name} className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" />
                        </div>
                        {logo.featured && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Layout - 3 columns per row */}
              <div className="lg:hidden space-y-10">
                {/* Row 1 - 3 logos */}
                <div className="grid grid-cols-3 gap-6 items-center justify-items-center w-full">
                  {items.slice(0, 3).map((logo, index) => (
                    <motion.div
                      key={logo.name}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8, y: 40 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.08,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {/* Logo Container */}
                      <div className={`relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3 ${
                        logo.featured 
                          ? '' 
                          : ''
                      }`}>
                        <img 
                          src={logo.image} 
                          alt={logo.name} 
                          className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" 
                        />
                      </div>
                      
                      {/* Hover Glow Effect */}
                      {logo.featured && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Row 2 - 3 logos */}
                <div className="grid grid-cols-3 gap-6 items-center justify-items-center w-full">
                  {items.slice(3, 6).map((logo, index) => (
                    <motion.div
                      key={logo.name}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8, y: 40 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.08,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {/* Logo Container */}
                      <div className={`relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3 ${
                        logo.featured 
                          ? '' 
                          : ''
                      }`}>
                        <img 
                          src={logo.image} 
                          alt={logo.name} 
                          className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" 
                        />
                      </div>
                      
                      {/* Hover Glow Effect */}
                      {logo.featured && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Row 3 - 3 logos */}
                <div className="grid grid-cols-3 gap-6 items-center justify-items-center w-full">
                  {items.slice(6, 9).map((logo, index) => (
                    <motion.div
                      key={logo.name}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8, y: 40 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.08,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {/* Logo Container */}
                      <div className={`relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3 ${
                        logo.featured 
                          ? '' 
                          : ''
                      }`}>
                        <img 
                          src={logo.image} 
                          alt={logo.name} 
                          className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" 
                        />
                      </div>
                      
                      {/* Hover Glow Effect */}
                      {logo.featured && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Row 4 - 2 logos */}
                <div className="grid grid-cols-3 gap-6 items-center justify-items-center w-full">
                  {items.slice(9, 11).map((logo, index) => (
                    <motion.div
                      key={logo.name}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8, y: 40 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.08,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {/* Logo Container */}
                      <div className={`relative w-50 h-50 rounded-full flex items-center justify-center overflow-visible transition-all duration-500 hover:-translate-y-3 ${
                        logo.featured 
                          ? '' 
                          : ''
                      }`}>
                        <img 
                          src={logo.image} 
                          alt={logo.name} 
                          className="w-3/4 h-3/4 object-contain transition-transform duration-500 hover:scale-105" 
                        />
                      </div>
                      
                      {/* Hover Glow Effect */}
                      {logo.featured && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            {/* <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" /> */}
            {/* <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-2xl" /> */}
          </motion.div>
        </ContentBlock>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
}
