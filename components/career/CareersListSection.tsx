import { getCareers } from '@/lib/strapi';
import CareersFooterSection from '@/components/career/CareersFooterSection';
import CareersHeroSection from '@/components/career/CareersHeroSection';
import OpenRolesSection from '@/components/career/OpenRolesSection';
import {
  DEFAULT_CAREERS_LIST_SECTION,
  type CareersListSectionData,
} from '@/types/career-sections';

type CareersListSectionProps = {
  data?: CareersListSectionData | null;
};

export default async function CareersListSection({ data }: CareersListSectionProps) {
  const content = data ?? DEFAULT_CAREERS_LIST_SECTION;
  let careers: Awaited<ReturnType<typeof getCareers>> = [];

  try {
    careers = await getCareers();
  } catch (error) {
    console.error('Failed to load careers from Strapi:', error);
  }

  return (
    <>
      <CareersHeroSection content={content} />
      <OpenRolesSection content={content} careers={careers} />
      <CareersFooterSection content={content} />
    </>
  );
}
