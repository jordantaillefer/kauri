import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { ExerciceBuilder } from "../../../testUtils/builders/ExerciceBuilder"
import { ListerExerciceRepository, ListerExerciceUseCase } from "../../usecases/ListerExerciceUseCase"

describe("ListerExerciceUseCase", () => {
  let exerciceRepository: MockProxy<ListerExerciceRepository>
  let listerExerciceUseCase: ListerExerciceUseCase

  beforeEach(() => {
    exerciceRepository = mock<ListerExerciceRepository>()
    listerExerciceUseCase = new ListerExerciceUseCase({ exerciceRepository })
  })
  it("doit lister les exercices", async () => {
    // Arrange
    const exercice1 = new ExerciceBuilder().withId("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0").build()
    const exercice2 = new ExerciceBuilder().withId("11113696-da3b-4af6-bdee-4aa0dea3948a").build()
    exerciceRepository.recupererTout.mockResolvedValue([exercice1, exercice2])
    // Act
    const listeExercicePourUtilisateur = await listerExerciceUseCase.execute()
    // Assert
    expect(listeExercicePourUtilisateur).toHaveLength(2)
    expect(listeExercicePourUtilisateur.at(0)?.id).toEqual("9fff6b5d-d5c6-4efc-89a3-f5e4b662dce0")
    expect(listeExercicePourUtilisateur.at(1)?.id).toEqual("11113696-da3b-4af6-bdee-4aa0dea3948a")
  })
})