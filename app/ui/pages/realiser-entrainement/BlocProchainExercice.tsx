import { ExerciceEntrainementContrat, SerieEntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat"
import { clsxm } from "~/utils/clsxm";

export function BlocProchainExercice({
  prochainExercice,
  prochaineSerie,
}: {
  prochainExercice: ExerciceEntrainementContrat
  prochaineSerie: SerieEntrainementContrat
}) {
  return (
    <>
      {prochainExercice ? (
        <div className="flex flex-col">
          <div className="mb-4 h-fit rounded-md p-4 bg-primary text-secondary-darker">
            <p className="font-bold">{prochainExercice.nomExercice}</p>
            <p>Temps Repos : {prochainExercice.tempsRepos}</p>
          </div>
          <div>
            {prochainExercice.listeSerieEntrainement.map(serie => {
              const serieClassNames = clsxm("text-primary", {
                "text-secondary font-bold": serie.id === prochaineSerie.id
              })
              return (
                <p className={serieClassNames} key={serie.id}>
                  Série n°{serie.ordre} : {serie.nombreRepetition} répétitions
                </p>
              )
            })}
          </div>
        </div>
      ) : (
        <span>Séance terminée</span>
      )}
    </>
  )
}
