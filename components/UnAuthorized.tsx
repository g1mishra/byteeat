import Link from "next/link"

const UnAuthorized = () => {
  return (
    <main className="flex h-full flex-1 items-center justify-center">
      <div className="rounded-lg border bg-background p-8 text-center shadow-lg">
        <div className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          You&apos;re not authorized to view this page
        </h1>
        <p className="mt-4 text-muted-foreground">
          It looks like you&apos;ve reached a page that you don&apos;t have access to. Please go
          back to the homepage.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
