'use client';

import { FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

import InteractiveDots from '@/components/home/InteractiveDots';
import CTA from '@/components/shared/CTA';
import {
  DEFAULT_CAREER_APPLY_SECTION,
  type CareerApplySectionData,
} from '@/types/career-sections';

type CareerApplySectionProps = {
  data?: CareerApplySectionData | null;
  careerTitle: string;
  careerSlug: string;
};

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  as?: 'input' | 'textarea';
  className?: string;
};

type CareerApplyContentProps = CareerApplySectionProps & {
  getRecaptchaToken?: () => Promise<string | null>;
};

const RECAPTCHA_ACTION = 'career_apply_submit';
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function FormField({
  id,
  label,
  required = false,
  type = 'text',
  as = 'input',
  className = '',
}: FormFieldProps) {
  const fieldClassName =
    'contact-form-field w-full border-0 border-b border-white/25 bg-transparent py-3 text-[15px] font-light text-white placeholder:text-white/35 focus:border-white focus:outline-none';

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-light text-white/80">
        {label}
        {required && <span className="text-[#FF0000]">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea id={id} name={id} rows={4} required={required} className={fieldClassName} />
      ) : (
        <input id={id} name={id} type={type} required={required} className={fieldClassName} />
      )}
    </div>
  );
}

function CvField({ className = '' }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  return (
    <div className={className}>
      <span className="mb-2 block text-[13px] font-light text-white/80">Attach CV</span>
      <div className="flex items-center gap-3 border-b border-white/25 py-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-[15px] font-light text-white/70 transition-colors hover:text-white"
        >
          <span className="relative inline-block h-4 w-4 shrink-0">
            <Image src="/images/career/apply-now-.svg" alt="" fill className="object-contain" />
          </span>
          <span className="truncate">{fileName || 'Choose a file'}</span>
        </button>
        <input
          ref={inputRef}
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file?.name ?? '');
          }}
        />
      </div>
    </div>
  );
}

function CareerApplyContent({
  data,
  careerTitle,
  careerSlug,
  getRecaptchaToken,
}: CareerApplyContentProps) {
  const router = useRouter();
  const content = data ?? DEFAULT_CAREER_APPLY_SECTION;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
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

    const formData = new FormData(form);
    const cvFile = formData.get('cv');
    const cvFileName =
      cvFile instanceof File && cvFile.name ? cvFile.name : '';

    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      message: String(formData.get('message') ?? ''),
      careerTitle,
      careerSlug,
      cvFileName,
      recaptchaToken,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/career-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? 'Failed to submit your application. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const thankYouPath = content.ThankYouPath || '/thank-you';
      router.push(thankYouPath);
    } catch {
      setError('Failed to submit your application. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <InteractiveDots variant="dark" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 z-0 hidden h-[70%] w-[45%] max-w-[520px] -translate-y-1/2 opacity-20 lg:block"
        style={{
          backgroundImage: "url('/images/career/background-dots.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-8 sm:py-20 lg:px-0 lg:py-24">
        <h2 className="type-h2 font-normal text-white">{content.Heading}</h2>
        {content.Subtitle && (
          <p className="type-p mt-4 max-w-[560px] text-[#AEAEAE]">{content.Subtitle}</p>
        )}

        <form className="mt-10 space-y-8 sm:mt-12" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10">
            <FormField id="name" label="Name" required />
            <FormField id="email" label="Email" type="email" required />
            <FormField id="phone" label="Phone number" type="tel" required />
            <CvField />
          </div>

          <FormField id="message" label="Message" as="textarea" />

          <div className="space-y-4">
            {error && (
              <p className="text-sm font-light text-[#FF0000]" role="alert">
                {error}
              </p>
            )}

            <div className="pt-2">
              <CTA
                displayText={isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                hoverText={isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function CareerApplyWithRecaptcha(props: CareerApplySectionProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) {
      return null;
    }
    return executeRecaptcha(RECAPTCHA_ACTION);
  };

  return <CareerApplyContent {...props} getRecaptchaToken={getRecaptchaToken} />;
}

export default function CareerApplySection(props: CareerApplySectionProps) {
  if (!SITE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <>
          <p className="px-6 pt-6 text-xs text-amber-400/90">
            reCAPTCHA site key missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local
          </p>
          <CareerApplyContent {...props} />
        </>
      );
    }
    return <CareerApplyContent {...props} />;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <CareerApplyWithRecaptcha {...props} />
    </GoogleReCaptchaProvider>
  );
}
