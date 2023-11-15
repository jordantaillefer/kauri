import { Outlet, useOutletContext } from "@remix-run/react"
import { FunctionComponent, PropsWithChildren } from "react"

import { SideBar } from "~/ui/organisms/SideBar"

export const DefaultLayout = () => {
  const { authenticated } = useOutletContext<{ authenticated: boolean }>()

  return (
    <div className="flex h-full flex-col" data-theme="default">
      <main id="main" className="flex flex-col md:flex-row flex-grow overflow-x-hidden">
        <SideBar authenticated={authenticated} />
        <MainContent>
          <Outlet />
        </MainContent>
      </main>
    </div>
  )
}

const MainContent: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="w-full">
      { children }
    </div>
  )
}
