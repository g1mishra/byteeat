/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["byte-eat-staticfiles.s3.amazonaws.com", "lh3.googleusercontent.com"],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "/api/:path*",
  //     },
  //     {
  //       source: "/restaurant/:path*",
  //       has: [
  //         {
  //           type: "host",
  //           value: `(?<slug>.*).${process.env.NEXT_PUBLIC_BASE_DOMAIN}`,
  //         },
  //       ],
  //       destination: "/restaurant/:slug/:path*",
  //     },
  //   ]
  // },
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
