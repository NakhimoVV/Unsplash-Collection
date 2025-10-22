import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: "@use \"@/shared/styles/helpers\" as *;",
  },
};

export default nextConfig;
