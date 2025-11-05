import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">About ByteEat</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        ByteEat is revolutionizing the restaurant experience with innovative digital menus and table
        QR-based ordering. Our mission is to enhance the efficiency and satisfaction of restaurant
        operations through cutting-edge technology.
      </p>
      <p className="mb-6 text-lg text-muted-foreground">
        Founded in 2024, ByteEat has quickly become a trusted partner for restaurants looking to
        modernize their services and provide a seamless dining experience for their customers.
      </p>
      <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
