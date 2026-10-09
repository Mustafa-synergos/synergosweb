import type {
  Category,
  PaidAdCreative,
  Project,
  ProjectCategorySlug,
  ProjectType,
  SocialMediaPost,
  VideoMedia,
} from '@/types/work';

export const WORK_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', type: 'web' },
  { id: 'web-app', label: 'Web & App', type: 'web' },
  { id: 'brochures', label: 'Brochures', type: 'brochures' },
  { id: 'social-media', label: 'Social Media Creatives', type: 'social' },
  { id: 'paid-ads', label: 'Paid Ads', type: 'paid-ads' },
  { id: 'videos', label: 'Videos', type: 'video' },
  { id: 'branding', label: 'Branding', type: 'branding' },
];

export const CATEGORY_MAP: Record<ProjectCategorySlug, Category> = {
  all: WORK_CATEGORIES[0],
  'web-app': WORK_CATEGORIES[1],
  brochures: WORK_CATEGORIES[2],
  'social-media': WORK_CATEGORIES[3],
  'paid-ads': WORK_CATEGORIES[4],
  videos: WORK_CATEGORIES[5],
  branding: WORK_CATEGORIES[6],
};

export const CATEGORY_BY_TYPE: Record<ProjectType, ProjectCategorySlug> = {
  web: 'web-app',
  brochures: 'brochures',
  social: 'social-media',
  'paid-ads': 'paid-ads',
  video: 'videos',
  branding: 'branding',
};

const mediaBase = '/images/Our work';

const posts: SocialMediaPost[] = [
  { url: `${mediaBase}/image-1.webp`, platform: 'instagram', alt: 'HAPPY GANESHA CHATURTHI Instagram post' },
  { url: `${mediaBase}/image-2.webp`, platform: 'facebook', alt: 'Facebook creative 1' },
  {
    url: `${mediaBase}/image-3.webp`, platform: 'linkedin', alt: 'LinkedIn creative 1' },
  { url: `${mediaBase}/image-4.webp`, platform: 'instagram', alt: 'Instagram creative 2' },
];

const paidAdCreatives: PaidAdCreative[] = [
  { url: `${mediaBase}/image-3.webp`, platform: 'google', headline: 'Channel Loyalty Solutions', description: 'Grow brand preference, ROI & market share' },
  { url: `${mediaBase}/image-1.webp`, platform: 'facebook', headline: 'HAPPY GANESHA CHATURTHI', description: 'Festival social media campaign' },
  { url: `${mediaBase}/image-2.webp`, platform: 'instagram', headline: 'Kern Kreare', description: 'Brand launch creative' },
];

const discoverVideo: VideoMedia = {
  url: `${mediaBase}/image-6.webp`,
  alt: 'Kern Kreare brand film',
  provider: 'mp4',
  videoUrl: `${mediaBase}/image-6.webp`,
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'ganesha-chaturthi',
    title: 'HAPPY GANESHA CHATURTHI',
    shortTitle: 'Ganesha Chaturthi',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    category: WORK_CATEGORIES[3],
    client: 'Tour of Karnataka',
    year: '2024',
    type: 'social',
    coverImage: { url: `${mediaBase}/image-1.webp`, alt: 'HAPPY GANESHA CHATURTHI social media creative' },
    coverAspectClass: 'aspect-square',
    socialPosts: posts,
  },
  {
    id: 2,
    slug: 'kern-kreare',
    title: 'Kern Kreare',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    category: WORK_CATEGORIES[6],
    client: 'Kern Kreare',
    year: '2024',
    type: 'branding',
    coverImage: { url: `${mediaBase}/image-2.webp`, alt: 'Kern Kreare brand identity' },
    coverAspectClass: 'aspect-square',
    brandingAssets: [
      { url: `${mediaBase}/image-2.webp`, kind: 'logo', alt: 'Kern Kreare logo' },
      { url: `${mediaBase}/image-6.webp`, kind: 'mockups', alt: 'Brand mockup' },
    ],
  },
  {
    id: 5,
    slug: 'kia-employee-handbook',
    title: 'KIA Employee Handbook',
    description: 'A premium digital handbook designed for KIA employees with rich visuals and intuitive navigation.',
    category: WORK_CATEGORIES[2],
    client: 'KIA',
    year: '2023',
    type: 'brochures',
    coverImage: { url: `${mediaBase}/image-5.webp`, alt: 'KIA Employee Handbook cover' },
    coverAspectClass: 'aspect-square',
    brochurePages: [
      { url: `${mediaBase}/image-1.webp`, pageNumber: 1 },
      { url: `${mediaBase}/image-2.webp`, pageNumber: 2 },
      { url: `${mediaBase}/image-3.webp`, pageNumber: 3 },
      { url: `${mediaBase}/image-4.webp`, pageNumber: 4 },
      { url: `${mediaBase}/image-5.webp`, pageNumber: 5 },
      { url: `${mediaBase}/image-6.webp`, pageNumber: 6 },
    ],
  },
  {
    id: 3,
    slug: 'bi-worldwide-ads',
    title: 'BI WORLDWIDE',
    shortTitle: 'Channel Loyalty Campaign',
    description: 'Grow your brand preference, ROI & market share with innovative Channel Loyalty Solutions.',
    category: WORK_CATEGORIES[4],
    client: 'BI Worldwide',
    year: '2024',
    type: 'paid-ads',
    coverImage: { url: `${mediaBase}/image-3.webp`, alt: 'BI Worldwide paid ads creative' },
    coverAspectClass: 'aspect-square',
    paidAdCreatives,
  },
  {
    id: 6,
    slug: 'brand-film-kern-kreare',
    title: 'Kern Kreare Brand Film',
    description: 'A cinematic brand film capturing the essence of Kern Kreare.',
    category: WORK_CATEGORIES[5],
    client: 'Kern Kreare',
    year: '2024',
    type: 'video',
    coverImage: { url: `${mediaBase}/image-6.webp`, alt: 'Kern Kreare brand film still' },
    coverAspectClass: 'aspect-square',
    video: discoverVideo,
  },
  {
    id: 4,
    slug: 'discover-platform',
    title: 'Discover Platform',
    description: 'A next-generation digital experience platform designed to streamline discovery and engagement.',
    category: WORK_CATEGORIES[1],
    client: 'Discover Inc.',
    year: '2024',
    type: 'web',
    coverImage: { url: `${mediaBase}/image-4.webp`, alt: 'Discover platform on laptop' },
    coverAspectClass: 'aspect-square',
    heroImage: { url: `${mediaBase}/image-4.webp`, alt: 'Discover platform hero' },
    overview: {
      summary: 'We designed and built a high-performance web platform that combines editorial content, product discovery, and community features into one seamless experience.',
      challenge: 'The client needed a scalable solution that could handle thousands of concurrent users while maintaining a premium, editorial feel.',
      problem: 'Legacy systems were slow, unresponsive, and difficult to maintain, leading to poor user engagement and high bounce rates.',
      solution: 'We delivered a modern Next.js application with a headless CMS, ISR for performance, and a component-driven design system.',
    },
    designApproach: 'Our design process began with deep user research and competitive analysis. We crafted a modular UI system using atomic design principles, ensuring consistency and scalability across all breakpoints.',
    development: {
      summary: 'Built with Next.js 14, React Server Components, and a headless Strapi CMS, the platform is optimized for performance, SEO, and maintainability.',
      technologies: ['React', 'Next.js', 'Node.js', 'Strapi', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
      techStack: [
        { name: 'React', description: 'Component-driven UI library' },
        { name: 'Next.js', description: 'Server-side rendering & static generation' },
        { name: 'Node.js', description: 'Scalable runtime environment' },
        { name: 'Strapi', description: 'Headless CMS for content' },
        { name: 'Tailwind CSS', description: 'Utility-first styling' },
        { name: 'Framer Motion', description: 'Declarative animations' },
      ],
    },
    gallery: [
      { url: `${mediaBase}/image-4.webp`, alt: 'Discover platform screen 1' },
      { url: `${mediaBase}/image-1.webp`, alt: 'Discover platform screen 2' },
      { url: `${mediaBase}/image-5.webp`, alt: 'Discover platform screen 3' },
    ],
    results: [
      { label: 'Page Speed', value: '98', suffix: '/100' },
      { label: 'Conversion Lift', value: '42', suffix: '%' },
      { label: 'Bounce Rate Drop', value: '35', suffix: '%' },
      { label: 'Organic Traffic', value: '2.5', suffix: 'x' },
    ],
    relatedProjectIds: [5, 6, 2],
  },
  {
    id: 7,
    slug: 'synergos-website',
    title: 'Synergos Website',
    description: 'A premium brand experience website built with motion, performance, and scalability in mind.',
    category: WORK_CATEGORIES[1],
    client: 'Synergos',
    year: '2024',
    type: 'web',
    coverImage: { url: `${mediaBase}/image-4.webp`, alt: 'Synergos website' },
    coverAspectClass: 'aspect-square',
    heroImage: { url: `${mediaBase}/image-4.webp`, alt: 'Synergos website hero' },
    overview: {
      summary: 'The Synergos website represents the next evolution of our brand presence, combining cinematic motion with performance engineering.',
      challenge: 'Create a website that communicates complex services while maintaining premium visual storytelling.',
      problem: 'Previous site struggled with slow load times and inconsistent brand expression across devices.',
      solution: 'A Next.js-powered platform with GSAP + Framer Motion, optimized images, and a scalable component architecture.',
    },
    designApproach: 'We developed a dark, cosmic aesthetic with red accents, subtle dot patterns, and fluid transitions that reflect the Synergos brand philosophy.',
    development: {
      summary: 'Server-side rendering, static generation, and dynamic imports keep the experience fast and accessible.',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'Lenis'],
      techStack: [
        { name: 'Next.js', description: 'React framework for production' },
        { name: 'React', description: 'Modern UI library' },
        { name: 'TypeScript', description: 'Type-safe development' },
        { name: 'Tailwind CSS', description: 'Rapid styling system' },
        { name: 'GSAP', description: 'High-performance animation' },
        { name: 'Framer Motion', description: 'React motion library' },
      ],
    },
    gallery: [
      { url: `${mediaBase}/image-4.webp`, alt: 'Synergos home' },
      { url: `${mediaBase}/image-2.webp`, alt: 'Synergos about' },
      { url: `${mediaBase}/image-5.webp`, alt: 'Synergos services' },
    ],
    results: [
      { label: 'Performance Score', value: '99', suffix: '/100' },
      { label: 'Load Time', value: '0.8', suffix: 's' },
      { label: 'Engagement', value: '3.2', suffix: 'x' },
      { label: 'Leads', value: '60', suffix: '%' },
    ],
    relatedProjectIds: [4, 2, 6],
  },
];

export function getProjectsByCategory(
  categoryId: ProjectCategorySlug,
  projects: Project[] = PROJECTS
): Project[] {
  if (categoryId === 'all') return projects;
  return projects.filter((project) => project.category.id === categoryId);
}

export function getProjectBySlug(
  slug: string,
  projects: Project[] = PROJECTS
): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(
  project: Project,
  projects: Project[] = PROJECTS
): Project[] {
  if (!project.relatedProjectIds?.length) return [];
  return projects.filter((p) => project.relatedProjectIds?.includes(p.id) && p.id !== project.id);
}
