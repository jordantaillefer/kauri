import { DetailExerciceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { ExerciceEntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import { NavLink, useFetcher } from "@remix-run/react";
import { FunctionComponent } from "react"

import { ImageMuscle } from "~/ui/molecules/imageMuscle"
import { ExerciceSeancePopover } from "~/ui/organisms/ExerciceSeancePopover";

export const ListeExerciceSeance: FunctionComponent<{
  exerciceSeances: (DetailExerciceContrat | ExerciceEntrainementContrat)[]
  editable?: boolean
}> = ({ exerciceSeances, editable = false }) => {
  const fetcher = useFetcher({ key: "supprimer-seance"})
  
  return (
    <div className="flow-root h-full overflow-auto">
      <ul key="liste-exercice-seance">
        {exerciceSeances.map((exercice, exerciceItemIdx) => (
          <li key={`${exercice.nomExercice}-${exerciceItemIdx}`} className="bg-white rounded-lg shadow px-4 pt-4 mb-4">
            <div className="relative pb-4">
              <div className="relative flex space-x-4 items-center">
                <div className="relative z-[2]">
                  <ImageMuscle categorie={exercice.categorie} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 overflow-ellipsis overflow-hidden max-w-full whitespace-nowrap">
                      {exercice.nomExercice}
                    </p>
                  </div>
                </div>
                {
                  editable && (
                    <ExerciceSeancePopover>
                      <fetcher.Form method="DELETE">
                        <input type="hidden" name="idExerciceSeance" value={exercice.id} />
                        <button type="submit" name="_action" value="supprimer-exercice" className="relative rounded-lg p-4 hover:bg-gray-50 flex justify-center w-full">
                          <span className="font-semibold text-red-800">Supprimer l'exercice</span>
                        </button>
                      </fetcher.Form>
                      <NavLink to={exercice.id} className="relative rounded-lg p-4 hover:bg-gray-50 flex justify-center">
                        <span className="font-semibold text-gray-900">Modifier l'exercice</span>
                      </NavLink>
                    </ExerciceSeancePopover>
                  )
                }
              </div>
            </div>
            {exercice.series.map((serie, idSerie) => (
              <div key={`${exercice.nomExercice}-${serie.ordre}-${idSerie}`} className="relative flex gap-x-4">
                <div className="relative pb-4">
                  <span className="absolute left-5 bottom-10 -ml-px h-6 w-0.5 bg-main-kauri-lighter z-[1]" aria-hidden="true" />
                  <div className="relative flex items-start space-x-3">
                    <div className="relative flex h-4 w-6 pl-4 mb-2 flex-none items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-main-kauri ring-1 ring-main-kauri-lighter" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">Série n°{serie.ordre}</span> ⬝ Reps :{" "}
                        {serie.repetitions} ⬝ Repos : {serie.tempsRepos} secs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}
