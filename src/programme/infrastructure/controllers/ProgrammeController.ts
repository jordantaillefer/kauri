import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"
import { ContainerDependencies } from "api"

export class ProgrammeController {
  private creerProgrammeUseCase: CreerProgrammeUseCase

  constructor({ creerProgrammeUseCase }: ContainerDependencies) {
    this.creerProgrammeUseCase = creerProgrammeUseCase
  }

  async creerProgramme(userId: string, nomProgramme: string): Promise<void> {
    await this.creerProgrammeUseCase.execute(userId, nomProgramme)
  }
}