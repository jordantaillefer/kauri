import { describe } from "vitest"
import { DeepMockProxy, mockDeep } from "vitest-mock-extended"

import { ProgrammeBuilder } from "../../../testUtils/builders/ProgrammeBuilder"
import { ProgrammeRepository } from "../../domain/ports/ProgrammeRepository"
import { ListerProgrammesUseCase } from "../../usecases/ListerProgrammesUseCase"

describe("ListerProgrammesUseCase", () => {
  let programmeRepository: DeepMockProxy<ProgrammeRepository>
  let listerProgrammesUseCase: ListerProgrammesUseCase

  beforeEach(() => {
    programmeRepository = mockDeep<ProgrammeRepository>()
    listerProgrammesUseCase = new ListerProgrammesUseCase({ programmeRepository })
  })

  it("Doit lister les programmes pour un utilisateur", async () => {
    // Assert
    const programme = new ProgrammeBuilder().withId("idProgramme").build()
    programmeRepository.recupererToutPourLUtilisateur.mockResolvedValue([programme])
    // Act
    const listeDeProgrammes = await listerProgrammesUseCase.execute("idUtilisateur")
    // Assert
    expect(programmeRepository.recupererToutPourLUtilisateur).toHaveBeenNthCalledWith(1, "idUtilisateur")
    expect(listeDeProgrammes.length).toEqual(1)
    expect(listeDeProgrammes.at(0)?.id).toEqual("idProgramme")
  })
})