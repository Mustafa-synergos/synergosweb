import { getCaseStudies } from '@/lib/strapi';
import CaseStudyCard from '@/components/case-studies/CaseStudyCard';
import CTA from '@/components/shared/CTA';
import DotsSection from '@/components/shared/DotsSection';

export default async function CaseStudiesSection() {
  let caseStudies: Awaited<ReturnType<typeof getCaseStudies>> = [];

  try {
    const all = await getCaseStudies();
    caseStudies = all.slice(0, 6);
  } catch {
    // render empty state
  }

  return (
    <DotsSection className="bg-[#111111] py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-0">
        {/* Header row */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none text-white">
            CASE STUDIES
          </h2>
          <CTA displayText="EXPLORE MORE" hoverText="EXPLORE MORE" link="/resources/case-studies" />
        </div>

        {/* Cards grid: 3 columns on large, 2 on sm, 1 on mobile */}
        {caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs, i) => (
              <CaseStudyCard
                key={cs.documentId ?? cs.id ?? i}
                caseStudy={cs}
                index={i}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40">No case studies available.</p>
        )}
      </div>
    </DotsSection>
  );
}
