import { describe, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { SeanceBuilder } from "../../../testUtils/builders/SeanceBuilder"
import { ListerSeanceRepository, ListerSeanceUseCase } from "../../usecases/ListerSeanceUseCase"

describe("ListerSeanceUseCase", () => {
  let seanceRepository: MockProxy<ListerSeanceRepository>
  let listerSeanceUseCase: ListerSeanceUseCase

  beforeEach(() => {
    seanceRepository = mock<ListerSeanceRepository>()
    listerSeanceUseCase = new ListerSeanceUseCase({ seanceRepository })
  })
  it("doit lister les séances", async () => {
    // Arrange
    const seance1 = new SeanceBuilder().withId("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0").build()
    const seance2 = new SeanceBuilder().withId("11113696-da3b-4af6-bdee-4aa0dea3948a").build()
    seanceRepository.recupererTout.mockResolvedValue([seance1, seance2])
    // Act
    const listeSeancePourUtilisateur = await listerSeanceUseCase.execute("idUtilisateur")
    // Assert
    expect(listeSeancePourUtilisateur).toHaveLength(2)
    expect(listeSeancePourUtilisateur.at(0)?.id).toEqual("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0")
    expect(listeSeancePourUtilisateur.at(1)?.id).toEqual("11113696-da3b-4af6-bdee-4aa0dea3948a")
  })
})