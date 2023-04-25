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
        <div className="flex flex-grow flex-col">
          <div className="flex flex-grow flex-col">
            <div className="mb-4 h-fit rounded-md p-4 bg-secondary text-secondary-darker">
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
