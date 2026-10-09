'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import { dzBodyField } from '@/lib/dz-sections';
import type { BlogData } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  blog: BlogData;
  related: BlogData[];
};

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/resources/blog/${slug}`);
  }, [slug]);

  const encoded = shareUrl ? encodeURIComponent(shareUrl) : '';
  const text = encodeURIComponent(title);

  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-clother text-[13px] font-semibold uppercase tracking-[0.18em] text-white/60">
        Share:
      </span>
      <div className="flex items-center gap-3">
        <a
          href={shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encoded}` : '#'}
          target={shareUrl ? '_blank' : undefined}
          rel={shareUrl ? 'noopener noreferrer' : undefined}
          className="transition-opacity hover:opacity-70"
          onClick={(e) => { if (!shareUrl) e.preventDefault(); }}
        >
          <img src="/images/blog/facebook.svg" alt="Facebook" className="h-5 w-5" />
        </a>
        <a
          href={shareUrl ? `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${text}` : '#'}
          target={shareUrl ? '_blank' : undefined}
          rel={shareUrl ? 'noopener noreferrer' : undefined}
          className="transition-opacity hover:opacity-70"
          onClick={(e) => { if (!shareUrl) e.preventDefault(); }}
        >
          <img src="/images/blog/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
        </a>
        <a
          href={shareUrl ? `https://www.instagram.com/` : '#'}
          target={shareUrl ? '_blank' : undefined}
          rel={shareUrl ? 'noopener noreferrer' : undefined}
          className="transition-opacity hover:opacity-70"
          onClick={(e) => { if (!shareUrl) e.preventDefault(); }}
        >
          <img src="/images/blog/instagram.svg" alt="Instagram" className="h-5 w-5" />
        </a>
        <a
          href={shareUrl ? `https://x.com/intent/tweet?url=${encoded}&text=${text}` : '#'}
          target={shareUrl ? '_blank' : undefined}
          rel={shareUrl ? 'noopener noreferrer' : undefined}
          className="transition-opacity hover:opacity-70"
          onClick={(e) => { if (!shareUrl) e.preventDefault(); }}
        >
          <img src="/images/blog/x.svg" alt="X" className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}

export default function BlogDetailContent({ blog, related }: Props) {
  // DZ body section wins when the entry is migrated; legacy field otherwise.
  const content = dzBodyField<string>(blog, 'sections.blog-body', 'Content') ?? blog.Content;
  return (
    <section className="bg-[#111111] py-12 lg:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">

          {/* Main content */}
          <div>
            <ShareBar title={blog.Title} slug={blog.Slug} />

            {content ? (
              <div
                className="prose prose-invert prose-p:font-light prose-p:text-white/75 prose-a:text-red-400 hover:prose-a:text-red-300 prose-headings:text-red-400 prose-headings:font-clother prose-headings:font-semibold max-w-none prose-ul:text-white/70 prose-ol:text-white/70 prose-li:text-white/70 prose-strong:text-white"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-white/30">No content available.</p>
            )}

            {/* Back link */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-[13px] font-light text-white/40 transition hover:text-white"
              >
                <img src="/images/blog/arrow-2.svg" alt="" className="h-3 w-3 rotate-180" />
                Back to all posts
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <h3 className="mb-6 font-clother text-[18px] font-semibold text-white">
              Other Post
            </h3>
            <div className="flex flex-col gap-4">
              {related.length > 0 ? (
                related.map((r, i) => (
                  <BlogCard key={r.documentId ?? r.Slug} blog={r} index={i} hideExcerpt />
                ))
              ) : (
                <p className="text-[13px] text-white/30">No related posts.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
