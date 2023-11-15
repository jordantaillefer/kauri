import { ReasonPhrases } from "http-status-codes"
import { describe, expect } from "vitest"

import { integrationTestFunction } from "../../../../../../test/setup-test-env"
import { CompteUtilisateur } from "../../../domain/CompteUtilisateur"
import { LUtilisateurNExistePasError } from "../../../domain/errors/LUtilisateurNExistePasError"
import { PrismaCompteUtilisateurRepository } from "../../../infrastructure/adapters/PrismaCompteUtilisateurRepository"
import { TestFailedError } from "~/server/testUtils/errors/TestFailedError"

describe("PrismaCompteUtilisateurRepository", () => {
  let prismaCompteUtilisateurRepository: PrismaCompteUtilisateurRepository
  beforeEach(() => {
    prismaCompteUtilisateurRepository = new PrismaCompteUtilisateurRepository()
  })

  describe("CreerCompteUtilisateur", () => {
    it(
      "Doit créer un compte utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidUtilisateur = testIdGenerator.getId()
        const compteUtilisateur = CompteUtilisateur.creerCompteUtilisateur({ id: uuidUtilisateur })
        // Act
        const compteUtilisateurResult =
          await prismaCompteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateur)
        // Assert
        expect(compteUtilisateurResult.id).toEqual(uuidUtilisateur)
      })
    )
  })

  describe("recupererCompteUtilisateur", () => {
    it(
      "Quand l'utilisateur existe, doit récupérer un compte utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        // Arrange
        const uuidUtilisateur = testIdGenerator.getId()
        const compteUtilisateur = CompteUtilisateur.creerCompteUtilisateur({ id: uuidUtilisateur })
        await prismaCompteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateur)
        // Act
        const compteUtilisateurResult =
          await prismaCompteUtilisateurRepository.recupererCompteUtilisateurParId(uuidUtilisateur)
        // Assert
        expect(compteUtilisateurResult.id).toEqual(uuidUtilisateur)
      })
    )
    it(
      "Quand l'utilisateur n'existe pas, doit récupérer un compte utilisateur",
      integrationTestFunction(async ({ testIdGenerator }) => {
        try {
          // Act
          const uuidUtilisateur = testIdGenerator.getId()
          await prismaCompteUtilisateurRepository.recupererCompteUtilisateurParId(uuidUtilisateur)
          throw new TestFailedError()
        } catch (error: unknown) {
          // Assert
          expect(error).toBeInstanceOf(LUtilisateurNExistePasError)
          expect((error as LUtilisateurNExistePasError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
        }
      })
    )
  })
})
