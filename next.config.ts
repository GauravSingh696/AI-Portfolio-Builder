import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sliderrevolution.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
