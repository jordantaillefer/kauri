import { SerieExerciceSeance } from "../domain/SerieExerciceSeance"
import { ExerciceSeanceRepository } from "../domain/ports/ExerciceSeanceRepository"

interface Dependencies {
  exerciceSeanceRepository: DefinirSerieExerciceSeanceRepository
}

export type SerieExerciceSeancePayload = { repetitions: number }

export interface DefinirSerieExerciceSeanceRepository extends Pick<ExerciceSeanceRepository, "recupererParIdSeanceEtParId" | "supprimerSerieExerciceSeance" | "ajouterSerieExerciceSeance"> {
}

export class DefinirSerieExerciceSeanceUseCase {
  private exerciceSeanceRepository: DefinirSerieExerciceSeanceRepository

  constructor({ exerciceSeanceRepository }: Dependencies) {
    this.exerciceSeanceRepository = exerciceSeanceRepository
  }

  async execute(idSeance: string, idExerciceSeance: string, listeSerie: SerieExerciceSeancePayload[]) {
    const exerciceSeance = await this.exerciceSeanceRepository.recupererParIdSeanceEtParId(idSeance, idExerciceSeance)
    if (exerciceSeance.listeSerieExerciceSeance.length) {
      await this.exerciceSeanceRepository.supprimerSerieExerciceSeance(idExerciceSeance)
    }
    const listeSerieExerciceSeance = listeSerie.map((serie, index) => {
      return SerieExerciceSeance.creerSerieExerciceSeance({ repetitions: serie.repetitions, ordre: index + 1 })
    })
    exerciceSeance.definirSerie(listeSerieExerciceSeance)
    await this.exerciceSeanceRepository.ajouterSerieExerciceSeance(exerciceSeance)
  }
}
