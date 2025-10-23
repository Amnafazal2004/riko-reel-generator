/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only apply this on the server side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'esbuild': 'commonjs esbuild',
      });
    }
    
    // Exclude remotion packages from client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@remotion/bundler': false,
        '@remotion/renderer': false,
        'esbuild': false,
      };
    }
    
    return config;
  },
  // ✅ Updated for Next.js 15
  serverExternalPackages: ['@remotion/bundler', '@remotion/renderer', 'esbuild'],
};

export default nextConfig;