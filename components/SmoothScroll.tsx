'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from '../lib/lenis-instance';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : isTouchDevice ? 0.9 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: isTouchDevice ? 1.5 : 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Keep ScrollTrigger in sync with Lenis virtual scroll position
    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback, false);
    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    const onScrollTriggerRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', onScrollTriggerRefresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.removeEventListener('refresh', onScrollTriggerRefresh);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      setLenisInstance(null);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
    };
  }, []);

  return null;
}
