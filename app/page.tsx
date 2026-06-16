import dynamic from "next/dynamic";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhoWeAre from "../components/WhoWeAre";

// Lazy-load heavy below-fold sections to reduce initial bundle and improve TTI
const AmbitionSection = dynamic(() => import("../components/AmbitionSection"), {
  ssr: false,
});
const SynergyEngine = dynamic(() => import("../components/SynergyEngine"), {
  ssr: false,
});
// const SixThingsSection = dynamic(
//   () => import("../components/home/SixThingsSection"),
//   { ssr: false },
// );
const SixThingsSection = dynamic(
  () => import("../components/home/StackedServices"),
  { ssr: false },
);
const ExponentialImpactSection = dynamic(
  () => import("../components/ExponentialImpactSection"),
  { ssr: false },
);
const BrandsThatTrustUs = dynamic(
  () => import("../components/BrandsThatTrustUs"),
  { ssr: false },
);
const LatestFromSynergos = dynamic(
  () =>
    import("../components/LatestFromSynergos").then((m) => ({
      default: m.LatestFromSynergos,
    })),
  { ssr: false },
);
const Testimonials = dynamic(
  () =>
    import("../components/Testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  { ssr: false },
);
const BeforeFooterCTA = dynamic(
  () => import("../components/BeforeFooterCTA"),
  { ssr: false },
);

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
     
        <Navbar />
     
     
        <Hero />
     
     
        <WhoWeAre />
     
     
        <AmbitionSection />
     
     
        <SynergyEngine />
     
     
        <SixThingsSection />
     
     
        <ExponentialImpactSection />
     
     
        <BrandsThatTrustUs />
     
     
        <LatestFromSynergos />
     
     
        <Testimonials />
     
     
        <BeforeFooterCTA />

        <Footer />
     
    </main>
  );
}
