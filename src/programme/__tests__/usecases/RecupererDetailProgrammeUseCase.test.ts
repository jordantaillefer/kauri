import { describe } from "vitest"
import { DeepMockProxy, mockDeep } from "vitest-mock-extended"

import { ProgrammeBuilder } from "../../../testUtils/builders/ProgrammeBuilder"
import { ProgrammeRepository } from "../../domain/ports/ProgrammeRepository"
import { RecupererDetailProgrammeUseCase } from "../../usecases/RecupererDetailProgrammeUseCase"

describe("RecupererDetailProgrammeUseCase", () => {
  let programmeRepository: DeepMockProxy<ProgrammeRepository>
  let recupererDetailProgrammeUseCase: RecupererDetailProgrammeUseCase

  beforeEach(() => {
    programmeRepository = mockDeep<ProgrammeRepository>()
    recupererDetailProgrammeUseCase = new RecupererDetailProgrammeUseCase({ programmeRepository })
  })

  it("Doit récupérer le détail d'un programme pour un utilisateur", async () => {
    // Act
    const programme = new ProgrammeBuilder().withId("idProgramme").build()
    programmeRepository.recupererParIdPourLUtilisateur.mockResolvedValue(programme)
    const programmeResult = await recupererDetailProgrammeUseCase.execute("idUtilisateur", "idProgramme")
    // Assert
    expect(programmeRepository.recupererParIdPourLUtilisateur).toHaveBeenNthCalledWith(1, "idUtilisateur", "idProgramme")
    expect(programmeResult?.id).toEqual("idProgramme")
  })
})