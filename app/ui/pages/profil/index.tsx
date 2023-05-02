import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { addDays, format, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"

import { EntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat"
import { container, SeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { PencilIcon } from "~/ui/icons/Pencil"
import { TrashIcon } from "~/ui/icons/Trash"
import { CreerSeanceButton } from "~/ui/molecules/CreerSeanceButton"
import { HeaderCalendar } from "~/ui/organisms/HeaderCalendar"

type LoaderData = {
  listeSeance: SeanceContrat[]
  listeEntrainement: EntrainementContrat[]
  day: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const resultListerSeance = await container.resolve("seanceController").listerSeance({ request })
  const resultListerEntrainement = await container.resolve("entrainementController").listerEntrainement({ request })
  const listeSeance = resultListerSeance.data as SeanceContrat[]
  const listeEntrainement = resultListerEntrainement.data as EntrainementContrat[]

  const url = new URL(request.url)

  const day = url.searchParams.get("day") || dates[2].daysAndMonth

  return json<LoaderData>({ listeSeance, listeEntrainement, day })
}

export const action: ActionFunction = async ({ request }) => {
  const result = await container.resolve("seanceController").initialiserSeance({ request })
  const nouvelleSeance = result.data as SeanceContrat
  return redirect(`/seance/${nouvelleSeance.id}`)
}

enum Categorie {
  ENTRAINEMENT = "entrainement",
  SEANCE = "seance"
}

const formatDate = (date: Date) => format(date, "dd/MM")
const formatStrDate = (date: Date) => format(date, "EEE", { locale: fr })
const now = new Date()
const dates = [
  {
    daysAndMonth: formatDate(subDays(now, 2)),
    days: formatStrDate(subDays(now, 2))
  },
  {
    daysAndMonth: formatDate(subDays(now, 1)),
    days: formatStrDate(subDays(now, 1))
  },
  {
    daysAndMonth: formatDate(now),
    days: formatStrDate(now)
  },
  {
    daysAndMonth: formatDate(addDays(now, 1)),
    days: formatStrDate(addDays(now, 1))
  },
  {
    daysAndMonth: formatDate(addDays(now, 2)),
    days: formatStrDate(addDays(now, 2))
  }
]

export default function Profil() {
  const { listeSeance, listeEntrainement, day } = useLoaderData<LoaderData>()

  const [categorieSelected, setCategorieSelected] = useState<Categorie>(Categorie.ENTRAINEMENT)

  return (
    <div className="relative">
      <div className="container">
        <HeaderCalendar selected={day} dates={dates} />

        <div className="flex w-full justify-between">
          <button
            className={`border-2 border-primary rounded-full px-4 py-1 ${
              categorieSelected === Categorie.ENTRAINEMENT
                ? "text-white bg-primary shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                : "text-primary"
            }`}
            onClick={() => setCategorieSelected(Categorie.ENTRAINEMENT)}
          >
            Mon entrainement
          </button>
          <button
            className={`border-2 border-primary rounded-full px-4 py-1 ${
              categorieSelected === Categorie.SEANCE
                ? "text-white bg-primary shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                : "text-primary"
            }`}
            onClick={() => setCategorieSelected(Categorie.SEANCE)}
          >
            Mes séances
          </button>
        </div>
        {categorieSelected === Categorie.SEANCE && (
          <>
            <H2Title>Liste des séances</H2Title>
            <div>
              <ul>
                {listeSeance.map(seance => (
                  <li key={seance.id} className="flex text-primary w-full border border-primary rounded mb-2 p-4 justify-between">
                    <Link to={`/seance/${seance.id}/resume`}>{seance.nomSeance}</Link>
                    <div className="flex">
                      <Link to={`/seance/${seance.id}`} className="mr-2">
                        <PencilIcon />
                      </Link>
                      <button>
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {categorieSelected === Categorie.ENTRAINEMENT && (
          <>
            <H2Title>Reprendre un entrainement</H2Title>
            <div>
              <ul>
                {listeEntrainement.map(entrainement => (
                  <li key={entrainement.id} className="text-primary w-full border border-primary rounded mb-2 p-4">
                    <Link to={`/entrainement/${entrainement.id}`}>{entrainement.nomSeance}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      {categorieSelected === Categorie.SEANCE && (
        <div className="fixed bottom-0 left-0 w-full p-8">
          <CreerSeanceButton />
        </div>
      )}
    </div>
  )
}
