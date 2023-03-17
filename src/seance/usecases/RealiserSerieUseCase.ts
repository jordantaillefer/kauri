import { EntrainementRepository } from "../domain/ports/EntrainementRepository"

export interface RealiserSerieRepository extends Pick<EntrainementRepository, "mettreAJourSerieEstRealise"> {
}

interface Dependencies {
  entrainementRepository: RealiserSerieRepository
}

export class RealiserSerieUseCase {
  private entrainementRepository: RealiserSerieRepository

  constructor({ entrainementRepository }: Dependencies) {
    this.entrainementRepository = entrainementRepository
  }

  async execute({ idUtilisateur, idSerie }: { idSerie: string; idUtilisateur: string }) {
    await this.entrainementRepository.mettreAJourSerieEstRealise(idSerie, true)
  }
}
