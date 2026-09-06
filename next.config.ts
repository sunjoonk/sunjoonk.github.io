import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
} satisfies NextConfig;

const withMDX = createMDX({});

export default withMDX(nextConfig);
