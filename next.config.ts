
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Firebase Storage and R2 public endpoints
    remotePatterns: (() => {
      const patterns = [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          port: '',
          pathname: '/v0/b/biblioangola.appspot.com/o/**',
        },
      ];
      const r2Public = process.env.R2_PUBLIC_BASE_URL;
      const r2AccountId = process.env.R2_ACCOUNT_ID;
      try {
        if (r2Public) {
          const u = new URL(r2Public);
          patterns.push({
            protocol: u.protocol.replace(':', '') as 'http' | 'https',
            hostname: u.hostname,
            port: u.port || '',
            pathname: '/**',
          });
        }
      } catch {}
      if (r2AccountId) {
        patterns.push({
          protocol: 'https',
          hostname: `pub-${r2AccountId}.r2.dev`,
          port: '',
          pathname: '/**',
        });
        patterns.push({
          protocol: 'https',
          hostname: 'r2.cloudflarestorage.com',
          port: '',
          pathname: '/**',
        });
      }
      return patterns;
    })(),
    domains: (() => {
      const domains = ['firebasestorage.googleapis.com'];
      const r2Public = process.env.R2_PUBLIC_BASE_URL;
      const r2AccountId = process.env.R2_ACCOUNT_ID;
      try {
        if (r2Public) {
          const u = new URL(r2Public);
          domains.push(u.hostname);
        }
      } catch {}
      if (r2AccountId) {
        domains.push(`pub-${r2AccountId}.r2.dev`);
        domains.push('r2.cloudflarestorage.com');
      }
      return domains;
    })(),
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

