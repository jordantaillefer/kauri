import { IdUtilisateur, Seance } from "../domain/Seance"
import { SeanceRepository } from "../domain/ports/SeanceRepository"

interface Dependencies {
  seanceRepository: ListerSeanceRepository
}

export interface ListerSeanceRepository extends Pick<SeanceRepository, "recupererTout"> {
}

export class ListerSeanceUseCase {
  private seanceRepository: ListerSeanceRepository

  constructor({ seanceRepository }: Dependencies) {
    this.seanceRepository = seanceRepository

  }

  async execute(idUtilisateur: IdUtilisateur): Promise<Seance[]> {
    return this.seanceRepository.recupererTout(idUtilisateur)
  }
}
