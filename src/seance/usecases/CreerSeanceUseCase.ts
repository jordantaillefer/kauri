import { Seance } from "../domain/Seance"
import { SeanceRepository } from "../domain/ports/SeanceRepository"

export interface CreerSeanceRepository extends Pick<SeanceRepository, "creerSeance"> {}

interface Dependencies {
  creerSeanceRepository: CreerSeanceRepository
}

export class CreerSeanceUseCase {
  private creerSeanceRepository: CreerSeanceRepository

  constructor({ creerSeanceRepository }: Dependencies) {
    this.creerSeanceRepository = creerSeanceRepository
  }

  async execute(idUtilisateur: string, nomSeance: string) {
    const seance = Seance.creerSeance({ idUtilisateur, nomSeance })
    await this.creerSeanceRepository.creerSeance(seance)
  }
}