import { getTitleLines, type HeadingLayout } from '@/lib/heading';

type PageBannerProps = {
  title: string;
  headingLayout?: HeadingLayout;
  vectorImage?: string;
  vectorAlt?: string;
  children?: React.ReactNode;
};

export default function PageBanner({
  title,
  headingLayout = 'multiline',
  vectorImage,
  vectorAlt = '',
  children
}: PageBannerProps) {
  const titleLines = getTitleLines(title, headingLayout);
  const isMultiline = titleLines.length > 1;

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[#171717]">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1920 676"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-64 260C102 384 315 359 424 430C545 509 498 674 368 676H-64"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
        />
        <path
          d="M1260 -42C1187 96 1234 210 1393 257C1566 307 1795 314 1918 489"
          fill="none"
          stroke="rgba(255,255,255,0.13)"
          strokeWidth="1"
        />
        {/* <path
          d="M0 654H374C441 654 477 604 477 535"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        /> */}
      </svg>

      <div className="relative z-10 mx-auto grid min-h-[635px] w-full max-w-[1280px] grid-cols-1 items-center pt-16 md:grid-cols-[0.95fr_1.05fr] md:px-14 lg:px-0">
        <div className="self-center md:pb-40">
          <h1
            className={`type-h1 font-black text-white ${
              isMultiline ? '' : 'whitespace-nowrap'
            }`}
          >
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`} className={isMultiline ? 'block' : undefined}>
                {line}
              </span>
            ))}
          </h1>
          {children && <div className="mt-8">{children}</div>}
        </div>

        <div className="relative hidden min-h-[390px] items-end justify-center md:flex">
          <div className="relative z-10 h-[460px] w-[520px] opacity-50">
            <div className="absolute bottom-0 left-0 h-px w-full bg-white/35" />
            <div className="absolute bottom-0 left-[8%] h-[210px] w-[95px] rounded-t-full border border-white/35" />
            <div className="absolute bottom-0 left-[25%] h-[250px] w-[110px] rounded-t-full border border-white/35" />
            <div className="absolute bottom-0 left-[45%] h-[225px] w-[105px] rounded-t-full border border-white/35" />
            <div className="absolute bottom-0 left-[63%] h-[205px] w-[95px] rounded-t-full border border-white/35" />
            <div className="absolute bottom-0 left-[78%] h-[215px] w-[100px] rounded-t-full border border-white/35" />
          </div>

          {vectorImage && (
            <div
              aria-label={vectorAlt}
              className="absolute bottom-0 z-20 h-[420px] w-[82%] max-w-[620px] bg-contain bg-bottom bg-no-repeat opacity-80"
              style={{ backgroundImage: `url(${vectorImage})` }}
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-12 left-[18%] z-20 hidden h-28 w-16 sm:block">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/45" />
        <div className="absolute left-1/2 top-[27px] z-[-1] h-[58px] w-[58px] -translate-x-1/2 rounded-full bg-[#ff202a] z-[-1]" />
        <div className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[6px] border-x-transparent border-t-white" />
      </div>

      {/* <div className="absolute bottom-0 left-0 h-px w-full bg-white/10" /> */}
    </section>
  );
}
