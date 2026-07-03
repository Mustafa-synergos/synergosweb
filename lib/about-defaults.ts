import type {
  AboutConnectCtaSectionData,
  AscentSectionData,
  IndustriesSectionData,
  StoryOfFlightSectionData,
  SynergyPrincipleSectionData,
} from '@/types/about-sections';

export const DEFAULT_STORY_OF_FLIGHT: StoryOfFlightSectionData = {
  __component: 'pages.story-of-flight-section',
  Heading: 'A STORY OF\nFLIGHT.',
  Subtitle:
    'You bring the ambition. We bring the compass, the fuel, and the thrust.',
  ParagraphOne:
    'Synergos is a brand acceleration system, a full-service creative and marketing partner built for brands that refuse to stay in one place. We work across strategy, branding, social media, performance marketing, web development, film production, and offline, not as separate departments passing work between them, but as one integrated engine firing together.',
  ParagraphTwo:
    'For over 16 years, we have partnered with founders navigating their first launch and marketing leaders managing their hundredth. Across fintech, fitness, healthcare, hospitality, education, manufacturing, and much, much more. The industries change. The commitment does not: every brand we touch is treated as a singular mission.',
  PrimaryCTA: {
    DisplayText: 'SEE OUR WORK',
    HoverText: 'SEE OUR WORK',
    Link: '/projects',
  },
  SecondaryCTA: {
    DisplayText: 'TALK TO US',
    HoverText: 'TALK TO US',
    Link: '/contact',
  },
  IllustrationPath: '/images/about/a-story-vector-1.png',
  BackgroundVectorPath: '/images/about/a-story-vector-background-1.svg',
};

export const DEFAULT_SYNERGY_PRINCIPLE: SynergyPrincipleSectionData = {
  __component: 'pages.synergy-principle-section',
  Heading: 'THE SYNERGY PRINCIPLE.\nTHREE PILLARS, ONE SYSTEM.',
  Subtitle: 'Every engagement at Synergos is built on three pillars that work in concert.',
  FooterLineOne: 'WHEN ALL THREE FIRE TOGETHER, BRANDS MOVE.',
  FooterLineTwo: '',
  DecorVectorPath: '/images/about/the-synergy-vector.png',
  BackgroundImagePath: '/images/about/background-image.webp',
  Pillars: [
    {
      Title: 'Strategy.',
      Subtitle: 'The Compass.',
      Description:
        'Before ignition, there must be sight. We excavate the deeper truths buried in data, behaviour, and market friction. Who is the audience, really? Where does the brand sit, and where should it? What is the gap between where it is and where it needs to be? Strategy answers the fundamental question',
      LinkText: 'why?',
    },
    {
      Title: 'Storytelling.',
      Subtitle: 'The Fuel.',
      Description:
        'A strategy without narrative is a map without roads. We build identities, craft visual systems, and create the brand world that makes a business impossible to confuse with anyone else. Storytelling answers the question that matters most',
      LinkText: 'how will they feel?',
    },
    {
      Title: 'Delivery.',
      Subtitle: 'The Thrust.',
      Description:
        'A vision without velocity remains a dream. From social media to performance marketing, from websites to film production, from SEO to outdoor: we execute with precision and measure everything. Delivery answers the question',
      LinkText: 'what happens now?',
    },
  ],
};

export const DEFAULT_ASCENT: AscentSectionData = {
  __component: 'pages.ascent-section',
  Eyebrow: 'The Ascension principle',
  Heading: 'ASCENT IS NOT LUCK.\nIT IS DESIGNED.',
  ParagraphOne:
    'We look at every brand through six intersecting domains: Culture, Observation, Psychology, Design, Technology, and Brand, all aligned around one centre: the consumer.',
  ParagraphTwo:
    'Most agencies pick one or two of these lenses. We use all six, simultaneously, because a brand that is culturally resonant but technologically behind will plateau. A brand with beautiful design but no psychological hook will be forgotten. A brand with sharp technology but no cultural awareness will feel cold.',
  ParagraphThree:
    'Line all six up around the consumer, and ascent stops being a matter of luck. It becomes a matter of design.',
  DiagramPath: '/images/about/ascent-is-not-luck-image.webp',
  BackgroundVectorPath: '/images/about/The Ascension principle-vector.png',
};

export const DEFAULT_INDUSTRIES: IndustriesSectionData = {
  __component: 'pages.industries-section',
  Eyebrow: 'Industries we work across',
  Heading: 'PRESENCE ACROSS INDUSTRIES.\nDEPTH WITHIN EACH.',
  Description:
    'Fintech & Financial Services · Fitness & Wellness · Healthcare & Pharmaceuticals · Hospitality & F&B · Education & EdTech · Manufacturing · Real Estate & Infrastructure · Retail & E-Commerce · Professional Services · Non-Profit & Social Enterprise\n\nWe bring the same rigour, curiosity, and commitment to every industry we enter, and to stay long enough to genuinely understand it.',
  CTA: {
    DisplayText: 'SEE WHO WE WORK WITH',
    HoverText: 'SEE WHO WE WORK WITH',
    Link: '/projects',
  },
  RowOne: [
    { Label: 'Fintech & Financial Services' },
    { Label: 'Fitness & Wellness' },
    { Label: 'Healthcare & Pharmaceuticals' },
    { Label: 'Hospitality & F&B' },
    { Label: 'Education & EdTech' },
    { Label: 'Manufacturing' },
    { Label: 'Real Estate & Infrastructure' },
    { Label: 'Retail & E-Commerce' },
  ],
  RowTwo: [
    { Label: 'Professional Services' },
    { Label: 'Non-Profit & Social Enterprise' },
    { Label: 'Fintech & Financial Services' },
    { Label: 'Fitness & Wellness' },
    { Label: 'Healthcare & Pharmaceuticals' },
    { Label: 'Hospitality & F&B' },
    { Label: 'Education & EdTech' },
    { Label: 'Manufacturing' },
  ],
};

export const DEFAULT_ABOUT_CONNECT: AboutConnectCtaSectionData = {
  __component: 'pages.about-connect-cta-section',
  Eyebrow: "Let's connect",
  Heading: 'YOUR NEXT GROWTH\nPLATFORM IS HERE.',
  Description:
    'We have spent over 16 years perfecting the mechanics of brand acceleration: imagination, craft, dexterity, and sheer will. Whatever is next for your brand, we are ready to build it with you.',
  EmailPlaceholder: 'your email id here',
  PrimaryCTA: {
    DisplayText: "LET'S LIFT OFF",
    HoverText: "LET'S LIFT OFF",
    Link: '/contact',
  },
  VectorPath: '/images/about/lets-connect-vector-1.svg',
  BackgroundImagePath: '/images/about/background-image.webp',
};

const PILLAR_CARD_TRANSFORMS = [
  'origin-center -rotate-[0deg] lg:-translate-y-2 lg:-rotate-[4deg] sm:-rotate-[4deg]',
  'origin-center rotate-[0deg] lg:-translate-y-12 lg:rotate-[4deg] sm:rotate-[4deg]',
  'origin-center -rotate-[0deg] lg:translate-y-1 lg:-rotate-[4deg] sm:-rotate-[4deg]',
];

export function getPillarCardTransformClass(index: number) {
  return PILLAR_CARD_TRANSFORMS[index % PILLAR_CARD_TRANSFORMS.length];
}
