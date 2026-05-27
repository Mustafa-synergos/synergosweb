'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Mousewheel, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import UnifiedSectionWrapper from './layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading } from './layout/EditorialContentGrid';
import InteractiveDots from './InteractiveDots';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  highlightedWords?: number[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Head of lorem ipsum",
    content: "Great experience overall. They delivered intuitive design with strong attention to detail and clear communication. Highly recommended.",
    highlightedWords: [2, 6]
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Chief Technology Officer",
    content: "Outstanding technical execution and strategic vision. The team transformed our digital presence with exceptional results.",
    highlightedWords: [1, 4]
  },
  {
    id: 3,
    name: "Michael Roberts",
    role: "Product Design Lead",
    content: "Incredible attention to user experience. They understood our needs perfectly and exceeded all expectations.",
    highlightedWords: [0, 3]
  },
  {
    id: 4,
    name: "Emily Watson",
    role: "Marketing Director",
    content: "Strategic brilliance meets creative excellence. Their approach revolutionized our brand positioning.",
    highlightedWords: [1, 5]
  },
  {
    id: 5,
    name: "David Kim",
    role: "CEO & Founder",
    content: "Game-changing partnership. The ROI and impact on our business has been extraordinary.",
    highlightedWords: [0, 4]
  }
];

const OrbitalGraphic: React.FC = () => {
  return (
    <motion.div
      className="absolute top-8 right-8 w-32 h-32 lg:w-48 lg:h-48 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.3, scale: 1 }}
      transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Outer orbit ring */}
      <motion.div
        className="absolute inset-0 border border-white/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Middle orbit ring */}
      <motion.div
        className="absolute inset-4 border border-white/5 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner orbit ring */}
      <motion.div
        className="absolute inset-8 border border-white/3 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${50 + Math.sin(i * Math.PI / 3) * 40}%`,
            left: `${50 + Math.cos(i * Math.PI / 3) * 40}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Central glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-xl" />
    </motion.div>
  );
};

const ProgressBar: React.FC<{ activeIndex: number; totalSlides: number }> = ({ activeIndex }) => {
  return (
    <div className="h-[4px] w-full bg-[#424242] overflow-hidden mb-10 lg:mb-8">
      <motion.div
        className="h-full bg-[#ACACAC]"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{
          duration: 4.5,
          ease: 'linear'
        }}
        key={activeIndex}
      />
    </div>
  );
};

const TestimonialSlide: React.FC<{ testimonial: Testimonial; isActive: boolean; activeIndex: number; totalSlides: number }> = ({ testimonial, isActive, activeIndex, totalSlides }) => {
  const words = testimonial.content.split(' ');
  
  return (
    <motion.div
      className="flex flex-col lg:flex-row items-start gap-0 lg:gap-[7rem] text-center lg:text-left px-5 lg:px-0 pl-4 lg:pl-[10rem]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        y: isActive ? 0 : 10,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Content with Progress Bar */}
      <div className="flex-1 max-w-4xl lg:max-w-4xl">
        {/* Progress Bar */}
        <ProgressBar activeIndex={activeIndex} totalSlides={totalSlides} />
        
        {/* Client Info and Testimonial Content */}
        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-[7rem]">
          {/* Quote Icon + Client Info - Mobile Row, Desktop Column */}
          <div className="flex flex-row lg:flex-col items-start gap-3 lg:gap-0 flex-shrink-0">
            {/* Quote Icon - Mobile Only */}
            <div className="flex-shrink-0 lg:hidden">
              <div className="relative w-10 h-10">
                <img
                  src="/images/testimonial-icon.webp"
                  alt="Quote"
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            </div>
            
            {/* Client Info */}
            <div className="space-y-1 text-left">
              <h3 className="text-white font-clother font-normal text-[22px] lg:text-[22px] leading-[22px] lg:leading-[26px] tracking-normal">
                {testimonial.name}
              </h3>
              <p className="text-white font-clother font-light text-[16px] lg:text-[16px] tracking-normal">
                {testimonial.role}
              </p>
            </div>
          </div>
          
          {/* Testimonial Content */}
          <div className="flex-1 text-left">
            <p className="text-gray-400 font-clother font-light text-[16px] lg:text-[30px] tracking-normal">
              {words.map((word, index) => (
                <span
                  key={index}
                  className={
                    testimonial.highlightedWords?.includes(index)
                      ? ' decoration-2 underline-offset-4 !mb-0 lg:!mb-2'
                      : '!mb-0 lg:!mb-2'
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Testimonials: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
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

  const headingVariants = {
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

  const sliderVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        delay: 0.3,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  if (!mounted) return null;

  return (
    <UnifiedSectionWrapper background="custom" id="testimonials" customBgColor="bg-[#171717]">
      <InteractiveDots variant="dark" />
      <EditorialContentGrid>
        <SectionHeader
          label="Real Stories. Lasting Impressions."
          heading={
            <EditorialHeading size="large">
              VOICES OF REAL
              <br />
              EXPERIENCES
            </EditorialHeading>
          }
        />

        {/* Testimonial Slider - PERFECTLY ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Fixed Quote Icon - Desktop Only */}
          <div className="absolute z-10 hidden lg:block" style={{ left: '0rem', top: '-22px' }}>
            <div className="relative w-32 h-32">
              <img
                src="/images/testimonial-icon.webp"
                alt="Quote"
                className="w-full h-full object-contain opacity-80"
              />
            </div>
          </div>

          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            allowTouchMove={true}
            grabCursor={true}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            pagination={{
              clickable: true
            }}
            className="testimonial-swiper !overflow-hidden !pb-10 lg:!pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="!h-auto">
                <TestimonialSlide
                  testimonial={testimonial}
                  isActive={testimonials[activeIndex].id === testimonial.id}
                  activeIndex={activeIndex}
                  totalSlides={testimonials.length}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </EditorialContentGrid>
      
    </UnifiedSectionWrapper>
  );
};
