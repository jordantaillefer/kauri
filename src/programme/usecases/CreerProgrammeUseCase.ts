import { Programme } from "../domain/Programme"
import { ProgrammeRepository } from "../infrastructure/adapters/ProgrammeRepository"
import { ContainerDependencies } from "api"

export class CreerProgrammeUseCase {
  private programmeRepository: ProgrammeRepository

  constructor({ programmeRepository }: ContainerDependencies) {
    this.programmeRepository = programmeRepository
  }

  async execute(userId: string, nomProgramme: string) {
    const programme = Programme.creerProgramme({ userId, nomProgramme })
    await this.programmeRepository.creerProgramme(programme)
  }
}