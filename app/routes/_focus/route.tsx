import { Outlet } from "@remix-run/react"
import type { FunctionComponent, PropsWithChildren, ReactNode } from "react"

import { Navigation } from "~/ui/shared/Navigation"

type FocusLayoutProps = PropsWithChildren & {
  children: ReactNode
}

const FocusLayout: FunctionComponent<FocusLayoutProps> = () => {
  return (
    <div className="flex min-h-screen flex-col bg-lighter" data-theme="focus">
      <header className="border-b border-primary-lighter border-opacity-40 shadow-lg" />
      <main id="main" className="flex flex-grow flex-col overflow-x-hidden">
        <Navigation mode="light"/>

        <MainContent>
          <Outlet />
        </MainContent>
      </main>
    </div>
  )
}

const MainContent: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="relative w-full flex flex-col items-center flex-grow bg-lighter md:pl-80">
      {children}
    </div>
  )
}
export default FocusLayout
