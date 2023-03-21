import { describe, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { EntrainementBuilder } from "../../application/EntrainementBuilder"
import { ListerEntrainementRepository, ListerEntrainementUseCase } from "../../usecases/ListerEntrainementUseCase"

describe("ListerEntrainementUseCase", () => {
  let entrainementRepository: MockProxy<ListerEntrainementRepository>
  let listerEntrainementUseCase: ListerEntrainementUseCase

  beforeEach(() => {
    entrainementRepository = mock<ListerEntrainementRepository>()
    listerEntrainementUseCase = new ListerEntrainementUseCase({ entrainementRepository })
  })
  it("doit lister les entrainements", async () => {
    // Arrange
    const entrainement1 = new EntrainementBuilder().withId("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0").build()
    const entrainement2 = new EntrainementBuilder().withId("11113696-da3b-4af6-bdee-4aa0dea3948a").build()
    entrainementRepository.recupererTout.mockResolvedValue([entrainement1, entrainement2])
    // Act
    const listeEntrainementPourUtilisateur = await listerEntrainementUseCase.execute("idUtilisateur")
    // Assert
    expect(listeEntrainementPourUtilisateur).toHaveLength(2)
    expect(listeEntrainementPourUtilisateur.at(0)?.id).toEqual("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0")
    expect(listeEntrainementPourUtilisateur.at(1)?.id).toEqual("11113696-da3b-4af6-bdee-4aa0dea3948a")
  })
})
