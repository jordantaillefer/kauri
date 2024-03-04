import { ReasonPhrases } from "http-status-codes"
import { describe, expect } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { CompteUtilisateur } from "../../../domain/CompteUtilisateur"
import { creerRequestAvecSession } from "~/.server/testUtils/RequestUtils"
import { CompteUtilisateurBuilder } from "~/.server/testUtils/builders/CompteUtilisateurBuilder"

describe("CompteUtilisateurController", () => {
  describe("#recupererCompteUtilisateur", () => {
    it(
      "S'il existe, doit récupérer le compte utilisateur",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const uuidUtilisateur = testIdGenerator.getId()
        const compteUtilisateur = new CompteUtilisateurBuilder().withId(uuidUtilisateur).build()
        await container.resolve('compteUtilisateurRepository').creerCompteUtilisateur(compteUtilisateur)
        // Act
        const response = await container.resolve('compteUtilisateurController').recupererCompteUtilisateur(compteUtilisateur.id)

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        expect(response.data).toBeDefined()
        const compteUtilisateurResult: CompteUtilisateur = response.data as CompteUtilisateur

        expect(compteUtilisateurResult.id).toEqual(uuidUtilisateur)
      })
    )

    it(
      "S'il n'existe pas, doit retourner une erreur",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Act
        const response = await container.resolve('compteUtilisateurController').recupererCompteUtilisateur(testIdGenerator.getId())

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
        expect(response.data).toBeDefined()
        const message: string = response.data as string

        expect(message).toEqual("L'utilisateur n'existe pas")
      })
    )
  })

  describe("#creerCompteUtilisateur", () => {
    it(
      "doit créer le compte utilisateur",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const uuid = testIdGenerator.getId()
        const request = await creerRequestAvecSession(container, uuid)

        // Act
        const response = await container.resolve('compteUtilisateurController').creerCompteUtilisateur(request)

        // Assert
        const compteUtilisateurResult = await container.resolve('compteUtilisateurRepository').recupererCompteUtilisateurParId(uuid)
        expect(compteUtilisateurResult).toBeDefined()
        expect(compteUtilisateurResult?.id).toEqual(uuid)

        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    )
    it(
      "Quand le compte utilisateur existe déjà, doit renvoyer l'utilisateur",
      integrationTestFunction(async ({ testIdGenerator, container }) => {
        // Arrange
        const uuid = testIdGenerator.getId()
        const request = await creerRequestAvecSession(container, uuid)
        await container.resolve('compteUtilisateurController').creerCompteUtilisateur(request)

        // Act
        const response = await container.resolve('compteUtilisateurController').creerCompteUtilisateur(request)

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    )
  })
})
