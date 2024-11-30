/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/pet_arogya' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pet_arogya/' : '',
}

module.exports = nextConfig
