import type { SeanceRepository } from "../domain/ports/SeanceRepository"
import { Seance } from "@/api/seance/domain/Seance"
import { ExerciceSeance } from "@/api/seance/domain/ExerciceSeance"
import { SerieExerciceSeance } from "@/api/seance/domain/SerieExerciceSeance"
import type { ExerciceSeanceRepository } from "@/api/seance/domain/ports/ExerciceSeanceRepository"

interface Dependencies {
  seanceRepository: SeanceRepository
  exerciceSeanceRepository: ExerciceSeanceRepository
}

export class DupliquerSeanceUseCase {
  private seanceRepository: SeanceRepository
  private exerciceSeanceRepository: ExerciceSeanceRepository

  constructor({ seanceRepository, exerciceSeanceRepository }: Dependencies) {
    this.exerciceSeanceRepository = exerciceSeanceRepository
    this.seanceRepository = seanceRepository
  }

  async execute({ idSeance, idUtilisateur }: { idSeance: string; idUtilisateur: string }): Promise<Seance> {
    const seance = await this.seanceRepository.recupererDetailParId(idSeance)
    const seanceDuplique = Seance.creerSeance({
      nomSeance: `Séance dupliqué depuis : ${seance.nomSeance}`,
      idUtilisateur,
      exerciceSeances: []
    })

    await this.seanceRepository.creerSeance(seanceDuplique)

    await Promise.all(
      seance.listeDetailExercice.map(exerciceSeance => {
        const exerciceSeanceDuplique = ExerciceSeance.creerExerciceSeance({
          idSeance: seanceDuplique.id,
          idExercice: exerciceSeance.nomExercice,
          nomExercice: exerciceSeance.nomExercice,
          ordre: exerciceSeance.ordre,
          categorie: exerciceSeance.categorie,
          listeSerieExerciceSeance: exerciceSeance.listeDetailSerie.map((serie, index) => {
            return SerieExerciceSeance.creerSerieExerciceSeance({
              repetitions: serie.nombreRepetition,
              tempsRepos: serie.tempsRepos,
              poids: serie.poids,
              ordre: index + 1
            })
          })
        })
        return this.exerciceSeanceRepository.creerExerciceSeance(exerciceSeanceDuplique)
      })
    )
    return seanceDuplique
  }
}
