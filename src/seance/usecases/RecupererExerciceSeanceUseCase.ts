import { ExerciceSeance } from "../domain/ExerciceSeance"
import { ExerciceSeanceRepository } from "../domain/ports/ExerciceSeanceRepository"

interface Dependencies {
  exerciceSeanceRepository: RecupererExerciceSeanceParIdEtSeanceIdRepository
}

export interface RecupererExerciceSeanceParIdEtSeanceIdRepository extends Pick<ExerciceSeanceRepository, "recupererParIdSeanceEtParId"> {
}

export class RecupererExerciceSeanceUseCase {
  private exerciceSeanceRepository: RecupererExerciceSeanceParIdEtSeanceIdRepository

  constructor({ exerciceSeanceRepository }: Dependencies) {
    this.exerciceSeanceRepository = exerciceSeanceRepository
  }

  async execute(idSeance: string, idExerciceSeance: string): Promise<ExerciceSeance> {
    return this.exerciceSeanceRepository.recupererParIdSeanceEtParId(idSeance, idExerciceSeance)
  }
}
