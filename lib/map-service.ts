import { getMediaUrl } from '@/lib/strapi-media';
import { resolveServiceCtaHref } from '@/lib/our-work-tabs';
import type { ServiceData, ServiceCtaData } from '@/types/service';
import type { RichTextBlockNode } from '@/types/rich-text';
import type { Service } from '@/data/services';

function blockText(value?: string | RichTextBlockNode[] | null): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';

  return value
    .map((block) => {
      if (block.type === 'list') {
        return block.children
          .map((item) => item.children.map((child) => ('text' in child ? child.text : child.children.map((c) => c.text).join(''))).join(''))
          .join('\n');
      }

      return block.children
        .map((child) => ('text' in child ? child.text : child.children.map((c) => c.text).join('')))
        .join('');
    })
    .filter(Boolean)
    .join('\n\n');
}

function normalizeSlug(slug: string) {
  return slug.startsWith('/services/') ? slug : `/services/${slug}`;
}

/** First URL segments that are real app routes (kept as-is when linked). */
const APP_ROUTE_FIRST_SEGMENTS = new Set([
  'services',
  'case-studies',
  'resources',
  'blog',
  'blogs',
  'careers',
  'career',
  'team',
  'clients',
  'about',
  'contact',
  'our-work',
  'work',
  'projects',
  'privacy-policy',
  'terms-and-conditions',
  'thank-you',
]);

/**
 * Normalize a CMS case-card link. Editors store either a full app path
 * (`/case-studies/<slug>`, `/services/<slug>`, …), an external URL, or a
 * bare case-study slug (`synergos-…`). Bare slugs resolve to the case-study
 * detail route, which is what these cards link to. Returns null when there
 * is no usable link (card then renders without navigation).
 */
function normalizeCaseStudyLink(raw?: string | null): string | null {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const rooted = trimmed.replace(/^\/+/, '');
  const [first, ...rest] = rooted.split('/');
  if (!first) return null;
  if (rest.length > 0 || APP_ROUTE_FIRST_SEGMENTS.has(first.toLowerCase())) {
    return `/${rooted}`;
  }
  return `/case-studies/${rooted}`;
}

function textOrFallback(value: unknown, fallback: string) {
  const text =
    typeof value === 'string'
      ? value.trim()
      : typeof value === 'number' || typeof value === 'boolean'
        ? String(value).trim()
        : '';
  return text ? text : fallback;
}

function ctaList(
  cta?:
    | { DisplayText?: string | null; HoverText?: string | null; Link?: string | null; targetSlug?: string | null; TargetSlug?: string | null }
    | { DisplayText?: string | null; HoverText?: string | null; Link?: string | null; targetSlug?: string | null; TargetSlug?: string | null }[]
    | null,
): ServiceCtaData[] {
  if (!cta) return [];
  return (Array.isArray(cta) ? cta : [cta]) as ServiceCtaData[];
}

function categoryName(category: ServiceData['service_category']) {
  return category?.name ?? category?.Name ?? category?.title ?? category?.Title ?? '';
}

function serviceCategoryName(data: ServiceData) {
  const categories = data.service_category ?? data.service_categories;
  const first = Array.isArray(categories) ? categories[0] : categories;
  return categoryName(first ?? data.service_category);
}

export function mapServiceDataToService(data: ServiceData): Service {
  const id = typeof data.id === 'number' ? data.id : 0;
  const title = data.title ?? data.Title ?? '';
  const description = data.shortDescription ?? blockText(data.description) ?? data.Description ?? '';
  const illustration =
    getMediaUrl(data.thumbnail) ??
    getMediaUrl(data.Illustration) ??
    '/images/Service%20listing/icon-btn.svg';
  const slug = normalizeSlug(data.slug ?? data.Slug ?? '');

  // Live `body` DZ bands by component. Band content is the ONLY component
  // content source; the entry's own scalar/relation fields (title,
  // shortDescription, thumbnail, service_category, order) remain in use.
  // Legacy duplicated component fields are never read here.

  // Live `body` DZ content overlay. Migrated services carry their CURRENT
  // content in `services.*` bands; unmigrated services have empty shells.
  // Per-field rule: a meaningful body value wins, otherwise the legacy
  // chains below apply — migrated, unmigrated and partially-migrated
  // entries all render correctly, and CMS edits need no code changes.
  // (The `caseStudies` band is order-only: its nested stub carries no card
  // content, so cards always come from the legacy relations.)
  const bodyByComponent = new Map<string, { __component: string }>(
    (Array.isArray(data.body) ? data.body : []).map((b) => [b.__component, b]),
  );
  const BB = <T,>(component: string): T | undefined =>
    bodyByComponent.get(component) as T | undefined;
  const BHero = BB<import('@/types/service').ServiceBodyHeroSection>('services.service-hero');
  const BContent = BB<import('@/types/service').ServiceBodyContentSection>('services.service-content');
  const BProcess = BB<import('@/types/service').ServiceBodyProcessSection>('services.process');
  const BCaps = BB<import('@/types/service').ServiceBodyCapabilitiesSection>('services.services-capabilities');
  const BGlance = BB<import('@/types/service').ServiceBodyGlanceSection>('services.capabilities-at-glance');
  const BCases = BB<import('@/types/service').ServiceBodyCasesSection>('services.case-studies');
  const BEnquiry = BB<import('@/types/service').ServiceBodyEnquiryFormSection>('services.enquiry-form');
  // Editors may also drop the shared contact form component
  // (`pages.contact-form-section`) directly into a service entry — same
  // fields (Heading, Subtitle, SubmitCTA, ThankYouPath, BackgroundImage),
  // so it feeds the same enquiry band when no `services.enquiry-form` is set.
  const BContactForm = BB<import('@/types/service').ServiceBodyEnquiryFormSection>('pages.contact-form-section');
  const BEnquiryContent = BEnquiry ?? BContactForm;
  const BFaq = BB<import('@/types/service').ServiceBodyFaqSection>('services.faq');

  /** True when a CMS value carries real content (blanks, empty blocks/lists and id-only stubs do not). */
  function hasContent(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number' || typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.some((item) => hasContent(item));
    if (typeof value === 'object') {
      return Object.entries(value).some(([k, v]) => k !== 'id' && hasContent(v));
    }
    return false;
  }

  /** Rich-text (string or blocks) → plain string, first meaningful value wins. */
  function pickText(...vals: readonly unknown[]): string {
    for (const v of vals) {
      if (!hasContent(v)) continue;
      if (typeof v === 'string') return v;
      if (Array.isArray(v)) return blockText(v as RichTextBlockNode[]);
    }
    return '';
  }

  /** Media → URL, first resolvable value wins. */
  function pickMediaUrl(...vals: readonly unknown[]): string | null {
    for (const v of vals) {
      if (!hasContent(v)) continue;
      const url = getMediaUrl(v as { url?: string });
      if (url) return url;
    }
    return null;
  }

  const fallbackImage = illustration;

  const heroImage = pickMediaUrl(BHero?.Image, data.heroImage) ?? fallbackImage;
  const heroImageMobile = getMediaUrl(data.HeroImageMobile) ?? undefined;

  const bodyCtas = [
    ...ctaList(BHero?.CTA),
    ...ctaList(BHero?.cta2),
    ...ctaList(BContent?.cta1),
    ...ctaList(BContent?.cta2),
  ].filter((cta) => hasContent(cta.DisplayText) && (hasContent(cta.Link) || hasContent(cta.targetSlug) || hasContent((cta as { TargetSlug?: unknown }).TargetSlug)));
  const ctas = bodyCtas
    .map((cta) => {
      const targetSlug = cta.targetSlug ?? cta.TargetSlug ?? null;
      return {
        displayText: cta.DisplayText,
        hoverText: cta.HoverText ?? cta.DisplayText,
        link:
          resolveServiceCtaHref({ link: cta.Link, targetSlug }) ?? cta.Link,
        targetSlug,
      };
    })
    .filter((cta) => Boolean(cta.link));

  const bodyCaps = BCaps?.Capability;
  const capabilities = (bodyCaps?.some((cap) => hasContent(cap)) ? bodyCaps : [])
    .filter((cap) => hasContent(cap.title) || hasContent(cap.description))
    .map((cap) => ({
      title: textOrFallback(cap.title, title),
      body: textOrFallback(blockText(cap.description), description),
      image: getMediaUrl(cap.Illustration) ?? fallbackImage,
    }));

  // Case cards come ONLY from the body's nested `caseStudies` relation
  // (deep-populated). The nested stub carries no card content.
  const caseStudyCards = (BCases?.caseStudies ?? [])
    .flatMap((group) => group.caseStudiesItem ?? [])
    .filter((item) => hasContent(item.title))
    .map((item) => ({
      category: item.category ?? serviceCategoryName(data) ?? title,
      title: textOrFallback(item.title, title),
      description: textOrFallback(item.excerpt ?? item.description, description),
      date: item.date ?? '',
      link: normalizeCaseStudyLink(item.link) ?? undefined,
    }));

  // Glance items come ONLY from the body band (icons via the deep
  // populate). No legacy merge: the band is the source of truth.
  const bodyGlanceItems = BGlance?.ExpertiseItem;
  const expertiseItems = (bodyGlanceItems?.some((item) => hasContent(item)) ? bodyGlanceItems : [])
    .filter((item) => hasContent(item.Title))
    .map((item) => ({
      title: textOrFallback(item.Title, title),
      icon: getMediaUrl(item.Icon) ?? fallbackImage,
      description: blockText(item.description) || undefined,
    }));

  const bodyFaqs = BFaq?.FAQs;
  const faqEyebrow = pickText(BFaq?.Eyebrow) || '';
  const faqHeading = pickText(BFaq?.Heading) || '';
  const faqs = (bodyFaqs?.some((faq) => hasContent(faq)) ? bodyFaqs : [])
    .filter((faq) => hasContent(faq.Question) || hasContent(faq.Answer))
    .map((faq) => ({
      question: textOrFallback(faq.Question, ''),
      answer: textOrFallback(blockText(faq.Answer), ''),
    }));

  // Enquiry band: same section as the contact form. Accepts either the
  // dedicated `services.enquiry-form` band or a `pages.contact-form-section`
  // dropped into the service DZ. CMS values win when present; otherwise the
  // contact defaults apply so the band renders correctly even with an empty
  // shell in the DZ.
  const enquiryCta = BEnquiryContent?.SubmitCTA ?? null;
  const enquiry = {
    Heading: pickText(BEnquiryContent?.Heading) || "LET'S TALK",
    Subtitle:
      pickText(BEnquiryContent?.Subtitle) ||
      "And find out if there's a better path ahead for your brand.",
    SubmitCTA:
      enquiryCta && hasContent(enquiryCta)
        ? {
            DisplayText: textOrFallback(enquiryCta.DisplayText, 'SUBMIT'),
            HoverText: enquiryCta.HoverText ?? enquiryCta.DisplayText ?? 'SUBMIT',
            Link: enquiryCta.Link ?? null,
            IsOpenNewTab: enquiryCta.IsOpenNewTab ?? null,
            Magnetic: enquiryCta.Magnetic ?? null,
          }
        : null,
    ThankYouPath: BEnquiryContent?.ThankYouPath || '/thank-you',
    BackgroundImageUrl: pickMediaUrl(BEnquiryContent?.BackgroundImage) ?? null,
  };

  return {
    id,
    number: data.Number ?? (data.order ? String(data.order).padStart(2, '0') : '01'),
    title,
    description,
    illustration,
    slug,
    detail: {
      heroImage,
      heroImageMobile,
      intro: {
        heading: pickText(BHero?.heading) || '',
        lead: pickText(BHero?.description) || description,
        body: pickText(BContent?.description) || '',
        para: pickText(BContent?.description1) || undefined,
        image: pickMediaUrl(BContent?.Image) ?? fallbackImage,
        ctas,
      },
      approach: {
        eyebrow: pickText(BProcess?.Eyebrow) || '',
        heading: pickText(BProcess?.Heading) || '',
        lead: pickText(BProcess?.Description) || '',
        body: pickText(BProcess?.Description1) || '',
        image: pickMediaUrl(BProcess?.Illustration) ?? fallbackImage,
      },
      capabilities: {
        eyebrow: pickText(BCaps?.eyebrow) || '',
        heading: pickText(BCaps?.heading) || '',
        image: fallbackImage,
        items: capabilities,
      },
      caseStudies: {
        label: pickText(BCases?.eyebrow) || '',
        title: pickText(BCases?.heading) || '',
        cards: caseStudyCards,
      },
      expertise: {
        eyebrow: pickText(BGlance?.eyebrow) || '',
        heading: pickText(BGlance?.heading) || '',
        items: expertiseItems,
      },
      faqs,
      faqEyebrow,
      faqHeading,
      enquiry,
    },
  };
}

/** Canonical service band keys rendered by ServiceDetail. */
export type ServiceBandKey =
  | 'hero'
  | 'intro'
  | 'approach'
  | 'capabilities'
  | 'expertise'
  | 'cases'
  | 'enquiry'
  | 'faq';

/**
 * Single Dynamic Zone component registry for services. Keys are the ACTUAL
 * `__component` UIDs returned by the API across backends: live `services.*`,
 * local `sections.*`, alternate `stg.*`. The renderer's iteration order is
 * the DZ array order — this map only resolves identity, never order.
 */
export const SERVICE_BAND_BY_COMPONENT: Record<string, ServiceBandKey> = {
  'services.service-hero': 'hero',
  'sections.service-hero': 'hero',
  'stg.service-hero': 'hero',
  'services.service-content': 'intro',
  'sections.service-intro': 'intro',
  'stg.service-content': 'intro',
  'services.process': 'approach',
  'sections.service-approach': 'approach',
  'stg.service-approach': 'approach',
  'services.services-capabilities': 'capabilities',
  'sections.service-capabilities': 'capabilities',
  'stg.service-capabilities': 'capabilities',
  'services.capabilities-at-glance': 'expertise',
  'sections.service-expertise': 'expertise',
  'stg.service-glance': 'expertise',
  'services.case-studies': 'cases',
  'sections.service-case-studies': 'cases',
  'stg.service-portfolio': 'cases',
  'stg.service-cases': 'cases',
  'services.enquiry-form': 'enquiry',
  'pages.contact-form-section': 'enquiry',
  'sections.service-enquiry': 'enquiry',
  'stg.service-enquiry': 'enquiry',
  'services.faq': 'faq',
  'sections.service-faq': 'faq',
  'stg.service-faq': 'faq',
};

export type ResolvedServiceSection = {
  /** Stable React key (UID + Strapi id + position; position only disambiguates). */
  key: string;
  band: ServiceBandKey;
  component: string;
};

/**
 * Resolve the entry's Dynamic Zone into an ordered render list.
 * Source: live `body`, else `Sections` (other backends), else nothing.
 * Membership AND order come from the DZ array itself — nothing is
 * synthesized, sorted, or defaulted. Unknown components warn (dev) and are
 * skipped so a new CMS band can never crash the page.
 */
export function resolveServiceSections(data: ServiceData): ResolvedServiceSection[] {
  const body = Array.isArray(data.body) ? data.body : null;
  const sections = Array.isArray(data.Sections) ? data.Sections : null;
  const dz: { __component?: string; id?: number }[] =
    (body?.length ? body : sections) ?? [];

  const seen = new Set<ServiceBandKey>();
  const resolved: ResolvedServiceSection[] = [];

  dz.forEach((section, index) => {
    const component = section?.__component ?? '';
    const band = SERVICE_BAND_BY_COMPONENT[component];

    if (!band) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Services] Unknown Dynamic Zone component "${component}" — skipping.`,
        );
      }
      return;
    }

    if (seen.has(band)) return;
    seen.add(band);

    resolved.push({
      key: `${component}-${section?.id ?? 'noid'}-${index}`,
      band,
      component,
    });
  });

  return resolved;
}
