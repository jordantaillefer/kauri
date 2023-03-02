import { Exercice } from "../Exercice"

export interface ExerciceRepository {
  creerExercice(exercice: Exercice): Promise<void>

  recupererTout(): Promise<Exercice[]>
}