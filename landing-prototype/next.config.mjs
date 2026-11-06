/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { cpus: 2 },
  ...(process.env.GITHUB_PAGES === "true"
    ? {
        output: "export",
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        trailingSlash: true,
        distDir: ".next-pages",
      }
    : {}),
};

export default nextConfig;
