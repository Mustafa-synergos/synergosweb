import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getProjects } from '../../lib/strapi';

export default async function ProjectsPage() {
  let items: any[] = [];
  try {
    const projects = await getProjects();
    items = projects.data || [];
  } catch (error) {
    console.warn('Failed to fetch projects:', error);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
          <p className="text-lg text-slate-300 mb-8">Current work and recent launches from the Synergos showcase.</p>

          <div className="mt-12">
            <p className="text-slate-400">Projects content coming soon...</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
