import { ExerciceSeance } from "../domain/ExerciceSeance"
import { SeanceExerciceRepository } from "../domain/ports/SeanceExerciceRepository"
import { SeanceRepository } from "../domain/ports/SeanceRepository"

export interface RecupererExerciceRepository extends Pick<SeanceExerciceRepository, "recupererParId"> {
}

export interface InitialiserExerciceSeanceRepository extends Pick<SeanceRepository, "recupererParId" | "ajouterExerciceSeanceASeance"> {

}

interface Dependencies {
  seanceExerciceRepository: RecupererExerciceRepository
  seanceRepository: InitialiserExerciceSeanceRepository
}

export class InitialiserExerciceSeanceUseCase {
  private seanceExerciceRepository: RecupererExerciceRepository // Pas ouf
  private seanceRepository: InitialiserExerciceSeanceRepository

  constructor({
                seanceExerciceRepository,
                seanceRepository
              }: Dependencies) {
    this.seanceExerciceRepository = seanceExerciceRepository
    this.seanceRepository = seanceRepository
  }

  async execute(idSeance: string, idExercice: string): Promise<ExerciceSeance> {
    const exercice = await this.seanceExerciceRepository.recupererParId(idExercice)
    const seance = await this.seanceRepository.recupererParId(idSeance)

    const exerciceSeance = ExerciceSeance.creerExerciceSeance({
      idSeance,
      idExercice,
      nomExercice: exercice.nomExercice,
      ordre: (seance.exerciceSeances.at(-1)?.ordre || 0) + 1,
      categorie: exercice.categorie
    })

    await this.seanceRepository.ajouterExerciceSeanceASeance(idSeance, exerciceSeance)
    return exerciceSeance
  }
}
