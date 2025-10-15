import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow build to succeed even with lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
