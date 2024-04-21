/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["byte-eat-staticfiles.s3.amazonaws.com"],
  },
}

export default nextConfig
