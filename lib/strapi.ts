// lib/strapi.ts

export const strapiBase =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${strapiBase}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN && {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      next: {
        revalidate: 60,
        ...options.next,
      },
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
  return fetchAPI<{ data: any[] }>(
    `/api/blog-posts?populate=cover_image&sort=publishedAt:desc&pagination[limit]=6`
  );
}

export async function getPostBySlug(slug: string) {
  return fetchAPI<{ data: any[] }>(
    `/api/blog-posts?filters[slug][$eq]=${encodeSlug(
      slug
    )}&populate=cover_image`
  );
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