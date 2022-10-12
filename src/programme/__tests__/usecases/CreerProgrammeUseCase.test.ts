import { describe, expect, it } from "vitest"
import { captor, mock, MockProxy } from "vitest-mock-extended"
import { CaptorMatcher } from "vitest-mock-extended/lib/Matchers"

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
    const programmeCaptor: CaptorMatcher<Programme> = captor()
    // Act
    await creerProgrammeUseCase.execute("id", "nomProgramme")
    // Assert
    expect(programmeRepository.creerProgramme).toHaveBeenNthCalledWith(1, programmeCaptor)
    expect(programmeCaptor.value.id).toBeDefined()
    expect(programmeCaptor.value.nomProgramme).toEqual("nomProgramme")
    expect(programmeCaptor.value.userId).toEqual("id")
  })
})