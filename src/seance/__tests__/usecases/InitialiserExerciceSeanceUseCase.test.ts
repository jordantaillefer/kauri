import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceBuilder } from "../../application/builders/ExerciceBuilder"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import {
  InitialiserExerciceSeanceRepository,
  InitialiserExerciceSeanceUseCase,
  RecupererExerciceRepository
} from "../../usecases/InitialiserExerciceSeanceUseCase"

describe("InitialiserExerciceSeanceUseCase", () => {
  let exerciceRepository: MockProxy<RecupererExerciceRepository>
  let initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  let exerciceSeanceRepository: MockProxy<InitialiserExerciceSeanceRepository>

  beforeEach(() => {
    exerciceRepository = mock<RecupererExerciceRepository>()
    exerciceSeanceRepository = mock<InitialiserExerciceSeanceRepository>()
    initialiserExerciceSeanceUseCase = new InitialiserExerciceSeanceUseCase({
      seanceExerciceRepository: exerciceRepository,
      exerciceSeanceRepository
    })
  })

  it("doit créer l'exercice pour une séance", async () => {
    // Arrange
    const initialiserExerciceSeanceCaptor: CaptorMatcher<ExerciceSeance> = captor()
    const exercice = new ExerciceBuilder()
      .withId("idExercice")
      .withNomExercice("nomExercice")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .build()
    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    // Act
    await initialiserExerciceSeanceUseCase.execute("idSeance", "idExercice")
    // Assert
    expect(exerciceSeanceRepository.creerExerciceSeance).toHaveBeenNthCalledWith(1, initialiserExerciceSeanceCaptor)
    expect(initialiserExerciceSeanceCaptor.value.id).toBeDefined()
    expect(initialiserExerciceSeanceCaptor.value.idSeance).toEqual("idSeance")
    expect(initialiserExerciceSeanceCaptor.value.idExercice).toEqual("idExercice")
    expect(initialiserExerciceSeanceCaptor.value.nomExercice).toEqual("nomExercice")
    expect(initialiserExerciceSeanceCaptor.value.categorie).toEqual(CATEGORIE.ABDOMINAUX)
  })
})