import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",

  trailingSlash: true,
  sassOptions: {
    additionalData: `@import "./src/app/styles/_variables.scss";`,
  },
};

export default nextConfig;
