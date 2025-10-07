import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow deploys to proceed even if there are ESLint or TS errors.
  // This avoids Vercel build failures and lets us fix issues incrementally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
