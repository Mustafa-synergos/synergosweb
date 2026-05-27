'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const editorialCards = [
  {
    title: 'INNOVATION',
    description: 'Pushing boundaries with cutting-edge solutions that redefine possibilities.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 text-white/60 mb-4">
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 32 12 L 32 32 L 48 32" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'PRECISION',
    description: 'Meticulous attention to detail in every pixel and interaction.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 text-white/60 mb-4">
        <rect x="16" y="16" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 24 24 L 40 40 M 40 24 L 24 40" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  {
    title: 'VELOCITY',
    description: 'Lightning-fast execution that transforms vision into reality.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 text-white/60 mb-4">
        <path d="M 16 32 L 32 16 L 32 28 L 48 12 L 48 24 L 32 40 L 32 28 L 16 44" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    )
  }
];

export default function EditorialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring-based horizontal translation
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]), {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  // Progressive opacity and scale for each column
  const column1Opacity = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [1, 0.3, 0.1, 0]);
  const column2Opacity = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0.3, 1, 0.3, 0.1]);
  const column3Opacity = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0.1, 0.3, 1, 0.3]);

  const column1Scale = useTransform(scrollYProgress, [0, 0.33], [1, 0.8]);
  const column2Scale = useTransform(scrollYProgress, [0.33, 0.66], [0.8, 1]);
  const column3Scale = useTransform(scrollYProgress, [0.66, 1], [0.8, 1]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-[300vh] bg-black overflow-hidden"
    >
      {/* Dotted background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Sticky container for cinematic effect */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center"
        >
          {/* Horizontal sliding container */}
          <motion.div 
            style={{ x, width: '300%' }}
            className="flex h-full"
          >
            {/* Column 1: Vector Visual */}
            <motion.div 
              style={{ 
                opacity: column1Opacity,
                scale: column1Scale
              }}
              className="w-1/3 h-full flex items-center justify-center relative"
            >
              {/* Floating vector visual */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [-2, 2, -2]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Abstract technical vector */}
                <svg width="300" height="400" viewBox="0 0 300 400" className="text-white/20">
                  <defs>
                    <linearGradient id="vectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Central hexagon */}
                  <path
                    d="M 150 100 L 200 150 L 200 250 L 150 300 L 100 250 L 100 150 Z"
                    stroke="url(#vectorGradient)"
                    strokeWidth="2"
                    fill="none"
                  />
                  
                  {/* Orbital rings */}
                  <circle cx="150" cy="200" r="80" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
                  <circle cx="150" cy="200" r="120" stroke="white" strokeWidth="0.3" fill="none" opacity="0.2" />
                  
                  {/* Connection lines */}
                  <path d="M 150 200 L 250 150" stroke="white" strokeWidth="1" opacity="0.4" />
                  <path d="M 150 200 L 50 250" stroke="white" strokeWidth="1" opacity="0.4" />
                  <path d="M 150 200 L 180 100" stroke="white" strokeWidth="1" opacity="0.4" />
                  
                  {/* Data points */}
                  <circle cx="250" cy="150" r="4" fill="white" opacity="0.6" />
                  <circle cx="50" cy="250" r="4" fill="white" opacity="0.6" />
                  <circle cx="180" cy="100" r="4" fill="white" opacity="0.6" />
                </svg>
              </motion.div>

              {/* Floating particles */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Column 2: Main Heading */}
            <motion.div 
              style={{ 
                opacity: column2Opacity,
                scale: column2Scale
              }}
              className="w-1/3 h-full flex items-center justify-center px-12"
            >
              <div className="text-center">
                <motion.h2 
                  className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-8"
                  style={{
                    letterSpacing: '-0.02em'
                  }}
                >
                  THE<br />FUTURE<br />OF<br />DESIGN
                </motion.h2>
                <motion.p 
                  className="responsive-paragraph text-white/60 font-light tracking-widest uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Editorial Excellence
                </motion.p>
              </div>
            </motion.div>

            {/* Column 3: Cards Section */}
            <motion.div 
              style={{ 
                opacity: column3Opacity,
                scale: column3Scale
              }}
              className="w-1/3 h-full flex items-center justify-center px-8"
            >
              <div className="space-y-6 max-w-md">
                {editorialCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 text-white hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl mb-3 tracking-tight">
                          {card.title}
                        </h3>
                        <p className="text-white/70 font-light">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0, 1]) }}
      >
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            style={{ 
              scaleX: scrollYProgress,
              transformOrigin: "left"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
