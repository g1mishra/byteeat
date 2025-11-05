import React from "react"

const AnalyticsPage: React.FC = () => {
  const isLoading = false

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Restaurant Analytics</h1>

      <div
        className="mb-6 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700"
        role="alert"
      >
        <div className="flex">
          <div className="py-1">
            <svg
              className="mr-4 size-6 fill-current text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Analytics Coming Soon</p>
            <p className="text-sm">
              We&apos;re working hard to bring you valuable insights about your restaurant.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 text-center shadow">
          <svg
            className="mx-auto mb-4 size-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08 .402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">Coming soon</p>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center shadow">
          <svg
            className="mx-auto mb-4 size-12 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold">Average Order Value</h2>
          <p className="text-3xl font-bold">Coming soon</p>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center shadow">
          <svg
            className="mx-auto mb-4 size-12 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold">Total Customers</h2>
          <p className="text-3xl font-bold">Coming soon</p>
        </div>
      </div>

      {/* Placeholder for future analytics components */}
      <div className="mt-8">
        {/* Add more detailed analytics components here when they're ready */}
      </div>
    </div>
  )
}

export default AnalyticsPage
