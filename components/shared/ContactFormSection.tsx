'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

import InteractiveDots from '@/components/home/InteractiveDots';
import CTA from '@/components/shared/CTA';
import { getMediaUrl } from '@/lib/strapi-media';
import {
  DEFAULT_CONTACT_FORM_SECTION,
  type ContactFormSectionData,
} from '@/types/contact-sections';

type ContactFormSectionProps = {
  data?: ContactFormSectionData | null;
};

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  as?: 'input' | 'textarea';
  className?: string;
};

type ContactFormContentProps = ContactFormSectionProps & {
  getRecaptchaToken?: () => Promise<string | null>;
};

const RECAPTCHA_ACTION = 'contact_submit';
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

function ContactFormContent({ data, getRecaptchaToken }: ContactFormContentProps) {
  const router = useRouter();
  const content = data ?? DEFAULT_CONTACT_FORM_SECTION;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backgroundUrl =
    getMediaUrl(content.BackgroundImage) ?? '/images/contact/background.png';

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
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
      recaptchaToken,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? 'Failed to submit the form. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const thankYouPath = content.ThankYouPath || '/thank-you';
      router.push(thankYouPath);
    } catch {
      setError('Failed to submit the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <InteractiveDots variant="dark" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 z-0 hidden h-[70%] w-[45%] max-w-[520px] -translate-y-1/2 opacity-30 lg:block"
        style={{
          backgroundImage: `url('${backgroundUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-0 sm:py-20 lg:py-24">
        <div>
          <h2 className="type-h2 font-normal text-white">
            {content.Heading}
          </h2>
          {content.Subtitle && (
            <p className="type-p mt-4 max-w-[560px] text-[#AEAEAE]">
              {content.Subtitle}
            </p>
          )}

          <form className="mt-10 space-y-8 sm:mt-12" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10">
              <FormField id="name" label="Name" required />
              <FormField id="email" label="Email" type="email" required />
              <FormField id="phone" label="Phone number" type="tel" required />
              <FormField id="subject" label="Subject" />
            </div>

            <FormField id="message" label="Messages" as="textarea" />

            <div className="space-y-4">
              {/* {SITE_KEY && (
                <p className="text-xs font-light text-white/45">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    className="underline hover:text-white/70"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://policies.google.com/terms"
                    className="underline hover:text-white/70"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>{' '}
                  apply.
                </p>
              )} */}

              {error && (
                <p className="text-sm font-light text-[#FF0000]" role="alert">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <CTA
                  data={content.SubmitCTA}
                  displayText={isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  hoverText={isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactFormWithRecaptcha({ data }: ContactFormSectionProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) {
      return null;
    }
    return executeRecaptcha(RECAPTCHA_ACTION);
  };

  return <ContactFormContent data={data} getRecaptchaToken={getRecaptchaToken} />;
}

export default function ContactFormSection({ data }: ContactFormSectionProps) {
  if (!SITE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <>
          <p className="px-6 pt-6 text-xs text-amber-400/90">
            reCAPTCHA site key missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local
          </p>
          <ContactFormContent data={data} />
        </>
      );
    }
    return <ContactFormContent data={data} />;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <ContactFormWithRecaptcha data={data} />
    </GoogleReCaptchaProvider>
  );
}
