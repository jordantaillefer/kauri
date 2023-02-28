import { ReasonPhrases } from "http-status-codes"
import { describe, expect, it } from "vitest"

import { creerRequest, creerRequestPourCompteUtilisateur } from "../../../../testUtils/RequestUtils"
import { SeanceRepository } from "../../../domain/ports/SeanceRepository"
import { SeanceController } from "../../../infrastructure/controllers/SeanceController"
import { container } from "api"

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
        const listeDeSeances = await seanceRepository.recupererTout("idUtilisateur")

        expect(listeDeSeances).toHaveLength(1)

        expect(listeDeSeances.at(0)?.idUtilisateur).toEqual("idUtilisateur")
        expect(listeDeSeances.at(0)?.nomSeance).toEqual("Nouvelle séance")

        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
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