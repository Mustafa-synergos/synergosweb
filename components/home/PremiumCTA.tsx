'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface PremiumCTAProps {
  title?: string;
  hoverTitle?: string;
  href?: string;
  openInNewTab?: boolean;
  onClick?: () => void;
  className?: string;
  magnetic?: boolean;
}

export default function PremiumCTA({
  title = "LET'S TALK",
  hoverTitle = 'GET STARTED',
  href,
  openInNewTab = false,
  onClick,
  className = '',
  magnetic = false,
}: PremiumCTAProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const [isRedSection, setIsRedSection] = useState(false);
  const [magnetArmed, setMagnetArmed] = useState(false);
  const [hoverScale, setHoverScale] = useState(64);
  const [isHovered, setIsHovered] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let node: HTMLElement | null = el;

    const isRed = (color: string) => {
      if (!color) return false;
      const norm = color.replace(/\s+/g, ' ').toLowerCase();
      return (
        norm.includes('rgb(255, 0, 0)') ||
        norm.includes('rgba(255, 0, 0, 1)') ||
        norm.includes('rgb(255 0 0') ||
        norm.includes('255, 0, 0')
      );
    };

    while (node) {
      const bg = getComputedStyle(node).backgroundColor;
      if (isRed(bg)) {
        setIsRedSection(true);
        break;
      }
      node = node.parentElement;
    }
  }, []);

  useEffect(() => {
    const computeScale = () => {
      const btn = ref.current;
      const circle = circleRef.current;
      if (!btn || !circle) return;

      const b = btn.getBoundingClientRect();
      const c = circle.getBoundingClientRect();

      const cx = c.left + c.width / 2 - b.left;
      const cy = c.top + c.height / 2 - b.top;

      const d1 = Math.hypot(cx - 0, cy - 0);
      const d2 = Math.hypot(cx - b.width, cy - 0);
      const d3 = Math.hypot(cx - 0, cy - b.height);
      const d4 = Math.hypot(cx - b.width, cy - b.height);
      const maxDist = Math.max(d1, d2, d3, d4);

      const radius = maxDist + 4;
      const required = Math.max(1, (radius * 2) / c.width);
      setHoverScale(required);
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 40,
    damping: 14,
    mass: 1.8,
  });

  const springY = useSpring(y, {
    stiffness: 40,
    damping: 14,
    mass: 1.8,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!magnetic || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawDx = e.clientX - centerX;
    const rawDy = e.clientY - centerY;

    if (!magnetArmed) {
      if (Math.hypot(rawDx, rawDy) < 6) {
        x.set(0);
        y.set(0);
        return;
      }
      setMagnetArmed(true);
    }

    x.set((rawDx / rect.width) * 10);
    y.set((rawDy / rect.height) * 10);
  };

  const handleMouseLeave = () => {
    if (magnetic) {
      x.set(0);
      y.set(0);
      setMagnetArmed(false);
    }
  };

  const handleMouseEnter = () => {
    if (ref.current && circleRef.current) {
      const b = ref.current.getBoundingClientRect();
      const c = circleRef.current.getBoundingClientRect();
      const cx = c.left + c.width / 2 - b.left;
      const cy = c.top + c.height / 2 - b.top;
      const d1 = Math.hypot(cx - 0, cy - 0);
      const d2 = Math.hypot(cx - b.width, cy - 0);
      const d3 = Math.hypot(cx - 0, cy - b.height);
      const d4 = Math.hypot(cx - b.width, cy - b.height);
      const maxDist = Math.max(d1, d2, d3, d4);
      const radius = maxDist + 4;
      const required = Math.max(1, (radius * 2) / Math.max(1, c.width));
      setHoverScale(required);
    }

    if (magnetic) {
      setMagnetArmed(false);
      x.set(0);
      y.set(0);
    }
  };

  const Component = href ? motion.a : motion.button;
  const extraProps = href
    ? {
        href,
        ...(openInNewTab
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {}),
      }
    : { onClick };

  return (
    <Component
      ref={ref as never}
      {...extraProps}
      onMouseEnter={() => {
        setIsHovered(true);
        handleMouseEnter();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
      initial="rest"
      animate={isHovered ? 'hover' : 'rest'}
      whileTap={{ scale: 0.985 }}
      style={{
        x: magnetic ? springX : 0,
        y: magnetic ? springY : 0,
        borderColor: isRedSection ? '#ffffff' : 'rgba(255,255,255,0.2)',
        fontFamily: '"clother", sans-serif',
      }}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        gap-4
        overflow-hidden
        rounded-full
        border
        px-6 pr-12
        py-3
        uppercase
        font-[300]
        bg-transparent
        transition-all
        duration-700
        cursor-pointer
        ${className}
      `}
    >
      <motion.div
        ref={circleRef}
        className="absolute right-4 top-1/2 z-10 rounded-full"
        initial={{
          width: 15,
          height: 15,
          x: 0,
          y: '-50%',
          scale: 1,
        }}
        custom={hoverScale}
        variants={{
          hover: (s: number) => ({
            scale: s,
            transition: {
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
            },
          }),
        }}
        style={{
          backgroundColor: isRedSection ? '#ffffff' : '#ff2020',
        }}
      />

      <motion.div
        className="absolute right-4 top-1/2 z-30 rounded-full"
        initial={{
          width: 15,
          height: 15,
          y: '-50%',
          backgroundColor: '#ffffff',
        }}
        variants={{
          hover: {
            backgroundColor: isRedSection ? '#ff0000' : '#ffffff',
            transition: {
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            },
          },
        }}
      />

      <div className="relative z-40 flex overflow-hidden">
        {title.split('').map((char, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <motion.span
              className="block text-white"
              style={{ fontFamily: '"clother", sans-serif' }}
              initial={{ y: 0 }}
              variants={{
                hover: {
                  y: '-120%',
                  transition: {
                    delay: i * 0.04,
                    duration: 0.45,
                    ease: [0.76, 0, 0.24, 1],
                  },
                },
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>

            <motion.span
              className="absolute left-0 top-full block"
              style={{
                fontFamily: '"clother", sans-serif',
                color: isRedSection ? '#ff0000' : '#ffffff',
              }}
              initial={{ y: 0 }}
              variants={{
                hover: {
                  y: '-100%',
                  transition: {
                    delay: i * 0.04,
                    duration: 0.45,
                    ease: [0.76, 0, 0.24, 1],
                  },
                },
              }}
            >
              {hoverTitle[i] || char}
            </motion.span>
          </span>
        ))}
      </div>
    </Component>
  );
}
