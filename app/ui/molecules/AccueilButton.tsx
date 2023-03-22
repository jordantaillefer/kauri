import { Link } from "@remix-run/react"
import * as React from "react"

export function AccueilButton() {
  return (
    <Link to="/" className="flex items-center w-24 md:w-32 text-2xl text-primary h-full">
      <span className="flex bg-no-repeat bg-contain bg-center bg-accueil-button h-8 w-full" />
    </Link>
  )
}
