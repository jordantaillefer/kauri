import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { ExerciceSeanceBuilder } from "../../application/builders/ExerciceSeanceBuilder"
import {
  RecupererExerciceSeanceParIdEtSeanceIdRepository,
  RecupererExerciceSeanceUseCase
} from "../../usecases/RecupererExerciceSeanceUseCase"

describe("RecupererExerciceSeanceUseCase", () => {
  let recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  let exerciceSeanceRepository: MockProxy<RecupererExerciceSeanceParIdEtSeanceIdRepository>

  beforeEach(() => {
    exerciceSeanceRepository = mock<RecupererExerciceSeanceParIdEtSeanceIdRepository>()
    recupererExerciceSeanceUseCase = new RecupererExerciceSeanceUseCase({ exerciceSeanceRepository })
  })

  it("doit récupérer l'exercice de la séance", async () => {
    // Arrange
    const idSeanceCaptor1: CaptorMatcher<string> = captor()
    const idExerciceSeanceCaptor2: CaptorMatcher<string> = captor()

    const idSeance = "idSeance"
    const idExerciceSeance = "idExerciceSeance"
    const exerciceSeance = new ExerciceSeanceBuilder()
      .withId("idExerciceSeance")
      .withIdSeance("idSeance")
      .build()

    exerciceSeanceRepository.recupererParIdSeanceEtParId
      .calledWith("idSeance", "idExerciceSeance")
      .mockResolvedValue(exerciceSeance)

    // Act
    const exerciceSeanceResult = await recupererExerciceSeanceUseCase.execute(idSeance, idExerciceSeance)
    // Assert
    expect(exerciceSeanceResult).toBeDefined()
    expect(exerciceSeanceRepository.recupererParIdSeanceEtParId).toHaveBeenNthCalledWith(1, idSeanceCaptor1, idExerciceSeanceCaptor2)
    expect(idSeanceCaptor1.value).toEqual("idSeance")
    expect(idExerciceSeanceCaptor2.value).toEqual("idExerciceSeance")
  })
})