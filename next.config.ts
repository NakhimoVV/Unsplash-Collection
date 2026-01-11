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
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
