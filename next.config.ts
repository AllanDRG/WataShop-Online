
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
      // Firebase Storage for whatashop-ef462 project
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // General Google Storage host
        port: '',
        // Path prefix for the specific bucket for this project
        pathname: '/v0/b/whatashop-ef462.appspot.com/o/**',
      },
      // Fallback for direct gs:// URL style if constructed manually, less common for next/image
      {
        protocol: 'https',
        hostname: 'whatashop-ef462.appspot.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mos.cms.futurecdn.net',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
