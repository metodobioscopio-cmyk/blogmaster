import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*"],
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
