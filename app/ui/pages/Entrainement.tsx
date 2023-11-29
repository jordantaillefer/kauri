import { container } from "@/api"
import { DetailEntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import { CATEGORIE } from "@/api/exercice/domain/categorie"
import { CheckIcon } from "@heroicons/react/20/solid"
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { FunctionComponent, useState } from "react"
import invariant from "tiny-invariant"

import { H2Title } from "~/ui/atoms/H2Title"
import { Card } from "~/ui/molecules/Card"
import { ListeExerciceSeanceSideBar } from "~/ui/molecules/ListeExerciceSeanceSideBar"
import { StopWatch } from "~/ui/organisms/StopWatch"
import { ListeExerciceSeance } from "~/ui/pages/trainings/ListeExerciceSeance"
import { AVAILABLE_MUSCLE } from "~/utils/AvailableMuscle"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { idEntrainement } = params
  invariant(idEntrainement, "idEntrainement is missing")

  const payload = {
    idEntrainement
  }

  const entrainementResult = await container
    .resolve("entrainementQuery")
    .recupererEntrainementParId({ request, payload })

  const entrainement = entrainementResult.data as DetailEntrainementContrat

  const dernierExerciceActif = entrainement.listeExerciceEntrainement.find(exercice => !exercice.estRealise)
  const derniereSerieActive = dernierExerciceActif?.series.find(serie => !serie.estRealise)

  return {
    entrainement,
    dernierExerciceActif,
    derniereSerieActive
  }
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "valider-serie": {
      const { idSerieEntrainement, idExerciceEntrainement } = Object.fromEntries(formData)

      const payload = {
        idSerieEntrainement: idSerieEntrainement.toString(),
        idExerciceEntrainement: idExerciceEntrainement.toString()
      }
      await container.resolve("entrainementController").realiserSerie({ request, payload })
    }
  }
  return null
}

const Entrainement: FunctionComponent = () => {
  const { entrainement, dernierExerciceActif, derniereSerieActive } = useLoaderData<typeof loader>()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEntrainementDemarre, setIsEntrainementDemarre] = useState<boolean>(false)

  const fetcher = useFetcher()

  return (
    <div className="px-4">
      <H2Title>Entrainement</H2Title>
      <div className="flex justify-center w-full h-full">
        <Card className="relative w-full sm:w-3/5 md:w-1/2 lg:w-1/3 h-full min-h-[90vh] md:min-h-[80vh] p-0 bg-gray-100">
          {!isEntrainementDemarre ? (
            <div className="p-4">
              <span>Récapitulatif de la séance {entrainement.nomSeance}</span>
              <div className="flex w-full">
                <ListeExerciceSeance exerciceSeances={entrainement.listeExerciceEntrainement} />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsEntrainementDemarre(true)}
                  className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                  Démarrer la séance
                </button>
              </div>
            </div>
          ) : (
            <>
              {dernierExerciceActif && derniereSerieActive ? (
                <>
                  <div>Entrainement démarre</div>
                  <img
                    className="absolute w-full object-cover top-0 left-0 h-40"
                    src={AVAILABLE_MUSCLE[dernierExerciceActif.categorie as CATEGORIE]}
                    alt=""
                  />
                  <div className="flex flex-col flex-1 mt-[8.5rem] w-full">
                    <div>
                      <ul className="flex w-full bg-gray-400 py-4 pl-4">
                        {dernierExerciceActif.series.map(serie => (
                          <li key={serie.id} className="relative bg-gray-200 py-1 px-2 mr-2">
                            Série {serie.ordre}
                            {serie.estRealise && (
                              <span className="absolute rounded-full bg-gray-300 -top-1 -right-1 ring-2 ring-gray-300 text-green-500">
                                <CheckIcon className="h-3 w-3" />
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{dernierExerciceActif.nomExercice}</h3>
                      <p>{ derniereSerieActive.repetitions } répétitions</p>
                    </div>
                    <div className="flex flex-col flex-1 justify-center w-full h-full items-center">
                      <StopWatch />
                    </div>
                    <div className="flex w-full justify-center mb-4">
                      <fetcher.Form method="POST">
                        <input type="hidden" name="idSerieEntrainement" value={derniereSerieActive.id} />
                        <input type="hidden" name="idExerciceEntrainement" value={dernierExerciceActif.id} />
                        <button
                          type="submit"
                          name="_action"
                          value="valider-serie"
                          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                        >
                          Valider la série
                        </button>
                      </fetcher.Form>
                    </div>
                  </div>
                </>
              ) : (
                <div>Entrainement terminé</div>
              )}
              <button
                className="absolute rounded-full bottom-2 md:bottom-0 right-6 md:-right-16 bg-gray-400 md:bg-gray-100 p-3"
                type="button"
                onClick={() => setIsOpen(true)}
              >
                {isOpen ? (
                  <ChevronDoubleRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                )}
              </button>
            </>
          )}
        </Card>
      </div>
      <ListeExerciceSeanceSideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        exerciceSeances={entrainement.listeExerciceEntrainement}
      />
    </div>
  )
}
export default Entrainement
