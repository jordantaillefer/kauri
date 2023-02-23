import { SeConnecterButton } from "~/ui/molecules/SeConnecterButton"
import { SeDeconnecterButton } from "~/ui/molecules/SeDeconnecterButton"
import { AccueilButton } from "~/ui/organisms/AccueilButton"

export function Header(props: { authenticated: boolean }) {
  return (
    <header className="container">
      <div
        className="flex items-center justify-between h-20 md:justify-start md:space-x-6">
        <AccueilButton />
        <nav className="flex items-center justify-end flex-1 w-full h-full space-x-10 flex">
          {props.authenticated ? <SeDeconnecterButton /> : <SeConnecterButton />}
        </nav>
      </div>
    </header>
  )
}