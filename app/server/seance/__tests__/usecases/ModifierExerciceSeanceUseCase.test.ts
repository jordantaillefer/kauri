import { randomUUID } from "crypto";
import { describe, expect, it } from "vitest"
import type { CaptorMatcher, MockProxy } from "vitest-mock-extended";
import { captor, mock } from "vitest-mock-extended"

import { ExerciceBuilder } from "../../application/builders/ExerciceBuilder"
import { ExerciceSeanceBuilder } from "../../application/builders/ExerciceSeanceBuilder"
import type { ExerciceSeance } from "../../domain/ExerciceSeance"
import { CATEGORIE } from "~/server/exercice/domain/categorie"
import type { SeanceExerciceRepository } from "~/server/seance/domain/ports/SeanceExerciceRepository";
import type { SeanceRepository } from "~/server/seance/domain/ports/SeanceRepository";
import { SeanceBuilder } from "~/server/testUtils/builders/SeanceBuilder"
import { SerieExerciceSeanceBuilder } from "@/api/seance/application/builders/SerieExerciceSeanceBuilder";
import type { ExerciceSeanceRepository } from "@/api/seance/domain/ports/ExerciceSeanceRepository";
import { ModifierExerciceSeanceUseCase } from "@/api/seance/usecases/ModifierExerciceSeanceUseCase";

describe("ModifierExerciceSeanceUseCase", () => {
  let exerciceRepository: MockProxy<SeanceExerciceRepository>
  let modifierExerciceSeanceUseCase: ModifierExerciceSeanceUseCase
  let seanceRepository: MockProxy<SeanceRepository>
  let exerciceSeanceRepository: MockProxy<ExerciceSeanceRepository>

  beforeEach(() => {
    exerciceRepository = mock<SeanceExerciceRepository>()
    exerciceSeanceRepository = mock<ExerciceSeanceRepository>()
    seanceRepository = mock<SeanceRepository>()
    modifierExerciceSeanceUseCase = new ModifierExerciceSeanceUseCase({
      seanceExerciceRepository: exerciceRepository,
      seanceRepository,
      exerciceSeanceRepository
    })
  })

  it("quand l'exercice existe, doit modifier l'exercice", async () => {
    // Arrange
    const uuidExercice = randomUUID();
    const uuidExerciceSeance = randomUUID();
    const uuidSeance = randomUUID();
    const exercice = new ExerciceBuilder()
      .withId(uuidExercice)
      .withNomExercice("nom nouvel exercice")
      .withCategorie(CATEGORIE.PECTORAUX)
      .build()


    const serieExerciceSeance1 = new SerieExerciceSeanceBuilder().withRepetitions(8).build()
    const serieExerciceSeance2 = new SerieExerciceSeanceBuilder().withRepetitions(10).build()
    const serieExerciceSeance3 = new SerieExerciceSeanceBuilder().withRepetitions(12).build()

    const exerciceSeance1 = new ExerciceSeanceBuilder()
      .withId(uuidExerciceSeance)
      .withIdExercice(randomUUID())
      .withNomExercice("nomExercice 1")
      .withCategorie(CATEGORIE.PECTORAUX)
      .withListeSerieExerciceSeance(serieExerciceSeance1)
      .build()

    const exerciceSeance2 = new ExerciceSeanceBuilder()
      .withNomExercice("nomExercice 2")
      .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
      .withListeSerieExerciceSeance(serieExerciceSeance2, serieExerciceSeance3)
      .build()

    const seance = new SeanceBuilder()
      .withId(uuidSeance)
      .withListeExerciceSeance(exerciceSeance1, exerciceSeance2)
      .build()

    const modifierExerciceSeanceCaptor: CaptorMatcher<ExerciceSeance> = captor()

    exerciceRepository.recupererParId.mockResolvedValue(exercice)
    seanceRepository.recupererParId.mockResolvedValue(seance)
    // Act
    const exerciceSeanceModifie = await modifierExerciceSeanceUseCase.execute({ idSeance: uuidSeance, idExerciceSeance: uuidExerciceSeance, idExercice: uuidExercice, series: [{ repetitions: 10, tempsRepos: 45}] })
    // Assert
    expect(exerciceSeanceRepository.supprimerSerieExerciceSeance).toHaveBeenNthCalledWith(1, uuidExerciceSeance)
    expect(exerciceSeanceRepository.modifierExerciceSeance).toHaveBeenNthCalledWith(1, modifierExerciceSeanceCaptor)
    const exerciceSeanceAModifie = modifierExerciceSeanceCaptor.value
    expect(exerciceSeanceAModifie.id).toEqual(exerciceSeanceModifie.id)
    expect(exerciceSeanceModifie.idExercice).toEqual(uuidExercice)
    expect(exerciceSeanceModifie.ordre).toEqual(1)
    expect(exerciceSeanceModifie.nomExercice).toEqual("nom nouvel exercice")
    expect(exerciceSeanceModifie.categorie).toEqual(CATEGORIE.PECTORAUX)
    expect(exerciceSeanceModifie.listeSerieExerciceSeance).toHaveLength(1)
    expect(exerciceSeanceModifie.listeSerieExerciceSeance.at(0)?.tempsRepos).toEqual(45)
    expect(exerciceSeanceModifie.listeSerieExerciceSeance.at(0)?.repetitions).toEqual(10)
  })
})
