import { Seance } from "../domain/Seance"
import type { SeanceRepository } from "../domain/ports/SeanceRepository"

interface Dependencies {
  seanceRepository: SeanceRepository
}

export class InitialiserSeanceUseCase {
  private initialiserSeanceRepository: SeanceRepository

  constructor({ seanceRepository }: Dependencies) {
    this.initialiserSeanceRepository = seanceRepository
  }

  async execute(idUtilisateur: string): Promise<Seance> {
    const nomInitialSeance = "Nouvelle séance"
    const seance = Seance.creerSeance({ idUtilisateur, nomSeance: nomInitialSeance, exerciceSeances: [] })
    await this.initialiserSeanceRepository.creerSeance(seance)
    return seance
  }
}