import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dsugibdwfntrcloeytya.supabase.co',
        pathname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/collections/:gender',
        destination: '/:gender/collection',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
