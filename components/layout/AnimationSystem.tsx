'use client';

import { motion } from 'framer-motion';

// Unified animation variants for consistent motion across all sections
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      staggerChildren: 0.15,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

// Unified hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.98 }
};

export const hoverGlow = {
  whileHover: { 
    scale: 1.05,
    boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)'
  },
  whileTap: { scale: 0.98 }
};

// Responsive viewport settings
export const viewportConfig = {
  once: true,
  margin: "-50px"
};

// Breakpoint-based animation delays
export const getStaggerDelay = (index: number, baseDelay: number = 0.08) => index * baseDelay;

export const getResponsiveDelay = (baseDelay: number, isMobile: boolean = false) => 
  isMobile ? baseDelay * 0.7 : baseDelay;

// Easing functions for premium feel
export const premiumEase = [0.23, 1, 0.32, 1];
export const smoothEase = [0.25, 0.1, 0.25, 1];
export const sharpEase = [0.215, 0.61, 0.355, 1];

// Animation duration presets
export const durations = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.0,
  premium: 1.2
};

// Default motion props for consistent behavior
export const defaultMotionProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: viewportConfig,
  transition: { duration: durations.premium, ease: premiumEase }
};

// Staggered animation wrapper
export const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = "", staggerDelay = 0.08 }) => {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      transition={{
        duration: durations.premium,
        staggerChildren: staggerDelay,
        ease: premiumEase
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated text component for consistent text animations
export const AnimatedText: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: any;
}> = ({ children, className = "", delay = 0, variants = headingVariants }) => {
  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{ 
        duration: durations.premium, 
        delay,
        ease: premiumEase 
      }}
    >
      {children}
    </motion.div>
  );
};

// Parallax animation hook helper
export const useParallax = (scrollYProgress: any, distance: number = 100) => {
  return {
    y: scrollYProgress * distance
  };
};

// Floating animation component
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}> = ({ children, className = "", duration = 3, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation component
export const PulseElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  scale?: number;
}> = ({ children, className = "", scale = 1.1 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  containerVariants,
  headingVariants,
  contentVariants,
  slideInFromLeft,
  slideInFromRight,
  scaleIn,
  hoverScale,
  hoverGlow,
  viewportConfig,
  getStaggerDelay,
  getResponsiveDelay,
  premiumEase,
  smoothEase,
  sharpEase,
  durations,
  defaultMotionProps,
  StaggeredContainer,
  AnimatedText,
  useParallax,
  FloatingElement,
  PulseElement
};
