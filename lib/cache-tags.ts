export const CACHE_TAGS = {
  pages: 'pages',
  page: (slug: string) => `page-${slug}`,
  blogs: 'blogs',
  blog: (slug: string) => `blog-${slug}`,
  articles: 'articles',
  article: (slug: string) => `article-${slug}`,
  caseStudies: 'case-studies',
  caseStudy: (slug: string) => `case-study-${slug}`,
  careers: 'careers',
  career: (slug: string) => `career-${slug}`,
  // teamMembers: 'team-members',
  teamMembers: 'team_members',
  services: 'services',
  service: (slug: string) => `service-${slug}`,
  footer: 'footer',
  header: 'header',
  clients: 'clients',
} as const;

export type RevalidateContentType =
  | 'page'
  | 'blog'
  | 'article'
  | 'case-study'
  | 'career'
  | 'service'
  | 'footer'
  | 'header'
  | 'team'
  | 'clients';

export function getListTag(type: RevalidateContentType): string {
  switch (type) {
    case 'page':
      return CACHE_TAGS.pages;
    case 'blog':
      return CACHE_TAGS.blogs;
    case 'article':
      return CACHE_TAGS.articles;
    case 'case-study':
      return CACHE_TAGS.caseStudies;
    case 'career':
      return CACHE_TAGS.careers;
    case 'service':
      return CACHE_TAGS.services;
    case 'footer':
      return CACHE_TAGS.footer;
    case 'header':
      return CACHE_TAGS.header;
    case 'team':
      return CACHE_TAGS.teamMembers;
    case 'clients':
      return CACHE_TAGS.clients;
  }
}

export function getItemTag(type: RevalidateContentType, slug: string): string {
  switch (type) {
    case 'page':
      return CACHE_TAGS.page(slug);
    case 'blog':
      return CACHE_TAGS.blog(slug);
    case 'article':
      return CACHE_TAGS.article(slug);
    case 'case-study':
      return CACHE_TAGS.caseStudy(slug);
    case 'career':
      return CACHE_TAGS.career(slug);
    case 'service':
      return CACHE_TAGS.service(slug);
    case 'footer':
      return CACHE_TAGS.footer;
    case 'header':
      return CACHE_TAGS.header;
    case 'team':
      // Team members are only ever read as a list (getTeam); the list tag
      // is what the fetch is cached with, so it is what must be purged.
      return CACHE_TAGS.teamMembers;
    case 'clients':
      // Same: clients/categories/sections share the single 'clients' tag.
      return CACHE_TAGS.clients;
  }
}

export function getPathsForContent(
  type: RevalidateContentType,
  slug?: string | null
): string[] {
  const paths: string[] = [];

  switch (type) {
    case 'page':
      paths.push('/');
      if (slug && slug !== 'home') {
        paths.push(`/${slug}`);
      }
      break;
    case 'blog':
      // Canonical blogs listing lives at /blogs; old URLs redirect there.
      paths.push('/blog', '/blogs', '/resources/blogs');
      if (slug) {
        paths.push(`/blog/${slug}`, `/resources/blog/${slug}`);
      }
      break;
    case 'article':
      paths.push('/resources/articles');
      if (slug) {
        paths.push(`/resources/article/${slug}`);
      }
      break;
    case 'case-study':
      paths.push('/case-studies', '/projects');
      if (slug) {
        paths.push(`/case-studies/${slug}`, `/projects/${slug}`);
      }
      break;
    case 'career':
      paths.push('/careers');
      if (slug) {
        paths.push(`/careers/${slug}`);
      }
      break;
    case 'service':
      paths.push('/services');
      if (slug) {
        paths.push(`/services/${slug}`);
      }
      break;
    case 'footer':
      // The footer is rendered on every page; purging the footer tag is what
      // invalidates the cached pages, so no single path owns it.
      paths.push('/');
      break;
    case 'header':
      // Same as the footer: the header renders on every page. The
      // /resources hub also embeds the header-driven menu, so refresh it too.
      paths.push('/', '/resources');
      break;
    case 'team':
      paths.push('/team');
      break;
    case 'clients':
      paths.push('/clients');
      break;
  }

  return paths;
}
