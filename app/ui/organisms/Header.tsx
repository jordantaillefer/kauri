import { FunctionComponent } from "react"

type HeaderProps = {
  authenticated: boolean
}
export const Header: FunctionComponent<HeaderProps> = ({ authenticated }) => {
  return (
    <header className="border-b border-primary-lighter border-opacity-40 shadow-lg">

    </header>
  )
}
