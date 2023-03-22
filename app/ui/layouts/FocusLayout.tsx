import { Outlet, useOutletContext } from "@remix-run/react"
import type { FunctionComponent, PropsWithChildren, ReactNode } from "react"

import { Header } from "~/ui/organisms/Header"

type FocusLayoutProps = PropsWithChildren & {
  children: ReactNode
}

export const FocusLayout: FunctionComponent<FocusLayoutProps> = () => {
  const { authenticated } = useOutletContext<{ authenticated: boolean }>()

  return (
    <div className="flex flex-col min-h-screen bg-background-main" data-theme="focus">
      <Header authenticated={authenticated} />

      <main id="main" className="flex flex-col flex-grow overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
