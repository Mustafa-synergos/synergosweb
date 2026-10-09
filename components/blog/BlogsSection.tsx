import { getBlogs } from '@/lib/strapi';
import BlogCard from '@/components/blog/BlogCard';
import CTA from '@/components/shared/CTA';
import DotsSection from '@/components/shared/DotsSection';

type BlogsSectionProps = {
  data?: {
    Heading?: string | null;
    CTAText?: string | null;
    CTALink?: string | null;
    PostCount?: number | null;
  } | null;
};

export default async function BlogsSection({ data }: BlogsSectionProps = {}) {
  let blogs: Awaited<ReturnType<typeof getBlogs>> = [];

  const heading = data?.Heading ?? 'BLOGS';
  const ctaText = data?.CTAText ?? 'EXPLORE MORE';
  const ctaLink = data?.CTALink ?? '/blogs';
  const postCount = data?.PostCount ?? 3;

  try {
    const all = await getBlogs();
    blogs = all.slice(0, postCount);
  } catch {
    // render empty state
  }

  return (
    <DotsSection className="bg-[#111111] py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-0">
        {/* Header row */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none text-white">
            {heading}
          </h2>
          <CTA displayText={ctaText} hoverText={ctaText} link={ctaLink} />
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
