import type { LoaderFunction, TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"

import { ProgrammeContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<ProgrammeContrat[]>> => {

  return json([])
}

export default function Profil() {
  return (
    <div className="container">
      <H2Title>Liste des séances</H2Title>

    </div>
  )
}