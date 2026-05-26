'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import PremiumCTA from './PremiumCTA';

const navItems = [
  { label: 'WHO WE ARE ', href: '/about' },
  { label: 'WHAT WE OFFER', href: '/services' },
  { label: 'OUR WORK', href: '/projects' },
  // { label: 'CONTACT', href: '/contact' }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [useAnimatedLogo, setUseAnimatedLogo] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  
  // Smooth scroll-based animations
  const scrollThreshold = 60;
  
  // Background opacity and blur effect
  const backgroundOpacity = useTransform(scrollY, [0, scrollThreshold, scrollThreshold + 20], [0, 0.4, 0.95]);
  const backdropBlur = useTransform(scrollY, [0, scrollThreshold, scrollThreshold + 20], [0, 8, 16]);
  
  // Container width and centering
  const containerMaxWidth = useTransform(scrollY, [0, scrollThreshold, scrollThreshold + 20], ['100%', '100%', '1200px']);
  const containerPaddingY = useTransform(scrollY, [0, scrollThreshold, scrollThreshold + 20], [16, 16, 12]);
  
  // Border radius and gap
  const borderRadius = useTransform(scrollY, [0, scrollThreshold, scrollThreshold + 20], [0, 0, 8]);
  const gap = useTransform(scrollY, [0, scrollThreshold, scrollThreshold + 20], [24, 24, 32]);
  
  // Header stays always visible - no hide/reveal logic

  // Detect when header reaches max-width: 900px to change logo
  useMotionValueEvent(scrollY, "change", (latest) => {
    // When scroll > 80, containerMaxWidth becomes 900px
    setUseAnimatedLogo(latest > 80);
  });

  return (
    <>
      {/* Main Header - Animated and Sticky */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50"
      >
        <motion.div 
          className="mx-auto flex items-center border-x border-white/10 shadow-2xl rounded-full px-[25px] lg:px-[50px]"
          style={{
            maxWidth: containerMaxWidth,
            paddingTop: containerPaddingY,
            paddingBottom: containerPaddingY,
            borderRadius: borderRadius,
            gap: gap,
            marginTop: '2rem',
            justifyContent: useTransform(scrollY, (value) => {
              // Always use space-between on mobile, center on desktop when scrolled
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                return 'space-between';
              }
              return value > scrollThreshold ? 'center' : 'space-between';
            }),
            background: useTransform(backgroundOpacity, (value) => `rgba(42, 42, 42, ${value})`),
            backdropFilter: useTransform(backdropBlur, (value) => `blur(${value}px)`),
            WebkitBackdropFilter: useTransform(backdropBlur, (value) => `blur(${value}px)`),
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center"
            >
              <div className="relative">
                <img
                  src={useAnimatedLogo ? "/images/logo.gif" : "/images/logo.png"}
                  alt="Synergos Logo"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 responsive-cta text-white/90 hover:text-white transition-colors duration-200"
                >
                  <motion.span
                    initial="rest"
                    whileHover="hover"
                    className="relative flex overflow-hidden"
                  >
                    {item.label.split('').map((char, i) => (
                      <span
                        key={i}
                        className="relative inline-block overflow-hidden"
                        style={{ marginRight: char === ' ' ? '6px' : '1px' }}
                      >
                        <motion.span
                          className="block text-white/90"
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
                                duration: 0.40,
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
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 relative">
              {/* GET IN TOUCH Button with premium hover */}
              <div className="hidden lg:block">
                <PremiumCTA href="/contact" title="GET IN TOUCH" hoverTitle="GET IN TOUCH" />
              </div>


              {/* Search Icon */}
              <button
                type="button"
                aria-label="Search"
                className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full text-white/80 transition-all duration-200 relative z-20"
              >
                <div className="relative w-6 h-6 sm:w-5 sm:h-5">
                  <Image
                    src="/images/search-icon.png"
                    alt="Search"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </button>

              {/* Menu Toggle */}
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full text-white/80 transition-all duration-200 relative z-30"
              >
                <div className="relative w-12 h-12 sm:w-10 sm:h-10">
                  <Image
                    src="/images/menu-icon.png"
                    alt="Menu"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </button>
            </div>
          </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
            <motion.nav
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className="relative h-full flex flex-col items-center justify-center px-6"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-4 responsive-cta font-semibold uppercase tracking-[0.1em] text-white hover:text-sky-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
