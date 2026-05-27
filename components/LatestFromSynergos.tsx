'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Mousewheel } from 'swiper/modules';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import UnifiedSectionWrapper from './layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading } from './layout/EditorialContentGrid';
import PremiumCTA from './PremiumCTA';
import InteractiveDots from './InteractiveDots';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Why Creators are now driving Commerce, not just Content",
    excerpt: "In an exclusive piece for MediaBrief, Vishal Rajani, Founder and Chief Executive Officer, Synergos...",
    category: "Article",
    date: "27 Apr 2026",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "The Future of AI-Powered Business Intelligence",
    excerpt: "Exploring how artificial intelligence is revolutionizing data analytics and decision-making processes in modern enterprises.",
    category: "Technology",
    date: "15 May 2024",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "Building Scalable Infrastructure for Global Teams",
    excerpt: "Key strategies for creating robust technical architectures that support distributed teams across multiple time zones.",
    category: "Engineering",
    date: "12 May 2024",
    readTime: "8 min read"
  },
  {
    id: 4,
    title: "The Psychology of User Experience Design",
    excerpt: "Understanding cognitive principles that drive effective digital experiences and user engagement metrics.",
    category: "Design",
    date: "10 May 2024",
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Quantum Computing: Practical Applications Today",
    excerpt: "Real-world implementations of quantum algorithms solving complex optimization problems in enterprise environments.",
    category: "Innovation",
    date: "8 May 2024",
    readTime: "10 min read"
  },
  {
    id: 6,
    title: "Sustainable Technology: Green Computing Practices",
    excerpt: "How leading tech companies are reducing their carbon footprint through innovative infrastructure design.",
    category: "Sustainability",
    date: "5 May 2024",
    readTime: "7 min read"
  },
  {
    id: 7,
    title: "Digital Transformation Strategies for 2024",
    excerpt: "Comprehensive approaches to modernizing business operations and embracing digital-first methodologies.",
    category: "Strategy",
    date: "2 May 2024",
    readTime: "9 min read"
  },
  {
    id: 8,
    title: "Remote Work: The New Normal",
    excerpt: "Best practices for managing distributed teams and maintaining productivity in remote work environments.",
    category: "Workplace",
    date: "30 Apr 2024",
    readTime: "6 min read"
  }
];

const additionalBlogPosts: BlogPost[] = [
  {
    id: 9,
    title: "Machine Learning in Healthcare: Revolutionizing Patient Care",
    excerpt: "How AI and ML technologies are transforming medical diagnostics, treatment planning, and patient outcomes globally.",
    category: "Healthcare",
    date: "3 May 2024",
    readTime: "12 min read"
  },
  {
    id: 10,
    title: "The Evolution of Cloud Computing Architecture",
    excerpt: "From monolithic to serverless: Understanding the paradigm shift in cloud infrastructure design and deployment strategies.",
    category: "Cloud",
    date: "1 May 2024",
    readTime: "9 min read"
  },
  {
    id: 11,
    title: "Cybersecurity Trends: Protecting Digital Assets in 2024",
    excerpt: "Essential strategies and emerging technologies for safeguarding enterprise data against sophisticated cyber threats.",
    category: "Security",
    date: "28 Apr 2024",
    readTime: "8 min read"
  },
  {
    id: 12,
    title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
    excerpt: "Exploring how distributed ledger technology is revolutionizing supply chain, finance, and digital identity management.",
    category: "Blockchain",
    date: "25 Apr 2024",
    readTime: "11 min read"
  },
  {
    id: 13,
    title: "The Rise of Low-Code/No-Code Development Platforms",
    excerpt: "Democratizing software development: How visual programming tools are enabling non-technical users to build applications.",
    category: "Development",
    date: "22 Apr 2024",
    readTime: "7 min read"
  },
  {
    id: 14,
    title: "Data Privacy Regulations: Navigating Global Compliance",
    excerpt: "A comprehensive guide to GDPR, CCPA, and emerging privacy laws affecting businesses operating across international markets.",
    category: "Compliance",
    date: "20 Apr 2024",
    readTime: "10 min read"
  },
  {
    id: 15,
    title: "Edge Computing: Processing at the Network Edge",
    excerpt: "How edge computing is reducing latency and improving performance for IoT and real-time applications.",
    category: "Infrastructure",
    date: "18 Apr 2024",
    readTime: "8 min read"
  },
  {
    id: 16,
    title: "5G Technology: Transforming Connectivity",
    excerpt: "The impact of 5G networks on business operations, consumer experiences, and the future of communication.",
    category: "Technology",
    date: "15 Apr 2024",
    readTime: "9 min read"
  }
];

const BlogCard: React.FC<{ post: BlogPost; index: number; onHover: (hovering: boolean) => void; onClick: () => void }> = ({ post, index, onHover, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    onHover(false);
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1]
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={onClick}
    >
      {/* Card - PERFECTLY ALIGNED */}
      <motion.div
        className="relative border border-white/10 rounded-2xl p-4 sm:p-6 w-[323px] lg:w-[470px] h-[177px] lg:h-[220px] transition-all duration-500 ease-out"
        animate={{
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.2)',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered ? '0 0 30px rgba(255, 255, 255, 0.1)' : 'none',
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -8 : 0
        }}
        transition={{
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1]
        }}
        style={{
          backdropFilter: isHovered ? 'blur(10px)' : 'none'
        }}
      >
        {/* Card Content */}
        <div className="flex flex-col h-full justify-between">
          {/* Title */}
          <h3 className="text-gray-400 font-clother font-bold text-[15px] sm:text-[17px] lg:text-[20px] leading-[20px] sm:leading-[22px] lg:leading-[30px] tracking-normal mb-2 sm:mb-3">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-400 font-clother font-light text-[13px] sm:text-[15px] lg:text-[18px] leading-[20px] sm:leading-[24px] lg:leading-[26px] tracking-normal line-clamp-2">
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="text-[16px] text-gray-500 font-clother font-light tracking-[0.08rem] mt-3 sm:mt-4">
            {post.category} | {post.date}
          </div>
        </div>

        {/* Glassmorphism Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        />
      </motion.div>
    </motion.div>
  );
};

// Custom Cursor Component for Insights Section
const InsightsCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveringCard = useRef(false);
  const isDragging = useRef(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const isDesktop = useRef(false);
  const rafId = useRef<number | null>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    // Check if desktop (no touch support)
    isDesktop.current = window.matchMedia('(pointer: fine)').matches;
    
    if (!isDesktop.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const animateCursor = () => {
      if (!isHoveringCard.current || isDragging.current) {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: 'power2.out'
          });
          // Restore default cursor
          document.body.style.cursor = '';
        }
        rafId.current = requestAnimationFrame(animateCursor);
        return;
      }

      if (cursorRef.current) {
        // Initialize GSAP quickTo if not already done
        if (!xTo.current || !yTo.current) {
          xTo.current = gsap.quickTo(cursorRef.current, 'x', { duration: 0.15, ease: 'power3' });
          yTo.current = gsap.quickTo(cursorRef.current, 'y', { duration: 0.15, ease: 'power3' });
        }
        
        xTo.current(mouseX.current - cursorX.current);
        yTo.current(mouseY.current - cursorY.current);

        gsap.to(cursorRef.current, {
          opacity: 1,
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out'
        });
        // Hide default cursor
        document.body.style.cursor = 'none';
      }

      rafId.current = requestAnimationFrame(animateCursor);
    };

    // Initialize cursor position after ref is available
    const initCursor = () => {
      if (cursorRef.current) {
        const rect = cursorRef.current.getBoundingClientRect();
        cursorX.current = rect.width / 2;
        cursorY.current = rect.height / 2;
      }
    };

    initCursor();
    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      document.body.style.cursor = '';
    };
  }, []);

  // Expose functions to parent
  useEffect(() => {
    (window as any).insightsCursorSetHovering = (hovering: boolean) => {
      isHoveringCard.current = hovering;
    };

    (window as any).insightsCursorSetDragging = (dragging: boolean) => {
      isDragging.current = dragging;
    };

    return () => {
      delete (window as any).insightsCursorSetHovering;
      delete (window as any).insightsCursorSetDragging;
    };
  }, []);

  const handleClick = () => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  };

  if (!isDesktop.current) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-[50px]"
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: '#FF0000',
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(0.8)',
        // boxShadow: '0 0 40px rgba(255, 59, 48, 0.5), 0 0 80px rgba(255, 59, 48, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        mixBlendMode: 'normal',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
      }}
      onClick={handleClick}
    >
      <span className="text-white font-bold uppercase tracking-[0.15em] text-sm !mb-0 lg:!mb-2" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
        Read More
      </span>
    </div>
  );
};

export const LatestFromSynergos: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<any>(null);
  const swiperRef2 = useRef<any>(null);
  const [hoveredCard, setHoveredCard] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleCardHover = (hovering: boolean) => {
    setHoveredCard(hovering);
    if (typeof window !== 'undefined' && (window as any).insightsCursorSetHovering) {
      (window as any).insightsCursorSetHovering(hovering);
    }
  };

  const handleCardClick = (post: BlogPost) => {
    // Navigate to article - placeholder for actual navigation
    console.log('Navigate to:', post.title);
  };

  useEffect(() => {
    setMounted(true);

    // Add Swiper drag detection
    const handleDragStart = () => {
      if (typeof window !== 'undefined' && (window as any).insightsCursorSetDragging) {
        (window as any).insightsCursorSetDragging(true);
      }
    };

    const handleDragEnd = () => {
      if (typeof window !== 'undefined' && (window as any).insightsCursorSetDragging) {
        (window as any).insightsCursorSetDragging(false);
      }
    };

    // Add event listeners to both Swiper instances
    const swiper1 = swiperRef.current?.swiper;
    const swiper2 = swiperRef2.current?.swiper;

    if (swiper1) {
      swiper1.on('touchStart', handleDragStart);
      swiper1.on('touchEnd', handleDragEnd);
      swiper1.on('sliderMove', handleDragStart);
      swiper1.on('slideChangeTransitionEnd', handleDragEnd);
    }

    if (swiper2) {
      swiper2.on('touchStart', handleDragStart);
      swiper2.on('touchEnd', handleDragEnd);
      swiper2.on('sliderMove', handleDragStart);
      swiper2.on('slideChangeTransitionEnd', handleDragEnd);
    }

    return () => {
      if (swiper1) {
        swiper1.off('touchStart', handleDragStart);
        swiper1.off('touchEnd', handleDragEnd);
        swiper1.off('sliderMove', handleDragStart);
        swiper1.off('slideChangeTransitionEnd', handleDragEnd);
      }
      if (swiper2) {
        swiper2.off('touchStart', handleDragStart);
        swiper2.off('touchEnd', handleDragEnd);
        swiper2.off('sliderMove', handleDragStart);
        swiper2.off('slideChangeTransitionEnd', handleDragEnd);
      }
    };
  }, [swiperRef, swiperRef2]);

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
    <UnifiedSectionWrapper background="custom" id="insights" customBgColor="bg-[#171717]">
      <InteractiveDots variant="dark" />
      <InsightsCursor />
      <EditorialContentGrid>
        <SectionHeader
          label="Insights"
          heading={
            <EditorialHeading size="large">
              LATEST FROM
              <br />
              SYNERGOS
            </EditorialHeading>
          }
          cta={
            <PremiumCTA title="View All Posts" hoverTitle="View All Posts" />
          }
        />

        {/* Blog Slider - PERFECTLY ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Mousewheel]}
            spaceBetween={40}
            slidesPerView={'auto'}
            centeredSlides={false}
            loop={false}
            allowTouchMove={true}
            grabCursor={true}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: false
            }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true
            }}
            slidesOffsetAfter={0}
            resistance={true}
            resistanceRatio={0.85}
            breakpoints={{
              320: { spaceBetween: 15 },
              480: { spaceBetween: 20 },
              640: { spaceBetween: 30 },
              768: { spaceBetween: 35 },
              1024: { spaceBetween: 40 },
              1280: { spaceBetween: 40 }
            }}
            className="!overflow-visible !cursor-grab active:!cursor-grabbing"
          >
            {blogPosts.map((post, index) => (
              <SwiperSlide key={post.id} className="!w-auto !h-auto">
                <BlogCard post={post} index={index} onHover={handleCardHover} onClick={() => handleCardClick(post)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Second Blog Slider - PERFECTLY ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative mt-20"
        >
          <Swiper
            ref={swiperRef2}
            modules={[Autoplay, Mousewheel]}
            spaceBetween={40}
            slidesPerView={'auto'}
            centeredSlides={false}
            loop={false}
            allowTouchMove={true}
            grabCursor={true}
            watchSlidesProgress={true}
            freeMode={true}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: false
            }}
            autoplay={{
              delay: 9000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true
            }}
            slidesOffsetAfter={20}
            resistance={true}
            resistanceRatio={0.85}
            breakpoints={{
              320: { spaceBetween: 15 },
              480: { spaceBetween: 20 },
              640: { spaceBetween: 30 },
              768: { spaceBetween: 35 },
              1024: { spaceBetween: 40 },
              1280: { spaceBetween: 40 }
            }}
            className="!overflow-visible !cursor-grab active:!cursor-grabbing"
          >
            {additionalBlogPosts.map((post, index) => (
              <SwiperSlide key={post.id} className="!w-auto !h-auto">
                <BlogCard post={post} index={index + 6} onHover={handleCardHover} onClick={() => handleCardClick(post)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
};
