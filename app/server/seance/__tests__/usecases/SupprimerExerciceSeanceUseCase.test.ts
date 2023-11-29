import { mock } from "vitest-mock-extended";

import type { ExerciceSeanceRepository } from "../../domain/ports/ExerciceSeanceRepository";
import { SupprimerExerciceSeanceUseCase } from "../../usecases/SupprimerExerciceSeanceUseCase";
import { randomUUID } from "crypto";

describe("SupprimerExerciceSeanceUseCase", () => {
  let modifierNomSeanceUseCase: SupprimerExerciceSeanceUseCase
  let exerciceSeanceRepository: ExerciceSeanceRepository

  beforeEach(() => {
    exerciceSeanceRepository = mock<ExerciceSeanceRepository>()
    modifierNomSeanceUseCase = new SupprimerExerciceSeanceUseCase({ exerciceSeanceRepository })
  })

  it("doit modifier le nom de la séance", async () => {
    // Arrange
    const idExerciceSeance = randomUUID()
    // Act
    await modifierNomSeanceUseCase.execute({ idExerciceSeance })
    // Assert
    expect(exerciceSeanceRepository.supprimerExerciceSeance).toHaveBeenNthCalledWith(1, idExerciceSeance)
  })
})
