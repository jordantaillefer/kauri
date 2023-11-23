import { container, ExerciceContrat, ListeExerciceContrat } from "@/api";
import { CATEGORIE } from "@/api/exercice/domain/categorie"
import { ChevronRightIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { ActionFunction, redirect } from "@remix-run/node";
import { useFetcher, useOutletContext, useRouteLoaderData } from "@remix-run/react";
import { AgnosticDataIndexRouteObject } from "@remix-run/router"
import { FunctionComponent, useState } from "react"

import { H2Title } from "~/ui/atoms/H2Title"
import { AVAILABLE_MUSCLE } from "~/utils/AvailableMuscle"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "ajouter-exercice": {
      const { idExercice, tempsRepos, idSeance } = Object.fromEntries(formData)
      const inputSeries = formData.getAll("inputSerie")
      const payload = {
        idSeance: idSeance?.toString(),
        idExercice: idExercice?.toString(),
        tempsRepos: Number(tempsRepos.toString()),
        series: inputSeries.map(inputSerie => Number(inputSerie.toString()))
      }
      await container.resolve("exerciceSeanceController").creerExerciceSeance({ request, payload })
      return redirect(`/trainings/${idSeance}`)
    }
  }

}

export const handle: AgnosticDataIndexRouteObject["handle"] = {
  breadcrumb: ({ params }: { params: { idSeance: string } }) => {
    return {
      to: `/trainings/${params.idSeance}/ajouter-exercice`,
      label: "Ajouter un exercice",
      state: "ajouter-exercice"
    }
  }
}

const AjouterExerciceSeance: FunctionComponent = () => {
  const { idSeanceSelectionne, lastState } = useOutletContext<{ idSeanceSelectionne: string, lastState: string }>()

  const [exerciceSelectionne, setExerciceSelectionne] = useState<ExerciceContrat | null>(null)
  const [listeSerie, setListeSerie] = useState<{ nombreRepetitions: number }[]>([{ nombreRepetitions: 1 }])

  const ajouterSerie = () => {
    setListeSerie([...listeSerie, { nombreRepetitions: 1 }])
  }

  const data = useRouteLoaderData<{ listeExercice: ListeExerciceContrat }>("routes/_default.trainings")

  const fetcher = useFetcher<{ nbSerie: number }>({ key: "ajouter-exercice" })

  if (!data) return null

  const sortedListeExercice = Object.values(data.listeExercice)
    .flatMap(exercices => exercices)
    .sort((exercice1, exercice2) => exercice1.nomExercice.localeCompare(exercice2.nomExercice))

  return (
    <div
      className={`${
        lastState === "ajouter-exercice" ? "" : "max-md:hidden"
      } flex flex-col w-full lg:w-1/3 px-4 h-full border-l border-gray-300 divide-y divide-gray-200`}
    >
      <H2Title>Ajouter un exercice</H2Title>
      {exerciceSelectionne ? (
        <fetcher.Form method="POST">
          <input type="hidden" name="_action" value="ajouter-exercice" />
          <input type="hidden" name="idSeance" value={idSeanceSelectionne} />
          <input type="hidden" name="idExercice" value={exerciceSelectionne.id} />
          <div
            key={exerciceSelectionne.id}
            className="group relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50 sm:px-6"
          >
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={AVAILABLE_MUSCLE[exerciceSelectionne.categorie as CATEGORIE]}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <button className="flex text-left" onClick={() => setExerciceSelectionne(null)}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {exerciceSelectionne.nomExercice}
                  </button>
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  <span className="relative truncate hover:underline">{exerciceSelectionne.categorie}</span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-background-main group-hover:text-primary text-sm leading-6 text-gray-900">Annuler</p>
              </div>
              <XMarkIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <div className="flow-root space-y-4">
            <input
              type="number"
              name="tempsRepos"
              id="tempsRepos"
              pattern="\d*"
              inputMode="numeric"
              placeholder="Temps de repos entre chaque répétitions"
              defaultValue={30}
              className="block w-full rounded-md border-0 mt-4 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <ul className="my-4 space-y-4">
              {listeSerie.map((serie, serieId) => (
                <li key={serieId}>
                  <div className="relative">
                    {serieId !== listeSerie.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div className="flex justify-center items-center">
                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white bg-main-kauri text-white">
                          {serieId + 1}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <input
                          type="number"
                          name="inputSerie"
                          id="nbRepetition"
                          placeholder="Nombre de répétition"
                          defaultValue={serie.nombreRepetitions}
                          className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <button
                  type="button"
                  onClick={ajouterSerie}
                  className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PlusIcon className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Ajouter une série
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            >
              Confirmer la création
            </button>
          </div>
        </fetcher.Form>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-auto">
          {sortedListeExercice.map(exercice => (
            <li
              key={exercice.id}
              className="group relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={AVAILABLE_MUSCLE[exercice.categorie as CATEGORIE]}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <button className="flex text-left" onClick={() => setExerciceSelectionne(exercice)}>
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {exercice.nomExercice}
                    </button>
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    <span className="relative truncate hover:underline">{exercice.categorie}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-background-main group-hover:text-primary text-sm leading-6 text-gray-900">
                    Ajouter
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default AjouterExerciceSeance
