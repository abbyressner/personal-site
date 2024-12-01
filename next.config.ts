import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ['mirrors.creativecommons.org'],
  },
};

export default nextConfig;
