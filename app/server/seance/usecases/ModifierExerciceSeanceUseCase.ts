import { ExerciceSeance } from "../domain/ExerciceSeance"
import type { SeanceExerciceRepository } from "../domain/ports/SeanceExerciceRepository"
import type { SeanceRepository } from "../domain/ports/SeanceRepository"
import { SerieExerciceSeance } from "~/server/seance/domain/SerieExerciceSeance"
import type { ExerciceSeanceRepository } from "@/api/seance/domain/ports/ExerciceSeanceRepository";

interface Dependencies {
  seanceExerciceRepository: SeanceExerciceRepository
  seanceRepository: SeanceRepository
  exerciceSeanceRepository: ExerciceSeanceRepository
}

export class ModifierExerciceSeanceUseCase {
  private seanceExerciceRepository: SeanceExerciceRepository
  private seanceRepository: SeanceRepository
  private exerciceSeanceRepository: ExerciceSeanceRepository

  constructor({ seanceExerciceRepository, seanceRepository, exerciceSeanceRepository }: Dependencies) {
    this.seanceExerciceRepository = seanceExerciceRepository
    this.seanceRepository = seanceRepository
    this.exerciceSeanceRepository = exerciceSeanceRepository
  }

  async execute({
                  idSeance,
                  idExerciceSeance,
                  idExercice,
                  series
                }: {
    idSeance: string
    idExerciceSeance: string
    idExercice: string
    series: { repetitions: number, tempsRepos: number }[]
  }): Promise<ExerciceSeance> {
    const exercice = await this.seanceExerciceRepository.recupererParId(idExercice)
    const seance = await this.seanceRepository.recupererParId(idSeance)
    const exerciceSeanceAModifier = seance.exerciceSeances.find(exercice => exercice.id === idExerciceSeance)

    await this.exerciceSeanceRepository.supprimerSerieExerciceSeance(idExerciceSeance)

    const exerciceSeance = ExerciceSeance.creerExerciceSeance({
      id: idExerciceSeance,
      idSeance,
      idExercice,
      nomExercice: exercice.nomExercice,
      ordre: exerciceSeanceAModifier?.ordre || 0,
      categorie: exercice.categorie,
      listeSerieExerciceSeance: series.map((serie, index) => {
        return SerieExerciceSeance.creerSerieExerciceSeance({ repetitions: serie.repetitions, tempsRepos: serie.tempsRepos, ordre: index + 1 })
      })
    })

    await this.exerciceSeanceRepository.modifierExerciceSeance(exerciceSeance)

    return exerciceSeance
  }
}
