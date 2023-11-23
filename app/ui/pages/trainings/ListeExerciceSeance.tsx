import { DetailExerciceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { ExerciceEntrainementContrat } from "@/api/app/contrats/EntrainementContrat"
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { Fragment, FunctionComponent } from "react"

import { ImageMuscle } from "~/ui/molecules/imageMuscle"

export const ListeExerciceSeance: FunctionComponent<{
  exerciceSeances: (DetailExerciceContrat | ExerciceEntrainementContrat)[]
}> = ({ exerciceSeances }) => {
  return (
    <div className="flow-root h-full overflow-auto">
      <ul key="liste-exercice-seance">
        {exerciceSeances.map((exercice, exerciceItemIdx) => (
          <Fragment key={exerciceItemIdx}>
            <li key={`${exercice.nomExercice}-${exerciceItemIdx}`}>
              <div className="relative pb-4 pt-4">
                <div className="relative flex items-start space-x-4">
                  <div className="relative z-[2]">
                    <ImageMuscle categorie={exercice.categorie} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{exercice.nomExercice}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Temps de repos entre chaque série: {exercice.tempsRepos}
                    </p>
                  </div>
                </div>
              </div>
            </li>
            {exercice.series.map((serie, idSerie) => (
              <li key={`${exercice.nomExercice}-${serie.ordre}-${idSerie}`} className="relative flex gap-x-4">
                <div className="relative pb-4">
                  <span className="absolute left-5 bottom-10 -ml-px h-6 w-0.5 bg-gray-200 z-[1]" aria-hidden="true" />
                  <div className="relative flex items-start space-x-3">
                    <div>
                      <div className="relative px-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                          <UserCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">Série n°{serie.ordre}</span> ⬝ Nombre de répétions :{" "}
                        {serie.repetitions}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
