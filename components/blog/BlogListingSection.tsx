import BlogHero from '@/components/blog/BlogHero';
import BlogListingContent from '@/components/blog/BlogListingContent';
import { getBlogsPaginated, getBlogCategories } from '@/lib/strapi';
import type { BlogListingSectionData } from '@/types/blog-sections';
import type { BlogData, BlogPaginationMeta } from '@/types/blog';

type Props = {
  data: BlogListingSectionData;
};

export default async function BlogListingSection({ data }: Props) {
  let blogs: BlogData[] = [];
  let meta: BlogPaginationMeta = { page: 1, pageSize: 11, pageCount: 1, total: 0 };
  let categories: string[] = [];

  try {
    const [result, cats] = await Promise.all([
      getBlogsPaginated(1, 11),
      getBlogCategories(),
    ]);
    blogs = result.data ?? [];
    meta = result.meta?.pagination ?? meta;
    categories = cats;
  } catch {
    // render empty state
  }

  return (
    <>
      <BlogHero data={data} />
      <BlogListingContent
        initialBlogs={blogs}
        initialMeta={meta}
        categories={categories}
        sectionHeading={data.SectionHeading}
      />
    </>
  );
}
