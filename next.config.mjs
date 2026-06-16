/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Emit a self-contained server (.next/standalone) so the Docker image
  // is small and the container runs with `node server.js`.
  output: "standalone",
};

export default nextConfig;
