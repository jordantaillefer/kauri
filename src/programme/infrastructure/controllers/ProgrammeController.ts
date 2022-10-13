import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"

interface Dependencies {
  creerProgrammeUseCase: CreerProgrammeUseCase
}

export class ProgrammeController implements Dependencies {
  creerProgrammeUseCase: CreerProgrammeUseCase

  constructor({ creerProgrammeUseCase }: Dependencies) {
    this.creerProgrammeUseCase = creerProgrammeUseCase
  }

  async creerProgramme(userId: string, nomProgramme: string): Promise<void> {
    await this.creerProgrammeUseCase.execute(userId, nomProgramme)
  }
}