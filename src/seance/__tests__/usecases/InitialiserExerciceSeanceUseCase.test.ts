import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceBuilder } from "../../application/builders/ExerciceBuilder"
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
    const exercice = new ExerciceBuilder()
      .withId("idExercice")
      .withNomExercice("nomExercice")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .build()
    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    // Act
    const exerciceSeance = await initialiserExerciceSeanceUseCase.execute("idSeance", "idExercice")
    // Assert
    expect(exerciceSeance.id).toBeDefined()
    expect(exerciceSeance.idSeance).toEqual("idSeance")
    expect(exerciceSeance.idExercice).toEqual("idExercice")
    expect(exerciceSeance.nomExercice).toEqual("nomExercice")
    expect(exerciceSeance.categorie).toEqual(CATEGORIE.ABDOMINAUX)
  })
})