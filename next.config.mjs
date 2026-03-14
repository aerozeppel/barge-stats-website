/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/barge",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
