import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  output: "standalone",

  trailingSlash: true,
  sassOptions: {
    additionalData: `@import "./src/app/styles/_variables.scss";`,
  },
};

export default nextConfig;
