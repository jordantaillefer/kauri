import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { EntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat"
import { container, SeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { PencilIcon } from "~/ui/icons/Pencil"
import { TrashIcon } from "~/ui/icons/Trash"
import { CreerSeanceButton } from "~/ui/molecules/CreerSeanceButton"

type LoaderData = {
  listeSeance: SeanceContrat[]
  listeEntrainement: EntrainementContrat[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const resultListerSeance = await container.resolve("seanceController").listerSeance({ request })
  const resultListerEntrainement = await container.resolve("entrainementController").listerEntrainement({ request })
  const listeSeance = resultListerSeance.data as SeanceContrat[]
  const listeEntrainement = resultListerEntrainement.data as EntrainementContrat[]
  return json<LoaderData>({ listeSeance, listeEntrainement })
}

export const action: ActionFunction = async ({ request }) => {
  const result = await container.resolve("seanceController").initialiserSeance({ request })
  const nouvelleSeance = result.data as SeanceContrat
  return redirect(`/seance/${nouvelleSeance.id}`)
}

export default function Profil() {
  const { listeSeance, listeEntrainement } = useLoaderData<LoaderData>()
  return (
    <div className="container">
      <H2Title>Liste des séances</H2Title>
      <div>
        <ul>
          {listeSeance.map(seance => (
            <li key={seance.id} className="flex">
              <Link to={`/seance/${seance.id}/resume`}>{seance.nomSeance}</Link>
              <Link to={`/seance/${seance.id}`}>
                <PencilIcon />
              </Link>
              <button>
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>

        <CreerSeanceButton />
      </div>

      <H2Title>Reprendre un entrainement</H2Title>
      <div>
        <ul>
          {listeEntrainement.map(entrainement => (
            <li key={entrainement.id}>
              <Link to={`/entrainement/${entrainement.id}`}>{entrainement.nomSeance}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
