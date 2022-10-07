import { Programme } from "../domain/Programme"
import { ProgrammeRepository } from "../domain/ports/ProgrammeRepository"

export class CreerProgrammeUseCase {
  private programmeRepository: ProgrammeRepository

  constructor(programmeRepository: ProgrammeRepository) {
    this.programmeRepository = programmeRepository
  }

  async execute(userId: string, nomProgramme: string) {
    const programme = Programme.creerProgramme(userId, nomProgramme)
    await this.programmeRepository.creerProgramme(programme)
  }
}