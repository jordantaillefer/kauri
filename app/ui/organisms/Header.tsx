import { FunctionComponent } from "react"

import { AccueilButton } from "~/ui/molecules/AccueilButton"
import { SeConnecterButton } from "~/ui/molecules/SeConnecterButton"
import { SeDeconnecterButton } from "~/ui/molecules/SeDeconnecterButton"

type HeaderProps = {
  authenticated: boolean
}
export const Header: FunctionComponent<HeaderProps> = ({ authenticated }) => {
  return (
    <header className="container">
      <div className="flex items-center justify-between h-20 md:justify-start md:space-x-6">
        <AccueilButton />
        <nav className="flex items-center justify-end flex-1 w-full h-full space-x-10 flex">
          {authenticated ? <SeDeconnecterButton /> : <SeConnecterButton />}
        </nav>
      </div>
    </header>
  )
}
