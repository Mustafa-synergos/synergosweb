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
  footer: 'footer',
} as const;

export type RevalidateContentType = 'page' | 'blog' | 'article' | 'case-study' | 'career';

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
      paths.push('/blog');
      if (slug) {
        paths.push(`/blog/${slug}`);
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
  }

  return paths;
}
