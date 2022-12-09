import { SeanceEntrainementRepository } from "../domain/ports/SeanceEntrainementRepository"

interface Dependencies {
  seanceEntrainementRepository: SeanceEntrainementRepository
}

export class SupprimerSeanceEntrainementUseCase {
  private seanceEntrainementRepository: SeanceEntrainementRepository

  constructor({ seanceEntrainementRepository }: Dependencies) {
    this.seanceEntrainementRepository = seanceEntrainementRepository
  }

  async execute(idSeanceEntrainement: string) {
    await this.seanceEntrainementRepository.supprimerSeanceEntrainement(idSeanceEntrainement)
  }
}