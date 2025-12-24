
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/biblioangola.appspot.com/o/**',
      },
    ],
  },
  // Reduce dev noise and remove console statements in production
  reactStrictMode: false,
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

export default nextConfig
