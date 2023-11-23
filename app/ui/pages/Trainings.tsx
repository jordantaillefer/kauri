import { container, ListeExerciceContrat } from "@/api";
import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Outlet, UIMatch, useLoaderData, useMatches, useParams } from "@remix-run/react";
import { ReasonPhrases } from "http-status-codes"
import { FunctionComponent, useState } from "react"

import { H2Title } from "~/ui/atoms/H2Title"
import { CreerSeanceCard } from "~/ui/organisms/CreerSeanceCard"
import { ListeSeance } from "~/ui/organisms/ListeSeance"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resultListerSeance = await container.resolve("seanceQuery").listerSeance({ request })

  const resultListerExercice = await container.resolve("exerciceQuery").listerExercice({ request })

  if (resultListerSeance.reasonPhrase === ReasonPhrases.FORBIDDEN) {
    redirect("/")
  }

  const listeSeance = resultListerSeance.data as DetailSeanceContrat[]
  const listeExercice = resultListerExercice.data as ListeExerciceContrat

  return json({
    listeSeance,
    listeExercice,
    listeCategorie: Object.keys(listeExercice).sort()
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "creer-seance": {
      await container.resolve("seanceController").initialiserSeance({ request })
      break
    }
  }

  return null
}

export const handle = {
  breadcrumb: () => ({ to: "/trainings", label: "Mes séances", state: "lister-seance" })
}

const Trainings: FunctionComponent = () => {
  const { listeSeance } = useLoaderData<typeof loader>()
  const matches = useMatches() as UIMatch<any, { breadcrumb: (match: UIMatch) => { to: string, label: string, state: string } }>[]

  const lastMatch = matches[matches.length - 1]
  const lastState = lastMatch.handle.breadcrumb(lastMatch).state

  const [idSeanceSelectionne, setIdSeanceSelectionne] = useState<string | null>(null)
  const { idSeance } = useParams()

  return (
    <div className="flex h-full">
      <div className={`${lastState === "lister-seance" || "max-md:hidden"} ${lastState === "ajouter-exercice" ? "lg:w-1/3" : "lg:w-2/3"} px-4 w-full md:w-1/2`}>
        <H2Title>Mes séances</H2Title>
        <div className="grid grid-cols-responsive gap-4">
          <ListeSeance
            listeSeance={listeSeance}
            idSeanceSelectionne={idSeanceSelectionne}
            setIdSeanceSelectionne={setIdSeanceSelectionne}
          />
          <CreerSeanceCard />
        </div>
      </div>
      <Outlet context={{ idSeanceSelectionne: idSeance, lastState }}></Outlet>
    </div>
  )
}

export default Trainings
