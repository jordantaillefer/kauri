import { Exercice } from "../Exercice"

export interface SeanceExerciceRepository {
  recupererParId(idExercice: string): Promise<Exercice>

  creerExercice(exercice: Exercice): Promise<void>
}
