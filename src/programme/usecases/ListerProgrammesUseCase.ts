import { Programme } from "../domain/Programme"
import { ProgrammeRepository } from "../domain/ports/ProgrammeRepository"

interface Dependencies {
  programmeRepository: ProgrammeRepository
}

export class ListerProgrammesUseCase {
  private _programmeRepository: ProgrammeRepository

  constructor({ programmeRepository }: Dependencies) {
    this._programmeRepository = programmeRepository
  }

  async execute(idUtilisateur: string): Promise<Programme[]> {
    return this._programmeRepository.recupererToutPourLUtilisateur(idUtilisateur)
  }
}