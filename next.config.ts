import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1:3000", "localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'whoisalfaz.me', // Trust your live site
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'v1.whoisalfaz.me', // Allow new GraphQL endpoint images
        pathname: '/wp-content/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
  output: 'standalone',
  async redirects() {
    return [
      // 1. Redirect old Date-based WP URLs (Day precision)
      // Example: /2025/12/17/my-post -> /blog/my-post
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      // 2. Redirect old Month-based WP URLs
      // Example: /2025/12/my-post -> /blog/my-post
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      // 3. Redirect generic "Author" archives to homepage
      {
        source: '/author/:path*',
        destination: '/',
        permanent: true,
      },
      // 4. Redirect legacy portfolio page
      {
        source: '/who-is-alfaz-mahmud-rizve',
        destination: '/portfolio',
        permanent: true,
      },
      // 5. Affiliate Link Cloaking
      {
        source: '/go/monday',
        destination: 'https://try.monday.com/66vrkkiezhrz',
        permanent: true,
      },
      {
        source: '/go/n8n',
        destination: 'https://n8n.partnerlinks.io/ch585gsqzanp',
        permanent: true,
      },
      {
        source: '/go/brevo',
        destination: 'https://get.brevo.com/6b88c13841c4',
        permanent: true,
      },
      {
        source: '/go/databox',
        destination: 'https://join.databox.com/qfzdqmwp7elc',
        permanent: true,
      },
      {
        source: '/go/turbotic',
        destination: 'https://try.turbotic.com/2xu9cie2qj39',
        permanent: true,
      },
      {
        source: '/go/cometchat',
        destination: 'https://try.cometchat.com/r4j3p5y2c9mn',
        permanent: true,
      },
      {
        source: '/go/apollo',
        destination: 'https://get.apollo.io/bs1ny1i5eigv',
        permanent: true,
      },
      {
        source: '/go/adcreative',
        destination: 'https://free-trial.adcreative.ai/78ye4zckgmez',
        permanent: true,
      },
      {
        source: '/go/elevenlabs',
        destination: 'https://try.elevenlabs.io/vde8vlnbokq4',
        permanent: true,
      },
      {
        source: '/go/vultr-promo',
        destination: 'https://www.vultr.com/?ref=9859101-9J',
        permanent: true,
      },
      {
        source: '/go/vultr',
        destination: 'https://www.vultr.com/?ref=9859100',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;