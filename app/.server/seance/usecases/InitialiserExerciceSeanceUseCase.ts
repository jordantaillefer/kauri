import { ExerciceSeance } from "../domain/ExerciceSeance"
import type { SeanceExerciceRepository } from "../domain/ports/SeanceExerciceRepository"
import type { SeanceRepository } from "../domain/ports/SeanceRepository"
import { SerieExerciceSeance } from "~/.server/seance/domain/SerieExerciceSeance"

interface Dependencies {
  seanceExerciceRepository: SeanceExerciceRepository
  seanceRepository: SeanceRepository
}

export class InitialiserExerciceSeanceUseCase {
  private seanceExerciceRepository: SeanceExerciceRepository
  private seanceRepository: SeanceRepository

  constructor({ seanceExerciceRepository, seanceRepository }: Dependencies) {
    this.seanceExerciceRepository = seanceExerciceRepository
    this.seanceRepository = seanceRepository
  }

  async execute({
    idSeance,
    idExercice,
    series
  }: {
    idSeance: string
    idExercice: string
    series: { repetitions: number, tempsRepos: number, poids: number }[]
  }): Promise<ExerciceSeance> {
    const exercice = await this.seanceExerciceRepository.recupererParId(idExercice)
    const seance = await this.seanceRepository.recupererParId(idSeance)

    const exerciceSeance = ExerciceSeance.creerExerciceSeance({
      idSeance,
      idExercice,
      nomExercice: exercice.nomExercice,
      ordre: (seance.exerciceSeances.at(-1)?.ordre || 0) + 1,
      categorie: exercice.categorie,
      listeSerieExerciceSeance: series.map((serie, index) => {
        return SerieExerciceSeance.creerSerieExerciceSeance({ repetitions: serie.repetitions, tempsRepos: serie.tempsRepos, poids: serie.poids, ordre: index + 1 })
      })
    })

    await this.seanceRepository.ajouterExerciceSeanceASeance(idSeance, exerciceSeance)

    return exerciceSeance
  }
}
