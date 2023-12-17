import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { prisma } from "~/.server/db/prisma"
import { PrismaSportifRepository } from "~/.server/sportif/infrastructure/adapters/PrismaSportifRepository"
import { SportifEvenementBuilder } from "~/.server/testUtils/builders/SportifEvenementBuilder"

describe("PrismaSportifRepository", () => {
  let prismaSportifRepository: PrismaSportifRepository

  beforeEach(() => {
    prismaSportifRepository = new PrismaSportifRepository()
  })

  it(
    "doit sauvegarder l'événement",
    integrationTestFunction(async ({ testIdGenerator }) => {
      // Arrange
      const idSeance = testIdGenerator.getId()
      const idUtilisateur = testIdGenerator.getId()
      const idSportifEvenement = testIdGenerator.getId()
      const sportifEvenement = new SportifEvenementBuilder()
        .withId(idSportifEvenement)
        .withTempsEvenement("10:45")
        .withIdSeance(idSeance)
        .withIdUtilisateur(idUtilisateur)
        .build()

      // Act
      await prismaSportifRepository.ajouterEvenement(sportifEvenement)

      // Assert
      const sportifEvenementResult = await prisma.sportifEvenement.findUnique({
        where: {
          id: idSportifEvenement
        }
      })

      expect(sportifEvenementResult?.id).toEqual(idSportifEvenement)
      expect(sportifEvenementResult?.idSeance).toEqual(idSeance)
      expect(sportifEvenementResult?.idUtilisateur).toEqual(idUtilisateur)
      expect(sportifEvenementResult?.tempsEvenement).toEqual("10:45")
    })
  )
})
