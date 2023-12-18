import { Outlet, useOutletContext } from "@remix-run/react"
import { FunctionComponent, PropsWithChildren } from "react"

import { FilAriane } from "~/ui/shared/FilAriane"
import { Navigation } from "~/ui/shared/Navigation"

export const DefaultLayout = () => {
  const { authenticated } = useOutletContext<{ authenticated: boolean }>()

  return (
    <div className="flex h-full flex-col text-primary" data-theme="default">
      <main id="main" className="flex flex-col flex-grow md:flex-row overflow-x-hidden  bg-background-main">
        <Navigation authenticated={authenticated} />
        <MainContent>
          <Outlet />
        </MainContent>
      </main>
    </div>
  )
}

const MainContent: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="relative w-full flex flex-col bg-background-main md:ml-80">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[50%] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-emerald-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
      </div>
      <div className="border-b w-full p-2">
        <FilAriane />
      </div>
      {children}
    </div>
  )
}
