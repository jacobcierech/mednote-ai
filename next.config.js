/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep local dev artifacts separate from production builds so switching
  // between `next build` and `next dev` does not corrupt the runtime chunks.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
}
module.exports = nextConfig
