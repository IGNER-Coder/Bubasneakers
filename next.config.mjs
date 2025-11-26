/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // 🟢 ALLOW CLOUDINARY
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Keep Unsplash working
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;