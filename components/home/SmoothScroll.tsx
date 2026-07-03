'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';

import { documentScrollY } from '@/lib/scroll-motion';

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    documentScrollY.set(lenis.scroll);

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      documentScrollY.set(scroll);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    }, false);

    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      lenis.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
