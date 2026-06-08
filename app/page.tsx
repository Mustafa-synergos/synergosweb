import dynamic from 'next/dynamic';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhoWeAre from '../components/WhoWeAre';
import { SpeedInsights } from "@vercel/speed-insights/next";

// Lazy-load heavy below-fold sections to reduce initial bundle and improve TTI
const AmbitionSection = dynamic(() => import('../components/AmbitionSection'), { ssr: false });
const SynergyEngine = dynamic(() => import('../components/SynergyEngine'), { ssr: false });
const SixThingsSection = dynamic(() => import('../components/home/SixThingsSection'), { ssr: false });
const ExponentialImpactSection = dynamic(() => import('../components/ExponentialImpactSection'), { ssr: false });
const BrandsThatTrustUs = dynamic(() => import('../components/BrandsThatTrustUs'), { ssr: false });
const LatestFromSynergos = dynamic(() => import('../components/LatestFromSynergos').then(m => ({ default: m.LatestFromSynergos })), { ssr: false });
const Testimonials = dynamic(() => import('../components/Testimonials').then(m => ({ default: m.Testimonials })), { ssr: false });
const BeforeFooterCTA = dynamic(() => import('../components/BeforeFooterCTA'), { ssr: false });

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <section>
        <Navbar />
      </section>
      <section>
        <Hero />
      </section>
      <section>
        <WhoWeAre />
      </section>
      <section>
        <AmbitionSection />
      </section>
      <section>
        <SynergyEngine />
      </section>
      <section>
        <SixThingsSection />
      </section>
      <section>
        <ExponentialImpactSection />
      </section>
      <section>
        <BrandsThatTrustUs />
      </section>
      <section>
        <LatestFromSynergos />
      </section>
      <section>
        <Testimonials />
      </section>
      <section>
        <BeforeFooterCTA />
      </section>
      <section>
        <Footer />
      </section>
        <SpeedInsights />
    </main>
  );
}
