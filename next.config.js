/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NEXT_PUBLIC_STATIC_MODE === '1' ? '/seamlyweb' : '',
  assetPrefix: process.env.NEXT_PUBLIC_STATIC_MODE === '1' ? '/seamlyweb/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig