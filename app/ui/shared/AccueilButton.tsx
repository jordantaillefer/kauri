import { Link } from "@remix-run/react"
import * as React from "react"

export function AccueilButton() {
  return (
    <Link to="/" className="flex h-full w-24 items-center text-2xl text-primary md:w-32">
      <span className="flex h-8 w-full bg-contain bg-center bg-no-repeat bg-logo-accueil-button" />
    </Link>
  )
}
