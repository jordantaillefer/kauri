import { EntrainementRepository } from "../domain/ports/EntrainementRepository"

export interface RealiserEntrainementRepository extends Pick<EntrainementRepository, "mettreAJourEntrainementEstRealise"> {
}

interface Dependencies {
  entrainementRepository: RealiserEntrainementRepository
}

export class RealiserEntrainementUseCase {
  private entrainementRepository: RealiserEntrainementRepository

  constructor({ entrainementRepository }: Dependencies) {
    this.entrainementRepository = entrainementRepository
  }

  async execute({ idUtilisateur, idEntrainement }: { idEntrainement: string; idUtilisateur: string }) {
    await this.entrainementRepository.mettreAJourEntrainementEstRealise(idEntrainement, true)
  }
}
