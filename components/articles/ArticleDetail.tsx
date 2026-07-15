'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import ArticleCard from '@/components/articles/ArticleCard';
import InteractiveDots from '@/components/home/InteractiveDots';
import { parseArticleContent } from '@/lib/article-parser';
import type { ArticleData } from '@/types/article';

type ArticleDetailProps = {
  article: ArticleData;
  related: ArticleData[];
};

/* =============================================================
   UTILITIES
============================================================= */

function formatArticleDate(dateString?: string | null) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isUnoptimizedImage(src: string) {
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.includes('article-detail.png')
  );
}

const FALLBACK_ARTICLE_IMAGE = '/images/article/article-detail.png';

/* =============================================================
   SHARE BAR
============================================================= */

const SOCIAL_LINKS = [
  {
    key: 'facebook',
    base: 'https://www.facebook.com/sharer/sharer.php?u=',
    icon: '/images/blog/facebook.svg',
    label: 'Share on Facebook',
  },
  {
    key: 'linkedin',
    base: 'https://www.linkedin.com/shareArticle?mini=true&url=',
    suffix: '&title=',
    icon: '/images/blog/linkedin.svg',
    label: 'Share on LinkedIn',
  },
  {
    key: 'instagram',
    base: 'https://www.instagram.com/',
    icon: '/images/blog/instagram.svg',
    label: 'Visit Instagram',
  },
  {
    key: 'x',
    base: 'https://x.com/intent/tweet?url=',
    suffix: '&text=',
    icon: '/images/blog/x.svg',
    label: 'Share on X',
  },
];

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/resources/article/${slug}`);
  }, [slug]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span className="font-clother text-[14px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:text-[18px] lg:text-[20px]">
        SHARE :
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        {SOCIAL_LINKS.map((item) => {
          const href = shareUrl
            ? `${item.base}${encodedUrl}${item.suffix ? `${item.suffix}${encodedTitle}` : ''}`
            : '#';

          return (
            <a
              key={item.key}
              href={href}
              target={shareUrl ? '_blank' : undefined}
              rel={shareUrl ? 'noopener noreferrer' : undefined}
              aria-disabled={!shareUrl}
              aria-label={item.label}
              className="flex h-7 w-7 items-center justify-center transition-opacity hover:opacity-70"
              onClick={(e) => {
                if (!shareUrl) e.preventDefault();
              }}
            >
              <img src={item.icon} alt={item.label} className="h-7 w-7" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* =============================================================
   HERO
============================================================= */

function ArticleHero({ article }: { article: ArticleData }) {
  const imageUrl = article.FeaturedImage?.url || FALLBACK_ARTICLE_IMAGE;
  const imageAlt = article.FeaturedImage?.alternativeText || article.Title;

  return (
    <article>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[400px_1fr] md:gap-12 lg:grid-cols-[480px_1fr] lg:gap-16">
        <div>
          {article.Category && (
            <span className="inline-flex rounded-full border border-[#2B2B2B] px-3 py-[4px] text-[16px] font-normal leading-[24px] tracking-[0] text-[#FF4040] sm:px-4 sm:py-[5px]">
              {article.Category}
            </span>
          )}

          <h1 className="mt-4 font-clother text-[28px] font-bold leading-[38px] tracking-[0] capitalize text-[#AEAEAE]">
            {article.Title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[14px] text-white/60 sm:gap-8 sm:text-[15px]">
            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <img
                  src="/images/blog/calendar.svg"
                  alt=""
                  className="h-4 w-4 sm:h-5.5 sm:w-5.5"
                />
                {formatArticleDate(article.publishedAt)}
              </div>
            )}
            {article.ReadTime && (
              <div className="flex items-center gap-2">
                <img
                  src="/images/blog/time.png"
                  alt=""
                  className="h-4 w-4 sm:h-5.5 sm:w-5.5"
                />
                {article.ReadTime}
              </div>
            )}
          </div>

          <div className="pt-10 md:pt-16 lg:pt-28">
            <ShareBar title={article.Title} slug={article.Slug} />
          </div>
        </div>

        <div className="relative h-[198px] w-full max-w-[360px] overflow-hidden sm:mx-auto md:h-[255px] md:max-w-[381px] lg:mx-0 lg:h-auto lg:w-full lg:max-w-[666px] lg:aspect-[666/360]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 666px"
            unoptimized={isUnoptimizedImage(imageUrl)}
            priority
          />
        </div>
      </div>
    </article>
  );
}

/* =============================================================
   BODY
============================================================= */

function ContentImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${className ?? ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        unoptimized={isUnoptimizedImage(src)}
      />
    </div>
  );
}

function ArticleBody({ content }: { content: string }) {
  const blocks = useMemo(() => parseArticleContent(content), [content]);

  return (
    <div className="w-full">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={idx}
              className="mt-10 mb-4 font-clother text-[20px] font-bold leading-[26px] tracking-[0] text-[#FF4040] first:mt-0 sm:mt-12 sm:mb-5 lg:mt-14"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }

        if (block.type === 'paragraph') {
          return (
            <div
              key={idx}
              className="w-full text-[15px] leading-[1.8] text-[#CFCFCF] sm:text-[17px] sm:leading-[2] lg:text-[18px] [&_p]:mb-4 sm:[&_p]:mb-6 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }

        if (block.type === 'image') {
          return (
            <ContentImage
              key={idx}
              src={block.src || FALLBACK_ARTICLE_IMAGE}
              alt={block.alt || 'Article image'}
              sizes="(max-width: 1024px) 100vw, 666px"
              className="my-8 h-[198px] w-full max-w-[360px] lg:my-10 lg:h-auto lg:w-full lg:max-w-[666px] lg:aspect-[666/360]"
            />
          );
        }

        return (
          <div
            key={idx}
            className={`my-8 grid grid-cols-1 items-start gap-6 sm:my-10 sm:gap-8 lg:grid-cols-[666px_1fr] lg:gap-10 ${
              block.reverse ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div
              className="text-[15px] leading-[1.8] text-[#CFCFCF] sm:text-[17px] sm:leading-[2] lg:text-[18px] [&_p]:mb-4 sm:[&_p]:mb-6 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
            <ContentImage
              src={block.src || FALLBACK_ARTICLE_IMAGE}
              alt={block.alt || 'Article image'}
              sizes="(max-width: 1024px) 100vw, 666px"
              className="h-[198px] w-full max-w-[360px] mx-auto lg:h-auto lg:w-full lg:max-w-[666px] lg:aspect-[666/360]"
            />
          </div>
        );
      })}
    </div>
  );
}

/* =============================================================
   RELATED ARTICLES
============================================================= */

function RelatedArticles({ articles }: { articles: ArticleData[] }) {
  const items = articles.slice(0, 2);
  if (items.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20 lg:mt-24">
      <h2 className="mb-6 font-clother text-[22px] font-semibold text-white sm:mb-8 sm:text-[26px] lg:mb-10 lg:text-[28px] lg:text-[34px]">
        Other Articles
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-8">
        {items.map((item, index) => (
          <ArticleCard
            key={item.documentId ?? item.Slug}
            article={item}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

/* =============================================================
   PAGE
============================================================= */

export default function ArticleDetail({ article, related }: ArticleDetailProps) {
  return (
    <section className="relative overflow-hidden bg-[#111111] px-4 pt-20 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:px-0 lg:pt-24 lg:pb-16">
      <div className="pointer-events-none">
        <InteractiveDots variant="dark" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 h-[40%] w-[70%] max-w-[640px] opacity-100 sm:h-[50%] sm:w-[60%] md:h-[55%] md:w-[58%] lg:h-[65%] lg:w-[48%]"
        style={{
          backgroundImage: "url('/images/vector-detail.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-0 sm:px-6 lg:px-8 lg:py-16 lg:mt-20 sm:mt-16">
        <ArticleHero article={article} />

        <div className="mt-16 w-full sm:mt-20 md:mt-24 lg:mt-28">
          {article.Content ? (
            <ArticleBody content={article.Content} />
          ) : (
            <p className="text-white/30">No content available.</p>
          )}
        </div>

        <RelatedArticles articles={related} />
      </div>
    </section>
  );
}
