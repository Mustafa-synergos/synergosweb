import CareerApplySection from '@/components/career/CareerApplySection';
import InteractiveDots from '@/components/home/InteractiveDots';
import PageHeroSection from '@/components/shared/PageHeroSection';
import RichTextSection from '@/components/shared/RichTextSection';
import type { CareerSection } from '@/types/career-sections';

type DynamicCareerSectionsProps = {
  sections?: CareerSection[] | null;
  careerTitle: string;
  careerSlug: string;
};

export default function DynamicCareerSections({
  sections,
  careerTitle,
  careerSlug,
}: DynamicCareerSectionsProps) {
  if (!sections?.length) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        const key = section.id ?? `section-${index}`;

        if (section.__component === 'pages.page-hero-section') {
          return <PageHeroSection key={key} data={section} />;
        }

        if (section.__component === 'pages.rich-text-section') {
          return (
            <div key={key} className="relative overflow-hidden">
              <InteractiveDots variant="dark" className="z-0" />
              <div className="relative z-10">
                <RichTextSection data={section} />
              </div>
            </div>
          );
        }

        if (section.__component === 'pages.career-apply-section') {
          return (
            <CareerApplySection
              key={key}
              data={section}
              careerTitle={careerTitle}
              careerSlug={careerSlug}
            />
          );
        }

        return null;
      })}
    </>
  );
}
