'use client';

import { FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

import PremiumCTA from '@/components/home/PremiumCTA';
import InteractiveDots from '@/components/home/InteractiveDots';
import { DEFAULT_ABOUT_CONNECT } from '@/lib/about-defaults';
import { getTitleLines } from '@/lib/heading';
import { getMediaUrl } from '@/lib/strapi-media';
import type { AboutConnectCtaSectionData } from '@/types/about-sections';
import DecorativeVectorImage from '@/components/shared/DecorativeVectorImage';
const decorativeUrl = '/images/foter-vector.svg';
type AboutConnectCTAProps = {
  data?: AboutConnectCtaSectionData | null;
};

const RECAPTCHA_ACTION = 'connect_cta_submit';
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type ConnectCtaFormProps = {
  content: AboutConnectCtaSectionData;
  getRecaptchaToken?: () => Promise<string | null>;
};

function ConnectCtaForm({ content, getRecaptchaToken }: ConnectCtaFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonLabel = content.PrimaryCTA?.DisplayText ?? "LET'S LIFT OFF";
  const emailPlaceholder =
    content.EmailPlaceholder?.replace(/^@/, '') ?? 'your email id here';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    setError(null);

    let recaptchaToken = 'development-bypass';

    if (SITE_KEY && getRecaptchaToken) {
      try {
        const token = await getRecaptchaToken();
        if (!token) {
          setError('reCAPTCHA verification failed. Please try again.');
          return;
        }
        recaptchaToken = token;
      } catch {
        setError('reCAPTCHA verification failed. Please try again.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/connect-cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          source: `${window.location.origin}${window.location.pathname}${window.location.search}`,
          recaptchaToken,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? 'Failed to submit. Please try again.');
        setIsSubmitting(false);
        return;
      }

      router.push('/thank-you');
    } catch {
      setError('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="about-connect-cta-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-6  pt-6 lg:pt-8"
    >
      <div className="relative flex w-full flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-0 lg:border-b lg:border-white/30 lg:pb-4 lg:focus-within:border-white/60 lg:transition-colors lg:duration-300">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={emailPlaceholder}
          required
          disabled={isSubmitting}
          className="min-w-0 flex-1 border-b border-white/30 bg-transparent pb-4 text-[16px] text-white transition-colors duration-300 placeholder:text-white/45 focus:border-white/60 focus:outline-none disabled:opacity-60 lg:border-none lg:text-[18px]"
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={isSubmitting ? undefined : { scale: 1.05 }}
          whileTap={isSubmitting ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          onTouchCancel={() => setIsHovered(false)}
          className="hidden shrink-0 items-center gap-1 uppercase text-white disabled:cursor-not-allowed disabled:opacity-60 lg:ml-2 lg:flex lg:gap-2 lg:text-[18px] lg:font-[300]"
        >
          <motion.span
            initial="rest"
            animate={isHovered ? 'hover' : 'rest'}
            className="relative flex overflow-hidden"
          >
            {buttonLabel.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="relative inline-block overflow-hidden"
                style={{ marginRight: char === ' ' ? '6px' : '1px' }}
              >
                <motion.span
                  className="block text-white"
                  initial={{ y: 0 }}
                  variants={{
                    hover: {
                      y: '-120%',
                      transition: {
                        delay: index * 0.03,
                        duration: 0.35,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    },
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>

                <motion.span
                  className="absolute left-0 top-full block text-white"
                  initial={{ y: 0 }}
                  variants={{
                    hover: {
                      y: '-100%',
                      transition: {
                        delay: index * 0.03,
                        duration: 0.4,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    },
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              </span>
            ))}
          </motion.span>
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white"
          >
            <svg
              className="h-4 w-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.div>
        </motion.button>

        <div className="flex justify-end pt-2 lg:hidden">
          <PremiumCTA
            title={buttonLabel}
            hoverTitle={buttonLabel}
            className="text-[16px]"
          />
        </div>
      </div>

      {error ? (
        <p className="font-clother text-[14px] text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function ConnectCtaFormWithRecaptcha({ content }: { content: AboutConnectCtaSectionData }) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) return null;
    return executeRecaptcha(RECAPTCHA_ACTION);
  };

  return <ConnectCtaForm content={content} getRecaptchaToken={getRecaptchaToken} />;
}

export default function AboutConnectCTA({ data }: AboutConnectCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content = data ?? DEFAULT_ABOUT_CONNECT;
  const headingLines = getTitleLines(content.Heading, 'multiline');
  const vectorUrl =
    getMediaUrl(content.Vector) ?? content.VectorPath ?? DEFAULT_ABOUT_CONNECT.VectorPath!;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#171717] px-6 py-16 sm:px-8 lg:py-28"
    >
      <InteractiveDots variant="dark" containerRef={sectionRef} />
       <DecorativeVectorImage
                  src={decorativeUrl}
                  className="hidden lg:block absolute -right-8 top-0 h-[min(42vw,420px)] w-[min(42vw,420px)]"
                  delay={0.3}
                />

    

      <div className="relative z-10 mx-auto max-w-[1280px] items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6 lg:space-y-8"
        >
          <span className="responsive-red-span">{content.Eyebrow}</span>
          <h2 className="responsive-large-h2 text-white">
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="font-clother text-[16px] font-light leading-relaxed text-white/80 lg:text-[18px]">
            {content.Description}
          </p>

          {SITE_KEY ? (
              <GoogleReCaptchaProvider
                reCaptchaKey={SITE_KEY}
                scriptProps={{ async: true, defer: true }}
              >
                <ConnectCtaFormWithRecaptcha content={content} />
              </GoogleReCaptchaProvider>
            ) : (
              <ConnectCtaForm content={content} />
            )}
        </motion.div>
      </div>
    </section>
  );
}
