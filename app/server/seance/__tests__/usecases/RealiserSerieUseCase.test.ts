import { describe, expect, it } from "vitest"
import type { MockProxy , CaptorMatcher } from "vitest-mock-extended";
import { mock , captor } from "vitest-mock-extended"

import { ExerciceEntrainementBuilder } from "../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../application/builders/SerieEntrainementBuilder"
import type { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import type { RealiserSerieRepository} from "../../usecases/RealiserSerieUseCase";
import { RealiserSerieUseCase } from "../../usecases/RealiserSerieUseCase"

describe("RealiserSerieUseCase", () => {
  let entrainementRepository: MockProxy<RealiserSerieRepository>
  let realiserSerieUseCase: RealiserSerieUseCase

  beforeEach(() => {
    entrainementRepository = mock<RealiserSerieRepository>()
    realiserSerieUseCase = new RealiserSerieUseCase({ entrainementRepository })
  })

  it("doit mettre a jour la série pour le marquer comme réaliser", async () => {
    // Arrange
    const idUtilisateur = "idUtilisateur"
    const idExercice = "idExercice"
    const serie1 = new SerieEntrainementBuilder().withId("idSerie 1").withEstRealise(false).build()
    const serie2 = new SerieEntrainementBuilder().withId("idSerie 2").withEstRealise(false).build()
    const exerciceEntrainement = new ExerciceEntrainementBuilder()
      .withId("idExercice")
      .withEstRealise(false)
      .withListeSerieEntrainement(serie1, serie2)
      .build()

    entrainementRepository.recupererExerciceEntrainementParId
      .calledWith("idExercice")
      .mockResolvedValue(exerciceEntrainement)
    const mettreAJourExerciceCaptor: CaptorMatcher<ExerciceEntrainement> = captor()

    // Act
    await realiserSerieUseCase.execute({
      idUtilisateur,
      idExerciceEntrainement: idExercice,
      idSerieEntrainement: "idSerie 1"
    })
    // Assert
    expect(entrainementRepository.mettreAJourExercice).toHaveBeenNthCalledWith(1, mettreAJourExerciceCaptor)
    const exerciceEntrainementMisAJour = mettreAJourExerciceCaptor.value
    expect(exerciceEntrainementMisAJour.estRealise).toEqual(false)
    expect(exerciceEntrainementMisAJour.listeSerieEntrainement.at(0)?.estRealise).toEqual(true)
    expect(exerciceEntrainementMisAJour.listeSerieEntrainement.at(1)?.estRealise).toEqual(false)
  })

  describe("après la mise à jour de la série", () => {
    it("quand toutes les séries de l'exercice sont réalisées, doit mettre à jour l'exercice pour le marquer comme réalisé", async () => {
      const idUtilisateur = "idUtilisateur"
      const idExercice = "idExercice"
      const serie1 = new SerieEntrainementBuilder().withId("idSerie 1").withEstRealise(true).build()
      const serie2 = new SerieEntrainementBuilder().withId("idSerie 2").withEstRealise(false).build()
      const exerciceEntrainement = new ExerciceEntrainementBuilder()
        .withId("idExercice")
        .withEstRealise(false)
        .withListeSerieEntrainement(serie1, serie2)
        .build()

      entrainementRepository.recupererExerciceEntrainementParId
        .calledWith("idExercice")
        .mockResolvedValue(exerciceEntrainement)
      const mettreAJourExerciceCaptor: CaptorMatcher<ExerciceEntrainement> = captor()

      // Act
      await realiserSerieUseCase.execute({
        idUtilisateur,
        idExerciceEntrainement: idExercice,
        idSerieEntrainement: "idSerie 2"
      })
      // Assert
      expect(entrainementRepository.mettreAJourExercice).toHaveBeenNthCalledWith(1, mettreAJourExerciceCaptor)
      const exerciceEntrainementMisAJour = mettreAJourExerciceCaptor.value
      expect(exerciceEntrainementMisAJour.estRealise).toEqual(true)
      expect(exerciceEntrainementMisAJour.listeSerieEntrainement.at(0)?.estRealise).toEqual(true)
      expect(exerciceEntrainementMisAJour.listeSerieEntrainement.at(1)?.estRealise).toEqual(true)
    })
  })
})
