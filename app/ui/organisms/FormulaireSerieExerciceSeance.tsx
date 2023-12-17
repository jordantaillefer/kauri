import { ExerciceContrat } from "@/api/app/contrats"
import { CATEGORIE } from "@/api/exercice/domain/categorie";
import { TrashIcon } from "@heroicons/react/24/outline"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

import { AVAILABLE_MUSCLE } from "~/utils/AvailableMuscle";

export type SerieCreation = { id: number; tempsRepos: string; nombreRepetitions: string, poids: string }
export const FormulaireSerieExerciceSeance: FunctionComponent<{
  exerciceSelectionne: ExerciceContrat,
  setExerciceSelectionne: Dispatch<SetStateAction<ExerciceContrat | null>>,
  listeSerie: SerieCreation[],
  setListeSerie: Dispatch<SetStateAction<SerieCreation[]>>
}> = ({ exerciceSelectionne, setExerciceSelectionne, listeSerie, setListeSerie }) => {

  const ajouterSerie = () => {
    setListeSerie([
      ...listeSerie,
      {
        id: listeSerie.length,
        tempsRepos: `${listeSerie.at(listeSerie.length - 1)?.tempsRepos || 12}`,
        nombreRepetitions: `${listeSerie.at(listeSerie.length - 1)?.nombreRepetitions || 12}`,
        poids: `${listeSerie.at(listeSerie.length - 1)?.poids || 12}`
      }
    ]);
  };
  const supprimerSerie = (index: number) => {
    listeSerie.splice(index, 1);
    setListeSerie([
    ...listeSerie
    ]);
  };

  return (
    <>
      <div
        key={exerciceSelectionne.id}
        className="group relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50 sm:px-6"
      >
        <div className="flex min-w-0 gap-x-4">
          <img
            className="h-12 w-12 flex-none rounded-full bg-gray-50"
            src={AVAILABLE_MUSCLE[exerciceSelectionne.categorie as CATEGORIE]}
            alt="de la catégorie du muscle de l'exercice"
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
        <div className="flex shrink-0 items-center gap-x-2">
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="text-background-main group-hover:text-primary text-sm leading-6 text-gray-900">Annuler</p>
          </div>
          <XMarkIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </div>
      </div>
      <div className="flow-root space-y-4">
        <ul className="my-4 space-y-4">
          {listeSerie.map((serie, index) => (
            <li key={index}>
              <div className="relative">
                {index !== listeSerie.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div className="flex justify-center items-center">
                    <span className="h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white bg-main-kauri text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div className="relative flex w-1/4 rounded-md shadow-sm">
                    <input
                      type="number"
                      name="nombreRepetitions"
                      pattern="\d*"
                      inputMode="numeric"
                      id="nombreRepetitions"
                      onChange={event => {
                        listeSerie.at(index)!.nombreRepetitions = event.target.value
                        setListeSerie([...listeSerie])
                      }}
                      value={serie.nombreRepetitions}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">reps</div>
                  </div>
                  <div className="relative rounded-md shadow-sm w-1/4">
                    <input
                      type="number"
                      name="tempsRepos"
                      id="tempsRepos"
                      pattern="\d*"
                      inputMode="numeric"
                      placeholder="Repos"
                      onChange={event => {
                        listeSerie.at(index)!.tempsRepos = event.target.value
                        setListeSerie([...listeSerie])
                      }}
                      value={serie.tempsRepos}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">secs</div>
                  </div>
                  <div className="relative rounded-md shadow-sm w-1/4">
                    <input
                      type="number"
                      name="poids"
                      id="poids"
                      pattern="\d*"
                      inputMode="numeric"
                      placeholder="Poids"
                      onChange={event => {
                        listeSerie.at(index)!.poids = event.target.value
                        setListeSerie([...listeSerie])
                      }}
                      value={serie.poids}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">kg</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => supprimerSerie(index)}
                    className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <TrashIcon className="-ml-1 -mr-0.5 h-5 w-5 text-red-500" aria-hidden="true" />
                  </button>
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
    </>
  )
};
