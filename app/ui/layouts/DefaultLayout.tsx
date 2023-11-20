import { Link, Outlet, UIMatch, useMatches, useOutletContext } from "@remix-run/react";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";

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

const FilAriane = () => {
  const matches = useMatches() as UIMatch<any, { breadcrumb: (match: UIMatch) => ReactNode}>[]

  return (
    <ol className="flex">
      {matches
        .filter(
          (match) =>
            match.handle && match.handle.breadcrumb
        )
        .map((match, index) => (
          <li key={index} className="pr-2">
            {match.handle.breadcrumb(match)}
          </li>
        ))}
    </ol>
  )
}

export const handle = {
  breadcrumb: () => <Link to="/">Home</Link>,
}

const MainContent: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="w-full flex flex-col">
      <div className="border-b w-full p-2">
        <FilAriane />
      </div>
      { children }
    </div>
  )
}
