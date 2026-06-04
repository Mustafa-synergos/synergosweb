'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import InteractiveDots from './InteractiveDots';
import PremiumCTA from './PremiumCTA';

export default function WhoWeAre() {
  const [dots, setDots] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random dots for the right column animation
    const generatedDots = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setDots(generatedDots);
  }, []);

  return (
    <section className="relative min-h-[75vh] md:min-h-screen overflow-hidden px-6 lg:px-8" style={{ backgroundColor: '#171717' }}>
      {/* Interactive Dots Background */}
      <InteractiveDots variant="dark" />


      {/* Two Column Layout */}
      <div className="relative z-10 flex sm:items-center md:items-start lg:items-center
      items-center justify-center min-h-[70vh] md:min-h-screen py-12 md:py-10  lg:py-15">
        <div className="max-w-7xl mx-auto w-full md:ml-0 lg:mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-16 lg:gap-24 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Red "Who We Are" heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="mb-0 lg:mb-2 mt-0"
              >
                <span className="text-red-500 responsive-red-span !mb-0 lg:!mb-0" style={{ textTransform: 'capitalize' }}>
                  Who We Are
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="responsive-large-h2 text-white leading-none !mt-0 lg:!mt-2"
              >
                WE ARE
                <br />
                SYNERGOS
              </motion.h2>

              {/* First paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="responsive-paragraph text-white/90 !mb-3 lg:!mb-6 max-w-lg"
              >
                We lift brands off the ground, keep them in sustained flight, and push them into orbit.
              </motion.p>

              {/* Second paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="responsive-paragraph text-white/90 !mb-3 lg:!mb-6 !mt-0 lg:!mt-3 max-w-lg"
              >
                For over 16 years, we have partnered with founders, legacy businesses, and marketing leaders to navigate launches, pivots, and plateaus. Across fintech, fitness, healthcare, education, manufacturing, and more, our longest relationships are built on one simple idea: consistency creates lift.
              </motion.p>

              {/* EXPLORE Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
              </motion.div>
            </motion.div>

            {/* Right Column - Rocket Image */}
            <div className="relative h-[80px] sm:h-[100px] md:h-[200px] lg:h-[200px] xl:h-[480px] 2xl:h-[650px] flex items-center justify-center md:items-end md:justify-center">
              <div className="relative w-full h-full max-w-md md:max-w-lg">
                {/* Desktop rocket image */}
                <Image
                  src="/images/vector-rocket.png"
                  alt="Rocket"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="object-contain hidden md:hidden lg:block"
                />

                {/* Mobile alternative image */}
                <Image
                  src="/images/exponential-impact-vector-2.webp"
                  alt="Particle wave effect"
                  width={200}
                  height={200}
                  className="w-full h-auto object-contain relative z-10 block md:block lg:hidden"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
