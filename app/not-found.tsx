import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 text-center shadow-soft backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Page not found</p>
          <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Lost in the Synergos experience?</h1>
          <p className="mt-6 text-slate-300 leading-[1.5]">The page you are trying to reach may have moved or does not exist yet. Let’s get you back on track.</p>
          <Link href="/" className="mt-10 inline-flex rounded-3xl bg-sky-400 px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
            Return home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
