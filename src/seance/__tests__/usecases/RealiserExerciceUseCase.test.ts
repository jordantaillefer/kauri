import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { RealiserEntrainementRepository, RealiserExerciceUseCase } from "../../usecases/RealiserExerciceUseCase"

describe("RealiserExerciceUseCase", () => {
  let entrainementRepository: MockProxy<RealiserEntrainementRepository>
  let realiserEntrainementUseCase: RealiserExerciceUseCase

  beforeEach(() => {
    entrainementRepository = mock<RealiserEntrainementRepository>()
    realiserEntrainementUseCase = new RealiserExerciceUseCase({ entrainementRepository })
  })

  it("doit mettre a jour l'entrainement pour le marquer comme réalisé", async () => {
    // Arrange
    const idUtilisateur = "idUtilisateur"
    const idExercice = "idExercice"

    // Act
    await realiserEntrainementUseCase.execute({
      idUtilisateur,
      idExercice
    })
    // Assert
    expect(entrainementRepository.mettreAJourExerciceEstRealise).toHaveBeenNthCalledWith(1, "idExercice", true)
  })
})
