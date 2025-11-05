import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Your privacy is important to us. This privacy policy explains what personal data ByteEat
        collects from you, and how we use that data.
      </p>
      <p className="mb-6 text-lg text-muted-foreground">
        <strong>Information We Collect:</strong> We collect information to provide better services
        to all our users. This includes your personal information, such as your name, email address,
        and payment details.
      </p>
      <p className="mb-6 text-lg text-muted-foreground">
        <strong>How We Use Information:</strong> We use the information we collect to provide,
        maintain, and improve our services, to develop new services, and to protect ByteEat and our
        users.
      </p>
      <p className="mb-6 text-lg text-muted-foreground">
        <strong>Data Security:</strong> We work hard to protect ByteEat and our users from
        unauthorized access to or unauthorized alteration, disclosure, or destruction of information
        we hold.
      </p>
      <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
