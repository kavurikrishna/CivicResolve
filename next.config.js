/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  // Allow leaflet CSS
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
