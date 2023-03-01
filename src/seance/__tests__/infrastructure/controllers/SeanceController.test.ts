import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { Seance } from "../../../domain/Seance"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { SeanceController } from "../../../infrastructure/controllers/SeanceController"
import { container, SeanceContrat } from "api"

describe("SeanceController", () => {
  let seanceController: SeanceController
  let seanceRepository: SeanceRepository

  beforeEach(() => {
    seanceController = container.resolve("seanceController")
    seanceRepository = container.resolve("seanceRepository")
  })

  describe("#initialiserSeance", () => {
    describe("Cas OK", () => {
      it("doit initialiser une seance", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")

        // Act
        const response = await seanceController.initialiserSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
        const nouvelleSeance = response.data as SeanceContrat
        expect(nouvelleSeance).toBeDefined()
        expect(nouvelleSeance.nomSeance).toEqual("Nouvelle séance")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceController.initialiserSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })

  describe("#listerSeance", () => {
    describe("Cas OK", () => {
      it("doit récupérer la liste des séances de l'utilisateur", async () => {
        // Arrange
        const request = await creerRequestPourCompteUtilisateur("idUtilisateur")
        const seanceUtilisateur1: Seance = new SeanceBuilder()
          .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("Seance 1")
          .build()
        const seanceUtilisateur2: Seance = new SeanceBuilder()
          .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
          .withIdUtilisateur("idUtilisateur")
          .withNomSeance("Seance 2")
          .build()
        const seanceAutreUtilisateur: Seance = new SeanceBuilder()
          .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
          .withIdUtilisateur("idAutreUtilisateur")
          .build()
        await seanceRepository.creerSeance(seanceUtilisateur1)
        await seanceRepository.creerSeance(seanceUtilisateur2)
        await seanceRepository.creerSeance(seanceAutreUtilisateur)
        // Act
        const response = await seanceController.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        const nouvelleSeance = response.data as SeanceContrat[]
        expect(nouvelleSeance).toBeDefined()
        expect(nouvelleSeance).toHaveLength(2)
        expect(nouvelleSeance.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        expect(nouvelleSeance.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      })
    })
    describe("Cas KO", () => {
      it("Quand l'utilisateur n'est pas connecté, erreur Unauthorized", async () => {
        // Arrange
        const request = creerRequest()
        // Act
        const response = await seanceController.listerSeance({ request })
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.UNAUTHORIZED)
      })
    })
  })
})