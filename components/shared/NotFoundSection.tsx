import Image from 'next/image';

import InteractiveDots from '../home/InteractiveDots';
import CTA from '@/components/shared/CTA';

const NOT_FOUND_MESSAGE =
  "Looks like you've drifted off course and have fallen off your flight path. Not to worry; you can get back to your trajectory. How about navigating to a different page? Or trying another search term? Or start afresh and head back to base by clicking below.";

export default function NotFoundSection() {
  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <InteractiveDots variant="dark" />

      {/* Background curves */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1920 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-80 280C120 420 340 390 460 470C590 560 540 760 390 780H-80"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <path
          d="M1280 -60C1200 110 1250 240 1420 290C1600 345 1840 350 1980 540"
          fill="none"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="1"
        />
      </svg>

      {/* Soft corner ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-white/[0.025] blur-3xl sm:h-80 sm:w-80"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-[920px] flex-col items-center justify-center px-6 pb-20 pt-28 text-center sm:px-8 sm:pt-32 lg:min-h-[78vh] lg:pb-28 lg:pt-36">
        <div className="relative mb-8 w-full max-w-[760px] sm:mb-10 lg:mb-12">
          <Image
            src="/images/404/404-vector.svg"
            alt=""
            width={813}
            height={345}
            priority
            className="mx-auto h-auto w-full max-w-[min(92vw,760px)]"
          />
        </div>

        <h1 className="type-h2 font-bold text-white">
          Page Not Found
        </h1>

        <p className="type-p mt-6 max-w-[720px] text-white/75 sm:mt-8">
          {NOT_FOUND_MESSAGE}
        </p>

        <div className="mt-8 sm:mt-10">
          <CTA
            link="/"
            displayText="BACK TO HOME"
            hoverText="BACK TO HOME"
            className="text-xs sm:text-sm"
          />
        </div>
      </div>
    </section>
  );
}
