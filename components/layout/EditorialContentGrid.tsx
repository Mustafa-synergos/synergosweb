'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface EditorialContentGridProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionHeaderProps {
  label: string;
  heading: React.ReactNode;
  description?: string;
  cta?: React.ReactNode;
  className?: string;
  labelColor?: string;
}

interface ContentBlockProps {
  children: React.ReactNode;
  className?: string;
  size?: 'narrow' | 'wide' | 'full';
}

// Main grid container with perfect alignment
export const EditorialContentGrid: React.FC<EditorialContentGridProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative z-10 py-12 lg:py-16 ${className}`}>
      {children}
    </div>
  );
};

// Unified section header with consistent spacing and typography
export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  label, 
  heading, 
  description, 
  cta,
  className = '',
  labelColor = 'text-[#FF0000]'
}) => {
  return (
    <motion.div 
      className={`mb-16 lg:mb-20 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true }}
    >
      {/* Small Label - PERFECTLY ALIGNED */}
      <motion.div
        className="mb-6 lg:mb-8"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className={`inline-block font-clother font-normal uppercase tracking-normal ${labelColor} text-[18px] lg:text-[28px] leading-[100%]`}>
          {label}
        </span>
      </motion.div>

      {/* Main Heading - PERFECTLY ALIGNED */}
      <motion.div
        className="mb-8 lg:mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
      >
        {heading}
      </motion.div>

      {/* Description - PERFECTLY ALIGNED */}
      {description && (
        <motion.p
          className="text-gray-400 font-clother font-normal text-[16px] lg:text-[18px] leading-[24px] lg:leading-[26px] tracking-normal mb-8 lg:mb-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      )}

      {/* CTA - PERFECTLY ALIGNED */}
      {cta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {cta}
        </motion.div>
      )}
    </motion.div>
  );
};

// Content block with consistent sizing
export const ContentBlock: React.FC<ContentBlockProps> = ({ 
  children, 
  className = '',
  size = 'wide' 
}) => {
  const getWidthClass = () => {
    switch (size) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className={`${getWidthClass()} mx-auto ${className}`}>
      {children}
    </div>
  );
};

// Unified heading component with consistent typography
export const EditorialHeading: React.FC<{ 
  children: React.ReactNode; 
  size?: 'large' | 'medium' | 'small';
  className?: string;
}> = ({ children, size = 'large', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'large':
        return 'text-[38px] lg:text-[134px] font-bold leading-[40px] lg:leading-[134px] tracking-normal uppercase';
      case 'medium':
        return 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-[0.9] tracking-tight uppercase';
      case 'small':
        return 'text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[0.95] tracking-tight uppercase';
      default:
        return 'text-[38px] lg:text-[134px] font-bold leading-[40px] lg:leading-[134px] tracking-normal uppercase';
    }
  };

  return (
    <h1 className={`text-white ${getSizeClass()} ${className}`}>
      {children}
    </h1>
  );
};

// Unified CTA button component with premium hover interaction
export const EditorialCTA: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  backgroundContext?: 'dark' | 'red';
}> = ({ children, variant = 'primary', className = '', onClick, backgroundContext = 'dark' }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const baseClasses = variant === 'primary'
    ? 'inline-flex items-center gap-[0.75rem] border rounded-full font-medium uppercase tracking-wider will-change-transform'
    : 'inline-flex items-center gap-[0.75rem] border rounded-full font-medium uppercase tracking-wider will-change-transform';
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smooth magnetic feel
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Handle mouse move for magnetic effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (limited to 10px max movement)
    const maxMove = 10;
    const moveX = (e.clientX - centerX) / rect.width * maxMove;
    const moveY = (e.clientY - centerY) / rect.height * maxMove;
    
    x.set(Math.max(-maxMove, Math.min(maxMove, moveX)));
    y.set(Math.max(-maxMove, Math.min(maxMove, moveY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  // Color configuration based on background context
  const colors = backgroundContext === 'dark' 
    ? {
        // Dark background section
        defaultDot: '#FFFFFF',
        hoverFill: '#FF0000',
        hoverDot: '#FFFFFF',
        defaultText: '#FFFFFF',
        hoverText: '#FFFFFF',
        defaultBorder: 'rgba(255, 255, 255, 0.3)',
        hoverBorder: 'rgba(255, 0, 0, 0.5)'
      }
    : {
        // Red background section
        defaultDot: '#FFFFFF',
        hoverFill: '#FFFFFF',
        hoverDot: '#000000',
        defaultText: '#FFFFFF',
        hoverText: '#000000',
        defaultBorder: 'rgba(255, 255, 255, 0.3)',
        hoverBorder: 'rgba(255, 255, 255, 0.5)'
      };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        borderColor: colors.defaultBorder
      }}
      className={`${baseClasses} will-change-transform overflow-hidden ${className}`}
      initial={false}
      whileHover="hover"
      whileTap="tap"
    >
      {/* Radial fill layer - true clip-path reveal from dot position */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={{
          hover: {
            clipPath: 'circle(160% at calc(100% - 20px) 50%)',
            transition: {
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1]
            }
          },
          tap: {
            clipPath: 'circle(155% at calc(100% - 20px) 50%)',
            transition: {
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        initial={{
          clipPath: 'circle(6px at calc(100% - 20px) 50%)'
        }}
        style={{
          backgroundColor: colors.hoverFill,
          willChange: 'clip-path'
        }}
      />

      {/* Border transition layer */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none z-10"
        variants={{
          hover: {
            borderColor: colors.hoverBorder,
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        initial={{
          borderColor: colors.defaultBorder
        }}
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          willChange: 'border-color'
        }}
      />

      {/* Text content with slide-up animation */}
      <div className="relative z-20 overflow-hidden h-6 flex items-start pt-[0.2rem]">
        <motion.div
          className="flex flex-col"
          variants={{
            hover: {
              y: '-50%',
              transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }
            }
          }}
          initial={{ y: '0%' }}
          style={{ willChange: 'transform' }}
        >
          <motion.span
            className="block leading-6"
            variants={{
              hover: {
                color: colors.hoverText,
                transition: {
                  duration: 0.35,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }
              }
            }}
            initial={{ color: colors.defaultText }}
            style={{ willChange: 'color' }}
          >
            {children}
          </motion.span>
          <motion.span
            className="block leading-6"
            variants={{
              hover: {
                color: colors.defaultText,
                transition: {
                  duration: 0.35,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }
              }
            }}
            initial={{ color: colors.hoverText }}
            style={{ willChange: 'color' }}
          >
            {children}
          </motion.span>
        </motion.div>
      </div>

      {/* Dot indicator - single dot with color transition */}
      <motion.div
        className="absolute right-3 z-30 rounded-full"
        style={{
          width: '13px',
          height: '13px',
          backgroundColor: colors.defaultDot,
          boxShadow: `0 0 0 2px ${backgroundContext === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}`,
          willChange: 'transform, background-color, box-shadow, opacity'
        }}
        variants={{
          hover: {
            backgroundColor: colors.hoverDot,
            scale: 1.15,
            opacity: 1,
            boxShadow: `0 0 0 2px ${backgroundContext === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}`,
            transition: {
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        initial={{
          scale: 1,
          opacity: 0
        }}
      />

      {/* Subtle elevation shadow on hover */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none z-5"
        variants={{
          hover: {
            boxShadow: backgroundContext === 'dark' 
              ? '0 12px 40px rgba(255, 0, 0, 0.25)'
              : '0 12px 40px rgba(255, 255, 255, 0.15)',
            transition: {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        initial={{
          boxShadow: 'none'
        }}
        style={{
          willChange: 'box-shadow'
        }}
      />
    </motion.button>
  );
};

export default EditorialContentGrid;
