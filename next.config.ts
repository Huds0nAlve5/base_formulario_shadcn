import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* retirar depois */
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
