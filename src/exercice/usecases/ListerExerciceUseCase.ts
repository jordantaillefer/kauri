import { Exercice } from "../domain/Exercice"
import { ExerciceRepository } from "../domain/ports/ExerciceRepository"
export interface ListerExerciceRepository extends Pick<ExerciceRepository, "recupererTout"> {}

interface Dependencies {
  exerciceRepository: ListerExerciceRepository
}

export class ListerExerciceUseCase {
  private exerciceRepository: ListerExerciceRepository

  constructor({ exerciceRepository }: Dependencies) {
    this.exerciceRepository = exerciceRepository

  }

  async execute(): Promise<Exercice[]> {
    return this.exerciceRepository.recupererTout()
  }
}
