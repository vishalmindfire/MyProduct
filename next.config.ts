import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['next-auth', '@auth/core'],
  images: {
    remotePatterns: [
     {
      protocol: "http",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**"
     },
     {
      protocol: "https",
      hostname: "https://different-freedom-77952e3e8f.media.strapiapp.com",
      port: "443",
      pathname: "**"
     }
    ],
  },
};

export default nextConfig;
