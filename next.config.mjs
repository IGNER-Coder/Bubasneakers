/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force TypeScript to ignore errors during build (Still valid)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. IMAGES CONFIG (Critical for Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;