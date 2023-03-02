import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { ExerciceBuilder } from "../../../application/builders/ExerciceBuilder"
import { ExerciceSeanceRepository } from "../../../domain/ports/ExerciceSeanceRepository"
import { SeanceExerciceRepository } from "../../../domain/ports/SeanceExerciceRepository"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { ExerciceSeanceController } from "../../../infrastructure/controllers/ExerciceSeanceController"
import { container } from "api"

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