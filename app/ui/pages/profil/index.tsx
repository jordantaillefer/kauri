import type { LoaderFunction, TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { container, ProgrammeContrat } from "api"
import { H2Title } from "~/ui/molecules/H2Title"

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<ProgrammeContrat[]>> => {

  return json([])
}

export default function Profil() {
  return (
    <div className="container">
      <H2Title>Mon profil</H2Title>
    </div>
  )
}