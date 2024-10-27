// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { dev }) => {
      if (dev) {
        // Remove the React Dev Overlay module
        config.resolve.alias['@next/react-dev-overlay'] = false;
      }
      return config;
    },
    devIndicators: {
      buildActivity: false,  // Disable build activity indicator
      buildActivityPosition: 'bottom-right', // If still enabled, move it to bottom-right
    },
  };
  
  export default nextConfig;
  