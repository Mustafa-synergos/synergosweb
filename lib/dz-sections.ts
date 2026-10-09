/**
 * Dynamic Zone section helpers — backward-compatible DZ support.
 *
 * When Strapi returns a populated `Sections` array, its `__component` order is
 * the editor's drag-and-drop order and must drive rendering. When `Sections`
 * is absent/empty (legacy entries, not-yet-migrated records), callers fall back
 * to the legacy fixed field layout — output is then byte-identical to today.
 */

export type DzSection = {
  __component: string;
  [key: string]: unknown;
};

/** Canonical (migration) order for case-study bands — equals legacy render order. */
export const CASE_STUDY_DZ_ORDER = [
  'case-study.objective',
  'case-study.approach',
  'case-study.soar',
  'case-study.outcome',
  'case-study.about',
] as const;

export function hasDzSections(entry: { Sections?: DzSection[] | null }): boolean {
  return Array.isArray(entry.Sections) && entry.Sections.length > 0;
}

/** Editor-defined `__component` order for a DZ array (unknown components kept as-is). */
export function dzComponentOrder(sections: DzSection[] | null | undefined): string[] {
  if (!sections?.length) return [];
  return sections.map((s) => s.__component);
}

/**
 * Sort pre-built band nodes by the DZ editor order. Unknown/future components
 * are ignored by the caller map; deleted bands simply have no entry.
 * Empty `sections` (legacy entry) => canonical order => legacy output.
 */
export function sortDzNodes<T>(
  nodes: { key: string; node: T }[],
  sections: DzSection[] | null | undefined,
  canonicalOrder: readonly string[],
): { key: string; node: T }[] {
  const order =
    sections && sections.length > 0
      ? sections.map((s) => s.__component)
      : [...canonicalOrder];
  const byKey = new Map(nodes.map((n) => [n.key, n]));
  return order.filter((k) => byKey.has(k)).map((k) => byKey.get(k)!);
}

/**
 * Body text for single-section DZ types (article/blog). Prefers the DZ body
 * section when present so delete/re-add flows keep rendering; otherwise null
 * so the caller falls back to the legacy top-level field.
 */
export function dzBodyField<T>(
  entry: { Sections?: DzSection[] | null },
  component: string,
  field: string,
): T | null {
  const section = entry.Sections?.find((s) => s.__component === component);
  if (!section) return null;
  const value = section[field] as T | null | undefined;
  return value ?? null;
}
