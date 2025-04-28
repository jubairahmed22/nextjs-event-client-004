/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // trailingSlash: true,
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],

    // unoptimized: true, // Fixes issues with Next.js image optimization on static export
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  // Experimental flags
  experimental: {
    // This helps with the useSearchParams() issue
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
