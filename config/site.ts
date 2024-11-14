import type { Metadata } from "next"

export const siteMetadata: Metadata = {
  metadataBase: new URL(`https://www.byteeat.in`),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "ByteEat - Digital Menu Platform | Create & Share Restaurant Menus",
    template: "%s | ByteEat Digital Menu",
  },
  description:
    "Transform your restaurant menu into an interactive digital experience with ByteEat. Create QR code menus, update dishes instantly, and provide a modern dining experience. Perfect for restaurants looking to digitize their menu and enhance customer experience.",
  keywords: [
    "digital menu",
    "restaurant QR menu",
    "online menu creator",
    "menu digitization",
    "digital menu platform",
    "QR code menu",
    "interactive restaurant menu",
    "digital menu system",
    "restaurant menu software",
    "digital menu near me",
    "Indian restaurant digital menu",
  ],
  authors: [{ name: "ByteEat Team" }],
  creator: "ByteEat",
  publisher: "ByteEat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.byteeat.in",
    siteName: "ByteEat",
    title: "ByteEat - Digital Menu Platform | Modern Restaurant Solutions",
    description:
      "Create stunning digital menus for your restaurant with ByteEat. Transform your traditional menu into an interactive digital experience with QR codes, instant updates, and seamless management.",
    images: [
      {
        url: "https://www.byteeat.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ByteEat - Digital Menu & Restaurant Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ByteEat",
    creator: "@ByteEat",
    title: "ByteEat - Digital Menu Platform | Restaurant Menu Solutions",
    description:
      "Create and manage professional digital menus for your restaurant. ByteEat helps restaurants digitize their menus with QR codes, real-time updates, and interactive features.",
    images: ["https://www.byteeat.in/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "",
    other: {
      me: ["https://www.byteeat.in"],
    },
  },
  category: "Technology",
}
