import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in the home directory otherwise makes Next
  // infer ~ as the root and the dev server never finishes starting.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
    domains: ['mirrors.creativecommons.org'],
  },
};

export default nextConfig;
