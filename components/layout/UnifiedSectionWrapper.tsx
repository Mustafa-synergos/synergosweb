'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UnifiedSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  background?: 'dark' | 'darker' | 'red' | 'gradient' | 'custom';
  id?: string;
  backgroundImage?: string;
  customBgColor?: string;
  backgroundElement?: React.ReactNode;
  sectionRef?: React.RefObject<HTMLElement>;
}

const UnifiedSectionWrapper: React.FC<UnifiedSectionWrapperProps> = ({ 
  children, 
  className = '', 
  background = 'dark',
  id,
  backgroundImage,
  customBgColor,
  backgroundElement,
  sectionRef
}) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'darker':
        return 'bg-[#050505]';
      case 'red':
        return 'bg-[#FF0000]';
      case 'gradient':
        return 'bg-gradient-to-b from-[#050505] to-[#0a0a0a]';
      case 'custom':
        return customBgColor || 'bg-[#171717]';
      default:
        return 'bg-[#0a0a0a]';
    }
  };

  const getBackgroundStyle = () => {
    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {};
  };

  return (
    <motion.section 
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative w-full overflow-hidden ${getBackgroundClass()} ${className}`}
      style={getBackgroundStyle()}
      ref={sectionRef as any}
    >
      {/* Unified Background Grid Pattern - Only show if no custom background image */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="h-full w-full bg-[radial-gradient(circle_1px_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      )}

      {/* Custom Background Element */}
      {backgroundElement}

      {/* Unified Content Container - PERFECT ALIGNMENT SYSTEM */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UnifiedSectionWrapper;
