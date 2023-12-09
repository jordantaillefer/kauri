import { Entrainement } from "../domain/Entrainement"
import { ExerciceEntrainement } from "../domain/ExerciceEntrainement"
import { SerieEntrainement } from "../domain/SerieEntrainement"
import type { EntrainementRepository } from "../domain/ports/EntrainementRepository"
import type { SeanceRepository } from "../domain/ports/SeanceRepository"

interface Dependencies {
  seanceRepository: SeanceRepository
  entrainementRepository: EntrainementRepository
}

export class DemarrerEntrainementUseCase {
  private seanceRepository: SeanceRepository
  private entrainementRepository: EntrainementRepository

  constructor({ seanceRepository, entrainementRepository }: Dependencies) {
    this.seanceRepository = seanceRepository
    this.entrainementRepository = entrainementRepository
  }

  async execute({ idSeance, idUtilisateur }: { idSeance: string; idUtilisateur: string }): Promise<Entrainement> {
    const detailSeance = await this.seanceRepository.recupererDetailParId(idSeance)
    const listeExerciceEntrainement = detailSeance.listeDetailExercice.map(detailExercice => {
      const listeSerieEntrainement = detailExercice.listeDetailSerie.map(serie => {
        return SerieEntrainement.creerSerieEntrainement({
          nombreRepetition: serie.nombreRepetition,
          tempsRepos: serie.tempsRepos,
          ordre: serie.ordre,
          estRealise: false
        })
      })

      return ExerciceEntrainement.creerExerciceEntrainement({
        estRealise: false,
        nomExercice: detailExercice.nomExercice,
        categorie: detailExercice.categorie,
        ordre: detailExercice.ordre,
        listeSerieEntrainement
      })
    })
    const entrainement = Entrainement.creerEntrainement({
      nomSeance: detailSeance.nomSeance,
      idUtilisateur,
      listeExerciceEntrainement
    })

    await this.entrainementRepository.creerEntrainement(entrainement)
    return entrainement
  }
}
