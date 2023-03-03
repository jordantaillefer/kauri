import { ExerciceSeance } from "../domain/ExerciceSeance"
import { ExerciceSeanceRepository } from "../domain/ports/ExerciceSeanceRepository"
import { SeanceExerciceRepository } from "../domain/ports/SeanceExerciceRepository"

export interface RecupererExerciceRepository extends Pick<SeanceExerciceRepository, "recupererParId"> {
}

export interface InitialiserExerciceSeanceRepository extends Pick<ExerciceSeanceRepository, "creerExerciceSeance"> {
}

interface Dependencies {
  seanceExerciceRepository: RecupererExerciceRepository
  exerciceSeanceRepository: InitialiserExerciceSeanceRepository
}

export class InitialiserExerciceSeanceUseCase {
  private seanceExerciceRepository: RecupererExerciceRepository // Pas ouf
  private exerciceSeanceRepository: InitialiserExerciceSeanceRepository

  constructor({
                seanceExerciceRepository,
                exerciceSeanceRepository
              }: Dependencies) {
    this.seanceExerciceRepository = seanceExerciceRepository
    this.exerciceSeanceRepository = exerciceSeanceRepository
  }

  async execute(idSeance: string, idExercice: string): Promise<ExerciceSeance> {
    const exercice = await this.seanceExerciceRepository.recupererParId(idExercice)
    const exerciceSeance = ExerciceSeance.creerExerciceSeance({
      idSeance,
      idExercice,
      nomExercice: exercice.nomExercice,
      categorie: exercice.categorie
    })
    await this.exerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
    return exerciceSeance
  }
}
