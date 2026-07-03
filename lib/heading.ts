export type HeadingLayout = 'single' | 'multiline';

export function normalizeHeadingBreaks(heading: string) {
  return heading.replace(/\\n/g, '\n').trim();
}

export function getTitleLines(heading: string, layout: HeadingLayout = 'multiline') {
  const normalized = normalizeHeadingBreaks(heading);

  if (layout === 'single') {
    return [
      normalized
        .replace(/\s*[\n\r]+\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    ];
  }

  return normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
