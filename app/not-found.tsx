import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import NotFoundSection from '@/components/shared/NotFoundSection';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <NotFoundSection />
      <Footer />
    </main>
  );
}
