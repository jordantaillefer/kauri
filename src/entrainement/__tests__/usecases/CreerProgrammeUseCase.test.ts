import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { format } from "../../../app/DateFormatter"
import { Programme } from "../../domain/Programme"
import { ProgrammeRepository } from "../../domain/ports/ProgrammeRepository"
import { CreerProgrammeUseCase } from "../../usecases/CreerProgrammeUseCase"

describe("CreerProgrammeUseCase", () => {
  let programmeRepository: MockProxy<ProgrammeRepository>
  let creerProgrammeUseCase: CreerProgrammeUseCase

  beforeEach(() => {
    programmeRepository = mock<ProgrammeRepository>()
    creerProgrammeUseCase = new CreerProgrammeUseCase({ programmeRepository })
  })
  it("doit créer le programme pour un utilisateur", async () => {
    // Arrange
    const programmeCaptor: CaptorMatcher<Programme> = captor()
    // Act
    await creerProgrammeUseCase.execute("idUtilisateur", "nomProgramme")
    // Assert
    expect(programmeRepository.creerProgramme).toHaveBeenNthCalledWith(1, programmeCaptor)
    expect(programmeCaptor.value.id).toBeDefined()
    expect(programmeCaptor.value.nomProgramme).toEqual("nomProgramme")
    expect(programmeCaptor.value.idUtilisateur).toEqual("idUtilisateur")
    expect(programmeCaptor.value.seancesEntrainement).toHaveLength(1)
    expect(programmeCaptor.value.seancesEntrainement.at(0)?.id).toBeDefined()
  })
})