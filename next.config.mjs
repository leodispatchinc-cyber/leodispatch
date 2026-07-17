/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Emit a self-contained server (.next/standalone) so the Docker image
  // is small and the container runs with `node server.js`.
  output: "standalone",
  images: {
    // Blog cover images are uploaded to Vercel Blob, which serves each
    // store from its own random subdomain — wildcard covers all of them.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
