import { ExerciceEntrainementContrat, SerieEntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat"
import { PrimaryButton } from "~/ui/atoms/PrimaryButton"
import classNames from "classnames";

export function BlocProchainExercice({
  prochainExercice,
  prochaineSerie,
  onClick
}: {
  prochainExercice: ExerciceEntrainementContrat
  prochaineSerie: SerieEntrainementContrat
  onClick: () => Promise<void>
}) {
  return (
    <>
      {prochainExercice ? (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-grow flex-col">
            <div className="bg-secondary p-4 text-secondary-darker rounded-md mb-4 h-fit">
              <p className="font-bold">{prochainExercice.nomExercice}</p>
              <p>Temps Repos : {prochainExercice.tempsRepos}</p>
            </div>
            <div>
              {
                prochainExercice.listeSerieEntrainement.map(serie => {
                  const serieClassNames = classNames("text-secondary", { "font-bold": serie.id === prochaineSerie.id, "text-secondary-lighter": serie.id === prochaineSerie.id })
                  return (
                    <p className={serieClassNames} key={serie.id}>
                      Série n°{serie.ordre} : {serie.nombreRepetition} répétitions
                    </p>
                  )
                })
              }

            </div>
          </div>

          <PrimaryButton onClick={onClick}>Valider serie</PrimaryButton>
        </div>
      ) : (
        <span>Séance terminée</span>
      )}
    </>
  )
}
