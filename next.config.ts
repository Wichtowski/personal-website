import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS ? [process.env.ALLOWED_DEV_ORIGINS] : [],
  pageExtensions: ["md", "mdx", "tsx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
