/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "byteeat.s3.ap-south-1.amazonaws.com",
      "byte-eat-staticfiles.s3.amazonaws.com",
      "lh3.googleusercontent.com",
    ],
  },

  async redirects() {
    return [
      {
        source: "/manage/orders",
        destination: "/manage/orders/current",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
