import { Link } from "@remix-run/react"
import * as React from "react"

export function AccueilButton() {
  return (
    <div className="inline-flex ml-4 md:ml-0">
      <Link to="/" className="text-2xl text-primary">Kauri</Link>
    </div>
  )
}