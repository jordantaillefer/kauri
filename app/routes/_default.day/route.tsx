import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { EntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import { SportifEvenementContrat } from "@/api/app/contrats/SportifEvenementContrat"
import * as serverModule from "@/api/index.server"
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { format } from "date-fns"
import { FunctionComponent, useState } from "react"

import { SeanceCard } from "~/routes/_default.trainings/SeanceCard"
import { Titre } from "~/ui/shared/Titre"

export const handle = {
  breadcrumb: () => ({ to: "/day", label: "Ma journée", state: "day" })
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload = {
    date: format(new Date(), "yyyy-MM-dd")
  }
  const resultListerEvenement = await serverModule.container
    .resolve("sportifQuery")
    .listerEvenementParDate({ request, payload })

  const payloadListeSeance = {
    listeSeanceIds: ((resultListerEvenement?.data as SportifEvenementContrat[]) || []).map(
      evenement => evenement.idSeance
    )
  }

  const resultListerSeanceParIds = await serverModule.container
    .resolve("seanceQuery")
    .listerSeanceParIds({ request, payload: payloadListeSeance })
  const listeSeance = resultListerSeanceParIds.data as DetailSeanceContrat[]

  const listeSportifEvenement = resultListerEvenement.data as SportifEvenementContrat[]

  return {
    listeSportifEvenement,
    listeSeance
  }
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "demarrer-entrainement": {
      const { idSeance } = Object.fromEntries(formData)

      const payload = {
        idSeance: idSeance.toString()
      }

      const demarrerEntrainementResult = await serverModule.container
        .resolve("entrainementController")
        .demarrerEntrainement({ request, payload })
      const nouvelEntrainement = demarrerEntrainementResult.data as EntrainementContrat
      return redirect(`/entrainement/${nouvelEntrainement.id}`)
    }
  }
  return null
}

const Day: FunctionComponent = () => {
  const { listeSeance } = useLoaderData<typeof loader>()
  const [idSeanceSelectionne, setIdSeanceSelectionne] = useState<string | null>(null)

  const fetcher = useFetcher()

  return (
    <div className="px-4">
      <Titre as="h2">Séance du jour</Titre>
      <div className="grid grid-cols-responsive gap-4 mb-4">
        {listeSeance.length > 0 ? (
          listeSeance.map(seance => (
            <button
              className="text-left"
              key={seance.id}
              type="button"
              onClick={() => setIdSeanceSelectionne(seance.id)}
            >
              <SeanceCard
                name={seance.nomSeance}
                description={`${seance.exerciceSeances.length} exercice${seance.exerciceSeances.length > 1 ? "s" : ""}`}
                active={seance.id === idSeanceSelectionne}
              ></SeanceCard>
            </button>
          ))
        ) : (
          <div>Aucun séance aujourd'hui</div>
        )}
      </div>
      <fetcher.Form method="POST">
        {idSeanceSelectionne && <input type="hidden" name="idSeance" value={idSeanceSelectionne} />}
        <button
          type="submit"
          name="_action"
          value="demarrer-entrainement"
          className={`rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${
            !idSeanceSelectionne ? "pointer-events-none" : ""
          }`}
        >
          Démarrer cette séance
        </button>
      </fetcher.Form>
    </div>
  )
}
export default Day
