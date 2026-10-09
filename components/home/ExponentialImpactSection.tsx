'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import UnifiedSectionWrapper from '../layout/UnifiedSectionWrapper';
import { EditorialContentGrid, SectionHeader, EditorialHeading, ContentBlock } from '../layout/EditorialContentGrid';
import PremiumCTA from './PremiumCTA';
import CTA from '@/components/shared/CTA';
import InteractiveDots from './InteractiveDots';
import { getMediaUrl } from '@/lib/strapi-media';

function MultilineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function ExponentialImpactSection({
  data,
}: {
  data?: import('@/types/home-sections').ExponentialImpactSectionData;
}) {
  const label = data?.Label ?? 'Why Us';
  const heading = data?.Heading ?? 'EXPONENTIAL\nIMPACT.';
  const description =
    data?.Description ??
    'Building brands takes skill. It is a balance of craft and patience, where expertise shapes outcomes through careful, deliberate decisions. We evaluate every piece through a magnifying lens, ensuring nothing goes missing. When focus is razor sharp and thinking is ten steps ahead, critical velocity is inevitable.';
  const subHeading = data?.SubHeading ?? 'Impact Shaping Voices';
  const subDescription =
    data?.SubDescription ??
    'Each brand is unique. Each trajectory upwards is a singular journey. As a one-stop solutions partner, we fine-tune every single aspect, setting up a blueprint that considers identity, market, barriers, and narrative. No two stories are alike. Everyone deserves their own script.';
  const sectionCta = data?.CTA;
  const bgVectorUrl =
    getMediaUrl(data?.BackgroundVector) ??
    '/images/exponential-impact-vector-1.webp';
  const sideVectorUrl =
    getMediaUrl(data?.SideVector) ?? '/images/exponential-impact-vector-2.svg';
  return (
    <UnifiedSectionWrapper background="custom" id="exponential-impact" customBgColor="bg-[#171717]">
      <InteractiveDots variant="dark" />
      <EditorialContentGrid>
        <SectionHeader
          label={label}
          heading={
            <div className="relative md:w-full">
              <Image
                src={bgVectorUrl}
                alt="Impact vector background"
                width={500}
                height={400}
                className="hidden md:block absolute right-20 top-0 object-contain opacity-35 -z-10 transform scale-150 -translate-x-12 md:w-[300px] md:h-[350px] lg:w-[500px] lg:h-[380px]"
                loading="lazy"
                unoptimized={bgVectorUrl.startsWith('http')}
              />
              <EditorialHeading size="large">
                <MultilineText text={heading} />
              </EditorialHeading>
            </div>
          }
          description={description}
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
              <h2 className="font-clother font-bold text-[24px] lg:text-[44px] leading-[44px] sm:leading-[24px] lg:leading-[52px] tracking-normal text-white uppercase">
                {subHeading}
              </h2>
              
              <p className=" font-clother font-light text-[16px] lg:text-[18px] tracking-normal">
                {subDescription}
              </p>
              {sectionCta ? (
                <CTA data={sectionCta} displayText="CASE STUDIES" hoverText="CASE STUDIES" link="/case-studies" />
              ) : (
                <PremiumCTA title="CASE STUDIES" hoverTitle="CASE STUDIES" href="/case-studies" />
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="relative flex justify-end md:justify-start items-end"
            >
              <div className="relative w-full  max-w-[220px] sm:max-w-[280px] md:max-w-[450px] lg:max-w-[512px] mx-auto">
                <Image
                  src={sideVectorUrl}
                  alt="Particle wave effect"
                  width={512}
                  height={512}
                  className="w-full h-auto 
                   object-contain relative z-10"
                  loading="lazy"
                  unoptimized={sideVectorUrl.startsWith('http')}
                />
              </div>
            </motion.div>
          </div>
        </ContentBlock>
      </EditorialContentGrid>
    </UnifiedSectionWrapper>
  );
}
