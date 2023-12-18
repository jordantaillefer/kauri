import { Outlet, useOutletContext } from "@remix-run/react"
import type { FunctionComponent, PropsWithChildren, ReactNode } from "react"

import { Header } from "~/ui/shared/Header"

type FocusLayoutProps = PropsWithChildren & {
  children: ReactNode
}

export const FocusLayout: FunctionComponent<FocusLayoutProps> = () => {
  const { authenticated } = useOutletContext<{ authenticated: boolean }>()

  return (
    <div className="flex min-h-screen flex-col bg-background-main" data-theme="focus">
      <Header authenticated={authenticated} />

      <main id="main" className="flex flex-grow flex-col overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
