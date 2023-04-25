import { Outlet, useOutletContext } from "@remix-run/react"

import { Header } from "~/ui/organisms/Header"

export const DefaultLayout = () => {
  const { authenticated } = useOutletContext<{ authenticated: boolean }>()

  return (
    <div className="flex min-h-screen flex-col bg-background-main" data-theme="default">
      <Header authenticated={authenticated} />

      <main id="main" className="flex flex-grow flex-col overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
