import { Link } from "@remix-run/react"
import * as React from "react"

export function AccueilButton() {
  return (
    <div className="inline-flex">
      <Link to="/" className="w-24 md:w-32 text-2xl text-primary">
        <img src="/assets/logo/logo-kauri-dark.png" alt="Accueil Kauri" />
      </Link>
    </div>
  )
}