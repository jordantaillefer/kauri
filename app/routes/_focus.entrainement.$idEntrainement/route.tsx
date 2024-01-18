import { DetailEntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import * as serverModule from "@/api/index.server"
import { PlayCircleIcon } from "@heroicons/react/20/solid"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useSubmit } from "@remix-run/react"
import { FunctionComponent, useEffect, useState } from "react"
import invariant from "tiny-invariant"

import { ListeExerciceSeance } from "~/routes/_default.trainings/ListeExerciceSeance"
import { ListeExerciceSeanceSideBar } from "~/routes/_focus.entrainement.$idEntrainement/ListeExerciceSeanceSideBar"
import { Card } from "~/ui/shared/Card"
import { Titre } from "~/ui/shared/Titre"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { idEntrainement } = params
  invariant(idEntrainement, "idEntrainement is missing")

  const payload = {
    idEntrainement
  }

  const entrainementResult = await serverModule.container
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

  console.log("action", _action)
  switch (_action) {
    case "valider-serie": {
      const { idSerie, idExercice } = Object.fromEntries(formData)

      const payload = {
        idSerieEntrainement: idSerie.toString(),
        idExerciceEntrainement: idExercice.toString()
      }
      console.log("payload", payload)
      await serverModule.container.resolve("entrainementController").realiserSerie({ request, payload })
      console.log("jeu")
    }
  }
  return null
}

const Entrainement: FunctionComponent = () => {
  const { entrainement, dernierExerciceActif, derniereSerieActive } = useLoaderData<typeof loader>()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEntrainementDemarre, setIsEntrainementDemarre] = useState<boolean>(false)
  const [isRepos, setIsRepos] = useState<boolean>(false)

  const [counter, setCounter] = useState(0);

  const submit = useSubmit()

  useEffect(() => {
    if (isRepos) {
      if (counter > 0) {
        setTimeout(() => setCounter(counter - 1), 1000);
      } else {
        setIsRepos(false)
        const formData = new FormData()
        formData.set("idSerie", derniereSerieActive!.id)
        formData.set("idExercice", dernierExerciceActif!.id)
        formData.set("_action", "valider-serie")
        submit(formData, {
          method: "post"
        })
      }
    }
  }, [counter]);

  const startTimer = (tempsRepos: number) => {
    setCounter(tempsRepos)
    setIsRepos(true)
  }

  const calculerWidth = (tempsRepos: number, counter: number) => {
    return counter === 0 ? 0 : 100 - (counter / tempsRepos) * 100
  }

  return (
    <div className="px-4">
      <Titre as="h2">Entrainement</Titre>
      <div className="flex justify-center w-full h-full">
        <Card className="relative items-start w-full sm:w-3/5 md:w-1/2 lg:w-1/2 h-full min-h-[90vh] md:min-h-[80vh] p-0 bg-gray-100">
          {
            !isEntrainementDemarre ? (
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
            <div className="flex flex-col w-full">
              <Titre as="h2" className="text-black px-4">{ entrainement.nomSeance }</Titre>
              <ul className="w-full px-4">
                {
                  entrainement.listeExerciceEntrainement.map(exerciceEntrainement => {
                    return (
                      <li key={exerciceEntrainement.id}>
                        {exerciceEntrainement.nomExercice}
                        <ul key={exerciceEntrainement.id} className="divide-y divide-gray-200 border-t border-gray-200 w-full pb-4 mt-2">
                          {exerciceEntrainement.series.map((serie, index) => (
                            <li key={serie.id} className="relative flex justify-between px-2 py-3 md:p-5">
                              {
                                serie.id === derniereSerieActive?.id ? (
                                <div
                                  style={{ width: `${calculerWidth(serie.tempsRepos, counter)}%` }}
                                  className="absolute top-0 left-0 bg-background-main opacity-50 h-full"/>
                                ) : null
                              }
                              {
                                serie.estRealise ? (
                                  <div
                                    className="absolute top-0 left-0 bg-background-main opacity-50 w-full h-full"/>
                                ) : null
                              }
                              <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none items-center">
                                <span
                                  className="h-8 w-8 md:h-12 md:w-12 flex justify-center items-center rounded-full bg-background-main text-white font-bold">{index + 1}</span>
                                <div className="min-w-0 flex-auto">
                                  <p className="text-sm font-semibold leading-6 text-gray-900">
                                    {serie.repetitions} répétitions
                                  </p>
                                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                    Poids : {serie.poids} kg * Repos : { serie.tempsRepos } secs
                                  </p>
                                </div>
                              </div>
                              {
                                serie.id === derniereSerieActive?.id ? (
                                  <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
                                    { counter } secs
                                    <button type="button" onClick={() => startTimer(serie.tempsRepos)}>
                                      <PlayCircleIcon className="h-8 w-8 flex-none text-gray-400" aria-hidden="true" />
                                    </button>
                                  </div>
                                ) : null
                              }
                            </li>
                            ))}
                        </ul>
                      </li>
                  )
                  })
                  }
                  </ul>
                  </div>
                  )
                  }
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
