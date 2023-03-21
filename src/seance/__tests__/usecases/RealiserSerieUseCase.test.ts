import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { RealiserSerieRepository, RealiserSerieUseCase } from "../../usecases/RealiserSerieUseCase"

describe("RealiserSerieUseCase", () => {
  let entrainementRepository: MockProxy<RealiserSerieRepository>
  let realiserSerieUseCase: RealiserSerieUseCase

  beforeEach(() => {
    entrainementRepository = mock<RealiserSerieRepository>()
    realiserSerieUseCase = new RealiserSerieUseCase({ entrainementRepository })
  })

  it("doit mettre a jour la série pour le marquer comme réaliser", async () => {
    // Arrange
    const idUtilisateur = "idUtilisateur"
    const idSerie = "idSerie"

    // Act
    await realiserSerieUseCase.execute({
      idUtilisateur,
      idSerie
    })
    // Assert
    expect(entrainementRepository.mettreAJourSerieEstRealise).toHaveBeenNthCalledWith(1, "idSerie", true)
  })
})
