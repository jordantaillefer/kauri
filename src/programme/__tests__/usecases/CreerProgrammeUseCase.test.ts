import { describe, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { Programme } from "../../domain/Programme"
import { ProgrammeRepository } from "../../infrastructure/adapters/ProgrammeRepository"
import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"

describe("CreerProgrammeUseCase", () => {
  let programmeRepository: MockProxy<ProgrammeRepository>
  let creerProgrammeUseCase: CreerProgrammeUseCase

  beforeEach(() => {
    programmeRepository = mock<ProgrammeRepository>()
    creerProgrammeUseCase = new CreerProgrammeUseCase(programmeRepository)
  })
  it("doit créer le programme pour un utilisateur", async () => {
    // Arrange
    const userId = "id"
    const nomProgramme = "nomProgramme"
    // Act
    await creerProgrammeUseCase.execute(userId, nomProgramme)
    // Assert
    expect(programmeRepository.creerProgramme).toHaveBeenNthCalledWith(1, Programme.creerProgramme(userId, nomProgramme))
  })
})