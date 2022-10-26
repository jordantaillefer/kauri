import { AccueilButton } from "~/ui/components/AccueilButton"
import { SeConnecterButton } from "~/ui/components/SeConnecterButton"
import { SeDeconnecterButton } from "~/ui/components/SeDeconnecterButton"

export function Header(props: { authenticated: boolean }) {
  return (
    <header className="container p-0">
      <div
        className="flex items-center justify-between h-20 border-b-2 border-primary md:justify-start md:space-x-6 mb-10">
        <AccueilButton />
        <nav className="flex items-center justify-end flex-1 w-full h-full space-x-10 flex">
          {props.authenticated ? <SeDeconnecterButton /> : <SeConnecterButton />}
        </nav>
      </div>
    </header>
  )
}