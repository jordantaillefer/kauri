import type { ActionFunction, LoaderFunction, TypedResponse } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { useState } from "react"

import { container, SeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { CreerSeanceButton } from "~/ui/molecules/CreerSeanceButton"

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<{ listeSeance: SeanceContrat[] }>> => {
  const result = await container.resolve("seanceController").listerSeance({ request })
  const listeSeance = result.data as SeanceContrat[]
  return json({ listeSeance })
}

export const action: ActionFunction = async ({ request }) => {
  const result = await container.resolve("seanceController").initialiserSeance({ request })
  const nouvelleSeance = result.data as SeanceContrat
  return redirect(`/seance/${nouvelleSeance.id}`)
}

export default function Profil() {
  const { listeSeance } = useLoaderData<{ listeSeance: SeanceContrat[] }>()
  return (
    <div className="container">
      <H2Title>Liste des séances</H2Title>
      <div>
        <ul>
          {
            listeSeance.map(seance => (
                <li key={seance.id}>
                  <Link to={`/entrainement/${seance.id}`}>{seance.nomSeance}</Link>
                  <Link to={`/seance/${seance.id}`}>[[icon__modifier]]</Link>
                  <button>[[icon__supprimer]]</button>
                </li>
              )
            )
          }
        </ul>

        <CreerSeanceButton />
      </div>
    </div>
  )
}