import { mock } from "vitest-mock-extended"

import { ExerciceSeanceRepository } from "../../domain/ports/ExerciceSeanceRepository"
import { DefinirTempsReposExerciceSeanceUseCase } from "../../usecases/DefinirTempsReposExerciceSeanceUseCase"

describe("DefinirTempsReposExerciceSeanceUseCase", () => {
  let exerciceSeanceRepository: ExerciceSeanceRepository
  let definirTempsReposExerciceSeanceUseCase: DefinirTempsReposExerciceSeanceUseCase

  beforeEach(() => {
    exerciceSeanceRepository = mock<ExerciceSeanceRepository>()
    definirTempsReposExerciceSeanceUseCase = new DefinirTempsReposExerciceSeanceUseCase({ exerciceSeanceRepository })
  })

  it("doit modifier le temps de repos de l'exercice", async () => {
    // Arrange
    const idExerciceSeance = "cc82bbe5-04d2-4bd3-a00d-bc5265e2e40a"
    const tempsRepos = 55

    // Act
    await definirTempsReposExerciceSeanceUseCase.execute({ idExerciceSeance, tempsRepos })
    // Assert
    expect(exerciceSeanceRepository.mettreAJourTempsRepos).toHaveBeenNthCalledWith(1, idExerciceSeance, tempsRepos)
  })
})
