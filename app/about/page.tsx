import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getTeam } from '../../lib/strapi';

const pillars = [
  { title: 'Clarity', description: 'Clear product storytelling and streamlined team pages keep your messaging sharp.' },
  { title: 'Growth', description: 'A refined content platform built to support launches, updates, and new offerings.' },
  { title: 'Trust', description: 'Premium UI details and polished motion create a memorable first impression.' }
];

export default async function AboutPage() {
  let teamMembers: any[] = [];
  try {
    const teamData = await getTeam();
    teamMembers = teamData.data || [];
  } catch (error) {
    console.warn('Failed to fetch team data:', error);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-slate-950/90 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-soft backdrop-blur-xl">
            <h1 className="text-4xl font-bold text-white mb-4">About Synergos</h1>
            <p className="text-lg text-slate-300 mb-8">Built to help modern teams launch bold work with confidence.</p>
            <p className="text-slate-300 mb-10">We create polished collaboration touchpoints that help teams showcase products, services, and stories with clarity and premium polish.</p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-3xl bg-slate-950/80 p-6 shadow-lg shadow-slate-950/40">
                  <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-4 text-slate-300">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="glass-panel rounded-[2rem] border border-white/10 p-10 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Our mission</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Deliver digital experiences that feel effortless and confident.</h2>
            <p className="mt-6 leading-[1.5] text-slate-300">
              Synergos helps brands and agencies align their product narrative with service positioning, empowering teams to ship announcements, case studies, and internal launches with ease.
            </p>
          </div>

          <div className="space-y-6 rounded-[2rem] bg-slate-900/70 p-10 shadow-soft">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Design system</p>
              <p className="mt-3 text-xl font-semibold text-white">High-quality components for product and marketing pages.</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Developer-first</p>
              <p className="mt-3 text-xl font-semibold text-white">Modern architecture powered by Next.js App Router and Strapi content APIs.</p>
            </div>
          </div>
        </div>
      </section>

      {teamMembers.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold text-white mb-4">Our Team</h2>
          <p className="text-lg text-slate-300 mb-8">Meet the people behind Synergos</p>
          <p className="text-slate-300 mb-12">Talented individuals working together to create exceptional digital experiences.</p>
          
          <div className="mt-12">
            <p className="text-slate-400">Team content coming soon...</p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
