import { Seance } from "../domain/Seance"
import { SeanceRepository } from "../domain/ports/SeanceRepository"

export interface InitialiserSeanceRepository extends Pick<SeanceRepository, "creerSeance"> {}

interface Dependencies {
  seanceRepository: InitialiserSeanceRepository
}

export class InitialiserSeanceUseCase {
  private initialiserSeanceRepository: InitialiserSeanceRepository

  constructor({ seanceRepository }: Dependencies) {
    this.initialiserSeanceRepository = seanceRepository
  }

  async execute(idUtilisateur: string) {
    const nomInitialSeance = "Nouvelle séance"
    const seance = Seance.creerSeance({ idUtilisateur, nomSeance: nomInitialSeance })
    await this.initialiserSeanceRepository.creerSeance(seance)
  }
}