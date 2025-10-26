import type { NextConfig } from 'next'

const sassOptions = {
  additionalData: `
    @use "@/shared/styles/helpers/media" as *;
    @use "@/shared/styles/helpers/mixins" as *;
  `,
}

const nextConfig: NextConfig = {
  sassOptions: {
    ...sassOptions,
  },
}

export default nextConfig
