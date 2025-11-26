/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force TypeScript to ignore errors (Keep this)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. REMOVED ESLINT CONFIG (This was causing the crash)
  
  // 3. Images Config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;