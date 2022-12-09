import { Programme } from "../domain/Programme"
import { ProgrammeRepository } from "../domain/ports/ProgrammeRepository"

interface Dependencies {
  programmeRepository: ProgrammeRepository
}

export class CreerProgrammeUseCase {
  private programmeRepository: ProgrammeRepository

  constructor({ programmeRepository }: Dependencies) {
    this.programmeRepository = programmeRepository
  }

  async execute(idUtilisateur: string, nomProgramme: string): Promise<Programme> {
    const programme = Programme.creerProgramme({ idUtilisateur, nomProgramme })
    programme.initialiserProgramme()
    await this.programmeRepository.creerProgramme(programme)
    return programme
  }
}