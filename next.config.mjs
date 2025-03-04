/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true, // Enable WebAssembly
      };
      return config;
    },
    output: 'export',
    distDir: 'dist',
    env: {
        TITLE: process.env.TITLE,
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        BACKEND_WS_API_URL: process.env.BACKEND_WS_API_URL,
        WEB3AUTH_CLIENT_ID: process.env.WEB3AUTH_CLIENT_ID,
        RPC_URL: process.env.RPC_URL,
        BLOCKFROST_PROJECT_ID: process.env.BLOCKFROST_PROJECT_ID
      }
};

export default nextConfig;