import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      },
    ],
    qualities: [75, 100],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline'
              https://www.youtube.com
              https://www.googletagmanager.com;
              https://cdn.jsdelivr.net;
            connect-src 'self' https: blob:;
            media-src 'self' https: blob:;
        img-src 'self' https://image.tmdb.org https://resources.tidal.com https://i.scdn.co data:;
            style-src 'self' 'unsafe-inline';
            frame-src 'self' https://www.youtube.com;
          `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },

      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline'
                https://www.youtube.com
                https://www.googletagmanager.com;
                https://cdn.jsdelivr.net;
              connect-src 'self' https:;
              media-src 'self' https:;
              img-src 'self' https://image.tmdb.org data:;
              frame-src 'self' https://www.youtube.com;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
