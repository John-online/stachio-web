import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "localhost-not-prod.phantomguard.eu:3000",
  ],
  images: {
    domains: [
      "cdn.discordapp.com",
      "github.com",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
