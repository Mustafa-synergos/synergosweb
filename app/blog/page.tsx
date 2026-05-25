import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getBlogPosts } from '../../lib/strapi';

export default async function BlogPage() {
  let items: any[] = [];
  try {
    const posts = await getBlogPosts();
    items = posts.data || [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <h1 className="text-4xl font-bold text-white mb-4">Insights</h1>
          <p className="text-lg text-slate-300 mb-8">Stories, guides, and perspective for scaling modern digital collaboration.</p>

          <div className="mt-12">
            <p className="text-slate-400">Blog content coming soon...</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
