import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import InteractiveDots from '@/components/home/InteractiveDots';
import StrapiRichText from '@/components/shared/StrapiRichText';
import { getMediaUrl } from '@/lib/strapi-media';
import type {
  CaseStudyAboutSectionData,
  CaseStudyApproachSectionData,
  CaseStudyData,
  CaseStudyObjectiveSectionData,
  CaseStudyOutcomeSectionData,
  CaseStudyRichText,
  CaseStudySection,
  CaseStudySoarSectionData,
} from '@/types/case-study';

const APPROACH_ICON = '/images/Case Study-Details Page/icon.png';

type ApproachGridItem = {
  heading?: string;
  body: string;
};

function splitApproachMarkdownByH2(markdown: string): {
  intro: string;
  sections: { heading: string; body: string }[];
} {
  const lines = markdown.split('\n');
  const introLines: string[] = [];
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string[] } | null = null;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.*)/);
    if (h2Match) {
      if (current)
        sections.push({ heading: current.heading, body: current.body.join('\n').trim() });
      current = { heading: h2Match[1].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    } else {
      introLines.push(line);
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.body.join('\n').trim() });

  return { intro: introLines.join('\n').trim(), sections };
}

/**
 * Parse the Approach rich-text into individual grid items.
 * Handles both live shapes:
 *  - `## Title` + paragraph repeated (h2 sections)
 *  - `![icon]` + `* bullet` repeated (fragmented single-item lists)
 *  - plain `- bullet` / `* bullet` / `1. bullet` lists
 * Returns null when the shape is unknown so the caller can fall back
 * to the generic rich-text renderer.
 */
function parseApproachItems(content: unknown): ApproachGridItem[] | null {
  if (!content || typeof content !== 'string') return null;
  const markdown = content.trim();
  if (!markdown) return null;

  // Shape A: ## sections → one grid item per section.
  const h2Count = markdown.match(/^##\s+.+/gm)?.length ?? 0;
  if (h2Count >= 2) {
    const { sections } = splitApproachMarkdownByH2(markdown);
    if (sections.length >= 2) {
      return sections
        .map((s) => ({
          heading: s.heading,
          body: s.body,
        }))
        .filter((s) => s.heading || s.body);
    }
    return null;
  }

  // Shape B/C: bullet lists, possibly fragmented by blank lines and
  // standalone icon images (`![...](...)`) between items.
  const lines = markdown.split('\n');
  const items: string[] = [];
  const bulletRe = /^\s*(?:[-*•]|\d+[.)])\s+(.+)\s*$/;
  const iconImageLineRe = /^\s*!\[.*?\]\(.*?\)\s*$/;
  const htmlImgLineRe = /^\s*<img\b[^>]*>\s*$/i;

  for (const line of lines) {
    if (!line.trim()) continue;
    if (iconImageLineRe.test(line) || htmlImgLineRe.test(line)) continue;
    // Strip inline icon images that may sit on the same line as text.
    const withoutIcons = line
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/<img\b[^>]*>/gi, '')
      .trim();
    if (!withoutIcons) continue;
    const bulletMatch = withoutIcons.match(bulletRe);
    if (bulletMatch) {
      const text = bulletMatch[1].trim();
      if (text) items.push(text);
    } else if (items.length > 0) {
      // Continuation line of a wrapped bullet (multi-line item).
      items[items.length - 1] += ` ${withoutIcons}`;
    }
  }

  if (items.length >= 2) {
    return items.map((body) => ({ body }));
  }

  return null;
}

const approachBodyComponents: any = {
  p: ({ children }: any) => (
    <p className="m-0 text-[15px] font-light leading-[1.75] text-white sm:text-[16px] sm:leading-[1.8]">
      {children}
    </p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }: any) => <em className="italic text-white/90">{children}</em>,
  a: ({ href, children }: any) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-[#ff202a] underline underline-offset-4 transition-colors hover:text-white"
    >
      {children}
    </a>
  ),
};

/**
 * THE SYNERGOS APPROACH items grid.
 * The grid element directly contains every approach item (no intermediate
 * <ul> wrapper), so `display:grid + repeat(2, ...)` applies to the items.
 * Existing breakpoint is `md` (matches StrapiRichText `md:grid-cols-2`).
 */
function ApproachItemsGrid({ description }: { description?: CaseStudyRichText }) {
  const items = parseApproachItems(description);

  // Unknown shape: keep the generic renderer instead of dropping content.
  if (!items || items.length === 0) {
    return <StrapiRichText content={description} h2Grid />;
  }

  return (
    <div className="approach-items-grid grid grid-cols-1 gap-x-[55px] gap-y-[38px] md:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="approach-item flex min-w-0 items-start gap-3"
        >
          <img
            src={APPROACH_ICON}
            alt=""
            className="approach-icon mt-1.5 h-3.5 w-3.5 flex-shrink-0 object-contain"
          />
          <div className="approach-text min-w-0 flex-1">
            {item.heading ? (
              <div className="mt-0 mb-3 font-['clother',sans-serif] text-[20px] font-bold uppercase leading-[1.3] text-white lg:text-[32px]">
                {item.heading}
              </div>
            ) : null}
            {item.body ? (
              <div className="text-[15px] font-light leading-[1.75] text-white sm:text-[16px] sm:leading-[1.8]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={approachBodyComponents}
                >
                  {item.body}
                </ReactMarkdown>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

type CaseStudyDetailProps = {
  caseStudy: CaseStudyData;
};

// Local fallback assets keep the visual design intact whenever a Strapi media
// field is empty (e.g. partially-configured CMS). They are design placeholders,
// not case-study content.
const FALLBACK = {
  hero: '/images/Case Study-Details Page/banner-image.webp',
  objective: '/images/Case Study-Details Page/the-objective.webp',
  soar: '/images/Case Study-Details Page/built-to-soar.webp',
  about: '/images/Case Study-Details Page/about.webp',
};

function SectionHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-['clother',sans-serif] text-[24px] font-bold uppercase leading-[40px] tracking-[0] text-white lg:text-[60px] lg:leading-[76px] ${className}`}>
      {children}
    </h2>
  );
}

/* ── Dynamic Zone bands (one per component UID, same pattern as
   DynamicCareerSections / DynamicPageSections: `__component` switch) ── */

function ObjectiveBand({ data }: { data: CaseStudyObjectiveSectionData }) {
  const title = data.Name ?? data.heading ?? 'THE OBJECTIVE';
  const body = data.Description ?? data.description;
  const image = getMediaUrl(data.image) ?? FALLBACK.objective;

  return (
    <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="dark" opacity={0.04} />
        <div
          className="absolute right-0 top-20 h-full w-full max-w-[640px] opacity-60 lg:max-w-[580px] hidden lg:block"
          style={{
            backgroundImage: "url('/images/Case Study-Details Page/vector.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top right',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-4 ">
          <div className="relative order-2 aspect-[4/3] w-full max-w-[560px] lg:order-1">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 560px, 90vw"
            />
          </div>

          <div className="order-1 max-w-2xl lg:order-2">
            <SectionHeading className="mb-6">{title}</SectionHeading>
            <StrapiRichText content={body} h2Grid />
          </div>
        </div>
      </div>
    </section>
  );
}

function ApproachBand({ data }: { data: CaseStudyApproachSectionData }) {
  const title = data.heading ?? data.Name ?? 'THE SYNERGOS APPROACH';
  const body = data.Description ?? data.description;

  return (
    <section className="relative overflow-hidden bg-[#171717] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="dark" opacity={0.04} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <SectionHeading className="mb-12 sm:mb-16 lg:mb-20">
          {title}
        </SectionHeading>

        <ApproachItemsGrid description={body} />
      </div>
    </section>
  );
}

function SoarBand({ data }: { data: CaseStudySoarSectionData }) {
  const title = data.heading ?? data.Name ?? 'BUILT TO SOAR';
  const body = data.Description ?? data.description;
  const image = getMediaUrl(data.image) ?? FALLBACK.soar;

  return (
    <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="dark" opacity={0.04} />
        <div
          className="absolute left-0 top-0 h-full w-full max-w-[640px] opacity-60 lg:max-w-[320px] hidden lg:block"
          style={{
            backgroundImage: "url('/images/Case Study-Details Page/vector-2.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <SectionHeading className="mb-6">{title}</SectionHeading>
            <StrapiRichText content={body} h2Grid />
          </div>

          <div className="relative aspect-[4/3] w-full max-w-[560px] justify-self-end md:justify-self-start">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 560px, 90vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function OutcomeBand({ data }: { data: CaseStudyOutcomeSectionData }) {
  const title = data.heading ?? data.Heading ?? 'The Outcome';
  const body = data.description ?? data.Description;
  const outcomeCards = data.OutcomeCards ?? [];
  // Production Strapi field: Outcome.gridImage (multiple media).
  // Supports both the flattened v5 shape ({url, ...}) and the legacy
  // {data: ...} shape via getMediaUrl, plus a single (non-array) value.
  const gridSource = data.gridImage;
  const gridList = gridSource ? (Array.isArray(gridSource) ? gridSource : [gridSource]) : [];
  const outcomeGridImages = gridList.filter((item) => getMediaUrl(item));

  return (
    <section className="relative overflow-hidden bg-[#ff202a] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="red" opacity={0.12} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <h2 className="mb-6 font-['clother',sans-serif] text-[24px] font-bold uppercase leading-[40px] tracking-[0] text-white lg:text-[60px] lg:leading-[76px]">
          {title}
        </h2>

        {body && (
          <div className="mb-12 text-[16px] font-normal leading-[26px] text-white/90 lg:text-[18px] sm:mb-16 lg:mb-20">
            <StrapiRichText content={body} h2Grid />
          </div>
        )}

        {outcomeCards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {outcomeCards.map((stat, index) => (
              <div
                key={index}
                className="relative flex h-[219px] w-[396px] flex-col justify-center gap-3 overflow-hidden rounded-[16px] bg-[#1B1B1B] px-6 py-6 lg:gap-8"
              >
                <div className="absolute right-0 top-0 h-full w-[55%]">
                  <Image
                    src="/images/Case Study-Details Page/logo.png"
                    alt=""
                    fill
                    className="object-cover object-right-top"
                    sizes="220px"
                  />
                </div>
                <span className="relative z-10 mb-1 font-['clother',sans-serif] text-[48px] font-bold leading-[1] text-[#ff202a]">
                  {stat.Text}
                </span>
                <span className="relative z-10 text-[16px] font-light text-white/90">
                  <StrapiRichText content={stat.Description} />
                </span>
              </div>
            ))}
          </div>
        )}

        {outcomeGridImages.length > 0 && (
          <div className="outcome-image-grid mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-8 lg:mt-10">
            {outcomeGridImages.map((item, index) => {
              const src = getMediaUrl(item);
              if (!src) return null;
              const alt =
                item?.alternativeText ??
                item?.caption ??
                'Outcome image';
              return (
                <figure key={index} className="min-w-0">
                  <div className="relative aspect-[4/2] w-full overflow-hidden rounded-[16px]">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 90vw"
                    />
                  </div>
                  {item?.caption && (
                    <figcaption className="mt-3 text-[14px] font-light leading-[1.7] text-white/90 sm:text-[15px]">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutBand({ data }: { data: CaseStudyAboutSectionData }) {
  const title = data.Heading ?? data.heading ?? 'ABOUT';
  const body = data.Description ?? data.description;
  const image = getMediaUrl(data.image) ?? FALLBACK.about;

  return (
    <section className="relative overflow-hidden bg-[#131313] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="dark" opacity={0.04} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <div className="grid items-center gap-4 lg:grid-cols-2 lg:gap-0">
          <div className="max-w-2xl">
            <h2 className="mb-6 font-['clother',sans-serif] text-[24px] font-bold uppercase leading-[40px] tracking-[0] text-white lg:text-[60px] lg:leading-[76px]">
              {title}
            </h2>
            <div className="text-[18px] font-light leading-[1.7] text-white">
              <StrapiRichText content={body} h2Grid />
            </div>
          </div>

          <div className="relative aspect-[534/284] max-w-[534px] w-full justify-self-end md:justify-self-start">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 534px, 90vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const OBJECTIVE_COMPONENTS = new Set(['case-study.objective', 'pages.case-studies-objective']);
const APPROACH_COMPONENTS = new Set(['case-study.approach', 'pages.case-studies-approach']);
const SOAR_COMPONENTS = new Set(['case-study.soar', 'pages.case-studies-soar']);
const OUTCOME_COMPONENTS = new Set(['case-study.outcome', 'pages.case-studies-outcome']);
const ABOUT_COMPONENTS = new Set(['case-study.about', 'pages.case-studies-about']);

/**
 * Dynamic Zone renderer — same architecture as DynamicCareerSections /
 * DynamicPageSections: iterate the DZ array in Strapi editor order and map
 * each entry by its `__component` UID. Unknown components warn (dev) and are
 * skipped so one bad band can never crash the page.
 */
function renderCaseStudySection(section: CaseStudySection, index: number) {
  // Index only disambiguates the React key (Strapi reuses numeric ids across
  // component types); rendering is driven by `__component`, never position.
  const key = `${section.__component}-${section.id ?? 'noid'}-${index}`;

  if (OBJECTIVE_COMPONENTS.has(section.__component)) {
    return <ObjectiveBand key={key} data={section as CaseStudyObjectiveSectionData} />;
  }

  if (APPROACH_COMPONENTS.has(section.__component)) {
    return <ApproachBand key={key} data={section as CaseStudyApproachSectionData} />;
  }

  if (SOAR_COMPONENTS.has(section.__component)) {
    return <SoarBand key={key} data={section as CaseStudySoarSectionData} />;
  }

  if (OUTCOME_COMPONENTS.has(section.__component)) {
    return <OutcomeBand key={key} data={section as CaseStudyOutcomeSectionData} />;
  }

  if (ABOUT_COMPONENTS.has(section.__component)) {
    return <AboutBand key={key} data={section as CaseStudyAboutSectionData} />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[CaseStudy] Unknown Dynamic Zone component "${section.__component}" — skipping.`,
    );
  }
  return null;
}

/**
 * Legacy fallback for entries without DZ content (local/dev backend with
 * top-level component fields): synthesize DZ entries in canonical order so
 * they flow through the SAME `__component` renderer above.
 */
function legacySections(caseStudy: CaseStudyData): CaseStudySection[] {
  const sections: CaseStudySection[] = [];

  if (caseStudy.Objective) {
    sections.push({ __component: 'case-study.objective', ...caseStudy.Objective });
  }
  if (caseStudy.Approach) {
    sections.push({ __component: 'case-study.approach', ...caseStudy.Approach });
  }
  if (caseStudy.SOAR) {
    sections.push({ __component: 'case-study.soar', ...caseStudy.SOAR });
  }
  if (caseStudy.Outcome) {
    sections.push({ __component: 'case-study.outcome', ...caseStudy.Outcome });
  }
  if (caseStudy.about) {
    sections.push({ __component: 'case-study.about', ...caseStudy.about });
  }

  return sections;
}

export default function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const heroImage = getMediaUrl(caseStudy.FeaturedImage) ?? FALLBACK.hero;

  // DZ-first: editor order in Strapi drives rendering. Legacy top-level
  // fields only feed entries that have no DZ content.
  const sections =
    caseStudy.Sections && caseStudy.Sections.length > 0
      ? caseStudy.Sections
      : legacySections(caseStudy);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#171717] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-0 h-[55%] w-[58%] max-w-[640px] opacity-100 sm:h-[60%] sm:w-[52%] lg:h-[65%] lg:w-[48%]"
          style={{
            backgroundImage: "url('/images/page-hero/banner-vector-right.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top right',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-[50%] w-[50%] max-w-[620px] opacity-100 sm:h-[55%] sm:w-[52%] lg:h-[60%] lg:w-[46%]"
          style={{
            backgroundImage: "url('/images/page-hero/banner-vector-left.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom left',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
          <div className="relative min-h-[min(88vh,720px)] py-28 sm:py-32 lg:min-h-[680px] lg:py-36">
            <div className="grid h-full items-center gap-8 grid-cols-1 md:rounded-br-none md:rounded-bl-none lg:grid-cols-2 rounded-[16px] border border-white/[0.11] bg-white/[0.11] backdrop-blur-[6.4px]">
              <div className="relative z-20 max-w-[620px] sm:p-8 lg:p-10 ">
                <h1 className="break-words text-[24px] font-bold uppercase leading-[32px] tracking-[0] text-white lg:text-[44px] lg:leading-[62px]">
                  {caseStudy.Title}
                </h1>
              </div>
              <div className="relative z-20 hidden aspect-[620/340] w-full max-w-[620px] lg:block">
                <Image
                  src={heroImage}
                  alt={caseStudy.Title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 620px, 100vw"
                  priority
                />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-10 left-0 z-30 sm:bottom-[10%]"
            >
              <div className="relative h-16 w-[32px] sm:h-28 sm:w-[58px]">
                <div className="absolute left-1/2 top-0 z-10 h-full w-px -translate-x-1/2 bg-white/50" />
                <div className="absolute left-1/2 top-[15px] z-0 size-[32px] -translate-x-1/2 rounded-full bg-[#ff202a] sm:top-[27px] sm:size-[58px]" />
                <div className="absolute bottom-0 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[3px] border-t-[5px] border-x-transparent border-t-white sm:border-x-[4px] sm:border-t-[6px]" />
              </div>
            </div>

            <div className="relative z-20 mt-8 md:mt-0  aspect-[620/340] w-full max-w-[1280px] lg:hidden">
              <Image
                src={heroImage}
                alt={caseStudy.Title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC ZONE (Strapi editor order) ── */}
      {sections.map((section, index) => renderCaseStudySection(section, index))}
    </>
  );
}
