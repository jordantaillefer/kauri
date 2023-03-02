import { IdSeance, IdUtilisateur, Seance } from "../domain/Seance"
import { SeanceRepository } from "../domain/ports/SeanceRepository"

interface Dependencies {
  seanceRepository: RecupererSeanceRepository
}

export interface RecupererSeanceRepository extends Pick<SeanceRepository, "recupererParId"> {}

export class RecupererSeanceUseCase {
  private seanceRepository: RecupererSeanceRepository

  constructor({ seanceRepository }: Dependencies) {
    this.seanceRepository = seanceRepository

  }

  async execute(idUtilisateur: IdUtilisateur, idSeance: IdSeance): Promise<Seance> {
    return this.seanceRepository.recupererParId(idSeance) // Mettre pour un utilisateur
  }
}
