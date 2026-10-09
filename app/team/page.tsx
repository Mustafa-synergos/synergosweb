import type { Metadata } from 'next';
import Image from 'next/image';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import PageHeroSection from '@/components/shared/PageHeroSection';
import TeamGrid, { type TeamMember } from '@/components/team/TeamGrid';
import InteractiveDots from '@/components/home/InteractiveDots';
import CTA from '@/components/shared/CTA';
import type { PageHeroSectionData } from '@/types/page-hero';
import type {
  TeamBodySection,
  TeamEntryData,
  TeamJoinSectionData,
  TeamListingSectionData,
  TeamMemberData,
} from '@/types/team';
import { normalizeHeadingBreaks } from '@/lib/heading';
import { getTeam, getTeamEntry, richTextToPlainText } from '@/lib/strapi';
import { getMediaUrl } from '@/lib/strapi-media';

// Team content is driven by the single `api::team.team` entry when present.
// The FALLBACK_* values below render ONLY when the entry cannot be fetched
// at all (design placeholders, never a competing data source).

export async function generateMetadata(): Promise<Metadata> {
  try {
    const entry = await getTeamEntry();
    const seo = entry?.SeoInfo;

    if (entry && (seo?.MetaTitle || seo?.MetaDescription)) {
      return {
        title: seo.MetaTitle ?? entry.Title,
        description: seo.MetaDescription ?? undefined,
      };
    }

    if (entry?.Title) {
      return { title: `${entry.Title} | Synergos` };
    }
  } catch {
    // fall through
  }

  return { title: 'Teams | Synergos' };
}

const FALLBACK_HERO: PageHeroSectionData = {
  __component: 'pages.page-hero-section',
  Heading: 'PEOPLE\nOUR TEAM',
  HeadingLayout: 'multiline',
  HeadingClassName:
    "font-['clother',sans-serif] text-[36px] font-bold uppercase leading-[42px] tracking-normal sm:text-[52px] sm:leading-[70px] lg:text-[80px] lg:leading-[90px]",
  HeroVectorPath: '/images/Team/Team/banner-vector.svg',
  BannerTopPath: '/images/page-hero/banner-vector-right.png',
  BannerBottomPath: '/images/page-hero/banner-vector-left.png',
  ShowScrollIndicator: false,
};

const FALLBACK_SECTION_LINES = ['People Who', 'Build Impact'];

const FALLBACK_SECTION_PARAGRAPHS = [
  'Behind every successful project is a team committed to excellence, innovation, and meaningful experiences. Together, we transform ideas into impactful digital products that connect with people and businesses alike.',
];

const FALLBACK_CTA_EYEBROW = 'Join Our Team';

const FALLBACK_CTA_LINES = ['Build, Learn &', 'Grow With Us'];

const FALLBACK_CTA_PARAGRAPHS = [
  "We're always looking for passionate people who love creating meaningful digital experiences. If you're driven by creativity, collaboration, and innovation, we'd love to hear from you.",
  "Whether you're a designer, developer, strategist, or creative thinker, this is a place where your ideas matter and your growth is valued.",
  'Ready to be part of our journey?',
];

const FALLBACK_CTA_BUTTON = {
  displayText: 'Apply Now',
  hoverText: 'Apply Now',
  link: '/careers',
};

const FALLBACK_CTA_VECTOR = '/images/Team/Team/join-our-team.svg';

const FALLBACK_CTA_IMAGE = '/images/Team/Team/image.webp';

const FALLBACK_CTA_IMAGE_ALT = 'Synergos team collaboration';

function toTeamMembers(rawMembers: TeamMemberData[]): TeamMember[] {
  return rawMembers.map((m, index) => ({
    id: m.documentId ?? (m.id != null ? String(m.id) : `member-${index}`),
    name: m.name,
    role: m.role ?? '',
    image: getMediaUrl(m.photo) ?? '',
  }));
}

function resolveHeroData(
  cmsHero: PageHeroSectionData | undefined,
): PageHeroSectionData {
  if (!cmsHero) return FALLBACK_HERO;

  return {
    ...FALLBACK_HERO,
    Heading:
      typeof cmsHero.Heading === 'string' && cmsHero.Heading.trim()
        ? cmsHero.Heading
        : FALLBACK_HERO.Heading,
    HeadingLayout: cmsHero.HeadingLayout ?? FALLBACK_HERO.HeadingLayout,
    HeroVector: cmsHero.HeroVector ?? null,
    HeroVectorPath: cmsHero.HeroVectorPath ?? FALLBACK_HERO.HeroVectorPath,
    BannerTop: cmsHero.BannerTop ?? null,
    BannerTopPath: cmsHero.BannerTopPath ?? FALLBACK_HERO.BannerTopPath,
    BannerBottom: cmsHero.BannerBottom ?? null,
    BannerBottomPath:
      cmsHero.BannerBottomPath ?? FALLBACK_HERO.BannerBottomPath,
    ShowScrollIndicator:
      cmsHero.ShowScrollIndicator ?? FALLBACK_HERO.ShowScrollIndicator,
  };
}

function resolveListingCopy(cmsListing: TeamListingSectionData | undefined): {
  lines: string[];
  paragraphs: string[];
} {
  let lines = FALLBACK_SECTION_LINES;
  let paragraphs = FALLBACK_SECTION_PARAGRAPHS;

  const cmsHeading = richTextToPlainText(cmsListing?.Heading).trim();
  if (cmsHeading) {
    lines = normalizeHeadingBreaks(cmsHeading)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const cmsDescription = richTextToPlainText(cmsListing?.Description).trim();
  if (cmsDescription) {
    paragraphs = cmsDescription
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  return { lines, paragraphs };
}

function resolveCta(cmsCta: TeamJoinSectionData | undefined): {
  eyebrow: string;
  lines: string[];
  paragraphs: string[];
  button: { displayText: string; hoverText: string; link: string };
  isOpenNewTab: boolean;
  vector: string;
  image: string;
  imageAlt: string;
} {
  if (!cmsCta) {
    return {
      eyebrow: FALLBACK_CTA_EYEBROW,
      lines: FALLBACK_CTA_LINES,
      paragraphs: FALLBACK_CTA_PARAGRAPHS,
      button: FALLBACK_CTA_BUTTON,
      isOpenNewTab: false,
      vector: FALLBACK_CTA_VECTOR,
      image: FALLBACK_CTA_IMAGE,
      imageAlt: FALLBACK_CTA_IMAGE_ALT,
    };
  }

  let lines = FALLBACK_CTA_LINES;
  let paragraphs = FALLBACK_CTA_PARAGRAPHS;

  const eyebrow =
    richTextToPlainText(cmsCta.SpanText).trim() || FALLBACK_CTA_EYEBROW;

  const heading = richTextToPlainText(cmsCta.heading).trim();
  if (heading) {
    lines = normalizeHeadingBreaks(heading)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const body = richTextToPlainText(cmsCta.description).trim();
  if (body) {
    paragraphs = body
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  return {
    eyebrow,
    lines,
    paragraphs,
    button: cmsCta.ApplyBtn
      ? {
          displayText:
            cmsCta.ApplyBtn.DisplayText?.trim() ||
            FALLBACK_CTA_BUTTON.displayText,
          hoverText:
            cmsCta.ApplyBtn.HoverText?.trim() ||
            cmsCta.ApplyBtn.DisplayText?.trim() ||
            FALLBACK_CTA_BUTTON.hoverText,
          link: cmsCta.ApplyBtn.Link?.trim() || FALLBACK_CTA_BUTTON.link,
        }
      : FALLBACK_CTA_BUTTON,
    isOpenNewTab: cmsCta.ApplyBtn?.IsOpenNewTab ?? false,
    vector: getMediaUrl(cmsCta.VectorImg) ?? FALLBACK_CTA_VECTOR,
    image: getMediaUrl(cmsCta.image) ?? FALLBACK_CTA_IMAGE,
    imageAlt: cmsCta.image?.alternativeText ?? FALLBACK_CTA_IMAGE_ALT,
  };
}

function ListingSection({
  lines,
  paragraphs,
  members,
}: {
  lines: string[];
  paragraphs: string[];
  members: TeamMember[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#070707] py-20 sm:py-24 lg:py-28">
      <InteractiveDots variant="dark" />
      <Image
        src="/images/Team/Team/vector.svg"
        alt=""
        width={560}
        height={360}
        className="pointer-events-none absolute right-[8%] top-28 hidden w-[420px] opacity-45 lg:block xl:w-[560px]"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-16 lg:mb-20">
          <h2 className="font-['clother',sans-serif] text-[80px] font-bold uppercase leading-[80px] tracking-normal text-white sm:text-[100px] sm:leading-[100px] lg:text-[134px] lg:leading-[134px]">
            {lines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${paragraph.slice(0, 24)}-${index}`}
              className="mt-6 font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-white/60 sm:text-[18px] sm:leading-[26px]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <TeamGrid members={members} />
      </div>
    </section>
  );
}

function CtaSection({
  cta,
}: {
  cta: ReturnType<typeof resolveCta>;
}) {
  return (
    <section className="relative overflow-hidden bg-[#111111] py-20 sm:py-24 lg:py-28">
      <InteractiveDots variant="dark" />
      <Image
        src={cta.vector}
        alt=""
        width={330}
        height={260}
        className="pointer-events-none absolute right-[5%] top-20 hidden opacity-40 lg:block xl:right-[8%]"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8">
        <p className="mb-4 font-['clother',sans-serif] text-[14px] font-semibold uppercase tracking-wider text-[#ff1d25] sm:text-[16px]">
          {cta.eyebrow}
        </p>
        <h2 className="font-['clother',sans-serif] mb-8 text-[80px] font-bold uppercase leading-[80px] tracking-normal text-white sm:text-[100px] sm:leading-[100px] lg:text-[134px] lg:leading-[134px]">
          {cta.lines.map((line, index) => (
            <span key={`${line}-${index}`}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="mb-8 space-y-4 font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-white/60 sm:text-[18px] sm:leading-[26px]">
              {cta.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))}
            </div>
            <CTA
              displayText={cta.button.displayText}
              hoverText={cta.button.hoverText}
              link={cta.button.link}
              isOpenNewTab={cta.isOpenNewTab}
            />
          </div>

          <div className="relative mx-auto w-full max-w-[600px]">
            <Image
              src={cta.image}
              alt={cta.imageAlt}
              width={760}
              height={410}
              className="aspect-[1.86/1] w-full object-cover grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function findSection<T extends TeamBodySection['__component']>(
  sections: TeamBodySection[],
  component: T,
): Extract<TeamBodySection, { __component: T }> | undefined {
  return sections.find(
    (section): section is Extract<TeamBodySection, { __component: T }> =>
      section.__component === component,
  );
}

/**
 * Dynamic Zone renderer for the team entry — same architecture as
 * DynamicCareerSections: iterate `Body` in Strapi editor order, map by
 * `__component`. Unknown components warn (dev) and are skipped.
 */
function renderTeamSection(
  section: TeamBodySection,
  index: number,
  context: {
    heroData: PageHeroSectionData;
    listingLines: string[];
    listingParagraphs: string[];
    members: TeamMember[];
    cta: ReturnType<typeof resolveCta>;
  },
) {
  // Index only disambiguates the React key; rendering is UID-driven.
  const key = `${section.__component}-${section.id ?? 'noid'}-${index}`;

  if (section.__component === 'pages.page-hero-section') {
    return <PageHeroSection key={key} data={context.heroData} />;
  }

  if (section.__component === 'pages.team-listing') {
    return (
      <ListingSection
        key={key}
        lines={context.listingLines}
        paragraphs={context.listingParagraphs}
        members={context.members}
      />
    );
  }

  if (section.__component === 'pages.join-our-team') {
    return <CtaSection key={key} cta={context.cta} />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[Team] Unknown Dynamic Zone component "${section.__component}" — skipping.`,
    );
  }
  return null;
}

export default async function TeamPage() {
  let entry: TeamEntryData | null = null;
  let collectionMembers: TeamMemberData[] = [];

  try {
    const [teamEntry, members] = await Promise.all([
      getTeamEntry().catch((error) => {
        console.error('Failed to load team entry from Strapi:', error);
        return null;
      }),
      getTeam().catch((error) => {
        console.error('Failed to load team members:', error);
        return [] as TeamMemberData[];
      }),
    ]);
    entry = teamEntry;
    collectionMembers = members;
  } catch (error) {
    console.error('Failed to load team page:', error);
  }

  const sections = entry?.Body ?? [];
  const cmsHero = findSection(sections, 'pages.page-hero-section');
  const cmsListing = findSection(sections, 'pages.team-listing');
  const cmsCta = findSection(sections, 'pages.join-our-team');

  const heroData = resolveHeroData(cmsHero);
  const { lines: listingLines, paragraphs: listingParagraphs } =
    resolveListingCopy(cmsListing);
  // CMS-driven members: the entry's relation wins; the published
  // `team-members` collection is the fallback. No static member data.
  const members =
    cmsListing?.team_members?.length
      ? toTeamMembers(cmsListing.team_members)
      : toTeamMembers(collectionMembers);
  const cta = resolveCta(cmsCta);

  const context = {
    heroData,
    listingLines,
    listingParagraphs,
    members,
    cta,
  };

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />
      {sections.length > 0 ? (
        sections.map((section, index) => renderTeamSection(section, index, context))
      ) : (
        <>
          <PageHeroSection data={heroData} />
          <ListingSection
            lines={listingLines}
            paragraphs={listingParagraphs}
            members={members}
          />
          <CtaSection cta={cta} />
        </>
      )}
      <Footer />
    </main>
  );
}
