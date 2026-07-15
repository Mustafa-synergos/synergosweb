'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useTransform,
  easeOut,
} from 'framer-motion';
import CTA from '@/components/shared/CTA';
import SearchOverlay from '@/components/layout/SearchOverlay';
import { documentScrollY } from '@/lib/scroll-motion';

const SCROLL_START = 40;
const SCROLL_END = 110;
const BG_START = 85;
const BG_END = 145;
const LOGO_OUT_END = BG_START + 10;
const LOGO_IN_END = BG_START + 28;
const COLLAPSED_WIDTH = 1280;
const HEADER_BG = '#2A2A2A';

const navItems = [
  { label: 'WHO WE ARE ', href: '/about' },
  { label: 'WHAT WE OFFER', href: '/services' },
  { label: 'OUR WORK', href: '/projects' },
];

const browseMainItems = [
  { label: 'Who we are', href: '/about' },
  { label: 'Our work', href: '/projects' },
  { label: 'Career', href: '/careers' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Our Client', href: '/clients' },
];

const resourceItems = [
  { label: 'Case Study', href: '/case-studies' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Articles', href: '/resources/articles' },
  { label: 'News', href: '/news' },
];

const serviceItemsLeft = [
  { label: 'Web Development & Web Technologies', href: '/services/web-development' },
  { label: 'Social Media Management', href: '/services/social-media' },
  { label: 'Search Engine Optimisation', href: '/services/seo' },
  { label: 'Performance Marketing', href: '/services/performance-marketing' },
  { label: 'Online Media Planning & Buying', href: '/services/online-media' },
  { label: 'Influencer Marketing & Management', href: '/services/influencer-marketing' },
];

const serviceItemsRight = [
  { label: 'Quick Commerce Marketing & Optimisation', href: '/services/quick-commerce' },
  { label: 'AI Strategy & Consultancy', href: '/services/ai-strategy' },
  { label: 'Branding & Identity', href: '/services/branding' },
  { label: 'Offline Print & Media Buying', href: '/services/offline-media' },
  { label: 'Brand Films & Multimedia Production', href: '/services/brand-films' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [headerBottom, setHeaderBottom] = useState(88);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(COLLAPSED_WIDTH);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    documentScrollY.set(window.scrollY);
  }, []);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setViewportWidth(width);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  useEffect(() => {
    const updateHeaderBottom = () => {
      if (!headerRef.current) return;
      setHeaderBottom(headerRef.current.getBoundingClientRect().bottom);
    };

    updateHeaderBottom();
    window.addEventListener('resize', updateHeaderBottom);
    window.addEventListener('scroll', updateHeaderBottom, { passive: true });

    return () => {
      window.removeEventListener('resize', updateHeaderBottom);
      window.removeEventListener('scroll', updateHeaderBottom);
    };
  }, [isDesktop, mobileMenuOpen, searchOpen]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
  };

  const toggleSearch = () => {
    setMobileMenuOpen(false);
    if (headerRef.current) {
      setHeaderBottom(headerRef.current.getBoundingClientRect().bottom);
    }
    setSearchOpen((open) => !open);
  };

  const scrollRange = [0, SCROLL_START, SCROLL_END];
  const backgroundRange = [0, BG_START, BG_END];
  const collapsedWidth = Math.min(viewportWidth, COLLAPSED_WIDTH);

  const containerMaxWidth = useTransform(documentScrollY, (y) => {
    if (!isDesktop || y <= SCROLL_START) return '100%';
    if (y >= SCROLL_END) return `${collapsedWidth}px`;
    const progress = easeOut((y - SCROLL_START) / (SCROLL_END - SCROLL_START));
    const width = viewportWidth + (collapsedWidth - viewportWidth) * progress;
    return `${width}px`;
  });

  const containerPaddingY = useTransform(
    documentScrollY,
    scrollRange,
    [16, 16, 12],
    { ease: easeOut, clamp: true }
  );
  const borderRadius = useTransform(
    documentScrollY,
    scrollRange,
    [0, 0, 8],
    { ease: easeOut, clamp: true }
  );
  const backgroundOpacity = useTransform(
    documentScrollY,
    backgroundRange,
    [0, 0, 1],
    { ease: easeOut, clamp: true }
  );
  const backdropBlur = useTransform(
    documentScrollY,
    backgroundRange,
    [0, 0, 16],
    { ease: easeOut, clamp: true }
  );
  const backgroundColor = useTransform(
    backgroundOpacity,
    (value) => `rgba(42, 42, 42, ${value})`
  );
  const backdropFilter = useTransform(backdropBlur, (value) => `blur(${value}px)`);
  const shadowOpacity = useTransform(
    documentScrollY,
    scrollRange,
    [0, 0, 1],
    { ease: easeOut, clamp: true }
  );
  const boxShadow = useTransform(shadowOpacity, (value) => {
    if (value <= 0) return 'none';
    return `0 25px 50px -12px rgba(0, 0, 0, ${0.25 * value})`;
  });
  const pngOpacity = useTransform(
    documentScrollY,
    [0, BG_START, LOGO_OUT_END],
    [1, 1, 0],
    { ease: easeOut, clamp: true }
  );
  const gifOpacity = useTransform(
    documentScrollY,
    [0, LOGO_OUT_END, LOGO_IN_END],
    [0, 0, 1],
    { ease: easeOut, clamp: true }
  );

  return (
    <>
      <motion.header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className={`mx-auto flex items-center justify-between rounded-none px-4 lg:mt-8 lg:justify-between lg:rounded-full lg:border-x lg:border-white/10 sm:px-8 ${
            mobileMenuOpen ? 'bg-[#2A2A2A]' : ''
          }`}
          style={{
            maxWidth: containerMaxWidth,
            paddingTop: containerPaddingY,
            paddingBottom: containerPaddingY,
            borderRadius: isDesktop ? borderRadius : 0,
            justifyContent: 'space-between',
            background: mobileMenuOpen && !isDesktop ? HEADER_BG : backgroundColor,
            boxShadow: isDesktop ? boxShadow : 'none',
            backdropFilter: isDesktop ? backdropFilter : undefined,
            WebkitBackdropFilter: isDesktop ? backdropFilter : undefined,
          }}
        >
          <Link href="/" className="relative z-[1] flex items-center">
            <div className="relative isolate flex h-[40px] w-[100px] max-w-[120px] items-center sm:h-[50px] sm:w-[50px] md:h-auto md:w-auto lg:h-full lg:max-h-[80px] lg:min-h-[48px] lg:w-auto lg:max-w-[180px]">
              <motion.img
                src="/images/logo.png"
                alt="Synergos Logo"
                className="h-full w-full object-contain lg:max-h-[80px]  lg:w-[130px]"
                style={{ opacity: pngOpacity }}
              />
              <motion.img
                src="/images/logo.gif"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 h-full w-[40px] object-contain lg:min-h-[48px] lg:w-[50px]"
                style={{ opacity: gifOpacity }}
              />
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="responsive-cta px-3 py-2 text-white/90 transition-colors duration-200 hover:text-white"
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
                        {char === ' ' ? ' ' : char}
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
                        {char === ' ' ? ' ' : char}
                      </motion.span>
                    </span>
                  ))}
                </motion.span>
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-3">
            <div className="hidden lg:block">
              <CTA
                displayText="GET IN TOUCH"
                hoverText="GET IN TOUCH"
                link="/contact"
              />
            </div>

            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              onClick={toggleSearch}
              className="relative z-20 flex h-8 w-8 items-center justify-center text-white/80 transition-all duration-200 sm:h-10 sm:w-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                {searchOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-white"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <Image
                      src="/images/search-icon.png"
                      alt="Search"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => {
                setSearchOpen(false);
                if (mobileMenuOpen) {
                  closeMenu();
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              className="relative z-30 flex h-8 w-8 items-center justify-center text-white/80 transition-all duration-200 sm:h-10 sm:w-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-white"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.div
                    key="hamburger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Image
                      src="/images/menu-icon.png"
                      alt="Menu"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </motion.header>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        headerBottom={headerBottom}
      />

      {/* Full menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#2A2A2A] m-0 lg:m-[20px] rounded-0 lg:rounded-[20px]"
          >
            {/* Banner decorators — same as PageHeroSection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 z-0 h-[65%] w-[48%] max-w-[30%] opacity-100"
              style={{
                backgroundImage: "url('/images/page-hero/banner-vector-right.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top right',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 z-0 h-[60%] w-[46%] max-w-[15%] opacity-100"
              style={{
                backgroundImage: "url('/images/page-hero/banner-vector-left.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom left',
              }}
            />

            {/* spacer equal to header height */}
            <div style={{ height: headerBottom }} />

            <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10 lg:px-0 lg:py-12 md:!px-4">
               <h2 className="mb-6 text-[clamp(3rem,8vw,5.5rem)] font-bold uppercase leading-none text-white">
                    MENU
                  </h2>
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">

                {/* ── LEFT: BROWSE ── */}
                <div>
                 

                  {/* BROWSE label */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className=" lg:text-[36px] text-[24px] font-bold uppercase tracking-[0.2em] text-[#ff202a]">
                      BROWSE
                    </span>
                  </div>

                  {/* Browse columns */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                    {/* Main nav items */}
                    <div className="space-y-4">
                      {[{ label: 'Home', href: '/' }, ...browseMainItems].map((item) => {
                        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className="group flex items-center gap-2 text-[16px] lg:text-[18px] transition-colors"
                          >
                            {isActive ? (
                              <svg
                                width="23"
                                height="20"
                                viewBox="0 0 23 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0"
                              >
                                <path d="M22.999 14.9799C23.0391 12.3306 21.8427 10.3362 19.5393 9.21604C17.9042 8.39369 15.433 7.69345 11.996 7.08108C8.86914 6.52329 6.25016 5.69261 4.20842 4.61218C2.05086 3.49013 0.672982 1.98973 0 0V16.3554C0 18.3683 1.60859 20 3.59289 20H19.0769C19.967 19.8659 20.7302 19.5578 21.3494 19.074C22.4163 18.2915 22.9771 16.9095 22.9981 14.9799H22.999Z" fill="#FF0000"/>
                              </svg>
                            ) : (
                              <span className="w-[23px] shrink-0" />
                            )}
                            <span className={isActive ? 'font-semibold text-white' : 'text-white/70 group-hover:text-white'}>
                              {item.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Resources + extra links */}
                    <div className="space-y-4">
                      {/* Resources dropdown toggle */}
                      <button
                        type="button"
                        onClick={() => setResourcesOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-[16px] lg:text-[18px] text-white/70 transition-colors hover:text-white"
                      >
                        Resources
                        <motion.svg
                          animate={{ rotate: resourcesOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 4l4 4 4-4" />
                        </motion.svg>
                      </button>

                      <AnimatePresence initial={false}>
                        {resourcesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 pl-3 pt-1">
                              {resourceItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={closeMenu}
                                  className="block text-[16px] lg:text-[18px] font-semibold text-[#ff202a] transition-colors hover:text-white"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Link
                        href="/team"
                        onClick={closeMenu}
                        className="block text-[16px] lg:text-[18px] text-white/70 transition-colors hover:text-white"
                      >
                        Our Team
                      </Link>
                      <Link
                        href="/contact"
                        onClick={closeMenu}
                        className="block text-[16px] lg:text-[18px] text-white/70 transition-colors hover:text-white"
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: WHAT WE OFFER ── */}
                <div>
                  <h3 className="mb-5 lg:text-[36px] text-[24px] font-bold uppercase tracking-[0.2em] text-[#ff202a]">
                    WHAT WE OFFER
                  </h3>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    <div className="space-y-4">
                      {serviceItemsLeft.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="block text-[16px] lg:text-[18px] text-white/70 transition-colors hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {serviceItemsRight.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="block text-[16px] lg:text-[18px] text-white/70 transition-colors hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
