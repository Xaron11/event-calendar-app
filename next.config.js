/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/__clerk/:path*',
        destination: 'https://api.clerk.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
