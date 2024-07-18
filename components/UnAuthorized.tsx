import Link from "next/link"

const UnAuthorized = () => {
  return (
    <main className="flex h-full flex-1 items-center justify-center">
      <div className="bg-background rounded-lg border p-8 text-center shadow-lg">
        <div className="text-primary mx-auto size-12" />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight">
          You&apos;re not authorized to view this page
        </h1>
        <p className="text-muted-foreground mt-4">
          It looks like you&apos;ve reached a page that you don&apos;t have
          access to. Please go back to the homepage.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            prefetch={false}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  )
}

export default UnAuthorized
