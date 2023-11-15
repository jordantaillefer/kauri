import { ExerciceContrat, ListeExerciceContrat } from "@/api"
import { PlusIcon } from "@heroicons/react/24/solid";
import { useFetcher } from "@remix-run/react"
import { FunctionComponent, MouseEventHandler, useEffect, useState } from "react";

import { SelectionCategorie } from "~/ui/molecules/SelectionCategorie"
import { SelectionExercice } from "~/ui/molecules/SelectionExercice"
import { Modale } from "~/ui/organisms/Modale"

export const AjouterExerciceModale: FunctionComponent<{
  listeExercice: ListeExerciceContrat
  listeCategorie: string[]
}> = ({ listeExercice, listeCategorie }) => {
  const [open, setOpen] = useState(false)

  const [categorie, setSelectedCategorie] = useState(listeCategorie[0])
  const [exerciceSelectionne, setExerciceSelectionne] = useState<ExerciceContrat | null>(null)
  const [listeExerciceSelectionne, setListeExerciceSelectionne] = useState<ExerciceContrat[]>(listeExercice[categorie])

  const [listeSerie, setListeSerie] = useState<{ nombreRepetitions: number}[]>([{ nombreRepetitions: 0 }])

  const fetcher = useFetcher<{ nbSerie: number }>({ key: "ajouter-exercice" })

  const ajouterSerie = () => {
    setListeSerie([...listeSerie, { nombreRepetitions: 0 }])
  }

  const submitForm: MouseEventHandler<HTMLButtonElement> = (event) => {
    fetcher.submit(event.currentTarget.form)
    setOpen(false)
  }

  useEffect(() => {
    setListeExerciceSelectionne(listeExercice[categorie])
  }, [categorie, listeExercice])

  return (
    <Modale labelBouton="Ajouter un exercice" titre="Ajouter un exercice" open={open} setOpen={setOpen}>
      <fetcher.Form method="POST">
        <input type="hidden" name="_action" value="ajouter-exercice" />
        <div className="flex gap-4">
          <div className="w-1/6 max-h-[80vh] overflow-scroll">
            <SelectionCategorie
              listeCategorie={listeCategorie}
              categorie={categorie}
              setSelectedCategorie={setSelectedCategorie}
            />
          </div>
          <div className="w-2/6 max-h-[80vh] overflow-scroll">
            <SelectionExercice
              listeExerciceSelectionne={listeExerciceSelectionne}
              exerciceSelectionne={exerciceSelectionne}
              setExerciceSelectionne={setExerciceSelectionne}
            />
          </div>
          <div className="w-3/6">
            {exerciceSelectionne && (
              <div className="flex flex-col justify-between h-full">
                <input type="hidden" name="idExercice" value={exerciceSelectionne?.id} />
                <div>
                  <p className="mb-2">{exerciceSelectionne?.nomExercice}</p>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {listeSerie.map((serie, serieId) => (
                        <li key={serieId}>
                          <div className="relative pb-8">
                            {serieId !== listeSerie.length - 1 ? (
                              <span
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div className="flex justify-center items-center">
                                <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-green-500 text-white">
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
                  </div>
                  <div className="relative mt-4">
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
                <div className="flex w-full justify-between">
                  <div>
                    <label htmlFor="tempsRepos" className="block text-sm font-medium leading-6 text-gray-900">
                      Temps de repos entre chaque répétitions
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="tempsRepos"
                        id="tempsRepos"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={submitForm}
                    className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                  >
                    Confirmer la création
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </fetcher.Form>
    </Modale>
  )
}
