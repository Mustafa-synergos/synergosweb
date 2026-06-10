'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rafThrottle } from '../lib/scroll-utils';
import PremiumCTA from './PremiumCTA';

const navItems = [
  { label: 'WHO WE ARE ', href: '/about' },
  { label: 'WHAT WE OFFER', href: '/services' },
  { label: 'OUR WORK', href: '/projects' },
];

const SCROLL_THRESHOLD = 60;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const updateScrolled = rafThrottle(() => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });

    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  const showCompactNav = isDesktop && isScrolled;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`
            mx-auto flex items-center justify-between
            px-[25px] lg:px-[50px] mt-0 lg:mt-8
            shadow-2xl gpu-layer
            transition-[background-color,backdrop-filter,max-width,padding,border-radius,gap]
            duration-300 ease-out
            ${showCompactNav
              ? 'lg:max-w-[1280px] lg:py-3 lg:rounded-lg lg:gap-8 lg:border-x lg:border-white/10 bg-[rgba(42,42,42,0.95)] lg:backdrop-blur-md'
              : 'lg:max-w-full lg:py-4 lg:rounded-none lg:gap-6 lg:border-x lg:border-white/10 bg-transparent'
            }
          `}
        >
          <Link href="/" className="flex items-center">
            <div className="relative flex items-center w-[100px] max-w-[120px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-auto md-h-auto lg:max-w-[180px] lg:w-auto lg:min-h-[48px] lg:max-h-[80px] lg:h-full">
              <img
                src="/images/logo.png"
                alt="Synergos Logo"
                className={`w-full h-full object-contain w-[120px] h-full lg:w-[130px] lg:max-h-[80px] lg:h-full transition-opacity duration-300 ${
                  isScrolled ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img
                src="/images/logo.gif"
                alt="Synergos Logo"
                className={`absolute top-0 left-0 h-full w-[40px] object-contain pointer-events-none lg:w-[50px] lg:min-h-[48px] transition-opacity duration-300 ${
                  isScrolled ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </Link>

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
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative">
            <div className="hidden lg:block">
              <PremiumCTA href="/contact" title="GET IN TOUCH" hoverTitle="GET IN TOUCH" />
            </div>

            <button
              type="button"
              aria-label="Search"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white/80 transition-all duration-200 relative z-20"
            >
              <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                <Image
                  src="/images/search-icon.png"
                  alt="Search"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white/80 transition-all duration-200 relative z-30"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/images/menu-icon.png"
                  alt="Menu"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 lg:hidden gpu-layer"
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
