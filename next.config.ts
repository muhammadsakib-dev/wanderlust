import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Image Optimization Configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/muhammadsakib/destinations/**',
        search: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/destination",
        destination: "/destinations",
        permanent: true,
      },
      {
        source: "/destination/:slug*",
        destination: "/destinations/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// https://ik.imagekit.io/muhammadsakib/destinations/image6.png