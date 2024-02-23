import { ReasonPhrases } from "http-status-codes"
import { beforeAll, describe, expect } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import type { CompteUtilisateur } from "../../../domain/CompteUtilisateur"
import type { CompteUtilisateurRepository } from "../../../domain/ports/CompteUtilisateurRepository"
import type { CompteUtilisateurController } from "../../../infrastructure/controllers/CompteUtilisateurController"
import { container } from "@/api/index.server"
import { creerRequestAvecSession } from "~/.server/testUtils/RequestUtils"
import { CompteUtilisateurBuilder } from "~/.server/testUtils/builders/CompteUtilisateurBuilder"

describe("CompteUtilisateurController", () => {
  let compteUtilisateurRepository: CompteUtilisateurRepository
  let compteUtilisateurController: CompteUtilisateurController

  beforeAll(() => {
    compteUtilisateurRepository = container.resolve("compteUtilisateurRepository")
    compteUtilisateurController = container.resolve("compteUtilisateurController")
  })

  describe("#recupererCompteUtilisateur", () => {
    it(
      "S'il existe, doit récupérer le compte utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidUtilisateur = testIdGenerator.getId()
        const compteUtilisateur = new CompteUtilisateurBuilder().withId(uuidUtilisateur).build()
        await compteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateur)
        // Act
        const response = await compteUtilisateurController.recupererCompteUtilisateur(compteUtilisateur.id)
        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
        expect(response.data).toBeDefined()
        const compteUtilisateurResult: CompteUtilisateur = response.data as CompteUtilisateur

        expect(compteUtilisateurResult.id).toEqual(uuidUtilisateur)
      })
    )
    it(
      "S'il n'existe pas, doit retourner une erreur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Act
        const response = await compteUtilisateurController.recupererCompteUtilisateur(testIdGenerator.getId())
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
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuid = testIdGenerator.getId()
        const request = await creerRequestAvecSession(uuid)
        // Act
        const response = await compteUtilisateurController.creerCompteUtilisateur(request)
        // Assert
        const compteUtilisateurResult = await compteUtilisateurRepository.recupererCompteUtilisateurParId(uuid)
        expect(compteUtilisateurResult).toBeDefined()
        expect(compteUtilisateurResult?.id).toEqual(uuid)

        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    )
    it(
      "Quand le compte utilisateur existe déjà, doit renvoyer l'utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuid = testIdGenerator.getId()
        const request = await creerRequestAvecSession(uuid)
        await compteUtilisateurController.creerCompteUtilisateur(request)
        // Act
        const response = await compteUtilisateurController.creerCompteUtilisateur(request)

        // Assert
        expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
      })
    )
  })
})
