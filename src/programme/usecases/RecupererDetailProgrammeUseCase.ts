import { ProgrammeRepository } from "../domain/ports/ProgrammeRepository"
import { Programme } from "../domain/Programme"

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