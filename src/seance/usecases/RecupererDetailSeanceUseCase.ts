import { DetailSeance } from "../domain/DetailSeance"
import { SeanceRepository } from "../domain/ports/SeanceRepository"

export interface RecupererDetailParIdSeanceRepository extends Pick<SeanceRepository, "recupererDetailParId"> {
}

interface Dependencies {
  seanceRepository: RecupererDetailParIdSeanceRepository
}

export class RecupererDetailSeanceUseCase {
  private seanceRepository: RecupererDetailParIdSeanceRepository

  constructor({ seanceRepository }: Dependencies) {
    this.seanceRepository = seanceRepository
  }

  execute({ idUtilisateur, idSeance }: { idUtilisateur: string, idSeance: string }): Promise<DetailSeance> {
    return this.seanceRepository.recupererDetailParId(idUtilisateur, idSeance)
  }

}
