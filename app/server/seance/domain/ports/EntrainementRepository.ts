import type { Entrainement } from "../Entrainement"
import type { ExerciceEntrainement } from "../ExerciceEntrainement";

export interface EntrainementRepository {
  creerEntrainement: (entrainement: Entrainement) => Promise<void>

  mettreAJourSerieEstRealise: (idSerie: string, estRealise: boolean) => Promise<void>

  mettreAJourExerciceEstRealise: (idEntrainement: string, estRealise: boolean) => Promise<void>

  recupererExerciceEntrainementParId(idExercice: string): Promise<ExerciceEntrainement>

  mettreAJourExercice(exerciceEntrainement: ExerciceEntrainement): Promise<void>
}
