import { DetailEntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import * as serverModule from "@/api/index.server"
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/20/solid"
import { logoBlue } from "@remix-run/dev/dist/colors"
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

  const entrainementResult = await serverModule
    .getContainer()
    .resolve("entrainementQuery")
    .recupererEntrainementParId({ request, payload })

  const entrainement = entrainementResult.data as DetailEntrainementContrat

  const dernierExerciceActif = entrainement.listeExerciceEntrainement.find(exercice => !exercice.estRealise)
  const prochainExercice = entrainement.listeExerciceEntrainement.find(
    exercice => exercice.ordre === (dernierExerciceActif?.ordre || 0) + 1
  )
  const derniereSerieActive = dernierExerciceActif?.series.find(serie => !serie.estRealise)

  return {
    entrainement,
    dernierExerciceActif,
    prochainExercice,
    derniereSerieActive
  }
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "valider-serie": {
      const { idSerie, idExercice } = Object.fromEntries(formData)

      const payload = {
        idSerieEntrainement: idSerie.toString(),
        idExerciceEntrainement: idExercice.toString()
      }
      await serverModule.getContainer().resolve("entrainementController").realiserSerie({ request, payload })
    }
  }
  return null
}

const Entrainement: FunctionComponent = () => {
  const { entrainement, dernierExerciceActif, derniereSerieActive, prochainExercice } = useLoaderData<typeof loader>()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEntrainementDemarre, setIsEntrainementDemarre] = useState<boolean>(false)
  const [isRepos, setIsRepos] = useState<boolean>(false)

  const [time, setTime] = useState(0)
  const [initialTime, setInitialTime] = useState(0)
  const [tempsRepos, setTempsRepos] = useState(0)

  const submit = useSubmit()

  useEffect(() => {
    if (isRepos) {
      const interval = setInterval(() => {
        if (time === 0) {
          clearInterval(interval)
          const formData = new FormData()
          formData.set("idSerie", derniereSerieActive!.id)
          formData.set("idExercice", dernierExerciceActif!.id)
          formData.set("_action", "valider-serie")
          submit(formData, {
            method: "post"
          })
          setIsRepos(false)
        } else {
          const remainingTime = Date.now()
          setTime(tempsRepos - Math.trunc((remainingTime - initialTime) / 1000))
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [time, dernierExerciceActif, derniereSerieActive, isRepos, submit, tempsRepos, initialTime])

  const startTimer = (tempsRepos: number) => {
    setTime(tempsRepos)
    setTempsRepos(tempsRepos)
    setInitialTime(Date.now())
    setIsRepos(true)
  }

  const calculerWidth = (tempsRepos: number, counter: number) => {
    return counter > 0 ? 100 - (counter / tempsRepos) * 100 : counter === 0 && isRepos ? 100 : 0;
  }

  return (
    <>
      <div className="flex flex-grow flex-col items-center w-full h-full">
        <Card className="flex-col flex-grow relative items-start w-full sm:w-3/5 md:w-1/2 lg:w-1/2 h-full md:min-h-[80vh] md:mt-8 p-0 bg-gray-100 rounded-none">
          {!isEntrainementDemarre ? (
            <div className="p-4 w-full">
              <p className="pb-4">Récapitulatif de la séance {entrainement.nomSeance}</p>
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
            <div className="flex flex-col flex-grow w-full justify-between">
              {dernierExerciceActif ? (
                <>
                  <div>
                    <Titre as="h2" className="text-black px-4">
                      {dernierExerciceActif.nomExercice}
                    </Titre>
                    <div key={dernierExerciceActif.id}>
                      <ul
                        key={dernierExerciceActif.id}
                        className="divide-y divide-gray-200 border-t border-b border-gray-200 w-full mt-2 px-4"
                      >
                        {dernierExerciceActif.series.map((serie, index) => (
                          <li key={serie.id} className="relative flex justify-between px-2 py-3 md:p-5">
                            {serie.id === derniereSerieActive?.id ? (
                              <div
                                style={{ width: `${calculerWidth(serie.tempsRepos, time)}%` }}
                                className="transition-all ease-linear duration-1000 absolute top-0 left-0 bg-background-main opacity-50 h-full"
                              />
                            ) : null}
                            {serie.estRealise ? (
                              <div className="absolute top-0 left-0 bg-background-main opacity-50 w-full h-full" />
                            ) : null}
                            <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none items-center">
                              <span className="h-8 w-8 md:h-12 md:w-12 flex justify-center items-center rounded-full bg-background-main text-white font-bold">
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  {serie.repetitions} répétitions
                                </p>
                                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                  <b className="pr-1">Poids : </b>
                                  {serie.poids} kg<b className="pl-2 pr-1">Repos : </b>
                                  {serie.tempsRepos} secs
                                </p>
                              </div>
                            </div>
                            {serie.id === derniereSerieActive?.id ? (
                              <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
                                {time > 0 || (time === 0 && isRepos) ? <span>{time} secs</span> : null}

                                {isRepos ? (
                                  <button type="button" onClick={() => setIsRepos(false)}>
                                    <PauseCircleIcon className="h-8 w-8 flex-none text-gray-400" aria-hidden="true" />
                                  </button>
                                ) : (
                                  <button type="button" onClick={() => startTimer(time > 0 ? time : derniereSerieActive.tempsRepos)}>
                                    <PlayCircleIcon className="h-8 w-8 flex-none text-gray-400" aria-hidden="true" />
                                  </button>
                                )}
                              </div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 border-t border-background-main">
                    {prochainExercice ? (
                      <div>
                        <b>A suivre : </b> {prochainExercice.nomExercice}
                      </div>
                    ) : (
                      <div>A suivre : Fin séance</div>
                    )}
                  </div>
                </>
              ) : (
                <div>entrainement terminé</div>
              )}
            </div>
          )}
        </Card>
        <div className="bg-background-main w-full h-12" />
      </div>
      <ListeExerciceSeanceSideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        exerciceSeances={entrainement.listeExerciceEntrainement}
      />
    </>
  )
}
export default Entrainement
