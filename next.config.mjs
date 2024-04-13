/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables static site generation for Github Pages
  output: "export",
  // On GitHub Pages, the default URL is https://{user}.github.com/{repo}/ so we need to adjust Next.js configuration for that additional {repo} path segment
  basePath: "GOOD-Morph",
};

export default nextConfig;
