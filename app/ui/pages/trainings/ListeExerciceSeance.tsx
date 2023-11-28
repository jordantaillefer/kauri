import { DetailExerciceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { ExerciceEntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import { FunctionComponent } from "react"

import { ImageMuscle } from "~/ui/molecules/imageMuscle"

export const ListeExerciceSeance: FunctionComponent<{
  exerciceSeances: (DetailExerciceContrat | ExerciceEntrainementContrat)[]
}> = ({ exerciceSeances }) => {
  return (
    <div className="flow-root h-full overflow-auto">
      <ul key="liste-exercice-seance">
        {exerciceSeances.map((exercice, exerciceItemIdx) => (
          <li key={`${exercice.nomExercice}-${exerciceItemIdx}`} className="bg-white rounded-lg shadow px-4 pt-4 mb-4">
            <div className="relative pb-4">
              <div className="relative flex items-start space-x-4">
                <div className="relative z-[2]">
                  <ImageMuscle categorie={exercice.categorie} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 overflow-ellipsis overflow-hidden max-w-full whitespace-nowrap">{exercice.nomExercice}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Repos: {exercice.tempsRepos} secondes</p>
                </div>
              </div>
            </div>
            {exercice.series.map((serie, idSerie) => (
              <div key={`${exercice.nomExercice}-${serie.ordre}-${idSerie}`} className="relative flex gap-x-4">
                <div className="relative pb-4">
                  <span className="absolute left-5 bottom-10 -ml-px h-6 w-0.5 bg-gray-200 z-[1]" aria-hidden="true" />
                  <div className="relative flex items-start space-x-3">
                    <div className="relative flex h-4 w-6 pl-4 mb-2 flex-none items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">Série n°{serie.ordre}</span> ⬝ Reps :{" "}
                        {serie.repetitions}
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
