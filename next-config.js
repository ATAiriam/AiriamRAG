/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.airiam.com'],
  },
  // Enable server components
  experimental: {
    serverActions: true,
  },
  // API proxy for local development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
}

module.exports = nextConfig
