import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/modules/sales-module",
        destination: "/modules/sales-crm",
        permanent: false,
      },
      {
        source: "/modules/service-module",
        destination: "/modules/service-crm",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
