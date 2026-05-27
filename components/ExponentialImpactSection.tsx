'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import UnifiedSectionWrapper from './layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading, ContentBlock } from './layout/EditorialContentGrid';
import PremiumCTA from './PremiumCTA';
import InteractiveDots from './InteractiveDots';

export default function ExponentialImpactSection() {
  return (
    <UnifiedSectionWrapper background="custom" id="exponential-impact" customBgColor="bg-[#171717]">
      <InteractiveDots variant="dark" />
      <EditorialContentGrid>
        <SectionHeader
          label="Exponential Impact"
          heading={
            <div className="relative">
              <Image
                src="/images/exponential-impact-vector-1.webp"
                alt="Impact vector background"
                width={500}
                height={400}
                className="hidden md:block absolute right-20 top-0 object-contain opacity-100 -z-10 transform scale-150 -translate-x-12"
                loading="lazy"
              />
              <EditorialHeading size="large">
                EXPONENTIAL
                <br />
                IMPACT.
              </EditorialHeading>
            </div>
          }
          description="Building brands takes skill. It is a balance of craft and patience, where expertise shapes outcomes through careful, deliberate decisions. We evaluate every piece through a magnifying lens, ensuring nothing goes missing. When focus is razor sharp and thinking is ten steps ahead, critical velocity is inevitable."
        />

        <ContentBlock size="full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-clother font-bold text-[24px] lg:text-[44px] leading-[32px] lg:leading-[52px] tracking-normal text-white uppercase">
                Impact Shaping Voices
              </h2>
              
              <p className=" font-clother font-light text-[16px] lg:text-[18px] tracking-normal">
               Each brand is unique. Each trajectory upwards is a singular journey. As a one-stop solutions partner, we fine-tune every single aspect, setting up a blueprint that considers identity, market, barriers, and narrative. No two stories are alike. Everyone deserves their own script.
              </p>
               <PremiumCTA title="CASE STUDIES" hoverTitle="CASE STUDIES" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="relative flex justify-end items-end"
            >
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/exponential-impact-vector-2.webp"
                  alt="Particle wave effect"
                  width={512}
                  height={512}
                  className="w-full h-auto object-contain relative z-10"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </ContentBlock>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
}
