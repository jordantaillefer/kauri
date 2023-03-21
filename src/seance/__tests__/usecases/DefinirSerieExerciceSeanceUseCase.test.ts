import { describe, expect, it } from "vitest"
import { CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { ExerciceSeanceBuilder } from "../../application/builders/ExerciceSeanceBuilder"
import { SerieExerciceSeanceBuilder } from "../../application/builders/SerieExerciceSeanceBuilder"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import {
  DefinirSerieExerciceSeanceRepository,
  DefinirSerieExerciceSeanceUseCase,
  SerieExerciceSeancePayload
} from "../../usecases/DefinirSerieExerciceSeanceUseCase"

describe("DefinirSerieExerciceSeanceUseCase", () => {
  let exerciceSeanceRepository: MockProxy<DefinirSerieExerciceSeanceRepository>
  let definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase

  beforeEach(() => {
    exerciceSeanceRepository = mock<DefinirSerieExerciceSeanceRepository>()
    definirSerieExerciceSeanceUseCase = new DefinirSerieExerciceSeanceUseCase({ exerciceSeanceRepository })
  })
  describe("quand l'exercice de la séance ne possède pas de série", () => {
    it("doit créer les séries", async () => {
      // Arrange
      const exerciceSeanceCaptor = new CaptorMatcher<ExerciceSeance>()
      const idSeance = "idSeance"
      const idExerciceSeance = "idExerciceSeance"
      const listeSerie: SerieExerciceSeancePayload[] = [{ repetitions: 10 }, { repetitions: 12 }]
      const exerciceSeance = new ExerciceSeanceBuilder()
        .withId("idExerciceSeance")
        .withIdSeance("idSeance")
        .build()
      exerciceSeanceRepository.recupererParIdSeanceEtParId.calledWith(idSeance, idExerciceSeance).mockResolvedValue(exerciceSeance)
      // Act
      await definirSerieExerciceSeanceUseCase.execute(idSeance, idExerciceSeance, listeSerie)
      // Assert
      expect(exerciceSeanceRepository.recupererParIdSeanceEtParId).toHaveBeenCalledOnce()
      expect(exerciceSeanceRepository.supprimerSerieExerciceSeance).not.toHaveBeenCalled()
      expect(exerciceSeanceRepository.ajouterSerieExerciceSeance).toHaveBeenNthCalledWith(1, exerciceSeanceCaptor)
      expect(exerciceSeanceCaptor.value.id).toEqual("idExerciceSeance")
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(0)?.repetitions).toEqual(10)
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(0)?.ordre).toEqual(1)
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(1)?.repetitions).toEqual(12)
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(1)?.ordre).toEqual(2)
    })
  })
  describe("quand l'exercice de la séance possède des série", () => {
    it("doit supprimer d'abord les séries existante avant de créer les nouvelles", async () => {
      // Arrange
      const exerciceSeanceCaptor = new CaptorMatcher<ExerciceSeance>()
      const idSeance = "idSeance"
      const idExerciceSeance = "idExerciceSeance"
      const listeSerie: SerieExerciceSeancePayload[] = [{ repetitions: 10 }, { repetitions: 12 }]
      const serieExerciceSeance = new SerieExerciceSeanceBuilder()
        .withId("idExerciceSeance")
        .withRepetitions(14)
        .withOrdre(1)
        .build()
      const exerciceSeance = new ExerciceSeanceBuilder()
        .withId("idExerciceSeance")
        .withIdSeance("idSeance")
        .withListeSerieExerciceSeance(serieExerciceSeance)
        .build()
      exerciceSeanceRepository.recupererParIdSeanceEtParId.calledWith(idSeance, idExerciceSeance).mockResolvedValue(exerciceSeance)
      // Act
      await definirSerieExerciceSeanceUseCase.execute(idSeance, idExerciceSeance, listeSerie)
      // Assert
      // TODO Call order -> recupererParIdSeanceEtParId -> supprimerSerie -> mettreAJourExerciceSeance
      expect(exerciceSeanceRepository.recupererParIdSeanceEtParId).toHaveBeenCalledOnce()
      expect(exerciceSeanceRepository.supprimerSerieExerciceSeance).toHaveBeenNthCalledWith(1, "idExerciceSeance")
      expect(exerciceSeanceRepository.ajouterSerieExerciceSeance).toHaveBeenNthCalledWith(1, exerciceSeanceCaptor)
      expect(exerciceSeanceCaptor.value.id).toEqual("idExerciceSeance")
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(0)?.repetitions).toEqual(10)
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(0)?.ordre).toEqual(1)
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(1)?.repetitions).toEqual(12)
      expect(exerciceSeanceCaptor.value.listeSerieExerciceSeance.at(1)?.ordre).toEqual(2)
    })
  })
})
