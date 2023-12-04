import { container } from "@/api";
import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { SeanceExplorationContrat } from "@/api/app/contrats/SeanceExplorationContrat";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { AgnosticDataIndexRouteObject } from "@remix-run/router"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant";

import { H2Title } from "~/ui/atoms/H2Title"
import { ListeExerciceSeance } from "~/ui/pages/trainings/ListeExerciceSeance"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.idSeance)

  const payload = {
    idSeance: params.idSeance
  }

  const resultRecupererSeance = await container.resolve("seanceQuery").recupererSeanceParId({ request, payload })

  const seanceSelectionne = resultRecupererSeance.data as DetailSeanceContrat

  return {
    seanceSelectionne
  }
}

type ParentMatchData = { params: { idSeance: string }; data: { listeSeance: SeanceExplorationContrat[] } };
type CurrentMatchData = { params: { idSeance: string }; data: { seanceSelectionne: DetailSeanceContrat } };

export const handle: AgnosticDataIndexRouteObject["handle"] = {
  breadcrumb: (parentMatch: ParentMatchData, currentMatch: CurrentMatchData ) => {
    if (currentMatch) {
      const seanceSelectionne = currentMatch.data.seanceSelectionne

      return { to: `/trainings/${currentMatch.params.idSeance}`, label: seanceSelectionne.nomSeance, state: "consulter-seance", isDynamic: true }
    }
    return { to: `/trainings/${parentMatch.params.idSeance}`, label: "Aucune séance", state: "consulter-seance" }
  }
}

const TrainingSeance: FunctionComponent = () => {
  const { seanceSelectionne } = useLoaderData<typeof loader>()
  const { lastState } = useOutletContext<{ idSeanceSelectionne: string, lastState: string }>()

  const { idSeance: idSeanceSelectionne } = useParams()

  return (
    <>
      <div
        className={`${lastState === "consulter-seance" || "max-md:hidden"} flex flex-col w-full lg:w-1/3 px-4 h-full border-l border-gray-300`}
      >
        {idSeanceSelectionne ? (
          <>
            <div>
              <H2Title>Résumé de la séance</H2Title>
              <ListeExerciceSeance exerciceSeances={seanceSelectionne.exerciceSeances} />
            </div>
            <div className="w-full flex justify-center pb-4">
              {idSeanceSelectionne && (
                <button
                  type="button"
                  className="rounded-md bg-gray-300 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Dupliquer cette séance
                </button>
              )}
            </div>
          </>
        ) : (
          <H2Title>Aucune séance séléctionnée</H2Title>
        )}
      </div>
    </>
  )
}
export default TrainingSeance
