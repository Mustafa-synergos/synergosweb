'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fragment, useEffect, useId, useRef, useState } from 'react';

import DotsSection from '@/components/shared/DotsSection';
import InteractiveDots from '@/components/home/InteractiveDots';

import PageHeroSection from '@/components/shared/PageHeroSection';
import CTA from '@/components/shared/CTA';
import ServiceEnquiryForm from '@/components/services/ServiceEnquiryForm';
import type { PageHeroSectionData } from '@/types/page-hero';
import type { ServiceDetailContent } from '@/data/services';
import type {
  ResolvedServiceSection,
  ServiceBandKey,
} from '@/lib/map-service';

type ServiceDetailProps = {
  title: string;
  detail: ServiceDetailContent;
  /** Ordered DZ sections from `resolveServiceSections` — the ONLY membership/order source. */
  sections: ResolvedServiceSection[];
};

const base = '/images/Service-Detail Page/Social Media Management';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};


function SectionShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-[#080808] bg-[url('/images/Service-Detail Page/Social Media Management/background.svg')] bg-repeat text-white ${className}`}
    >
      <InteractiveDots variant="dark" containerRef={sectionRef} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function splitTitleIntoTwoLines(title: string) {
  const words = title.split(' ');
  if (words.length <= 1) return title;
  const mid = Math.ceil(words.length / 2);
  return `${words.slice(0, mid).join(' ')}\n${words.slice(mid).join(' ')}`;
}

function ServiceHero({
  title,
  detail,
}: {
  title: string;
  detail: ServiceDetailContent;
}) {
  const heroData: PageHeroSectionData = {
    __component: 'pages.page-hero-section',
    Heading: splitTitleIntoTwoLines(title),
    HeadingLayout: 'multiline',
    HeadingClassName: "font-['clother',sans-serif] font-bold uppercase tracking-normal text-[36px] leading-[42px] lg:text-[60px] lg:leading-[70px] break-words",
    HeroVectorPath: detail.heroImage,
    BannerTopPath: '/images/page-hero/banner-vector-right.png',
    BannerBottomPath: '/images/page-hero/banner-vector-left.png',
    ShowScrollIndicator: true,
  };

  return <PageHeroSection data={heroData} />;
}

export default function ServiceDetail({ title, detail, sections }: ServiceDetailProps) {
  const [openCapability, setOpenCapability] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const faqBaseId = useId();
  const activeImage = detail.capabilities.items[openCapability]?.image ?? detail.capabilities.image;
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    const active = itemRefs.current[openCapability];
    if (!listRef.current || !active) return;

    const update = () => setBarHeight(active.offsetTop + active.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(active);

    return () => ro.disconnect();
  }, [openCapability]);

  // Band templates keyed by canonical band (see SERVICE_BAND_BY_COMPONENT).
  // The DZ array order drives rendering via `sections` below; these templates
  // only define HOW each band type looks, never WHETHER or WHEN it renders.
  const bands: Record<ServiceBandKey, React.ReactNode> = {
    hero: <ServiceHero title={title} detail={detail} />,

    intro: (
      <SectionShell className="py-12 sm:py-14 lg:py-[54px]">
        <Image src={`${base}/background.svg`} alt="" width={550} height={330} className="pointer-events-none absolute right-0 top-0 hidden opacity-65 lg:block" />
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-0">
          <Reveal>
            <h2 className="max-w-[1280px] font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white lg:text-[60px] lg:leading-[76px]">
              {detail.intro.heading}
            </h2>
            <strong className="mt-4 max-w-[760px] text-[20px] font-bold leading-[32px] tracking-normal text-white">
              {detail.intro.lead}
            </strong>
            <p className="mt-4 max-w-[760px] text-[16px] font-normal leading-[26px] text-[#AEAEAE] lg:text-[18px]">
              {detail.intro.body}
            </p>
          </Reveal>
          <div className="mt-10 grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <Reveal className="mx-auto w-full max-w-[540px] lg:mx-0">
              <Image src={detail.intro.image} alt="" width={540} height={340} className="h-auto w-full object-contain" />
            </Reveal>
            <Reveal>
              <p className="max-w-[520px] whitespace-pre-line text-[16px] font-normal leading-[26px] text-[#AEAEAE] lg:text-[18px]">
                {detail.intro.para}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {(detail.intro.ctas ?? []).map((cta, index) => (
                  <CTA
                    key={`${cta.displayText}-${index}`}
                    displayText={cta.displayText}
                    hoverText={cta.hoverText}
                    link={cta.link}
                    targetSlug={cta.targetSlug ?? null}
                    className="text-[11px] sm:text-[12px]"
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </SectionShell>
    ),

    approach: (
      <SectionShell className="py-12 sm:py-14 lg:py-[64px] bg-[#171717] opacity-90 bg-[url('/images/Service-Detail Page/Social Media Management/background.svg')] bg-repeat text-white">
        <Image src={`${base}/THE APPROACH-vector.svg`} alt="" width={250} height={150} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 bottom-20 opacity-65  hidden  lg:block" />
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 sm:px-8 lg:px-0">
          <Reveal>
            <span className="font-normal uppercase tracking-normal text-[#ff0a0a] text-[16px] leading-[24px] lg:text-[28px] lg:leading-[100%]">{detail.approach.eyebrow}</span>
            <h2 className="mt-3 max-w-[1280px] font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white lg:text-[60px] lg:leading-[76px]">
              {detail.approach.heading}
            </h2>
            <p className="mt-4 text-[16px] font-normal leading-[26px] text-[#AEAEAE] lg:text-[18px]">{detail.approach.lead}</p>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="max-w-[520px] text-[16px] font-normal leading-[26px] text-[#AEAEAE] lg:text-[18px]">{detail.approach.body}</p>
            </Reveal>
            <Reveal className="mx-auto w-full max-w-[540px] lg:self-end">
              <Image src={detail.approach.image} alt="" width={540} height={340} className="h-auto w-full object-contain" />
            </Reveal>
          </div>
        </div>
      </SectionShell>
    ),

    capabilities: (
      <SectionShell className="py-12 sm:py-14 lg:py-[66px]">
        <Image src={`${base}/six-vector.svg`} alt="" width={470} height={360} className="pointer-events-none absolute right-0 top-0 hidden opacity-35 lg:block" />
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-0">
          <Reveal>
            <span className="font-normal uppercase tracking-normal text-[#ff0a0a] text-[16px] leading-[24px] lg:text-[28px] lg:leading-[100%]">{detail.capabilities.eyebrow}</span>
            <h2 className="mt-4 max-w-[580px] font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white lg:text-[60px] lg:leading-[76px]">
              {detail.capabilities.heading}
            </h2>
            <div ref={listRef} className="relative mt-9 pl-14">
              <div className="absolute left-0 top-0 h-full w-[2px] bg-white/10" aria-hidden="true" />
              <div
                className="absolute left-0 top-0 w-[2px] bg-[#ff0a0a]"
                style={{ height: barHeight }}
                aria-hidden="true"
              />
              {detail.capabilities.items.map((item, index) => {
                const isOpen = index === openCapability;
                return (
                  <button
                    key={`${item.title}-${index}`}
                    type="button"
                    ref={(el) => { itemRefs.current[index] = el; }}
                    onClick={() => setOpenCapability(index)}
                    className={`block w-full border-b border-white/10 text-left transition-all duration-300 ${index === 0 ? 'pt-0 pb-10' : 'py-10'
                      } ${isOpen ? 'opacity-100' : 'opacity-35 hover:opacity-70'
                      }`}
                  >
                    <span className="block text-[15px] font-bold uppercase leading-tight text-white sm:text-[17px]">{item.title}</span>
                    <motion.span
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="block overflow-hidden"
                    >
                      <span className="mt-4 block max-w-[450px] text-[16px] font-normal leading-[26px] text-[#AEAEAE] lg:text-[18px]">{item.body}</span>
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </Reveal>
          <Reveal className="mx-auto w-full max-w-[540px]">
            <Image key={openCapability} src={activeImage} alt="" width={540} height={340} className="h-auto w-full object-contain" />
          </Reveal>
        </div>
      </SectionShell>
    ),

    // Case Studies band: rendered if and only if the entry's Dynamic Zone
    // contains it (membership comes from `sections` below). No flag forces it
    // on or off — delete it in Strapi and it disappears here.
    cases: (
      <section className="relative overflow-hidden bg-[#ff0b07] py-12 text-white sm:py-14 lg:py-[58px]">
        <div className="pointer-events-none absolute left-[-80px] top-1/2 z-0 hidden h-[500px] w-[450px] -translate-y-1/2 lg:block">
          <Image src={`${base}/case-studies.svg`} alt="" fill className="object-contain object-left" sizes="450px" />
        </div>
        <Reveal className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-0">
          <span className="text-[12px] font-bold uppercase tracking-wider text-white">{detail.caseStudies.label}</span>
          <h2 className="mt-3 max-w-[760px] font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white lg:text-[60px] lg:leading-[76px]">
            {detail.caseStudies.title}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {detail.caseStudies.cards.map((card, index) => {
              const body = (
                <>
                  <div>
                    <span className="inline-flex items-center rounded-full border border-[#ff0a0a] px-3 py-1 text-[10px] font-medium text-[#ff0a0a]">{card.category}</span>
                    <h3 className="mt-5 text-[16px] font-bold normal-case leading-[1.25] text-white sm:text-[17px]">{card.title}</h3>
                    <p className="mt-4 text-[16px] font-normal leading-[26px] text-[#AEAEAE] lg:text-[18px]">{card.description}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between text-[12px] font-semibold text-white/80">
                    <span>{card.date}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white transition duration-300 group-hover:scale-110">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5H8.5M8.5 5L5 1.5M8.5 5L5 8.5" stroke="#0c0c0c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </>
              );
              const className =
                'group flex h-full flex-col justify-between rounded-[12px] bg-[#0c0c0c] p-6 text-white transition duration-300 hover:-translate-y-1 sm:p-7';
              // Cards navigate only when Strapi provides a link; otherwise the
              // card renders as static content (no dead/placeholder hrefs).
              return card.link ? (
                <Link key={`${card.title}-${index}`} href={card.link} className={className} aria-label={card.title}>
                  {body}
                </Link>
              ) : (
                <article key={`${card.title}-${index}`} className={className}>
                  {body}
                </article>
              );
            })}
          </div>
        </Reveal>
      </section>
    ),

    expertise: (
      <SectionShell className="py-12 sm:py-14 lg:py-[66px]">
        <Image src={`${base}/six-vector.svg`} alt="" width={420} height={320} className="pointer-events-none absolute right-0 top-0 hidden opacity-30 lg:block" />
        <Reveal className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-0">
          <span className="text-[16px] font-bold uppercase text-white/65 sm:text-[16px] lg:text-[18px] ">{detail.expertise.eyebrow}</span>
          <h2 className="mt-3 font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white lg:text-[60px] lg:leading-[76px]">{detail.expertise.heading}</h2>
          <div className="mt-9 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {detail.expertise.items.map((item, index) => {
              const body = (
                <>
                  <span className="relative h-[5rem] w-[5rem] shrink-0 overflow-hidden rounded-[8px] border border-white/15 bg-white/[0.03]">
                    <Image src={item.icon} alt="" fill className="object-contain p-2.5" sizes="56px" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[22px] font-normal leading-[30px] tracking-normal text-white">{item.title}</span>
                    {item.description ? (
                      <span className="mt-2 block text-[15px] font-normal leading-[24px] text-[#AEAEAE]">{item.description}</span>
                    ) : null}
                    {item.link ? (
                      <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold uppercase tracking-wide text-[#ff0a0a] transition group-hover:opacity-80">
                        Learn More
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-px">
                          <path d="M1 5H8.5M8.5 5L5 1.5M8.5 5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                </>
              );
              return item.link ? (
                <a key={`${item.title}-${index}`} href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group grid grid-cols-[56px_1fr] items-center gap-14">
                  {body}
                </a>
              ) : (
                <div key={`${item.title}-${index}`} className="grid grid-cols-[56px_1fr] items-center gap-14">
                  {body}
                </div>
              );
            })}
          </div>
        </Reveal>
      </SectionShell>
    ),

    faq: (
      <DotsSection className="bg-[#181818] py-12 text-white sm:py-14 lg:py-[66px]">
        <Image src={`${base}/THE APPROACH-vector.svg`} alt="" width={280} height={300} className="pointer-events-none absolute left-0 bottom-0 z-10 hidden opacity-65 lg:block" />
        <Reveal className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-0">
          <span className="text-[16px] font-normal leading-[100%] tracking-normal text-white lg:text-[28px] lg:leading-[100%]">{detail.faqEyebrow}</span>
          <h2 className="mt-3 font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white lg:text-[60px] lg:leading-[76px]">{detail.faqHeading}</h2>
          <div className="mt-7">
            {detail.faqs.map((faq, index) => {
              const isOpen = index === openFaq;
              const panelId = `${faqBaseId}-faq-${index}`;
              return (
                <div key={`${faq.question}-${index}`} className="mb-3 bg-[#292929]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex min-h-[54px] w-full items-center justify-between gap-4 px-5 text-left text-[16px] font-normal leading-[24px] tracking-normal text-white transition hover:bg-white/[0.03] focus:outline-none focus:ring-2 focus:ring-white/40 sm:px-7 lg:text-[20px] lg:leading-[36px]"
                  >
                    <span>{faq.question}</span>
                    <span className="relative h-4 w-4 shrink-0">
                      <Image src={isOpen ? `${base}/close.svg` : `${base}/add.svg`} alt="" fill className="object-contain" sizes="16px" />
                    </span>
                  </button>
                  <motion.div
                    id={panelId}
                    role="region"
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-white/10 px-5 pb-5 pt-4 text-[18px] font-normal leading-[28px] text-[#AEAEAE] sm:px-7">{faq.answer}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </DotsSection>
    ),

    // Enquiry band (`services.enquiry-form` DZ component): the exact contact
    // form section. Rendered if and only if the entry's Dynamic Zone
    // contains it — position follows DZ order. Subject pre-fills with the
    // current service title so submissions carry service context.
    enquiry: <ServiceEnquiryForm data={detail.enquiry} serviceTitle={title} />,
  };

  // Render EXACTLY the resolved DZ sections, in DZ order. No synthesis,
  // no sorting, no fallback membership: absent from the DZ = not rendered.
  return (
    <>
      {sections.map((section) => (
        <Fragment key={section.key}>{bands[section.band]}</Fragment>
      ))}
    </>
  );
}
