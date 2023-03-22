import { EntrainementRepository } from "../domain/ports/EntrainementRepository"

export interface RealiserEntrainementRepository extends Pick<EntrainementRepository, "mettreAJourExerciceEstRealise"> {
}

interface Dependencies {
  entrainementRepository: RealiserEntrainementRepository
}

export class RealiserExerciceUseCase {
  private entrainementRepository: RealiserEntrainementRepository

  constructor({ entrainementRepository }: Dependencies) {
    this.entrainementRepository = entrainementRepository
  }

  async execute({ idUtilisateur, idExercice }: { idExercice: string; idUtilisateur: string }) {
    await this.entrainementRepository.mettreAJourExerciceEstRealise(idExercice, true)
  }
}
