import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  experimental: {
    workerThreads: false,
    cpus: 4,
  },
};

export default nextConfig;
