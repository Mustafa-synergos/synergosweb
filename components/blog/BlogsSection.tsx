import { getBlogs } from '@/lib/strapi';
import BlogCard from '@/components/blog/BlogCard';
import CTA from '@/components/shared/CTA';
import DotsSection from '@/components/shared/DotsSection';

export default async function BlogsSection() {
  let blogs: Awaited<ReturnType<typeof getBlogs>> = [];

  try {
    const all = await getBlogs();
    blogs = all.slice(0, 3);
  } catch {
    // render empty state
  }

  return (
    <DotsSection className="bg-[#111111] py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-0">
        {/* Header row */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none text-white">
            BLOGS
          </h2>
          <CTA displayText="EXPLORE MORE" hoverText="EXPLORE MORE" link="/resources/blogs" />
        </div>

        {/* Cards grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.documentId ?? blog.id ?? i} blog={blog} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-white/40">No blogs available.</p>
        )}
      </div>
    </DotsSection>
  );
}
