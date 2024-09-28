/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '',
  images: {
    unoptimized: true
  },
  // TODO: change to flat config
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
