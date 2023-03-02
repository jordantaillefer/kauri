
import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { SeanceBuilder } from "../../../testUtils/builders/SeanceBuilder"
import { RecupererSeanceRepository, RecupererSeanceUseCase } from "../../usecases/RecupererSeanceUseCase"
import { Seance } from "../../domain/Seance"

describe("RecupererSeanceUseCase", () => {
  let seanceRepository: MockProxy<RecupererSeanceRepository>
  let recupererSeanceUseCase: RecupererSeanceUseCase

  beforeEach(() => {
    seanceRepository = mock<RecupererSeanceRepository>()
    recupererSeanceUseCase = new RecupererSeanceUseCase({ seanceRepository })
  })
  it("doit récupérer les séances", async () => {
    // Arrange
    const recupererSeanceCaptor: CaptorMatcher<string> = captor()
    const seance1 = new SeanceBuilder().withId("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0").build()
    seanceRepository.recupererParId.mockResolvedValue(seance1)
    // Act
    const seanceResult = await recupererSeanceUseCase.execute("idUtilisateur", "idSeance")
    // Assert
    expect(seanceRepository.recupererParId).toHaveBeenNthCalledWith(1, recupererSeanceCaptor)
    expect(recupererSeanceCaptor.values.at(0)).toEqual("idSeance")
    expect(seanceResult).toBeDefined()
    expect(seanceResult.id).toEqual("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0")
  })
})