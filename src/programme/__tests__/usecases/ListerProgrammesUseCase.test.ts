import { describe } from "vitest"
import { mock } from "vitest-mock-extended"

import { ProgrammeRepository } from "../../domain/ports/ProgrammeRepository"

describe("ListerProgrammesUseCase", () => {
  let programmeRepository: ProgrammeRepository
  let listerProgrammesUseCase: ListerProgrammesUseCase

  beforeEach(() => {
    programmeRepository = mock<ProgrammeRepository>()
    listerProgrammesUseCase = new ListerProgrammesUseCase({ programmeRepository })
  })

  it("Doit lister les programmes", () => {

  })
})