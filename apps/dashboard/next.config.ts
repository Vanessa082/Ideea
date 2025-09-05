import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false, // pretend "canvas" does not exist
      "konva/lib/index-node": "konva/lib/index",
      "konva/lib/index-node.js": "konva/lib/index.js", // force browser build
    };
    return config;
  }
}

export default nextConfig;
