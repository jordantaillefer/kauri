import { Outlet } from "@remix-run/react"
import type { FunctionComponent, PropsWithChildren, ReactNode } from "react"

type FocusLayoutProps = PropsWithChildren & {
  children: ReactNode
}

const FocusLayout: FunctionComponent<FocusLayoutProps> = () => {

  return (
    <div className="flex min-h-screen flex-col bg-background-main" data-theme="focus">
      <header className="border-b border-primary-lighter border-opacity-40 shadow-lg" />
      <main id="main" className="flex flex-grow flex-col overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default FocusLayout