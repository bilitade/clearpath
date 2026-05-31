import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HMR over LAN dev hosts
  allowedDevOrigins: ["10.11.227.8"],
};

export default nextConfig;
