import type { Exercice } from "../Exercice"

export interface ExerciceRepository {
  creerExercice(exercice: Exercice): Promise<void>
}