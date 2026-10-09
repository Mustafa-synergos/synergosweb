'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

import InteractiveDots from '@/components/home/InteractiveDots';
import CTA from '@/components/shared/CTA';
import type { ServiceDetailContent } from '@/data/services';

type ServiceEnquiryFormProps = {
  data?: ServiceDetailContent['enquiry'] | null;
  /** Current service title — pre-fills the Subject field. */
  serviceTitle?: string;
};

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  as?: 'input' | 'textarea';
  defaultValue?: string;
  className?: string;
};

type EnquiryFormContentProps = ServiceEnquiryFormProps & {
  getRecaptchaToken?: () => Promise<string | null>;
};

const RECAPTCHA_ACTION = 'contact_submit';
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const FALLBACK_HEADING = "LET'S TALK";
const FALLBACK_SUBTITLE =
  "And find out if there's a better path ahead for your brand.";
const FALLBACK_BACKGROUND = '/images/contact/background.png';

function FormField({
  id,
  label,
  required = false,
  type = 'text',
  as = 'input',
  defaultValue,
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
        <textarea
          id={id}
          name={id}
          rows={4}
          required={required}
          defaultValue={defaultValue}
          className={fieldClassName}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          defaultValue={defaultValue}
          className={fieldClassName}
        />
      )}
    </div>
  );
}

function EnquiryFormContent({
  data,
  serviceTitle,
  getRecaptchaToken,
}: EnquiryFormContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heading = data?.Heading || FALLBACK_HEADING;
  const subtitle = data?.Subtitle ?? FALLBACK_SUBTITLE;
  const backgroundUrl = data?.BackgroundImageUrl || FALLBACK_BACKGROUND;
  const thankYouPath = data?.ThankYouPath || '/thank-you';

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

      router.push(thankYouPath);
    } catch {
      setError('Failed to submit the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="relative scroll-mt-24 overflow-hidden bg-[#050505] text-white md:px-4">
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
          <h2 className="type-h2 font-normal text-white">{heading}</h2>
          {subtitle && (
            <p className="type-p mt-4 max-w-[560px] text-[#AEAEAE]">{subtitle}</p>
          )}

          <form className="mt-10 space-y-8 sm:mt-12" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10">
              <FormField id="name" label="Name" required />
              <FormField id="email" label="Email" type="email" required />
              <FormField id="phone" label="Phone number" type="tel" required />
              <FormField id="subject" label="Subject" defaultValue={serviceTitle ?? ''} />
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
                  data={
                    data?.SubmitCTA
                      ? {
                        DisplayText:
                          data.SubmitCTA.DisplayText ??
                          (isSubmitting ? 'SUBMITTING...' : 'SUBMIT'),
                        HoverText:
                          data.SubmitCTA.HoverText ??
                          data.SubmitCTA.DisplayText ??
                          (isSubmitting ? 'SUBMITTING...' : 'SUBMIT'),
                        Link: data.SubmitCTA.Link ?? null,
                        IsOpenNewTab: data.SubmitCTA.IsOpenNewTab ?? undefined,
                        Magnetic: data.SubmitCTA.Magnetic ?? undefined,
                      }
                      : null
                  }
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

function EnquiryFormWithRecaptcha({ data, serviceTitle }: ServiceEnquiryFormProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) {
      return null;
    }
    return executeRecaptcha(RECAPTCHA_ACTION);
  };

  return (
    <EnquiryFormContent
      data={data}
      serviceTitle={serviceTitle}
      getRecaptchaToken={getRecaptchaToken}
    />
  );
}

export default function ServiceEnquiryForm({
  data,
  serviceTitle,
}: ServiceEnquiryFormProps) {
  if (!SITE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <>
          <p className="px-6 pt-6 text-xs text-amber-400/90">
            reCAPTCHA site key missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local
          </p>
          <EnquiryFormContent data={data} serviceTitle={serviceTitle} />
        </>
      );
    }
    return <EnquiryFormContent data={data} serviceTitle={serviceTitle} />;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <EnquiryFormWithRecaptcha data={data} serviceTitle={serviceTitle} />
    </GoogleReCaptchaProvider>
  );
}
