const strapiHost = process.env.NEXT_PUBLIC_STRAPI_API_URL
  ? new URL(process.env.NEXT_PUBLIC_STRAPI_API_URL).hostname
  : process.env.NEXT_PUBLIC_STRAPI_URL
    ? new URL(process.env.NEXT_PUBLIC_STRAPI_URL).hostname
  : null;

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname
  : strapiHost;

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      // Canonical blogs listing lives at /blogs
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/resources/blogs',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/resources/blog/:slug',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/case-study',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/projects/:slug',
        destination: '/case-studies/:slug',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/case-studies',
        permanent: true,
      },
      // {
      //   source: '/news',
      //   destination: '/resources/articles',
      //   permanent: true,
      // },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'localhost'
      },
      ...(strapiHost
        ? [
            { protocol: 'https', hostname: strapiHost },
            { protocol: 'http', hostname: strapiHost },
          ]
        : []),
      ...(mediaHost && mediaHost !== strapiHost
        ? [
            { protocol: 'https', hostname: mediaHost },
            { protocol: 'http', hostname: mediaHost },
          ]
        : []),
    ]
  }
};

export default nextConfig;
