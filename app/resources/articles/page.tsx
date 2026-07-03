import type { Metadata } from 'next';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ArticleListingSection from '@/components/articles/ArticleListingSection';

export const metadata: Metadata = {
  title: 'Articles | Synergos',
  description: 'In-depth articles on strategy, branding, and digital marketing from the Synergos team.',
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <ArticleListingSection />
      <Footer />
    </main>
  );
}
