/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // FORCE server-side rendering - completely disable static generation
  trailingSlash: false,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://quicksnack-final-backend.onrender.com',
  },
  // Completely disable static optimization
  experimental: {
    esmExternals: false
  },
  // Force dynamic rendering
  distDir: '.next',
  generateEtags: false,
  // Disable automatic static optimization
  target: 'server',
  // Force all pages to be server-rendered
  exportPathMap: async function () {
    return {}
  }
}

module.exports = nextConfig
