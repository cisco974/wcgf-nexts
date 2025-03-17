import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  sassOptions: {
    additionalData: `@import "./src/app/styles/_variables.scss";`,
  },
};

export default nextConfig;
