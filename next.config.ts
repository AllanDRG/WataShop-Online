import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // Example for Firebase Storage if you construct URLs directly.
      // If using getDownloadURL(), the hostname can vary, consider a more general pattern or ensure stable URLs.
      // For default bucket: <project-id>.appspot.com
      {
        protocol: 'https',
        hostname: 'whatashop-ef462.appspot.com', // Use the actual project ID from .env
        port: '',
        pathname: '/**',
      },
      // For other buckets or custom domains, add them here.
      // {
      //   protocol: 'https',
      //   hostname: 'firebasestorage.googleapis.com', // General Google Storage, might be too broad
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
