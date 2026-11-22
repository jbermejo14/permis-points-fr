import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/fr/permis-points',
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
