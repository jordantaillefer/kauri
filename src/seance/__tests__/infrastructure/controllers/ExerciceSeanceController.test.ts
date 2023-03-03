import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { ExerciceBuilder } from "../../../application/builders/ExerciceBuilder"
import { ExerciceSeanceBuilder } from "../../../application/builders/ExerciceSeanceBuilder"
import { SerieExerciceSeanceBuilder } from "../../../application/builders/SerieExerciceSeanceBuilder"
import { ExerciceSeanceRepository } from "../../../domain/ports/ExerciceSeanceRepository"
import { SeanceExerciceRepository } from "../../../domain/ports/SeanceExerciceRepository"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { ExerciceSeanceController } from "../../../infrastructure/controllers/ExerciceSeanceController"
import { SerieExerciceSeancePayload } from "../../../usecases/DefinirSerieExerciceSeanceUseCase"
import { container, ExerciceSeanceContrat } from "api"

describe("ExerciceSeanceController", () => {
  let exerciceSeanceController: ExerciceSeanceController
  let exerciceSeanceRepository: ExerciceSeanceRepository
  let seanceExerciceRepository: SeanceExerciceRepository
  let seanceRepository: SeanceRepository

  beforeEach(() => {
    exerciceSeanceController = container.resolve("exerciceSeanceController")
    exerciceSeanceRepository = container.resolve("exerciceSeanceRepository")
    seanceExerciceRepository = container.resolve("seanceExerciceRepository")
    seanceRepository = container.resolve("seanceRepository")
  })

  describe("#initialiserExerciceSeance", () => {
    describe("Cas OK", () => {
      it("doit initialiser une seance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seance = new SeanceBuilder().withId("081904a6-aaac-4e55-aab6-2652b099bce4").build()
        const exercice = new ExerciceBuilder()
          .withId("c73434ce-9cbe-4890-b7ed-56704485c356")
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        await seanceExerciceRepository.creerExercice(exercice)
        await seanceRepository.creerSeance(seance)
        const payload = {
          idSeance: "081904a6-aaac-4e55-aab6-2652b099bce4",
          idExercice: "c73434ce-9cbe-4890-b7ed-56704485c356"
        }
        // Act
        const response = await exerciceSeanceController.initialiserExerciceSeance({ request, payload })
        // Assert
        const listeExerciceSeances = await exerciceSeanceRepository.recupererTout()
        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
        expect(listeExerciceSeances.at(0)?.idSeance).toEqual("081904a6-aaac-4e55-aab6-2652b099bce4")
        expect(listeExerciceSeances.at(0)?.idExercice).toEqual("c73434ce-9cbe-4890-b7ed-56704485c356")
        expect(listeExerciceSeances.at(0)?.nomExercice).toEqual("nomExercice")
        expect(listeExerciceSeances.at(0)?.categorie).toEqual(CATEGORIE.ABDOMINAUX)
        const nouveauExerciceSeance = response.data as ExerciceSeanceContrat
        expect(nouveauExerciceSeance).toBeDefined()
        expect(nouveauExerciceSeance.nomExercice).toEqual("nomExercice")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        const payload = { idSeance: "idSeance", idExercice: "idExercice" }
        // Act
        const response = await exerciceSeanceController.initialiserExerciceSeance({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#recupererExerciceSeance", () => {
    describe("Cas OK", () => {
      it("quand l'exercice existe, doit récupérer l'exercice appartenant à la seance", async () => {
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seance = new SeanceBuilder().withId("081904a6-aaac-4e55-aab6-2652b099bce4").build()
        const exerciceSeance = new ExerciceSeanceBuilder()
          .withId("2289cca2-a211-43e1-805c-97c5dc97fc2a")
          .withIdSeance("081904a6-aaac-4e55-aab6-2652b099bce4")
          .withIdExercice("330a330b-e66e-447d-9166-2173562e2cbb")
          .withNomExercice("nomExercice")
          .withCategorie(CATEGORIE.ABDOMINAUX)
          .build()
        await seanceRepository.creerSeance(seance)

        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        const payload = {
          idSeance: "081904a6-aaac-4e55-aab6-2652b099bce4",
          idExerciceSeance: "2289cca2-a211-43e1-805c-97c5dc97fc2a"
        }
        // Act
        // Assert
        const response = await exerciceSeanceController.recupererExerciceSeance({ request, payload })
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const exerciceSeanceResult = response.data as ExerciceSeanceContrat
        expect(exerciceSeanceResult.id).toEqual("2289cca2-a211-43e1-805c-97c5dc97fc2a")
        expect(exerciceSeanceResult.idExercice).toEqual("330a330b-e66e-447d-9166-2173562e2cbb")
        expect(exerciceSeanceResult.nomExercice).toEqual("nomExercice")
        expect(exerciceSeanceResult.categorie).toEqual(CATEGORIE.ABDOMINAUX)
      })
    })
  })

  describe("#definirSerieExerciceSeance", () => {
    describe("Cas OK", () => {
      it("quand il n'y a pas de série, doit ajouter les séries à l'exercice seance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seance = new SeanceBuilder()
          .withId("6bc42156-b946-4128-b605-3b180765738f")
          .build()
        const exerciceSeance = new ExerciceSeanceBuilder()
          .withId("0e2947f4-960d-4fa2-b3f4-3c1f63447527")
          .withIdSeance("6bc42156-b946-4128-b605-3b180765738f")
          .build()
        await seanceRepository.creerSeance(seance)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        const payload: { idSeance: string, idExerciceSeance: string, serieExerciceSeance: SerieExerciceSeancePayload[] } = {
          idSeance: "6bc42156-b946-4128-b605-3b180765738f",
          idExerciceSeance: "0e2947f4-960d-4fa2-b3f4-3c1f63447527",
          serieExerciceSeance: [
            { repetitions: 10 },
            { repetitions: 12 }
          ]
        }
        // Act
        const response = await exerciceSeanceController.definirSerieExerciceSeance({
          request,
          payload
        })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)

        const exerciceSeanceResult = await exerciceSeanceRepository.recupererParIdSeanceEtParId("6bc42156-b946-4128-b605-3b180765738f", "0e2947f4-960d-4fa2-b3f4-3c1f63447527")
        expect(exerciceSeanceResult.listeSerieExerciceSeance).toHaveLength(2)
      })

      it("quand il existe déjà des séries, doit écraser les séries de l'exercice seance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seance = new SeanceBuilder()
          .withId("6bc42156-b946-4128-b605-3b180765738f")
          .build()
        const serieExerciceSeanceAEcraser = new SerieExerciceSeanceBuilder()
          .withId("e05848ad-146d-4cac-ba39-a146ab679cf6")
          .withRepetitions(12)
          .build()
        const exerciceSeance = new ExerciceSeanceBuilder()
          .withId("0e2947f4-960d-4fa2-b3f4-3c1f63447527")
          .withIdSeance("6bc42156-b946-4128-b605-3b180765738f")
          .withListeSerieExerciceSeance(serieExerciceSeanceAEcraser)
          .build()
        await seanceRepository.creerSeance(seance)
        await exerciceSeanceRepository.creerExerciceSeance(exerciceSeance)
        const payload: { idSeance: string, idExerciceSeance: string, serieExerciceSeance: SerieExerciceSeancePayload[] } = {
          idSeance: "6bc42156-b946-4128-b605-3b180765738f",
          idExerciceSeance: "0e2947f4-960d-4fa2-b3f4-3c1f63447527",
          serieExerciceSeance: [
            { repetitions: 8 },
            { repetitions: 7 }
          ]
        }
        // Act
        const response = await exerciceSeanceController.definirSerieExerciceSeance({
          request,
          payload
        })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)

        const exerciceSeanceResult = await exerciceSeanceRepository.recupererParIdSeanceEtParId("6bc42156-b946-4128-b605-3b180765738f", "0e2947f4-960d-4fa2-b3f4-3c1f63447527")
        expect(exerciceSeanceResult.listeSerieExerciceSeance).toHaveLength(2)
        expect(exerciceSeanceResult.listeSerieExerciceSeance.at(0)?.repetitions).toEqual(8)
        expect(exerciceSeanceResult.listeSerieExerciceSeance.at(1)?.repetitions).toEqual(7)
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        const payload = { idSeance: "idSeance", idExercice: "idExercice" }
        // Act
        const response = await exerciceSeanceController.initialiserExerciceSeance({ request, payload })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })
})