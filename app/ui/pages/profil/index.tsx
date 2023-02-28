import type { ActionFunction, LoaderFunction, TypedResponse } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"

import { SeanceContrat } from "../../../../src/app/contrats/SeanceContrat"
import { container } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { CreerSeanceButton } from "~/ui/molecules/CreerSeanceButton"

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<any[]>> => {
  return json([])
}

export const action: ActionFunction = async ({ request }) => {
  const result = await container.resolve("seanceController").initialiserSeance({ request })
  const nouvelleSeance = result.data as SeanceContrat
  return redirect(`/seance/${nouvelleSeance.id}`)
}

export default function Profil() {
  return (
    <div className="container">
      <H2Title>Liste des séances</H2Title>
      <div>
        <CreerSeanceButton />
      </div>
    </div>
  )
}