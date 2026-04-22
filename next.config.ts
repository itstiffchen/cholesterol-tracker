import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cholesterol-tracker",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
