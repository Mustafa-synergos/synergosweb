import RichText from '@/components/shared/RichText';
import {
  DEFAULT_RICH_TEXT_SECTION,
  type RichTextSectionData,
} from '@/types/rich-text';

type RichTextSectionProps = {
  data?: RichTextSectionData | null;
};

export default function RichTextSection({ data }: RichTextSectionProps) {
  const content = data ?? DEFAULT_RICH_TEXT_SECTION;

  return (
    <section className="bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-8 sm:py-16 lg:px-0 lg:py-20">
        <RichText content={content.Content} className={content.Class ?? ''} />
      </div>
    </section>
  );
}
