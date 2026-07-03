import { getCareers } from '@/lib/strapi';
import OpenRolesSection from '@/components/career/OpenRolesSection';
import type { CareerOpenRolesSectionData } from '@/types/career-sections';

type Props = {
  data: CareerOpenRolesSectionData;
};

export default async function OpenRolesSectionServer({ data }: Props) {
  let careers: Awaited<ReturnType<typeof getCareers>> = [];

  try {
    careers = await getCareers();
  } catch (error) {
    console.error('Failed to load careers from Strapi:', error);
  }

  return <OpenRolesSection content={data} careers={careers} />;
}
