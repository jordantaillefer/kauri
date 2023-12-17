import { ReasonPhrases } from "http-status-codes"

import { container } from "@/api/index.server"
import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { SportifRepository } from "~/.server/sportif/domain/ports/SportifRepository"
import type { SportifQuery } from "~/.server/sportif/infrastructure/queries/SportifQuery"
import { creerRequestPourCompteUtilisateur } from "~/.server/testUtils/RequestUtils"
import { SportifEvenementBuilder } from "~/.server/testUtils/builders/SportifEvenementBuilder"

describe("SportifQuery", () => {
  let sportifQuery: SportifQuery
  let sportifRepository: SportifRepository

  beforeEach(() => {
    sportifRepository = container.resolve("sportifRepository")
    sportifQuery = container.resolve("sportifQuery")
  })

  describe("#listerEvenement", () => {
    it(
      "doit récupérer les événements d'un utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidSeance1 = testIdGenerator.getId()
        const uuidSeance2 = testIdGenerator.getId()
        const uuidUtilisateur1 = testIdGenerator.getId()
        const uuidSportifEvenement1 = testIdGenerator.getId()
        const uuidSportifEvenement2 = testIdGenerator.getId()

        const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur1)

        const sportifEvenement1 = new SportifEvenementBuilder()
          .withId(uuidSportifEvenement1)
          .withIdUtilisateur(uuidUtilisateur1)
          .withIdSeance(uuidSeance1)
          .withTempsEvenement("10:45")
          .build()
        const sportifEvenement2 = new SportifEvenementBuilder()
          .withId(uuidSportifEvenement2)
          .withIdUtilisateur(uuidUtilisateur1)
          .withIdSeance(uuidSeance2)
          .withTempsEvenement("12:45")
          .build()
        const sportifEvenement3 = new SportifEvenementBuilder()
          .withId(testIdGenerator.getId())
          .withIdUtilisateur(testIdGenerator.getId())
          .withIdSeance(testIdGenerator.getId())
          .withTempsEvenement("14:45")
          .build()

        await sportifRepository.ajouterEvenement(sportifEvenement1)
        await sportifRepository.ajouterEvenement(sportifEvenement2)
        await sportifRepository.ajouterEvenement(sportifEvenement3)

        // Act
        const listerEvenementsResult = await sportifQuery.listerEvenement({ request })
        // Assert
        expect(listerEvenementsResult.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeEvenements = listerEvenementsResult.data
        expect(listeEvenements).toHaveLength(2)
      })
    )
  })
  describe("#listerEvenementParDate", () => {
    it(
      "quand il y a une date en payload, doit remonter les événements de cette date pour l'utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidUtilisateur1 = testIdGenerator.getId()
        const request = await creerRequestPourCompteUtilisateur(uuidUtilisateur1)

        const sportifEvenement1 = new SportifEvenementBuilder()
          .withId(testIdGenerator.getId())
          .withIdUtilisateur(uuidUtilisateur1)
          .withIdSeance(testIdGenerator.getId())
          .withTempsEvenement("2022-06-12T10:45")
          .build()
        const sportifEvenement2 = new SportifEvenementBuilder()
          .withId(testIdGenerator.getId())
          .withIdUtilisateur(uuidUtilisateur1)
          .withIdSeance(testIdGenerator.getId())
          .withTempsEvenement("2022-06-12T12:45")
          .build()
        const sportifEvenement3 = new SportifEvenementBuilder()
          .withId(testIdGenerator.getId())
          .withIdUtilisateur(uuidUtilisateur1)
          .withIdSeance(testIdGenerator.getId())
          .withTempsEvenement("2022-06-13T12:45")
          .build()
        const sportifEvenement4 = new SportifEvenementBuilder()
          .withId(testIdGenerator.getId())
          .withIdUtilisateur(testIdGenerator.getId())
          .withIdSeance(testIdGenerator.getId())
          .withTempsEvenement("2022-06-13T14:45")
          .build()

        await sportifRepository.ajouterEvenement(sportifEvenement1)
        await sportifRepository.ajouterEvenement(sportifEvenement2)
        await sportifRepository.ajouterEvenement(sportifEvenement3)
        await sportifRepository.ajouterEvenement(sportifEvenement4)

        const payload = {
          date: "2022-06-12"
        }

        // Act
        const listerEvenementsResult = await sportifQuery.listerEvenementParDate({ request, payload })
        // Assert
        expect(listerEvenementsResult.reasonPhrase).toEqual(ReasonPhrases.OK)
        const listeEvenements = listerEvenementsResult.data
        expect(listeEvenements).toHaveLength(2)
      })
    )
  })
})
