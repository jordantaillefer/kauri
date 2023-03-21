import { Entrainement } from "../domain/Entrainement"
import { EntrainementRepository } from "../domain/ports/EntrainementRepository"

interface Dependencies {
  entrainementRepository: ListerEntrainementRepository
}

export interface ListerEntrainementRepository extends Pick<EntrainementRepository, "recupererTout"> {
}

export class ListerEntrainementUseCase {
  private entrainementRepository: ListerEntrainementRepository

  constructor({ entrainementRepository }: Dependencies) {
    this.entrainementRepository = entrainementRepository

  }

  async execute(idUtilisateur: string): Promise<Entrainement[]> {
    return this.entrainementRepository.recupererTout(idUtilisateur)
  }
}
