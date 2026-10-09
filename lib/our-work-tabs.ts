import { WORK_CATEGORIES } from '@/data/work';
import type { ProjectCategorySlug } from '@/types/work';

/**
 * Canonical Our Work route. Single source of truth for the base path used
 * when a Service CTA points at a portfolio tab — do not hard-code
 * `/our-work` anywhere else.
 */
export const OUR_WORK_ROUTE = '/our-work';

/** Query parameter the Our Work page reads to pre-select a tab. */
export const OUR_WORK_TAB_PARAM = 'tab';

/**
 * Valid tab identifiers. Derived from the actual tabs implemented by the
 * Our Work page (`WORK_CATEGORIES`), never invented here:
 * `all | web-app | brochures | social-media | paid-ads | videos | branding`.
 */
const VALID_TAB_IDS: ReadonlySet<string> = new Set(
  WORK_CATEGORIES.map((category) => category.id),
);

export function isOurWorkTab(value: unknown): value is ProjectCategorySlug {
  return typeof value === 'string' && VALID_TAB_IDS.has(value.trim());
}

/** Normalize a raw `targetSlug` (or legacy `?tab=` value) to a valid tab id. */
export function normalizeOurWorkTab(value: unknown): ProjectCategorySlug | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return isOurWorkTab(trimmed) ? (trimmed as ProjectCategorySlug) : null;
}

/**
 * Resolve a CMS `targetSlug` (e.g. `web-app`) into `/our-work?tab=web-app`.
 * The CMS editor never types the URL — only the tab identifier.
 * Unknown/empty slugs fall back to the plain `/our-work` route (All tab).
 */
export function resolveOurWorkTabUrl(targetSlug?: string | null): string {
  const tab = normalizeOurWorkTab(targetSlug);
  if (!tab || tab === 'all') return OUR_WORK_ROUTE;
  return `${OUR_WORK_ROUTE}?${OUR_WORK_TAB_PARAM}=${encodeURIComponent(tab)}`;
}

export type ServiceCtaHrefInput = {
  link?: string | null;
  targetSlug?: string | null;
  TargetSlug?: string | null;
  slug?: string | null;
};

/**
 * Resolve the final href for a Service Dynamic Zone CTA.
 *
 * Priority (no service-specific hard-coding):
 *  1. `targetSlug` (or legacy `TargetSlug`/`slug` alias) → `/our-work?tab=<id>`
 *  2. An explicit `Link` that already points at `/our-work` (with or without
 *     a valid `?tab=`) → kept as-is so previously hand-typed URLs keep working
 *  3. Any other explicit `Link` → kept as-is
 *  4. Nothing usable → null (renderer must not render a dead link)
 */
export function resolveServiceCtaHref(input: ServiceCtaHrefInput): string | null {
  const rawSlug =
    input.targetSlug ?? input.TargetSlug ?? input.slug ?? null;
  const tab = normalizeOurWorkTab(rawSlug);
  if (tab) return resolveOurWorkTabUrl(tab);

  const rawLink = (input.link ?? '').trim();
  if (!rawLink) return null;

  // Preserve already-formed Our Work URLs (absolute or root-relative).
  try {
    const parsed = new URL(rawLink, 'https://placeholder.local');
    const path = parsed.pathname.replace(/\/+$/, '') || '/';
    if (path.toLowerCase() === OUR_WORK_ROUTE) {
      const existing = parsed.searchParams.get(OUR_WORK_TAB_PARAM);
      const valid = normalizeOurWorkTab(existing);
      return valid && valid !== 'all'
        ? `${OUR_WORK_ROUTE}?${OUR_WORK_TAB_PARAM}=${encodeURIComponent(valid)}`
        : OUR_WORK_ROUTE;
    }
  } catch {
    // Non-URL-safe input falls through to the raw link below.
  }

  return rawLink;
}
