import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { CATEGORIE } from "../../../exercice/domain/categorie"
import { SeanceBuilder } from "../../../testUtils/builders/SeanceBuilder"
import { ExerciceBuilder } from "../../application/builders/ExerciceBuilder"
import { ExerciceSeanceBuilder } from "../../application/builders/ExerciceSeanceBuilder"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import {
  InitialiserExerciceSeanceRepository,
  InitialiserExerciceSeanceUseCase,
  RecupererExerciceRepository
} from "../../usecases/InitialiserExerciceSeanceUseCase"

describe("InitialiserExerciceSeanceUseCase", () => {
  let exerciceRepository: MockProxy<RecupererExerciceRepository>
  let initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  let seanceRepository: MockProxy<InitialiserExerciceSeanceRepository>

  beforeEach(() => {
    exerciceRepository = mock<RecupererExerciceRepository>()
    seanceRepository = mock<InitialiserExerciceSeanceRepository>()
    initialiserExerciceSeanceUseCase = new InitialiserExerciceSeanceUseCase({
      seanceExerciceRepository: exerciceRepository,
      seanceRepository
    })
  })

  it("quand il n'existe pas d'exercice, doit définir l'exercice en premier dans la liste pour une séance", async () => {
    // Arrange
    const exercice = new ExerciceBuilder()
      .withId("idExercice")
      .withNomExercice("nomExercice")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .build()

    const seance = new SeanceBuilder()
      .withId("idSeance")
      .build()

    const ajouterExerciceSeanceCaptor: CaptorMatcher<ExerciceSeance> = captor()

    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    seanceRepository.recupererParId.mockResolvedValue(seance)
    // Act
    const nouvelExerciceSeance = await initialiserExerciceSeanceUseCase.execute("idSeance", "idExercice")
    // Assert
    expect(seanceRepository.ajouterExerciceSeanceASeance).toHaveBeenNthCalledWith(1, "idSeance", ajouterExerciceSeanceCaptor)
    const exerciceSeanceAAjouter = ajouterExerciceSeanceCaptor.value
    expect(exerciceSeanceAAjouter.id).toEqual(nouvelExerciceSeance.id)
    expect(nouvelExerciceSeance.id).toBeDefined()
    expect(nouvelExerciceSeance.idSeance).toEqual("idSeance")
    expect(nouvelExerciceSeance.ordre).toEqual(1)
    expect(nouvelExerciceSeance.idExercice).toEqual("idExercice")
    expect(nouvelExerciceSeance.nomExercice).toEqual("nomExercice")
    expect(nouvelExerciceSeance.tempsRepos).toEqual(45)
    expect(nouvelExerciceSeance.categorie).toEqual(CATEGORIE.ABDOMINAUX)
  })
  it("quand il existe déjà un exercice, doit ajouter l'exercice à la liste pour une séance", async () => {
    // Arrange
    const exercice = new ExerciceBuilder()
      .withId("idExercice")
      .withNomExercice("nomExercice")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .build()

    const exerciceSeance = new ExerciceSeanceBuilder()
      .withId("idExerciceSeance 1")
      .withOrdre(1)
      .build()

    const seance = new SeanceBuilder()
      .withId("idSeance")
      .withListeExerciceSeance(exerciceSeance)
      .build()

    const ajouterExerciceSeanceCaptor: CaptorMatcher<ExerciceSeance> = captor()

    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    seanceRepository.recupererParId.mockResolvedValue(seance)
    // Act
    const nouvelExerciceSeance = await initialiserExerciceSeanceUseCase.execute("idSeance", "idExercice")
    // Assert
    expect(seanceRepository.ajouterExerciceSeanceASeance).toHaveBeenNthCalledWith(1, "idSeance", ajouterExerciceSeanceCaptor)
    expect(nouvelExerciceSeance.ordre).toEqual(2)
  })
})
