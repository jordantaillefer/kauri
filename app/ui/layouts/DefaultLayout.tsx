import { Outlet, useOutletContext } from "@remix-run/react"

import { Header } from "~/ui/organisms/Header"

export const DefaultLayout = () => {
  const { authenticated } = useOutletContext<{ authenticated: boolean }>()

  return (
    <div className="flex flex-col min-h-screen bg-background-main" data-theme="default">
      <Header authenticated={authenticated} />

      <main id="main" className="flex flex-col flex-grow overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  )
}