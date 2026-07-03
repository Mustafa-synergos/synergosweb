export const strapiBase =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ||
  'http://localhost:1337';

/** Base URL for Strapi uploads / CMS images (CDN or public media domain). */
export const mediaBase =
  process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, '') || strapiBase;

type StrapiMediaLike =
  | { url?: string; alternativeText?: string | null }
  | { data?: { url?: string; attributes?: { url?: string } } | null }
  | null
  | undefined;

function resolveMediaOrigin(url: string): string {
  if (!url.startsWith('http')) {
    return `${mediaBase}${url.startsWith('/') ? url : `/${url}`}`;
  }

  if (mediaBase !== strapiBase && url.startsWith(strapiBase)) {
    return `${mediaBase}${url.slice(strapiBase.length)}`;
  }

  return url;
}

export function getMediaUrl(
  media?: StrapiMediaLike,
  base: string = mediaBase
): string | null {
  if (!media) return null;

  const url =
    'url' in media && media.url
      ? media.url
      : 'data' in media
        ? media.data?.url ?? media.data?.attributes?.url
        : undefined;

  if (!url) return null;

  if (url.startsWith('http')) {
    return resolveMediaOrigin(url);
  }

  return `${base.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
}
