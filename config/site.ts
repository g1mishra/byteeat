import type { Metadata } from "next"

export const siteMetadata: Metadata = {
  title: {
    default: "ByteEat - Digital Menu & Restaurant Management Platform",
    template: "%s | ByteEat",
  },
  description:
    "ByteEat is an all-in-one platform for restaurant owners in India to create digital menus, manage orders, and streamline operations. Enhance your dining experience with our user-friendly POS system and public menu sharing feature.",
  keywords: [
    "restaurant management",
    "digital menu",
    "online ordering",
    "POS system",
    "food service",
    "restaurant technology",
    "contactless dining",
    "menu digitization",
    "restaurant software",
    "dining experience",
    "Indian restaurants",
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
    title: "ByteEat - Revolutionizing Restaurant Management in India",
    description:
      "Empower your restaurant with ByteEat's digital menu and management solutions. Streamline operations, enhance customer experience, and boost your business in India.",
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
    title: "ByteEat - Digital Menus & Restaurant Management for India",
    description:
      "Transform your restaurant with ByteEat's innovative digital solutions. Create stunning menus, manage orders, and elevate your dining experience in India.",
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    // google: "",
    other: {
      me: ["https://www.byteeat.in"],
    },
  },
  category: "Technology",
}