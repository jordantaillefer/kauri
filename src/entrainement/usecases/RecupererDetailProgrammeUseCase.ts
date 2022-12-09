import { Programme } from "../domain/Programme"
import { ProgrammeRepository } from "../domain/ports/ProgrammeRepository"

interface Dependencies {
  programmeRepository: ProgrammeRepository
}

export class RecupererDetailProgrammeUseCase {
  private programmeRepository: ProgrammeRepository

  constructor({ programmeRepository }: Dependencies) {
    this.programmeRepository = programmeRepository
  }

  async execute(idUtilisateur: string, idProgramme: string): Promise<Programme> {
    return this.programmeRepository.recupererParIdPourLUtilisateur(idUtilisateur, idProgramme)
  }
}