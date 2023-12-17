import type { EntrainementRepository } from "../domain/ports/EntrainementRepository"

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

  async execute({ idExerciceEntrainement, idSerieEntrainement }: { idUtilisateur: string, idExerciceEntrainement: string, idSerieEntrainement: string }) {
    const exerciceEntrainement = await this.entrainementRepository.recupererExerciceEntrainementParId(idExerciceEntrainement)
    exerciceEntrainement.mettreAJourSerieEstRealise(idSerieEntrainement, true)
    exerciceEntrainement.mettreAJourEstRealise()

    await this.entrainementRepository.mettreAJourExercice(exerciceEntrainement)
  }
}
