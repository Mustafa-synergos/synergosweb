import type { Metadata } from 'next';

import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import TeamGrid from '@/components/team/TeamGrid';
import { getTeam } from '@/lib/strapi';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Team | Synergos',
    description: 'Meet the people behind Synergos.',
  };
}

export default async function TeamPage() {
  let team = null;
  let members: any[] = [];

  try {
    team = await getTeam();
    members = team?.data ?? [];
  } catch (error) {
    console.error('Failed to load team members from Strapi:', error);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-20 lg:py-28">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
          <div className="mb-12 max-w-2xl sm:mb-16 lg:mb-20">
            <span className="mb-4 block font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-[#ff202a] sm:text-[20px] sm:leading-[100%] lg:text-[28px]">
              People
            </span>
            <h1 className="mb-6 font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white sm:text-[80px] sm:leading-[82px] lg:text-[100px] lg:leading-[100px]">
              OUR TEAM
            </h1>
            <p className="max-w-[720px] font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-[#AEAEAE] sm:text-[18px] sm:leading-[26px]">
              The strategists, storytellers, and builders who make the work
              possible.
            </p>
          </div>

          <TeamGrid members={members} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
