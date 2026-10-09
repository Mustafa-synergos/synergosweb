export type ArticleContentBlock =
  | { type: 'heading'; html: string }
  | { type: 'paragraph'; html: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'pair'; html: string; src: string; alt: string; reverse: boolean };

type RawNode = {
  tag: 'heading' | 'paragraph' | 'image';
  inner: string;
  src?: string;
  alt?: string;
};

const TOP_LEVEL_REGEX = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>|<p[^>]*>([\s\S]*?)<\/p>|<img[^>]*>/gi;
const IMG_SRC_REGEX = /src=["']([^"']+)["']/i;
const IMG_ALT_REGEX = /alt=["']([^"]*)["']/i;

function extractTopLevelNodes(rawHtml: string): RawNode[] {
  if (!rawHtml) return [];

  const nodes: RawNode[] = [];
  let match: RegExpExecArray | null;

  while ((match = TOP_LEVEL_REGEX.exec(rawHtml)) !== null) {
    const full = match[0];

    if (/^<h[1-3]/i.test(full)) {
      const inner = match[2] ?? '';
      if (inner.trim()) {
        nodes.push({ tag: 'heading', inner });
      }
      continue;
    }

    if (/^<p/i.test(full)) {
      const inner = match[3] ?? '';
      const imgMatch = inner.match(/<img[^>]*>/i);
      const textOnly = inner
        .replace(/<img[^>]*>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();

      if (imgMatch && !textOnly) {
        const src = imgMatch[0].match(IMG_SRC_REGEX)?.[1] ?? '';
        const alt = imgMatch[0].match(IMG_ALT_REGEX)?.[1] ?? '';
        if (src) nodes.push({ tag: 'image', inner: '', src, alt });
      } else if (inner.trim()) {
        nodes.push({ tag: 'paragraph', inner });
      }
      continue;
    }

    if (/^<img/i.test(full)) {
      const src = full.match(IMG_SRC_REGEX)?.[1] ?? '';
      const alt = full.match(IMG_ALT_REGEX)?.[1] ?? '';
      if (src) nodes.push({ tag: 'image', inner: '', src, alt });
    }
  }

  return nodes;
}

export function parseArticleContent(rawHtml: string): ArticleContentBlock[] {
  const nodes = extractTopLevelNodes(rawHtml);
  const blocks: ArticleContentBlock[] = [];
  let imageIndex = 0;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.tag === 'heading') {
      blocks.push({ type: 'heading', html: node.inner });
      continue;
    }

    if (node.tag === 'image') {
      const prev = nodes[i - 1];
      const next = nodes[i + 1];

      // If image follows a paragraph that hasn't been paired yet, create pair
      if (prev && prev.tag === 'paragraph' && blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock.type === 'paragraph') {
          // Replace the paragraph with a pair
          blocks.pop();
          const reverse = imageIndex % 2 === 1;
          imageIndex++;
          blocks.push({
            type: 'pair',
            html: lastBlock.html,
            src: node.src ?? '',
            alt: node.alt ?? '',
            reverse,
          });
          continue;
        }
      }

      // If image is followed by a paragraph, create pair
      if (next && next.tag === 'paragraph') {
        const reverse = imageIndex % 2 === 1;
        imageIndex++;
        blocks.push({
          type: 'pair',
          html: next.inner,
          src: node.src ?? '',
          alt: node.alt ?? '',
          reverse,
        });
        i++;
        continue;
      }

      // Standalone image
      imageIndex++;
      blocks.push({ type: 'image', src: node.src ?? '', alt: node.alt ?? '' });
      continue;
    }

    if (node.tag === 'paragraph') {
      const next = nodes[i + 1];

      if (next && next.tag === 'image') {
        const reverse = imageIndex % 2 === 1;
        imageIndex++;
        blocks.push({
          type: 'pair',
          html: node.inner,
          src: next.src ?? '',
          alt: next.alt ?? '',
          reverse,
        });
        i++;
        continue;
      }

      blocks.push({ type: 'paragraph', html: node.inner });
    }
  }

  return blocks;
}
