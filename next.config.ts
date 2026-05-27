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
      hostname: "**.strapiapp.com",
      pathname: "/**"
     },
     {
      protocol: "https",
      hostname: "**.strapiapp.com",
      pathname: "/uploads/**"
     }
    ],
  },
};

export default nextConfig;
