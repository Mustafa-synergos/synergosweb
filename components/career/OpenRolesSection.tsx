import Image from 'next/image';
import Link from 'next/link';
import InteractiveDots from '@/components/home/InteractiveDots';
import type { CareerData } from '@/types/career-sections';

type OpenRolesContent = {
  OpenRolesHeading?: string | null;
};

type OpenRolesSectionProps = {
  content: OpenRolesContent;
  careers: CareerData[];
};

export default function OpenRolesSection({ content, careers }: OpenRolesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <InteractiveDots variant="dark" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-8 sm:py-20 lg:px-0 lg:py-24">
        <h2 className="text-[42px] font-semibold leading-[1.03] tracking-[-0.03em] text-white sm:text-[48px] lg:text-[56px]">
          {content.OpenRolesHeading ?? 'Open roles'}
        </h2>

        {careers.length > 0 ? (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {careers.map((career) => (
              <Link
                key={career.Slug}
                href={`/careers/${career.Slug}`}
                className="group flex flex-col rounded-[16px] border border-white/10 bg-[#0D0D0D] p-5 transition-all duration-300 hover:border-white/20"
              >
                <h3 className="min-h-[3.5rem] text-[20px] normal-case leading-snug text-white">
                  {career.Title}
                </h3>

                {career.ShortDescription && (
                  <p className="mt-4 line-clamp-2 text-[16px] leading-relaxed text-[#AEAEAE]">
                    {career.ShortDescription}
                  </p>
                )}

                <div className="flex-1" />


                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/career/job-icon-.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="shrink-0"
                    />
                    <span className="text-[16px] text-[#AEAEAE]">
                      {career.ExperienceYears ?? '2-3 Years'}
                    </span>
                  </div>

                  <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src="/images/career/arrow-.svg"
                      alt=""
                      width={28}
                      height={28}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-[#AEAEAE]">
            No open roles at the moment. Check back soon or reach out below.
          </p>
        )}
      </div>
    </section>
  );
}
