// lib/strapi.ts

import { CACHE_TAGS } from '@/lib/cache-tags';
import { getPreviewContext } from '@/lib/preview-server';
import type { StrapiPublicationStatus } from '@/lib/preview';
import { getMediaUrl, strapiBase } from '@/lib/strapi-media';

export { getMediaUrl, strapiBase };

const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
const STRAPI_SERVER_TOKEN = process.env.STRAPI_API_TOKEN;

/** Cached with tags; cleared on-demand from Strapi. 1h fallback TTL. */
const TAGGED_CACHE = { revalidate: 3600 };

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

  const authToken = isDraft
    ? STRAPI_SERVER_TOKEN || STRAPI_TOKEN
    : STRAPI_TOKEN;

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
    const response = await fetch(url, {
      ...requestInit,
      headers,
      ...(isDraft
        ? { cache: 'no-store' as const }
        : fetchNext
          ? { next: fetchNext }
          : {}),
    });

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

const PAGE_POPULATE =
  'populate[SeoInfo][populate]=*&populate[Sections][populate]=*';

export async function getPageBySlug(slug: string) {
  const { status } = await getPreviewContext();

  const response = await fetchAPI<{ data: import('@/types/page').PageData[] }>(
    `/api/pages?filters[Slug][$eq]=${encodeSlug(slug)}&${PAGE_POPULATE}`,
    {
      publicationStatus: status,
      next:
        status === 'published'
          ? {
              ...TAGGED_CACHE,
              tags: [CACHE_TAGS.pages, CACHE_TAGS.page(slug)],
            }
          : undefined,
    }
  );

  return response.data?.[0] ?? null;
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
========================================================= */

const BLOG_POPULATE =
  'populate[SeoInfo][populate]=*&populate[FeaturedImage][populate]=*';

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

  const response = await fetchAPI<{ data: import('@/types/blog').BlogData[] }>(
    `/api/blogs?filters[Slug][$eq]=${encodeSlug(slug)}&${BLOG_POPULATE}`,
    {
      publicationStatus: status,
      next:
        status === 'published'
          ? {
              ...TAGGED_CACHE,
              tags: [CACHE_TAGS.blogs, CACHE_TAGS.blog(slug)],
            }
          : undefined,
    }
  );

  return response.data?.[0] ?? null;
}

/* =========================================================
   ARTICLES
========================================================= */

const ARTICLE_POPULATE =
  'populate[SeoInfo][populate]=*&populate[FeaturedImage][populate]=*';

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
  const response = await fetchAPI<{ data: import('@/types/article').ArticleData[] }>(
    `/api/articles?filters[Slug][$eq]=${encodeSlug(slug)}&${ARTICLE_POPULATE}`,
    {
      publicationStatus: status,
      next:
        status === 'published'
          ? { ...TAGGED_CACHE, tags: [CACHE_TAGS.articles, CACHE_TAGS.article(slug)] }
          : undefined,
    }
  );
  return response.data?.[0] ?? null;
}

/* =========================================================
   CASE STUDIES
========================================================= */

const CASE_STUDY_POPULATE =
  'populate[SeoInfo][populate]=*&populate[FeaturedImage][populate]=*';

export async function getCaseStudies() {
  const response = await fetchAPI<{ data: import('@/types/case-study').CaseStudyData[] }>(
    `/api/case-studies?sort=publishedAt:desc&pagination[pageSize]=100&${CASE_STUDY_POPULATE}`,
    { next: { ...TAGGED_CACHE, tags: [CACHE_TAGS.caseStudies] } }
  );

  return response.data ?? [];
}

export async function getCaseStudyBySlug(slug: string) {
  const { status } = await getPreviewContext();

  const response = await fetchAPI<{ data: import('@/types/case-study').CaseStudyData[] }>(
    `/api/case-studies?filters[Slug][$eq]=${encodeSlug(slug)}&${CASE_STUDY_POPULATE}`,
    {
      publicationStatus: status,
      next:
        status === 'published'
          ? {
              ...TAGGED_CACHE,
              tags: [CACHE_TAGS.caseStudies, CACHE_TAGS.caseStudy(slug)],
            }
          : undefined,
    }
  );

  return response.data?.[0] ?? null;
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

  const response = await fetchAPI<{ data: import('@/types/career-sections').CareerData[] }>(
    `/api/careers?filters[Slug][$eq]=${encodeSlug(slug)}&${CAREER_POPULATE}`,
    {
      publicationStatus: status,
      next:
        status === 'published'
          ? {
              ...TAGGED_CACHE,
              tags: [CACHE_TAGS.careers, CACHE_TAGS.career(slug)],
            }
          : undefined,
    }
  );

  return response.data?.[0] ?? null;
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

export async function getServices() {
  return fetchAPI<{ data: any[] }>(`/api/services?sort=title:asc`);
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

export async function getTeam() {
  return fetchAPI<{ data: any[] }>(`/api/team-members?populate=photo`);
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