import { randomUUID } from "crypto";
import { describe, expect, it } from "vitest"
import type { CaptorMatcher, MockProxy } from "vitest-mock-extended";
import { captor, mock } from "vitest-mock-extended"

import { ExerciceBuilder } from "../../application/builders/ExerciceBuilder"
import { ExerciceSeanceBuilder } from "../../application/builders/ExerciceSeanceBuilder"
import type { ExerciceSeance } from "../../domain/ExerciceSeance"
import {
  InitialiserExerciceSeanceUseCase,
} from "../../usecases/InitialiserExerciceSeanceUseCase"
import { CATEGORIE } from "~/server/exercice/domain/categorie"
import type { SeanceExerciceRepository } from "~/server/seance/domain/ports/SeanceExerciceRepository";
import type { SeanceRepository } from "~/server/seance/domain/ports/SeanceRepository";
import { SeanceBuilder } from "~/server/testUtils/builders/SeanceBuilder"

describe("InitialiserExerciceSeanceUseCase", () => {
  let exerciceRepository: MockProxy<SeanceExerciceRepository>
  let initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  let seanceRepository: MockProxy<SeanceRepository>

  beforeEach(() => {
    exerciceRepository = mock<SeanceExerciceRepository>()
    seanceRepository = mock<SeanceRepository>()
    initialiserExerciceSeanceUseCase = new InitialiserExerciceSeanceUseCase({
      seanceExerciceRepository: exerciceRepository,
      seanceRepository
    })
  })

  it("quand il n'existe pas d'exercice, doit définir l'exercice en premier dans la liste pour une séance", async () => {
    // Arrange
    const uuidExercice = randomUUID();
    const uuidSeance = randomUUID();
    const exercice = new ExerciceBuilder()
      .withId(uuidExercice)
      .withNomExercice("nomExercice")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .build()

    const seance = new SeanceBuilder()
      .withId(uuidSeance)
      .build()

    const ajouterExerciceSeanceCaptor: CaptorMatcher<ExerciceSeance> = captor()

    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    seanceRepository.recupererParId.mockResolvedValue(seance)
    // Act
    const nouvelExerciceSeance = await initialiserExerciceSeanceUseCase.execute({ idSeance: uuidSeance, idExercice: uuidExercice, tempsRepos: 2, series: [] })
    // Assert
    expect(seanceRepository.ajouterExerciceSeanceASeance).toHaveBeenNthCalledWith(1, uuidSeance, ajouterExerciceSeanceCaptor)
    const exerciceSeanceAAjouter = ajouterExerciceSeanceCaptor.value
    expect(exerciceSeanceAAjouter.id).toEqual(nouvelExerciceSeance.id)
    expect(nouvelExerciceSeance.id).toBeDefined()
    expect(nouvelExerciceSeance.idSeance).toEqual(uuidSeance)
    expect(nouvelExerciceSeance.ordre).toEqual(1)
    expect(nouvelExerciceSeance.idExercice).toEqual(uuidExercice)
    expect(nouvelExerciceSeance.nomExercice).toEqual("nomExercice")
    expect(nouvelExerciceSeance.tempsRepos).toEqual(2)
    expect(nouvelExerciceSeance.categorie).toEqual(CATEGORIE.ABDOMINAUX)
  })
  it("quand il existe déjà un exercice, doit ajouter l'exercice à la liste pour une séance", async () => {
    // Arrange
    const uuidExercice = randomUUID();
    const uuidSeance = randomUUID();

    const exercice = new ExerciceBuilder()
      .withId(uuidExercice)
      .withNomExercice("nomExercice")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .build()

    const exerciceSeance = new ExerciceSeanceBuilder()
      .withId("idExerciceSeance 1")
      .withOrdre(1)
      .build()

    const seance = new SeanceBuilder()
      .withId(uuidSeance)
      .withListeExerciceSeance(exerciceSeance)
      .build()

    const ajouterExerciceSeanceCaptor: CaptorMatcher<ExerciceSeance> = captor()

    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    seanceRepository.recupererParId.mockResolvedValue(seance)
    // Act
    const nouvelExerciceSeance = await initialiserExerciceSeanceUseCase.execute({ idSeance: uuidSeance, idExercice: uuidExercice, tempsRepos: 0, series: [] })
    // Assert
    expect(seanceRepository.ajouterExerciceSeanceASeance).toHaveBeenNthCalledWith(1, uuidSeance, ajouterExerciceSeanceCaptor)
    expect(nouvelExerciceSeance.ordre).toEqual(2)
  })
})
