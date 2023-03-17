import { EntrainementRepository } from "../domain/ports/EntrainementRepository"
import { Entrainement } from "../domain/Entrainement"

export interface RecupererParIdEntrainementRepository extends Pick<EntrainementRepository, "recupererParId"> {
}

interface Dependencies {
  entrainementRepository: RecupererParIdEntrainementRepository
}

export class RecupererEntrainementUseCase {
  private entrainementRepository: RecupererParIdEntrainementRepository

  constructor({ entrainementRepository }: Dependencies) {
    this.entrainementRepository = entrainementRepository
  }

  async execute({ idEntrainement, idUtilisateur }: { idEntrainement: string; idUtilisateur: string }): Promise<Entrainement> {
    return this.entrainementRepository.recupererParId(idEntrainement)
  }
}
