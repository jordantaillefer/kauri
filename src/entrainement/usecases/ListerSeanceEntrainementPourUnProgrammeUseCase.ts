import { SeanceEntrainement } from "../domain/SeanceEntrainement"
import { SeanceEntrainementRepository } from "../domain/ports/SeanceEntrainementRepository"

interface Dependencies {
  seanceEntrainementRepository: SeanceEntrainementRepository
}

export class ListerSeanceEntrainementPourUnProgrammeUseCase {
  private seanceEntrainementRepository: SeanceEntrainementRepository

  constructor({ seanceEntrainementRepository }: Dependencies) {
    this.seanceEntrainementRepository = seanceEntrainementRepository

  }

  async execute(idProgramme: string): Promise<SeanceEntrainement[]> {
    return this.seanceEntrainementRepository.recupererToutParIdProgramme(idProgramme)
  }
}