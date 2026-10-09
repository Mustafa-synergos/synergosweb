// lib/strapi.ts



import { CACHE_TAGS } from '@/lib/cache-tags';

import { getPreviewContext } from '@/lib/preview-server';

import type { StrapiPublicationStatus } from '@/lib/preview';

import { getMediaUrl, strapiBase } from '@/lib/strapi-media';
import type { CaseStudyData } from '@/types/case-study';

import type { TeamMemberData } from '@/types/team';



export { getMediaUrl, strapiBase };



const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const STRAPI_SERVER_TOKEN = process.env.STRAPI_API_TOKEN;



/** Cached with tags; cleared on-demand from Strapi. 1h fallback TTL. */

const TAGGED_CACHE = { revalidate: 3600 };

const STRAPI_FETCH_TIMEOUT_MS = 5000;



type FetchOptions = RequestInit & {

  publicationStatus?: StrapiPublicationStatus;

  next?: {

    revalidate?: number | false;

    tags?: string[];

  };

};



async function fetchAPI<T>(

  endpoint: string,

  options: FetchOptions = {}

): Promise<T> {

  const { publicationStatus = 'published', next: nextConfig, ...requestInit } =

    options;



  const isDraft = publicationStatus === 'draft';

  const separator = endpoint.includes('?') ? '&' : '?';

  const url = isDraft

    ? `${strapiBase}${endpoint}${separator}status=draft`

    : `${strapiBase}${endpoint}`;



  const method = (requestInit.method ?? 'GET').toUpperCase();

  const authToken =

    isDraft || method !== 'GET'

      ? STRAPI_SERVER_TOKEN || STRAPI_TOKEN

      : undefined;



  const headers: HeadersInit = {

    "Content-Type": "application/json",

    ...(authToken && {

      Authorization: `Bearer ${authToken}`,

    }),

    ...(isDraft && {

      "strapi-encode-source-maps": "true",

    }),

    ...requestInit.headers,

  };



  const fetchNext = nextConfig

    ? {

        ...nextConfig,

        revalidate: nextConfig.tags?.length

          ? (nextConfig.revalidate ?? 3600)

          : (nextConfig.revalidate ?? 60),

      }

    : undefined;



  try {

    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), STRAPI_FETCH_TIMEOUT_MS);

    const response = await fetch(url, {

      ...requestInit,

      headers,

      signal: requestInit.signal ?? controller.signal,

      ...(isDraft

        ? { cache: 'no-store' as const }

        : fetchNext

          ? { next: fetchNext }

          : {}),

    }).finally(() => clearTimeout(timeout));



    if (!response.ok) {

      const errorBody = await response.text();



      console.error("STRAPI ERROR:", {

        status: response.status,

        statusText: response.statusText,

        body: errorBody,

      });



      throw new Error(

        `Strapi Error: ${response.status} ${response.statusText}`

      );

    }



    return response.json();

  } catch (error) {

    throw error;

  }

}



/* =========================================================

   HELPERS

========================================================= */



function encodeSlug(slug: string) {

  return encodeURIComponent(slug);

}

/**
 * Lookup variants for a dynamic-route slug, in query order.
 *
 * Next.js may hand a `[slug]` param to the page still percent-encoded when
 * the Strapi slug contains URL-special characters (spaces, `&`, `?`, curly
 * quotes, …). Strapi needs the decoded value for an exact `$eq` match, so
 * when decoding changes the value we try the decoded form first and fall
 * back to the raw value. For ordinary URL-safe slugs (About, services,
 * …) decoding is the identity, so behaviour is byte-for-byte unchanged.
 */
function slugLookupVariants(slug: string): string[] {

  try {

    const decoded = decodeURIComponent(slug);

    return decoded !== slug ? [decoded, slug] : [slug];

  } catch {

    return [slug];

  }

}

export function buildServicesQuery(slug?: string, opts?: { body?: boolean; enquiry?: boolean; contactForm?: boolean }) {
  const params = new URLSearchParams();

  if (slug) params.set('filters[slug][$eq]', slug);
  params.set('sort[0]', 'order:asc');
  params.set('pagination[pageSize]', '100');
  // Entry-level fields/relations (the entry's own current data).
  params.set('populate[thumbnail]', 'true');
  params.set('populate[heroImage]', 'true');
  params.set('populate[service_category]', 'true');

  // Live `body` Dynamic Zone. Requested only for detail fetches; the listing
  // never needs it. Fully explicit per-component populates (no blanket
  // populate=*): once ANY `on[...]` fragment exists for `body`, Strapi
  // ignores `populate[body][populate]=*` for media, so every media path —
  // direct AND nested repeatable — is listed explicitly. Validated live.
  if (opts?.body) {
    params.set('populate[body][on][services.service-hero][populate][Image]', 'true');
    params.set('populate[body][on][services.service-hero][populate][CTA]', 'true');
    params.set('populate[body][on][services.service-hero][populate][cta2]', 'true');
    params.set('populate[body][on][services.service-content][populate][Image]', 'true');
    params.set('populate[body][on][services.service-content][populate][cta1]', 'true');
    params.set('populate[body][on][services.service-content][populate][cta2]', 'true');
    params.set('populate[body][on][services.process][populate][Illustration]', 'true');
    params.set('populate[body][on][services.services-capabilities][populate][Capability][populate][Illustration]', 'true');
    params.set('populate[body][on][services.capabilities-at-glance][populate][ExpertiseItem][populate][Icon]', 'true');
    params.set('populate[body][on][services.case-studies][populate][illustration]', 'true');
    params.set('populate[body][on][services.case-studies][populate][caseStudies][populate]', '*');
    // Enquiry populate is opt-in: requesting it before `services.enquiry-form`
    // exists in the CMS `body` DZ makes Strapi answer HTTP 400 for the whole
    // query, so callers must retry without it (see getServiceBySlug).
    if (opts?.enquiry) {
      params.set('populate[body][on][services.enquiry-form][populate][BackgroundImage]', 'true');
      params.set('populate[body][on][services.enquiry-form][populate][SubmitCTA]', 'true');
    }
    // Same 400 rule for the shared contact form component when dropped into
    // a service entry — opt-in for the same reason.
    if (opts?.contactForm) {
      params.set('populate[body][on][pages.contact-form-section][populate][BackgroundImage]', 'true');
      params.set('populate[body][on][pages.contact-form-section][populate][SubmitCTA]', 'true');
    }
    params.set('populate[body][on][services.faq][populate][FAQs]', 'true');
  }

  return params.toString();
}

/**
 * Deploy-safety gate for Dynamic Zone populates. Production Strapi returns
 * HTTP 400 for unknown populate keys, so `Sections` fragments must only be
 * requested from backends that already expose the migrated schemas.
 * Default OFF (production-safe); staging sets NEXT_PUBLIC_STRAPI_DZ=1.
 */
export function isDzPopulateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_STRAPI_DZ === '1';
}



const FOOTER_POPULATE =

  'populate[Logo][fields][0]=url&populate[Logo][fields][1]=alternativeText&' +

  'populate[RegisteredAddress]=*&' +

  'populate[Browse][populate][LeftLinks]=*&populate[Browse][populate][RightLinks]=*&' +

  'populate[WhatWeOffer][populate][LeftLinks]=*&populate[WhatWeOffer][populate][RightLinks]=*&' +

  'populate[Connect][populate][LeftLinks]=*&populate[Connect][populate][RightLinks]=*&' +

  'populate[LegalLinks][populate][Links]=*&' +

  'populate[DecorativeImage][fields][0]=url&populate[DecorativeImage][fields][1]=alternativeText';



export async function getFooter() {

  const response = await fetchAPI<{ data: import('@/types/footer').FooterData | null }>(

    `/api/footer?${FOOTER_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.footer] } }

  );



  return response.data;

}



const HEADER_POPULATE =

  'populate[MainMenu]=*&' +

  'populate[MobileMenu]=*&' +

  'populate[DesktopHamburgerMenu][populate]=*&' +

  'populate[CTA]=*&' +

  'populate[Logo][fields][0]=url&populate[Logo][fields][1]=alternativeText&' +

  'populate[LogoAnimated][fields][0]=url&populate[LogoAnimated][fields][1]=alternativeText';



export async function getHeader() {



  const response = await fetchAPI<{ data: import('@/types/header').HeaderData | null }>(



    `/api/header?${HEADER_POPULATE}`,



    // Short TTL (5 min) + on-demand tag purge: nav reorders in Strapi show
    // up within minutes even if the revalidate webhook ever fails to fire.
    { next: { revalidate: 300, tags: [CACHE_TAGS.header] } }



  );





  return response.data;



}



const PAGE_POPULATE =

  'populate[SeoInfo][populate]=*&populate[Sections][populate]=*';



export async function getPageBySlug(slug: string, customPopulate?: string) {

  const { status } = await getPreviewContext();



  const populate = customPopulate ?? PAGE_POPULATE;



  for (const lookup of slugLookupVariants(slug)) {

    const response = await fetchAPI<{ data: import('@/types/page').PageData[] }>(

      `/api/pages?filters[Slug][$eq]=${encodeSlug(lookup)}&${populate}`,

      {

        publicationStatus: status,

        next:

          status === 'published'

            ? {

                ...TAGGED_CACHE,

                tags: [CACHE_TAGS.pages, CACHE_TAGS.page(lookup)],

              }

            : undefined,

      }

    );



    if (response.data?.[0]) return response.data[0];

  }



  return null;

}



export async function getPages() {

  const response = await fetchAPI<{ data: import('@/types/page').PageData[] }>(

    `/api/pages?fields[0]=Slug&fields[1]=Title&pagination[pageSize]=100`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.pages] } }

  );



  return response.data ?? [];

}



/* =========================================================

   BLOGS

======================================================== */



const BLOG_POPULATE =

  'populate[SeoInfo][populate]=*&populate[FeaturedImage][populate]=*' +
  (isDzPopulateEnabled() ? '&populate[Sections][populate]=*' : '');



/**
 * Single `blogs-page` entry fetcher — source of truth for the listing page
 * copy. Its `Body` Dynamic Zone carries `pages.page-hero-section` (hero)
 * and `pages.latest` (section heading), iterated in Strapi editor order by
 * the caller. Same tagged-cache + preview pattern as the other entries.
 */
const BLOGS_PAGE_POPULATE =
  'populate[SeoInfo][populate]=*&populate[Body][populate]=*';

export async function getBlogsPageEntry(): Promise<import('@/types/blog').BlogsPageEntryData | null> {

  const { status } = await getPreviewContext();

  const response = await fetchAPI<{ data: import('@/types/blog').BlogsPageEntryData[] }>(

    `/api/blogs-pages?sort=publishedAt:desc&pagination[pageSize]=1&${BLOGS_PAGE_POPULATE}`,

    {

      publicationStatus: status,

      next:
        status === 'published'
          ? { ...TAGGED_CACHE, tags: [CACHE_TAGS.blogs] }
          : undefined,

    }

  );

  return response.data?.[0] ?? null;

}



export async function getBlogs() {

  const response = await fetchAPI<{ data: import('@/types/blog').BlogData[] }>(

    `/api/blogs?sort=publishedAt:desc&pagination[pageSize]=100&${BLOG_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.blogs] } }

  );



  return response.data ?? [];

}



export async function getBlogsPaginated(

  page = 1,

  pageSize = 9,

  category?: string

) {

  const categoryFilter = category

    ? `&filters[Category][$eq]=${encodeURIComponent(category)}`

    : '';



  const response = await fetchAPI<import('@/types/blog').BlogsResponse>(

    `/api/blogs?sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${categoryFilter}&${BLOG_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.blogs] } }

  );



  return response;

}



export async function getBlogsOffset(

  start: number,

  limit: number,

  category?: string

) {

  const categoryFilter = category

    ? `&filters[Category][$eq]=${encodeURIComponent(category)}`

    : '';



  const response = await fetchAPI<{

    data: import('@/types/blog').BlogData[];

    meta: { pagination: { start: number; limit: number; total: number } };

  }>(

    `/api/blogs?sort=publishedAt:desc&pagination[start]=${start}&pagination[limit]=${limit}${categoryFilter}&${BLOG_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.blogs] } }

  );



  return {

    data: response.data ?? [],

    total: response.meta?.pagination?.total ?? 0,

  };

}



export async function getBlogCategories(): Promise<string[]> {

  const response = await fetchAPI<{ data: import('@/types/blog').BlogData[] }>(

    `/api/blogs?fields[0]=Category&pagination[pageSize]=100`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.blogs] } }

  );



  const cats = (response.data ?? [])

    .map((b) => b.Category)

    .filter((c): c is string => Boolean(c));



  return [...new Set(cats)].sort();

}



export async function getBlogBySlug(slug: string) {

  const { status } = await getPreviewContext();



  for (const lookup of slugLookupVariants(slug)) {

    const response = await fetchAPI<{ data: import('@/types/blog').BlogData[] }>(

      `/api/blogs?filters[Slug][$eq]=${encodeSlug(lookup)}&${BLOG_POPULATE}`,

      {

        publicationStatus: status,

        next:

          status === 'published'

            ? {

                ...TAGGED_CACHE,

                tags: [CACHE_TAGS.blogs, CACHE_TAGS.blog(lookup)],

              }

            : undefined,

      }

    );



    if (response.data?.[0]) return response.data[0];

  }



  return null;

}



/* =========================================================

   ARTICLES

========================================================= */



const ARTICLE_POPULATE =

  'populate[SeoInfo][populate]=*&populate[FeaturedImage][populate]=*' +
  (isDzPopulateEnabled() ? '&populate[Sections][populate]=*' : '');



export async function getArticles() {

  const response = await fetchAPI<{ data: import('@/types/article').ArticleData[] }>(

    `/api/articles?sort=publishedAt:desc&pagination[pageSize]=100&${ARTICLE_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.articles] } }

  );

  return response.data ?? [];

}



export async function getArticlesPaginated(page = 1, pageSize = 9, category?: string) {

  const categoryFilter = category

    ? `&filters[Category][$eq]=${encodeURIComponent(category)}`

    : '';

  const response = await fetchAPI<import('@/types/article').ArticlesResponse>(

    `/api/articles?sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${categoryFilter}&${ARTICLE_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.articles] } }

  );

  return response;

}



export async function getArticlesOffset(start: number, limit: number, category?: string) {

  const categoryFilter = category

    ? `&filters[Category][$eq]=${encodeURIComponent(category)}`

    : '';

  const response = await fetchAPI<{

    data: import('@/types/article').ArticleData[];

    meta: { pagination: { start: number; limit: number; total: number } };

  }>(

    `/api/articles?sort=publishedAt:desc&pagination[start]=${start}&pagination[limit]=${limit}${categoryFilter}&${ARTICLE_POPULATE}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.articles] } }

  );

  return {

    data: response.data ?? [],

    total: response.meta?.pagination?.total ?? 0,

  };

}



export async function getArticleCategories(): Promise<string[]> {

  const response = await fetchAPI<{ data: import('@/types/article').ArticleData[] }>(

    `/api/articles?fields[0]=Category&pagination[pageSize]=100`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.articles] } }

  );

  const cats = (response.data ?? [])

    .map((a) => a.Category)

    .filter((c): c is string => Boolean(c));

  return [...new Set(cats)].sort();

}



export async function getArticleBySlug(slug: string) {

  const { status } = await getPreviewContext();

  for (const lookup of slugLookupVariants(slug)) {

    const response = await fetchAPI<{ data: import('@/types/article').ArticleData[] }>(

      `/api/articles?filters[Slug][$eq]=${encodeSlug(lookup)}&${ARTICLE_POPULATE}`,

      {

        publicationStatus: status,

        next:

          status === 'published'

            ? { ...TAGGED_CACHE, tags: [CACHE_TAGS.articles, CACHE_TAGS.article(lookup)] }

            : undefined,

      }

    );

    if (response.data?.[0]) return response.data[0];

  }

  return null;

}



/* =========================================================

   CASE STUDIES

========================================================= */



/**
 * Populate for a Case Study entry — same architecture as PAGE_POPULATE and
 * CAREER_POPULATE (`populate[SeoInfo][populate]=*&populate[Sections][populate]=*`).
 *
 * The `case-studies` content type names its Dynamic Zone `Body` (components
 * `pages.case-studies-*`), so the DZ fragment targets `Body`.
 * `normalizeCaseStudy` canonicalizes `Body` into `Sections` so the renderer
 * uses the same `Sections` naming as pages/careers.
 */
const CASE_STUDY_POPULATE =
  'populate[SeoInfo][populate]=*&populate[FeaturedImage][populate]=*&populate[Body][populate]=*';

/**
 * Minimal populate for the listing (cards only need scalar fields, the hero
 * image and SEO). Verified against the live content type.
 */
const CASE_STUDY_POPULATE_MINIMAL =
  'populate[FeaturedImage][fields][0]=url&populate[FeaturedImage][fields][1]=alternativeText&populate[SeoInfo][populate]=*';

/**
 * Canonicalize a raw Case Study entry into the shape the frontend renders:
 *
 * - `Sections` is the EXCLUSIVE Dynamic Zone source (editor order drives
 *   rendering): live `Body`, falling back to `Sections` (local/dev backend).
 * - Legacy top-level component fields (`Objective`, `Approach`, `SOAR`,
 *   `Outcome`, `about`) — or the same components nested under `SeoInfo` on
 *   older deployments — are kept as a fallback for entries with no DZ content.
 */
export function normalizeCaseStudy(entry: CaseStudyData | null): CaseStudyData | null {
  if (!entry) return entry;

  const seo = (entry.SeoInfo ?? {}) as Record<string, unknown>;

  const liveDz = Array.isArray(entry.Body) && entry.Body.length > 0 ? entry.Body : null;
  const localDz =
    Array.isArray(entry.Sections) && entry.Sections.length > 0 ? entry.Sections : null;
  const dz = liveDz ?? localDz;

  if (dz) {
    return {
      ...entry,
      Sections: dz,
      Body: liveDz ?? entry.Body ?? null,
    };
  }

  return {
    ...entry,
    Objective: entry.Objective ?? (seo.Objective as CaseStudyData['Objective']) ?? null,
    Approach: entry.Approach ?? (seo.Approach as CaseStudyData['Approach']) ?? null,
    SOAR: entry.SOAR ?? (seo.SOAR as CaseStudyData['SOAR']) ?? null,
    Outcome: entry.Outcome ?? (seo.Outcome as CaseStudyData['Outcome']) ?? null,
    about: entry.about ?? (seo.about as CaseStudyData['about']) ?? null,
    SeoInfo: entry.SeoInfo,
  };
}



export async function getCaseStudies() {

  const response = await fetchAPI<{ data: import('@/types/case-study').CaseStudyData[] }>(

    `/api/case-studies?sort=publishedAt:desc&pagination[pageSize]=100&${CASE_STUDY_POPULATE_MINIMAL}`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.caseStudies] } }

  );



  return (response.data ?? []).map(normalizeCaseStudy) as CaseStudyData[];

}



export async function getCaseStudyBySlug(slug: string) {

  const { status } = await getPreviewContext();



  for (const lookup of slugLookupVariants(slug)) {

    const response = await fetchAPI<{ data: import('@/types/case-study').CaseStudyData[] }>(

      `/api/case-studies?filters[Slug][$eq]=${encodeSlug(lookup)}&${CASE_STUDY_POPULATE}`,

      {

        publicationStatus: status,

        next:

          status === 'published'

            ? {

                ...TAGGED_CACHE,

                tags: [CACHE_TAGS.caseStudies, CACHE_TAGS.caseStudy(lookup)],

              }

            : undefined,

      }

    );



    if (response.data?.[0]) return normalizeCaseStudy(response.data[0]);

  }



  return null;

}



/* =========================================================

   CAREERS

========================================================= */



const CAREER_POPULATE =

  'populate[SeoInfo][populate]=*&populate[Sections][populate]=*';



export async function getCareers() {

  const response = await fetchAPI<{ data: import('@/types/career-sections').CareerData[] }>(

    `/api/careers?sort=Title:asc&pagination[pageSize]=100&fields[0]=Title&fields[1]=Slug&fields[2]=ShortDescription&fields[3]=ExperienceYears`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.careers] } }

  );



  return response.data ?? [];

}



export async function getCareerBySlug(slug: string) {

  const { status } = await getPreviewContext();



  for (const lookup of slugLookupVariants(slug)) {

    const response = await fetchAPI<{ data: import('@/types/career-sections').CareerData[] }>(

      `/api/careers?filters[Slug][$eq]=${encodeSlug(lookup)}&${CAREER_POPULATE}`,

      {

        publicationStatus: status,

        next:

          status === 'published'

            ? {

                ...TAGGED_CACHE,

                tags: [CACHE_TAGS.careers, CACHE_TAGS.career(lookup)],

              }

            : undefined,

      }

    );



    if (response.data?.[0]) return response.data[0];

  }



  return null;

}



/* =========================================================

   PROJECTS

========================================================= */



export async function getProjects() {

  return fetchAPI<{ data: any[] }>(

    `/api/projects?populate=cover_image,images&sort=publishedAt:desc&pagination[limit]=6`

  );

}



export async function getProjectBySlug(slug: string) {

  return fetchAPI<{ data: any[] }>(

    `/api/projects?filters[slug][$eq]=${encodeSlug(

      slug

    )}&populate=cover_image,images`

  );

}



export async function createProject(data: any) {

  return fetchAPI(`/api/projects`, {

    method: "POST",

    body: JSON.stringify({ data }),

  });

}



export async function updateProject(id: number, data: any) {

  return fetchAPI(`/api/projects/${id}`, {

    method: "PUT",

    body: JSON.stringify({ data }),

  });

}



export async function deleteProject(id: number) {

  return fetchAPI(`/api/projects/${id}`, {

    method: "DELETE",

  });

}



/* =========================================================

   BLOG POSTS

========================================================= */



export async function getBlogPosts() {

  return getBlogs();

}



export async function getPostBySlug(slug: string) {

  const post = await getBlogBySlug(slug);

  return { data: post ? [post] : [] };

}



export async function createBlogPost(data: any) {

  return fetchAPI(`/api/blog-posts`, {

    method: "POST",

    body: JSON.stringify({ data }),

  });

}



export async function updateBlogPost(id: number, data: any) {

  return fetchAPI(`/api/blog-posts/${id}`, {

    method: "PUT",

    body: JSON.stringify({ data }),

  });

}



export async function deleteBlogPost(id: number) {

  return fetchAPI(`/api/blog-posts/${id}`, {

    method: "DELETE",

  });

}



/* =========================================================

   SERVICES

========================================================= */



export async function getServices(): Promise<import('@/types/service').ServiceData[]> {
  const response = await fetchAPI<{ data: import('@/types/service').ServiceData[] }>(
    `/api/services?${buildServicesQuery()}`,
    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.services] } }
  );
  return response.data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<import('@/types/service').ServiceData | null> {
  const { status } = await getPreviewContext();
  for (const lookup of slugLookupVariants(slug)) {
    // Prefer the query with the live `body` DZ (band order + membership),
    // including the enquiry-form and contact-form populates. Unknown populate
    // keys 400, so when either component doesn't exist in the CMS yet that
    // tier fails and we retry the same `body` query without it — then fall
    // back to the legacy query so detail pages keep rendering from
    // top-level fields on backends without `body` at all.
    const queries = [
      buildServicesQuery(lookup, { body: true, enquiry: true, contactForm: true }),
      buildServicesQuery(lookup, { body: true, contactForm: true }),
      buildServicesQuery(lookup, { body: true }),
      buildServicesQuery(lookup),
    ];
    for (const query of queries) {
      try {
        const response = await fetchAPI<{ data: import('@/types/service').ServiceData[] }>(
          `/api/services?${query}`,
          {
            publicationStatus: status,
            next:
              status === 'published'
                ? { ...TAGGED_CACHE, tags: [CACHE_TAGS.services, CACHE_TAGS.service(lookup)] }
                : undefined,
          }
        );
        if (response.data?.[0]) return response.data[0];
        break;
      } catch {
        // try the legacy query (or the next slug variant)
      }
    }
  }
  return null;
}



export async function createService(data: any) {

  return fetchAPI(`/api/services`, {

    method: "POST",

    body: JSON.stringify({ data }),

  });

}



export async function updateService(id: number, data: any) {

  return fetchAPI(`/api/services/${id}`, {

    method: "PUT",

    body: JSON.stringify({ data }),

  });

}



export async function deleteService(id: number) {

  return fetchAPI(`/api/services/${id}`, {

    method: "DELETE",

  });

}



/* =========================================================

   TEAM MEMBERS

========================================================= */



export async function getTeam(): Promise<TeamMemberData[]> {

  const response = await fetchAPI<{ data: TeamMemberData[] }>(

    `/api/team-members?populate=photo&sort[0]=name:asc&pagination[pageSize]=100`,

    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.teamMembers] } }

  );

  return response.data ?? [];

}



/* =========================================================

   TEAM ENTRY (api::team.team — source of truth for /team)

======================================================== */

/**
 * Structured populate for the single `team` entry — same fragment style as
 * TEAM_PAGE_POPULATE, but targeting the entry's `Body` Dynamic Zone:
 * hero media, the `team-listing` → `team_members` relation (with photos),
 * and `join-our-team` so a later-added CTA arrives fully populated.
 * Verified against the live entry.
 */
const TEAM_ENTRY_POPULATE =
  'populate[SeoInfo][populate]=*&' +
  'populate[Body][on][pages.page-hero-section][populate]=*&' +
  'populate[Body][on][pages.team-listing][populate][team_members][populate][photo]=true&' +
  'populate[Body][on][pages.join-our-team][populate]=*';

export async function getTeamEntry(): Promise<import('@/types/team').TeamEntryData | null> {

  const { status } = await getPreviewContext();

  const response = await fetchAPI<{ data: import('@/types/team').TeamEntryData[] }>(

    `/api/teams?sort=publishedAt:desc&pagination[pageSize]=1&${TEAM_ENTRY_POPULATE}`,

    {

      publicationStatus: status,

      next:
        status === 'published'
          // Same tag bucket as the members: the existing `team` webhook
          // purges `teamMembers`, which refreshes the entry and both
          // member sources with no new cache machinery.
          ? { ...TAGGED_CACHE, tags: [CACHE_TAGS.teamMembers] }
          : undefined,

    }

  );

  return response.data?.[0] ?? null;

}



export async function createTeamMember(data: any) {

  return fetchAPI(`/api/team-members`, {

    method: "POST",

    body: JSON.stringify({ data }),

  });

}



export async function updateTeamMember(id: number, data: any) {

  return fetchAPI(`/api/team-members/${id}`, {

    method: "PUT",

    body: JSON.stringify({ data }),

  });

}



export async function deleteTeamMember(id: number) {

  return fetchAPI(`/api/team-members/${id}`, {

    method: "DELETE",

  });

}

/* =========================================================

   CLIENT SECTION

======================================================== */

export interface ClientCategoryVM {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface ClientVM {
  id: number;
  name: string;
  categoryName: string;
  categorySlug: string;
  defaultImage: string;
  hoverImage: string;
  featured: boolean;
}

export interface ClientSectionVM {
  heading: string;
  description: string | null;
  hero: import('@/types/page-hero').PageHeroSectionData | null;
  seo: import('@/types/client').ClientSectionSeo;
}

export interface ClientListResult {
  clients: ClientVM[];
  total: number;
}

type RichTextChild = { text?: string; children?: RichTextChild[] };
type RichTextBlock = { children?: RichTextChild[] };

function richTextChildText(child: RichTextChild): string {
  if (typeof child.text === 'string') return child.text;
  if (Array.isArray(child.children)) {
    return child.children.map(richTextChildText).join('');
  }
  return '';
}

/**
 * Coerce a Strapi text field (plain string or rich-text blocks) to a plain
 * string. Returns '' when the value carries no text.
 */
export function richTextToPlainText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return (value as RichTextBlock[])
      .map((block) =>
        Array.isArray(block?.children)
          ? block.children.map(richTextChildText).join('')
          : ''
      )
      .filter(Boolean)
      .join('\n\n');
  }
  return '';
}

/**
 * Section entry fetcher — reads the single live `client-section` entry
 * (`l3pm90u41mf38aa3pzm6kh8r`). Its lowercase `body` Dynamic Zone carries:
 * - `pages.page-hero-section` → hero copy (editor-ordered)
 * - `pages.client-category` → listing heading (`Name`) + copy (`Description`)
 * Categories/clients arrive via their own collection fetchers below; the
 * client → `client_category` relation (not a section relation) is what
 * links them. Same tagged-cache mechanism as the other list fetchers.
 */
const CLIENT_SECTION_POPULATE =
  'populate[SeoInfo][populate]=*&populate[body][populate]=*';

export async function getClientSection(): Promise<ClientSectionVM | null> {
  const response = await fetchAPI<{ data: import('@/types/client').ClientSectionEntryData[] }>(
    `/api/client-sections?pagination[pageSize]=1&${CLIENT_SECTION_POPULATE}`,
    { next: { ...TAGGED_CACHE, revalidate: 0, tags: [CACHE_TAGS.clients] } }
  );

  const entry = response.data?.[0];
  if (!entry) return null;

  const body = entry.body ?? [];

  let heading = 'TRUSTED BY';
  let description: string | null = null;
  let hero: import('@/types/page-hero').PageHeroSectionData | null = null;

  // Editor order drives which band wins when multiples exist (last wins,
  // mirroring "later in Strapi = the override"); unknown bands are skipped.
  for (const section of body) {
    if (section.__component === 'pages.client-category') {
      const name = richTextToPlainText(section.Name).trim();
      const copy = richTextToPlainText(section.Description).trim();
      if (name) heading = name;
      if (copy) description = copy;
    } else if (section.__component === 'pages.page-hero-section') {
      hero = section as import('@/types/page-hero').PageHeroSectionData;
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Clients] Unknown Dynamic Zone component "${section.__component}" — skipping.`,
      );
    }
  }

  return { heading, description, hero, seo: entry.SeoInfo ?? null };
}

export async function getClientCategories(): Promise<ClientCategoryVM[]> {
  const query =
    'filters[isActive][$eq]=true&sort[0]=SortOrder:asc&pagination[pageSize]=100';

  const response = await fetchAPI<{ data: any[] }>(
    `/api/client-categories?${query}`,
    { next: { ...TAGGED_CACHE, revalidate: 0, tags: [CACHE_TAGS.clients] } }
  );

  return (response.data ?? []).map((category) => ({
    id: category.id,
    name: category.Name ?? '',
    slug: category.Slug ?? '',
    sortOrder: category.SortOrder ?? 0,
  }));
}

export async function getClients(): Promise<ClientListResult> {
  const query = [
    'populate[logo]=true',
    'populate[hoverImage]=true',
    'populate[client_category]=true',
    'pagination[pageSize]=100',
    'sort[0]=createdAt:desc',
  ].join('&');

  const response = await fetchAPI<{ data: any[]; meta?: any }>(
    `/api/clients?${query}`,
    { next: { ...TAGGED_CACHE, revalidate: 0, tags: [CACHE_TAGS.clients] } }
  );

  const clients: ClientVM[] = (response.data ?? []).map((client) => {
    const category = client.client_category;
    return {
      id: client.id,
      name: client.Name ?? '',
      categoryName: category?.Name ?? '',
      categorySlug: category?.Slug ?? '',
      defaultImage: getMediaUrl(client.logo) ?? '',
      hoverImage: getMediaUrl(client.hoverImage) ?? '',
      featured: Boolean(client.Featured),
    };
  });

  const total =
    response.meta?.pagination?.total ?? clients.length;

  return { clients, total };
}

