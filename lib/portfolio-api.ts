import { CATEGORY_BY_TYPE, CATEGORY_MAP, WORK_CATEGORIES } from '@/data/work';
import { getStrapiMediaUrl } from '@/lib/strapi-media';
import type {
  BrandingAsset,
  BrochurePage,
  Category,
  GalleryItem,
  Media,
  PaidAdCreative,
  Project,
  ProjectType,
  SocialMediaPost,
  VideoMedia,
} from '@/types/work';

/* ------------------------------------------------------------------ */
/*  Strapi raw response types (verified against live API)              */
/* ------------------------------------------------------------------ */

type StrapiTextChild = {
  type?: string;
  text?: string;
  children?: StrapiTextChild[];
};

type StrapiRichTextBlock = {
  type?: string;
  children?: StrapiTextChild[];
};

type StrapiMedia = {
  id?: number;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  url?: string | null;
};

type StrapiCategory = {
  name?: string | null;
  slug?: string | null;
  isActive?: boolean | null;
};

type StrapiSocialPost = {
  id?: number;
  order?: number | null;
  image?: StrapiMedia | null;
  platform?: SocialMediaPost['platform'] | null;
  caption?: string | null;
};

type StrapiBrochure = {
  id?: number;
  kind?: string | null;
  image?: StrapiMedia[] | null;
};

type StrapiVideoEntry = {
  id?: number;
  thumbnail?: StrapiMedia | null;
  provider?: string | null;
  videoUrl?: string | null;
  upload?: StrapiMedia[] | null;
  alt?: string | null;
};

type StrapiPaidAd = {
  id?: number;
  image?: StrapiMedia[] | null;
  platform?: string | null;
  headline?: string | null;
  description?: string | null;
};

export type StrapiPortfolioProject = {
  id: number;
  documentId?: string;
  title?: string | null;
  slug?: string | null;
  description?: StrapiRichTextBlock[] | string | null;
  projectUrl?: string | null;
  client?: string | null;
  year?: string | null;
  order?: number | null;
  isFeatured?: boolean | null;
  isActive?: boolean | null;
  type?: ProjectType | null;
  thumbnail?: StrapiMedia | null;
  gallery?: StrapiMedia[] | null;
  portfolio_category?: StrapiCategory | null;
  socialPosts?: StrapiSocialPost[] | null;
  brochures?: StrapiBrochure[] | null;
  videoUrl?: StrapiVideoEntry[] | null;
  paidAds?: StrapiPaidAd[] | null;
  Sections?: { __component: string; [key: string]: unknown }[] | null;
};

type PortfolioProjectsResponse = {
  data?: StrapiPortfolioProject[];
};

/* ------------------------------------------------------------------ */
/*  Populate query – deep populates every independent media field      */
/* ------------------------------------------------------------------ */

const POPULATE_QUERY = [
  'populate[thumbnail]=1',
  'populate[gallery]=1',
  'populate[portfolio_category]=1',
  'populate[socialPosts][populate][image]=1',
  'populate[brochures][populate][image]=1',
  'populate[videoUrl][populate][thumbnail]=1',
  'populate[videoUrl][populate][upload]=1',
  'populate[paidAds][populate][image]=1',
  // DZ sections — PRODUCTION-SHAPED (stg.*). Gated: only requested from migrated
  // backends (production Strapi 400s on unknown populate keys).
  // Enable with NEXT_PUBLIC_STRAPI_DZ=1 only against migrated backends.
  ...(process.env.NEXT_PUBLIC_STRAPI_DZ === '1'
    ? [
        'populate[Sections][on][stg.pf-gallery][populate][Gallery][populate][Image]=1',
        'populate[Sections][on][stg.pf-social][populate][SocialPosts][populate][image]=1',
        'populate[Sections][on][stg.pf-brochure][populate][BrochurePages][populate][image]=1',
        'populate[Sections][on][stg.pf-video][populate][Video][populate][thumbnail]=1',
        'populate[Sections][on][stg.pf-video][populate][Video][populate][upload]=1',
        'populate[Sections][on][stg.pf-paidads][populate][PaidAdCreatives][populate][image]=1',
      ]
    : []),
].join('&');

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const FALLBACK_IMAGE = '/images/Our work/image-1.webp';

function getStrapiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ||
    'https://api.synergostech.in'
  );
}

function flattenText(children?: StrapiTextChild[]): string {
  if (!children?.length) return '';
  return children
    .map((child) => child.text ?? flattenText(child.children))
    .filter(Boolean)
    .join('');
}

export function getStrapiText(value?: StrapiRichTextBlock[] | string | null): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value
    .map((block) => flattenText(block.children))
    .filter(Boolean)
    .join('\n\n');
}

/* ------------------------------------------------------------------ */
/*  Media normalizers – only normalize, never choose which field       */
/* ------------------------------------------------------------------ */

function normalizeMedia(media?: StrapiMedia | null, fallbackAlt = ''): Media | null {
  const url = getStrapiMediaUrl(media?.url);
  if (!url) return null;
  return {
    url,
    alt: media?.alternativeText ?? media?.caption ?? media?.name ?? fallbackAlt,
    width: media?.width ?? undefined,
    height: media?.height ?? undefined,
  };
}

function normalizeMediaArray(items?: StrapiMedia[] | null, fallbackAlt = ''): Media[] {
  if (!items?.length) return [];
  return items
    .map((item) => normalizeMedia(item, fallbackAlt))
    .filter((m): m is Media => m !== null);
}

/* ------------------------------------------------------------------ */
/*  Category                                                          */
/* ------------------------------------------------------------------ */

function getProjectCategory(project: StrapiPortfolioProject): Category {
  const byType = project.type ? CATEGORY_MAP[CATEGORY_BY_TYPE[project.type]] : undefined;
  if (byType) return byType;

  const strapiSlug = project.portfolio_category?.slug;
  const bySlug = WORK_CATEGORIES.find((category) => category.id === strapiSlug);
  return bySlug ?? CATEGORY_MAP['web-app'];
}

/* ------------------------------------------------------------------ */
/*  Per-field mappers – each reads ONLY from its own Strapi field     */
/* ------------------------------------------------------------------ */

function mapThumbnail(project: StrapiPortfolioProject): Media {
  const thumb = project.thumbnail ?? null;
  return normalizeMedia(thumb, project.title ?? '') ?? {
    url: FALLBACK_IMAGE,
    alt: project.title ?? '',
  };
}

function mapGallery(project: StrapiPortfolioProject): GalleryItem[] {
  return normalizeMediaArray(project.gallery, project.title ?? 'Portfolio gallery')
    .map((m): GalleryItem => ({ ...m, caption: undefined }));
}

function mapSocialPosts(project: StrapiPortfolioProject): SocialMediaPost[] {
  return (project.socialPosts ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .reduce<SocialMediaPost[]>((posts, post) => {
      const image = normalizeMedia(post.image, post.caption ?? project.title ?? 'Social media post');
      if (!image) return posts;
      posts.push({
        ...image,
        platform: post.platform ?? 'instagram',
        caption: post.caption ?? undefined,
      });
      return posts;
    }, []);
}

function mapBrochurePages(project: StrapiPortfolioProject): BrochurePage[] {
  const pages: BrochurePage[] = [];
  let pageNumber = 1;
  (project.brochures ?? []).forEach((entry) => {
    normalizeMediaArray(entry.image).forEach((img) => {
      pages.push({ ...img, pageNumber: pageNumber++ });
    });
  });
  return pages;
}

function mapVideo(project: StrapiPortfolioProject): VideoMedia | null {
  const entry = project.videoUrl?.[0];
  if (!entry) return null;
  const thumbnail = normalizeMedia(entry.thumbnail, project.title ?? 'Video');
  if (!thumbnail) return null;
  return {
    ...thumbnail,
    provider: (entry.provider as VideoMedia['provider']) ?? 'mp4',
    videoUrl: entry.videoUrl || thumbnail.url,
    thumbnailUrl: thumbnail.url,
  };
}

function mapBrandingAssets(project: StrapiPortfolioProject): BrandingAsset[] {
  const assets: BrandingAsset[] = [];
  (project.brochures ?? []).forEach((entry) => {
    normalizeMediaArray(entry.image).forEach((img) => {
      assets.push({
        ...img,
        kind: (entry.kind as BrandingAsset['kind']) ?? 'mockups',
      });
    });
  });
  return assets;
}

function mapPaidAdCreatives(project: StrapiPortfolioProject): PaidAdCreative[] {
  const creatives: PaidAdCreative[] = [];
  (project.paidAds ?? []).forEach((ad) => {
    normalizeMediaArray(ad.image).forEach((img) => {
      creatives.push({
        ...img,
        platform: (ad.platform as PaidAdCreative['platform']) ?? 'instagram',
        headline: ad.headline ?? undefined,
        description: ad.description ?? undefined,
      });
    });
  });
  return creatives;
}

/* ------------------------------------------------------------------ */
/*  Main mapper                                                       */
/* ------------------------------------------------------------------ */

export function mapStrapiProject(project: StrapiPortfolioProject): Project {
  // DZ-mode overlay: when Sections carry stg.* groups, they feed the SAME
  // mappers with the same item shapes (media reconnected by the populate).
  // Absent groups fall back to legacy top-level fields (unmigrated entries).
  const dzSec = (c: string) =>
    (project.Sections ?? []).find((s) => s.__component === c) as
      | { Gallery?: { Image?: StrapiMedia | null; Caption?: string | null }[] | null; SocialPosts?: StrapiSocialPost[] | null; BrochurePages?: StrapiBrochure[] | null; Video?: StrapiVideoEntry | null; PaidAdCreatives?: StrapiPaidAd[] | null }
      | undefined;
  const dzGallery = dzSec('stg.pf-gallery');
  const dzSocial = dzSec('stg.pf-social');
  const dzBrochure = dzSec('stg.pf-brochure');
  const dzVideo = dzSec('stg.pf-video');
  const dzPaidads = dzSec('stg.pf-paidads');
  const P: StrapiPortfolioProject = {
    ...project,
    gallery: dzGallery?.Gallery?.map((g) => g.Image ?? null).filter((m): m is StrapiMedia => m !== null) ?? project.gallery,
    socialPosts: dzSocial?.SocialPosts ?? project.socialPosts,
    brochures: dzBrochure?.BrochurePages ?? project.brochures,
    videoUrl: dzVideo?.Video ? [dzVideo.Video] : project.videoUrl,
    paidAds: dzPaidads?.PaidAdCreatives ?? project.paidAds,
  };
  const hasDz = (project.Sections ?? []).length > 0;
  const title = P.title?.trim() || 'Untitled Project';
  const type = P.type ?? 'web';
  const category = getProjectCategory({ ...P, type });

  const coverImage = mapThumbnail(P);
  const gallery = mapGallery(P);

  if (process.env.NODE_ENV === 'development') {
    console.log('PORTFOLIO MEDIA', {
      id: P.id,
      title,
      type,
      thumbnail: P.thumbnail?.url,
      galleryCount: P.gallery?.length ?? 0,
      socialPostsCount: P.socialPosts?.length ?? 0,
      brochuresCount: P.brochures?.length ?? 0,
      videoUrlCount: P.videoUrl?.length ?? 0,
      paidAdsCount: P.paidAds?.length ?? 0,
    });
  }

  const normalized: Project = {
    id: P.id,
    slug: P.slug || String(P.id),
    title,
    shortTitle: title,
    description: getStrapiText(P.description),
    category,
    client: P.client ?? '',
    year: P.year ?? '',
    coverImage,
    coverAspectClass: 'aspect-square',
    heroImage: coverImage,
    type,
    gallery,
    projectUrl: P.projectUrl ?? null,
    isFeatured: P.isFeatured ?? false,
    order: P.order ?? null,
    ...(hasDz ? { sectionOrder: (P.Sections ?? []).map((s) => s.__component) } : {}),
  };

  const socialPosts = mapSocialPosts(P);
  if (socialPosts.length) normalized.socialPosts = socialPosts;

  if (type === 'brochures') {
    normalized.brochurePages = mapBrochurePages(P);
  }

  if (type === 'branding') {
    normalized.brandingAssets = mapBrandingAssets(P);
  }

  if (type === 'paid-ads') {
    normalized.paidAdCreatives = mapPaidAdCreatives(P);
  }

  if (type === 'video') {
    normalized.video = mapVideo(P) ?? {
      ...coverImage,
      provider: 'mp4',
      videoUrl: P.projectUrl || coverImage.url,
    };
  }

  return normalized;
}

/* ------------------------------------------------------------------ */
/*  Fetch                                                             */
/* ------------------------------------------------------------------ */

export async function fetchPortfolioProjects(): Promise<Project[]> {
  const response = await fetch(
    `${getStrapiBaseUrl()}/api/portfolio-projects?${POPULATE_QUERY}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error(`Unable to fetch portfolio projects: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as PortfolioProjectsResponse;

  return (json.data ?? [])
    .filter((project) => project.isActive !== false)
    .slice()
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .map(mapStrapiProject);
}
