'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PremiumCTA from './PremiumCTA';

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Detect device type for responsive media
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setCurrentDevice('mobile');
      else if (width < 1024) setCurrentDevice('tablet');
      else setCurrentDevice('desktop');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Media sources based on device
  const mediaSources = {
    desktop: {
      video: '/videos/2547170_Travel_Futuristic_1920x1080.mp4',
      poster: '/images/hero-desktop.jpg',
      fallback: '/images/hero-desktop.jpg'
    },
    tablet: {
      video: '/videos/2547170_Travel_Futuristic_1920x1080.mp4',
      poster: '/images/hero-tablet.jpg',
      fallback: '/images/hero-tablet.jpg'
    },
    mobile: {
      video: '/videos/2547170_Travel_Futuristic_1920x1080.mp4',
      poster: '/images/hero-mobile.jpg',
      fallback: '/images/hero-mobile.jpg'
    }
  };

  const currentMedia = mediaSources[currentDevice];

  return (
    <section className="relative max-h-[88vh] md:h-[70vh] lg:max-h-screen overflow-hidden">
      {/* Background Media Layer */}
      <div className="absolute inset-0">
        {/* Video Background for All Devices */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={currentMedia.poster}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setIsVideoLoaded(false)}
          >
            <source src={currentMedia.video} type="video/mp4" />
          </video>
          
          {/* Video Fallback Image */}
          {/* <motion.img
            src={currentMedia.fallback}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoLoaded ? 0 : 1 }}
            transition={{ duration: 1 }}
          /> */}
        </div>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
              </div>

      {/* Hero Content - Split Layout */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex items-center max-h-[88vh]  lg:max-h-[88vh] lg:min-h-screen px-6 sm:px-8 lg:px-8 pt-20 sm:pt-24 lg:pt-20"
      >
        <div className="max-w-7xl hero-content mx-auto w-full px-4 sm:px-0
        
        ">
          {/* <div className="grid grid-cols-1 lg:flex lg:flex-row lg:justify-center lg:items-start gap-2 sm:gap-12 lg:gap-0"> */}
          <div className="grid grid-cols-1 md:flex md:flex-row lg:flex lg:flex-row lg:justify-center lg:items-start gap-2 sm:gap-12 lg:gap-0">
            {/* Left Column - "CAN A BRAND" */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-left flex items-center order-1 lg:order-1 mb-2 sm:mb-4 lg:mb-0"
            >
              <div className="lg:translate-y-[30px] lg:translate-x-[-20px] md:translate-y-[-140px] md:translate-x-[20px]">
                <h2 className="responsive-h2 text-white italic font-black leading-[0.85] tracking-tighter 
">
                  CAN A
                  <br />
                  BRAND
                </h2>
              </div>
            </motion.div>

            {/* Right Column - "GO BEYOND" and split paragraphs */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-left order-2 md:order-2 lg:order-2 w-full lg:w-[65%]"
            >
              <h1 className="responsive-h1 text-white mb-4 sm:mb-6 lg:mb-6
              
              ">
                GO
                <br />
                BEYOND.
              </h1>
              
              {/* Split paragraphs in 50-50 columns with button */}
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-3 sm:gap-6 md:gap-2 lg:gap-8">
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="responsive-paragraph text-white/80 mb-0 lg:mb-3 sm:mb-4 lg:mb-0 max-w-full"
                >
                  The sky isn't limit. For us, it is <br/>just first checkpoint.
                </motion.p>

                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-4">
                 <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="responsive-paragraph text-white/80 !leading-[1.5]  !mb-1 max-w-full md:pr-20"
                  >
                    Synergos is a brand acceleration system built for brands that refuse to stay in one place. Strategy, storytelling, and delivery, firing together, for your next orbit.
                  </motion.p>
                  
                  {/* START PROJECT Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <PremiumCTA href="/projects" className="text-xs sm:text-sm lg:text-base" title="START PROJECT" hoverTitle="START PROJECT" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Banner Vector Left */}
      <div className="hidden sm:block absolute bottom-0 w-64 h-96 md:w-45 md:h-65 md:w-[200px] max-w-[500px] xl:w-[450px] opacity-100 z-50" style={{ left: '-4rem' }}>
        <Image
          src="/images/banner-vector-left.webp"
          alt="Banner vector decoration"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Banner Vector Right */}
      <div className="hidden sm:block absolute right-0 w-[600px] h-[600px] md:w-[400px] md:h-[500px] max-w-[700px] xl:w-[700px] xl:h-[700px] opacity-100 " style={{ top: '-120px' }}>
        <Image
          src="/images/banner-vector-right.webp"
          alt="Banner vector decoration"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    </section>
  );
}
