import "@/styles/globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteMetadata } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import QueryProvider from "../components/QueryProvider"
import AuthContext from "./AuthContext"

export const metadata = siteMetadata

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en">
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />

        <body
          suppressHydrationWarning
          className={cn(
            "bg-background relative flex min-h-screen flex-col overflow-x-hidden font-sans antialiased",
            fontSans.variable
          )}
        >
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <AuthContext>{children}</AuthContext>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </>
  )
}
