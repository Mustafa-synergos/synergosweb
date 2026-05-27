import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getServices } from '../../lib/strapi';

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    const servicesData = await getServices();
    services = servicesData.data || [];
  } catch (error) {
    console.warn('Failed to fetch services:', error);
  }
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-slate-950/90 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <h1 className="text-4xl font-bold text-white mb-4">Services</h1>
          <p className="text-lg text-slate-300 mb-8">Professional-grade content and product positioning to move teams forward.</p>

          <div className="mt-12">
            <p className="text-slate-400">Services content coming soon...</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 lg:px-10">
        <div className="glass-panel rounded-[2rem] border border-white/10 p-10 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Integrated approach</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Services that align with your full digital experience.</h2>
          <p className="mt-6 leading-8 text-slate-300">
            Showcase every service with thoughtful layout, distinct brand positioning, and deeply curated content — powered by a connected CMS backend.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
