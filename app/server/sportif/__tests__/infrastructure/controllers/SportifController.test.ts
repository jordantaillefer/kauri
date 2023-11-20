import { anyString } from "vitest-mock-extended"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { container } from "app/server"
import { prisma } from "~/server/db/prisma"
import type { SportifController } from "~/server/sportif/infrastructure/controllers/SportifController"
import { creerRequestPourCompteUtilisateur } from "~/server/testUtils/RequestUtils"

describe("SportifController", () => {
  let sportifController: SportifController

  beforeEach(() => {
    sportifController = container.resolve("sportifController")
  })

  describe("#ajouterEvenement", () => {
    it(
      "doit sauvegarder le nouvel événement pour un utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const tempsEvenement = "10:45"
        const idSeance = testIdGenerator.getId()
        const idUtilisateur = testIdGenerator.getId()
        const request = await creerRequestPourCompteUtilisateur(idUtilisateur)
        const payload = {
          tempsEvenement,
          idSeance
        }

        // Act
        await sportifController.ajouterEvenement({ request, payload })

        // Assert
        const listeSportifEvenementResult = await prisma.sportifEvenement.findMany()

        const nouveauSportifEvenement = listeSportifEvenementResult.find(
          evenement => evenement.idUtilisateur === idUtilisateur
        )

        expect(nouveauSportifEvenement).toBeDefined()
        expect(nouveauSportifEvenement?.id).toEqual(anyString())
        expect(nouveauSportifEvenement?.idSeance).toEqual(idSeance)
        expect(nouveauSportifEvenement?.idUtilisateur).toEqual(idUtilisateur)
        expect(nouveauSportifEvenement?.tempsEvenement).toEqual("10:45")
      })
    )
  })
})
