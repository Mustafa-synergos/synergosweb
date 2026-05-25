'use client';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhoWeAre from '../components/WhoWeAre';
import AmbitionSection from '../components/AmbitionSection';
import SixThingsSection from '../components/home/SixThingsSection';
import ExponentialImpactSection from '../components/ExponentialImpactSection';
import BrandsThatTrustUs from '../components/BrandsThatTrustUs';
import { LatestFromSynergos } from '../components/LatestFromSynergos';
import { Testimonials } from '../components/Testimonials';
import BeforeFooterCTA from '../components/BeforeFooterCTA';
import SynergyEngine from '../components/SynergyEngine';
// import Crads from '../components/layout/Cards';
// import StickyCards from '../components/StickyCards';

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
      {/* <section>
        <StickyCards />
      </section> */}
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
    </main>
  );
}
