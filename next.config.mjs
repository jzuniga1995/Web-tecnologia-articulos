/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  env: {
    ADMIN_SECRET: process.env.ADMIN_SECRET, 
  },
}

export default nextConfig
