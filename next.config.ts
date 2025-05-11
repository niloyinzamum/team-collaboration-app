// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Also disable ESLint checking during build if needed
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Your other Next.js config options...
}

module.exports = nextConfig