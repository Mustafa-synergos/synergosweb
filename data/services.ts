export interface Service {
  id: number;
  number: string;
  title: string;
  description: string;
  illustration: string;
  slug?: string;
  detail?: ServiceDetailContent;
}

export interface ServiceDetailContent {
  heroImage: string;
  heroImageMobile?: string;
  intro: {
    heading: string;
    lead: string;
    body: string;
    para?: string;
    image: string;
    ctas?: { displayText: string; hoverText: string; link: string; targetSlug?: string | null }[];
  };
  approach: {
    eyebrow: string;
    heading: string;
    lead: string;
    body: string;
    image: string;
  };
  capabilities: {
    eyebrow: string;
    heading: string;
    image: string;
    items: {
      title: string;
      body: string;
      image?: string;
    }[];
  };
  caseStudies: {
    label: string;
    title: string;
    cards: {
      category: string;
      title: string;
      description: string;
      date: string;
      link?: string;
    }[];
  };
  expertise: {
    eyebrow: string;
    heading: string;
    items: {
      title: string;
      icon: string;
      description?: string;
      link?: string;
    }[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  /** CMS FAQ band copy (optional so static entries stay valid). */
  faqEyebrow?: string;
  faqHeading?: string;
  /**
   * CMS enquiry band (`services.enquiry-form` DZ component) — the exact
   * contact form section. Optional so static entries stay valid; the mapper
   * always provides contact defaults when the band is present in the DZ.
   */
  enquiry?: {
    Heading: string;
    Subtitle?: string | null;
    SubmitCTA?: {
      DisplayText?: string | null;
      HoverText?: string | null;
      Link?: string | null;
      IsOpenNewTab?: boolean | null;
      Magnetic?: boolean | null;
    } | null;
    ThankYouPath?: string | null;
    BackgroundImageUrl?: string | null;
  };
}


export const services: Service[] = [
  {
    id: 1,
    number: "01",
    title: "Web Development & Web Technologies",
    description: "A slow, broken, or forgettable website is a quiet business problem. We build platforms that load fast, hold up under pressure, and give every visitor a reason to stay and come back.",
    illustration: "/images/illustrations/Web Development & Web Technologies.svg",
    slug: "/services/web-development-and-web-technologies",
  },
  {
    id: 2,
    number: "02",
    title: "Social Media Management",
    description: "Showing up once is easy. Showing up consistently, creatively, and on-brand across every platform is the work. We do that work, so your brand is always present, always recognisable, and always worth following.",
    illustration: "/images/illustrations/Social Media Management.svg",
    slug: "/services/social-media-management",
  },
  {
    id: 3,
    number: "03",
    title: "Search Engine Optimisation",
    description: "Your next customer is already searching. The question is whether they find you or your competitor. We build the organic visibility that puts your brand in front of the right people reliably, and for the long run.",
    illustration: "/images/illustrations/Search Engine Optimisation.svg",
    slug: "/services/search-engine-optimisation",
  },
  {
    id: 4,
    number: "04",
    title: "Performance Marketing",
    description: "Good instincts are a start. Data is better. We run campaigns where every decision is backed by numbers, every rupee is tracked to an outcome, and every cycle leaves the next one with more to work with.",
    illustration: "/images/illustrations/Performance Marketing.svg",
    slug: "/services/performance-marketing",
  },
  {
    id: 5,
    number: "05",
    title: "Online Media Planning & Buying",
    description: "The best media buy is the one your audience never realises was planned. We put your brand in the right environment, at the right moment, with enough frequency to matter, and not a rupee more than necessary.",
    illustration: "/images/illustrations/Online Media Planning & Buying.svg",
    slug: "/services/online-media-planning-and-buying"
  },
  {
    id: 6,
    number: "06",
    title: "Influencer Marketing & Management",
    description: "People trust people. We find the creators whose audiences overlap with your customers, build the briefs that give them room to be genuine, and manage everything from outreach to reporting, so the partnership earns its place.",
    illustration: "/images/illustrations/Influencer Marketing & Management.svg",
    slug: "/services/influencer-marketing-and-management"
  },
  {
    id: 7,
    number: "07",
    title: "Quick Commerce Marketing & Optimisation",
    description: "The shelf lives on a screen, and the decision takes three seconds. We optimise your presence online so that when someone searches your category, your product is the one they find.",
    illustration: "/images/illustrations/Quick Commerce Marketing & Optimisation.svg",
    slug: "/services/quick-commerce-marketing-and-optimisation"
  },
  {
    id: 8,
    number: "08",
    title: "AI Strategy & Consultancy",
    description: "AI is already inside your competitors' workflows. We help you understand where it creates the most leverage in yours, and build the roadmap, the integrations, and the team capability to make it stick.",
    illustration: "/images/illustrations/AI Strategy & Consultancy.svg",
    slug: "/services/ai-strategy-and-consultancy"
  },
  {
    id: 9,
    number: "09",
    title: "Branding & Identity",
    description: "Before anyone reads a word, they have already formed an opinion. We build the visual,accompanying and verbal identity that shapes that opinion, giving your brand a mark, a voice, and a presence that holds across every touchpoint.",
    illustration: "/images/illustrations/Branding & Identity.svg",
    slug: "/services/branding-and-identity",
  },
  {
    id: 10,
    number: "10",
    title: "Offline Print & Media Buying",
    description: "Not every powerful brand moment happens on a screen. We plan and buy offline media, design print that demands attention, and put your brand in the physical spaces where your audience actually lives.",
    illustration: "/images/illustrations/Offline Print & Media Buying.svg",
    slug: "/services/offline-print-and-media-buying",
  },
  {
    id: 11,
    number: "11",
    title: "Brand Films & Multimedia Production",
    description: "A great film does not just communicate; it makes people feel something they did not expect. We conceptualise, script, produce, and deliver brand films and multimedia content that earn their place in the memory, not just the feed.",
    illustration: "/images/illustrations/Brand Films & Multimedia Production.svg",
    slug: "/services/brand-films-and-multimedia-production"
  }
];
