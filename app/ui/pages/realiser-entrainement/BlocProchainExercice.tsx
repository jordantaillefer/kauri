import { ExerciceEntrainementContrat, SerieEntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat";
import { PrimaryButton } from "~/ui/atoms/PrimaryButton";

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
        <>
          <ul>
            <li>
              Exercice à réaliser : N°{prochainExercice.ordre} / {prochainExercice.nomExercice}
            </li>
            <li>
              Série n°{prochaineSerie.ordre} : {prochaineSerie.nombreRepetition} répétitions
            </li>

            <li>Temps Repos : {prochainExercice.tempsRepos}</li>
          </ul>

          <PrimaryButton onClick={onClick}>Valider serie</PrimaryButton>
        </>
      ) : (
        <span>Séance terminée</span>
      )}
    </>
  );
}
