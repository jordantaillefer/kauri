import * as React from "react"
import { Link } from "@remix-run/react"

export function AccueilButton() {
  return (
    <div className="inline-flex">
      <Link to="/" className="text-2xl text-primary">Kauri</Link>
    </div>
  )
}