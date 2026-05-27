'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import UnifiedSectionWrapper from './layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading, EditorialCTA, ContentBlock } from './layout/EditorialContentGrid';
import InteractiveDots from './InteractiveDots';
import PremiumCTA from './PremiumCTA';

export default function BeforeFooterCTA() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const rocketY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 400, damping: 90 });
  const rocketRotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 3]), { stiffness: 400, damping: 90 });
  const particlesY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), { stiffness: 400, damping: 90 });
  const orbitalRotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 360]), { stiffness: 100, damping: 50 });

  // Floating animation for rocket
  const rocketFloat = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0]), { stiffness: 200, damping: 20 });

  return (
    <UnifiedSectionWrapper 
      background="custom" 
      id="final-cta" 
      customBgColor="bg-[#171717]" 
      className="h-[115vh] lg:h-[120vh]"
      sectionRef={sectionRef}
      backgroundElement={<InteractiveDots variant="dark" containerRef={sectionRef} />}
    >
      <EditorialContentGrid className="pb-16 lg:pb-24">
        {/* Two Column Layout - Text on left, Rocket on right */}
        <ContentBlock size="full">
          <div className="grid grid-cols-1 lg:grid-cols-[80%_20%] gap-8 lg:gap-24 xl:gap-32 items-center">
            
            {/* Left side - Text content and CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6 lg:space-y-12"
            >
              {/* Eyebrow text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="text-red-500 font-clother font-normal text-[18px] lg:text-[28px] leading-[100%] tracking-normal mb-0 lg:mb-2" style={{ textTransform: 'capitalize' }}>
                  Let's connect
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-white font-clother font-bold text-[38px] lg:text-[134px] leading-[40px] lg:leading-[134px] tracking-normal uppercase whitespace-nowrap !mt-0 lg:!mt-0"
              >
                WE REDEFINE THE
                <br />
                FINISH LINE
              </motion.h1>

              {/* Supporting paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="font-clother font-light text-[16px] lg:text-[18px] tracking-normal mt-2 lg:mt-3"
              >
                We have spent over a decade and a half perfecting the mechanics of flight through imagination, craft, dexterity, and sheer will. Your next launch is already on the pad.
              </motion.p>

              {/* Email input and CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="pt-8 lg:pt-32 w-full"
              >
                <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center w-full gap-6 lg:gap-0 lg:border-b lg:border-white/30 lg:focus-within:border-white/60 transition-colors duration-300 lg:pb-4">
                  <input
                    type="email"
                    placeholder="@youremailid"
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent text-white focus:outline-none pb-4 text-[16px] lg:text-[28px] border-b border-white/30 focus:border-white/60 transition-colors duration-300 lg:border-none"
                  />

                  {/* Desktop button — unchanged */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                    onTouchCancel={() => setIsHovered(false)}
                    className="hidden lg:flex items-center gap-1 lg:gap-2 text-white uppercase text-[16px] lg:text-[28px] font-[300] lg:font-[300] shrink-0 ml-2"
                  >
                    <motion.span
                      initial="rest"
                      animate={isHovered ? 'hover' : 'rest'}
                      className="relative flex overflow-hidden"
                    >
                      {"LET'S LIFT OFF".split('').map((char, i) => (
                        <span
                          key={i}
                          className="relative inline-block overflow-hidden"
                          style={{ marginRight: char === ' ' ? '6px' : '1px' }}
                        >
                          <motion.span
                            className="block text-white"
                            initial={{ y: 0 }}
                            variants={{
                              hover: {
                                y: '-120%',
                                transition: {
                                  delay: i * 0.03,
                                  duration: 0.35,
                                  ease: [0.76, 0, 0.24, 1],
                                },
                              },
                            }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>

                          <motion.span
                            className="absolute left-0 top-full block text-white"
                            initial={{ y: 0 }}
                            variants={{
                              hover: {
                                y: '-100%',
                                transition: {
                                  delay: i * 0.03,
                                  duration: 0.4,
                                  ease: [0.76, 0, 0.24, 1],
                                },
                              },
                            }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        </span>
                      ))}
                    </motion.span>
                    <motion.div
                      animate={{ rotate: isHovered ? 360 : 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white flex items-center justify-center shrink-0"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </motion.button>

                  {/* Mobile CTA */}
                  <div className="flex lg:hidden justify-end pt-2">
                    <PremiumCTA title="LET'S LIFT OFF" hoverTitle="LET'S LIFT OFF" className="text-[16px]" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Rocket and orbital elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative h-[330px] lg:h-[500px] flex items-center justify-center lg:justify-end order-2 lg:order-1"
            >
              {/* Orbital background - hidden on mobile */}
              <div className="absolute -top-12 -right-64 hidden lg:block">
                <img
                  src="/images/we-redefine-the-finish-line-vector.webp"
                  alt="Orbital background"
                  className="w-[625px] h-[330px] min-w-[625px] min-h-[330px] object-contain opacity-60"
                />
              </div>

              {/* Glowing particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                />
              ))}

              {/* Rocket image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-20 mt-40"
              >
                <Image
                  src="/images/rocket.png"
                  alt="Rocket"
                  width={92}
                  height={790}
                  className="w-auto h-[350px] lg:h-[790px] object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))',
                  }}
                />
              </motion.div>

              {/* Rocket exhaust */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 lg:-translate-x-[32px]"
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`exhaust-${i}`}
                    initial={{ opacity: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      y: [0, 100 + i * 20],
                      x: [0, (Math.random() - 0.5) * 40],
                      scale: [0, 1, 0.3],
                    }}
                    transition={{
                      duration: 2 + i * 0.1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 bg-gradient-to-b from-blue-400/60 to-transparent rounded-full blur-sm"
                    style={{
                      left: `${(Math.random() - 0.5) * 60}px`,
                    }}
                  />
                ))}
              </motion.div> */}
            </motion.div>
          </div>
        </ContentBlock>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
}
