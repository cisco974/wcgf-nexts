import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  experimental: {
    workerThreads: false,
    cpus: 4,
  },
  sassOptions: {
    additionalData: `@import "./src/app/styles/_variables.scss";`,
  },
};

export default nextConfig;
