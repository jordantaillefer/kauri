import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { RealiserEntrainementRepository, RealiserEntrainementUseCase } from "../../usecases/RealiserEntrainementUseCase"

describe("RealiserEntrainementUseCase", () => {
  let entrainementRepository: MockProxy<RealiserEntrainementRepository>
  let realiserEntrainementUseCase: RealiserEntrainementUseCase

  beforeEach(() => {
    entrainementRepository = mock<RealiserEntrainementRepository>()
    realiserEntrainementUseCase = new RealiserEntrainementUseCase({ entrainementRepository })
  })

  it("doit mettre a jour l'entrainement pour le marquer comme réaliser", async () => {
    // Arrange
    const idUtilisateur = "idUtilisateur"
    const idEntrainement = "idEntrainement"

    // Act
    await realiserEntrainementUseCase.execute({
      idUtilisateur,
      idEntrainement
    })
    // Assert
    expect(entrainementRepository.mettreAJourEntrainementEstRealise).toHaveBeenNthCalledWith(1, "idEntrainement", true)
  })
})
