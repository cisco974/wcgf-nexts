import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  output: "export",
  experimental: {
    // This is experimental but can
    // be enabled to allow parallel threads
    // with Next.js automatic static generation
    workerThreads: false,
    cpus: 4,
  },
};

export default nextConfig;
