import type { ReactNode } from "react"

import { Header } from "~/ui/organisms/Header"

interface RootLayoutProps {
  children: ReactNode;
  authenticated: boolean
}

export function RootLayout({ children, authenticated }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header authenticated={authenticated} />

      <main id="main" className="flex flex-col flex-grow overflow-x-hidden">
        {children}
      </main>

    </div>
  )
}