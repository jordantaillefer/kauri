import { EntrainementRepository } from "../domain/ports/EntrainementRepository"

export interface RealiserSerieRepository extends Pick<EntrainementRepository, "recupererExerciceEntrainementParId" | "mettreAJourExercice"> {
}

interface Dependencies {
  entrainementRepository: RealiserSerieRepository
}

export class RealiserSerieUseCase {
  private entrainementRepository: RealiserSerieRepository

  constructor({ entrainementRepository }: Dependencies) {
    this.entrainementRepository = entrainementRepository
  }

  async execute({ idUtilisateur, idExercice, idSerie }: { idUtilisateur: string, idExercice: string, idSerie: string }) {
    const exerciceEntrainement = await this.entrainementRepository.recupererExerciceEntrainementParId(idExercice)
    exerciceEntrainement.mettreAJourSerieEstRealise(idSerie, true)
    exerciceEntrainement.mettreAJourEstRealise()

    await this.entrainementRepository.mettreAJourExercice(exerciceEntrainement)
  }
}
