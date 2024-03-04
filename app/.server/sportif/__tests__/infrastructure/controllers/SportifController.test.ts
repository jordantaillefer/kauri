import { anyString } from "vitest-mock-extended"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { prisma } from "~/.server/db/prisma"
import { creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"

describe("SportifController", () => {
  describe("#ajouterEvenement", () => {
    it(
      "doit sauvegarder le nouvel événement pour un utilisateur",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const tempsEvenement = "10:45"
        const idSeance = testIdGenerator.getId()
        const idUtilisateur = testIdGenerator.getId()
        const request = await creerRequestPourCompteUtilisateur(container, idUtilisateur)
        const payload = {
          tempsEvenement,
          idSeance
        }

        // Act
        await container.resolve('sportifController').ajouterEvenement({ request, payload })

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
