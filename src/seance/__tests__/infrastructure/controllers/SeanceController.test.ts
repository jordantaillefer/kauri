import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { Seance } from "../../../domain/Seance"
import { SeanceController } from "../../../infrastructure/controllers/SeanceController"
import { container } from "api"

describe("SeanceController", () => {
  let seanceController: SeanceController

  beforeEach(() => {
    seanceController = container.resolve("seanceController")
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
        const nouvelleSeance = response.data as Seance
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
})