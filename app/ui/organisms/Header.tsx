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
      <div className="flex h-16 items-center justify-between md:space-x-6 md:justify-start border-b border-primary-transparent">
        <AccueilButton />
        <nav className="flex h-full w-full flex-1 items-center justify-end space-x-10">
          {authenticated ? <SeDeconnecterButton /> : <SeConnecterButton />}
        </nav>
      </div>
    </header>
  )
}
