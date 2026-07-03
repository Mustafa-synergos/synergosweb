import type { ReactNode } from 'react';
import type {
  RichTextBlockNode,
  RichTextInlineNode,
  RichTextLinkNode,
} from '@/types/rich-text';

type RichTextProps = {
  content?: RichTextBlockNode[] | null;
  className?: string;
  paragraphClassName?: string;
  headingClassName?: string;
};

function renderInline(nodes: (RichTextInlineNode | RichTextLinkNode)[]) {
  return nodes.map((node, index) => {
    if (node.type === 'link') {
      const isExternal =
        node.url.startsWith('http') || node.url.startsWith('mailto:');

      return (
        <a
          key={`link-${index}`}
          href={node.url}
          className="text-white underline decoration-white/50 underline-offset-4 transition-colors hover:text-[#FF0000] hover:decoration-[#FF0000]"
          {...(isExternal && node.url.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {renderInline(node.children)}
        </a>
      );
    }

    let text: ReactNode = node.text;

    if (node.bold) {
      text = <strong className="font-normal text-white">{text}</strong>;
    }
    if (node.italic) {
      text = <em>{text}</em>;
    }
    if (node.underline) {
      text = <span className="underline">{text}</span>;
    }

    return <span key={`text-${index}`}>{text}</span>;
  });
}

function renderBlock(
  block: RichTextBlockNode,
  index: number,
  headingClassName?: string,
  paragraphClassName?: string,
  isJobDescription?: boolean
) {
  const blockClassName = block.class?.trim() ?? '';

  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      const defaultHeadingClass =
        block.level <= 2
          ? 'mt-10 first:mt-0 text-[18px] font-normal leading-[1.3] text-white sm:mt-12 sm:text-[20px]'
          : 'mt-8 text-base font-normal text-white sm:text-lg';
      const jobDescriptionHeadingClass =
        block.level === 2
          ? 'mt-10 first:mt-0 text-[20px] font-normal leading-[1.3] text-white sm:mt-12 sm:text-[32px] lg:text-[44px]'
          : block.level === 3
          ? 'mt-8 text-[18px] font-normal text-white sm:text-[20px] lg:text-[28px]'
          : defaultHeadingClass;
      const headingClass =
        `${isJobDescription ? jobDescriptionHeadingClass : defaultHeadingClass} ${headingClassName ?? ''} ${blockClassName}`.trim();

      return (
        <Tag key={`heading-${index}`} className={headingClass}>
          {renderInline(block.children)}
        </Tag>
      );
    }

    case 'list':
      return block.format === 'ordered' ? (
        <ol
          key={`list-${index}`}
          className={`ml-5 list-decimal space-y-2 text-[#AEAEAE] ${blockClassName}`.trim()}
        >
          {block.children.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`}>{renderInline(item.children)}</li>
          ))}
        </ol>
      ) : (
        <ul
          key={`list-${index}`}
          className={`ml-5 list-disc space-y-2 text-[#AEAEAE] ${blockClassName}`.trim()}
        >
          {block.children.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`}>{renderInline(item.children)}</li>
          ))}
        </ul>
      );

    case 'paragraph':
    default:
      return (
        <p
          key={`paragraph-${index}`}
          className={`text-[15px] font-light leading-[1.7] text-[#AEAEAE] sm:text-[16px] sm:leading-[1.75] ${paragraphClassName ?? ''} ${blockClassName}`.trim()}
        >
          {renderInline(block.children)}
        </p>
      );
  }
}

export default function RichText({
  content,
  className = '',
  paragraphClassName,
  headingClassName,
}: RichTextProps) {
  if (!content?.length) {
    return null;
  }

  const isJobDescription = className.split(' ').includes('jd');

  return (
    <div className={`rich-text space-y-5 break-words sm:space-y-6 ${className}`.trim()}>
      {content.map((block, index) =>
        renderBlock(
          block,
          index,
          headingClassName,
          paragraphClassName,
          isJobDescription
        )
      )}
    </div>
  );
}
