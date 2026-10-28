import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chrome's HMR socket sends Origin: http://127.0.0.1:<port>. Next only
  // allows localhost by default, and a blocked socket prevents hydration.
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
