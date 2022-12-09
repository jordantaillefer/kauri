import { describe, expect, it } from "vitest"
import { mock } from "vitest-mock-extended"

import { SeanceEntrainementRepository } from "../../domain/ports/SeanceEntrainementRepository"
import { SupprimerSeanceEntrainementUseCase } from "../../usecases/SupprimerSeanceEntrainementUseCase"

describe("SupprimerSeanceEntrainementUseCase", () => {
  it("doit supprimer la seance d'entrainement", async () => {
    // Arrange
    const seanceEntrainementRepository = mock<SeanceEntrainementRepository>()
    const supprimerSeanceEntrainementUseCase = new SupprimerSeanceEntrainementUseCase({ seanceEntrainementRepository })
    // Act
    await supprimerSeanceEntrainementUseCase.execute("01373821-6012-4573-9b2a-1d276fd2ecc9")
    // Assert
    expect(seanceEntrainementRepository.supprimerSeanceEntrainement).toHaveBeenNthCalledWith(1, "01373821-6012-4573-9b2a-1d276fd2ecc9")
  })
})