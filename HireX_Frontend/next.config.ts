import type { NextConfig } from "next";

const isEmployer = process.env.APP_TYPE === "employer";

const nextConfig: NextConfig = {
  distDir: isEmployer ? ".next-employer" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
