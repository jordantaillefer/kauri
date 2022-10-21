import { ReasonPhrases } from "http-status-codes"
import { describe, expect } from "vitest"

import { TestFailedError } from "../../../../testUtils/errors/TestFailedError"
import { CompteUtilisateur } from "../../../domain/CompteUtilisateur"
import { LUtilisateurNExistePasError } from "../../../domain/errors/LUtilisateurNExistePasError"
import { PrismaCompteUtilisateurRepository } from "../../../infrastructure/adapters/PrismaCompteUtilisateurRepository"

describe("PrismaCompteUtilisateurRepository", () => {
  let prismaCompteUtilisateurRepository: PrismaCompteUtilisateurRepository
  beforeEach(() => {
    prismaCompteUtilisateurRepository = new PrismaCompteUtilisateurRepository()
  })

  describe("CreerCompteUtilisateur", () => {
    it("Doit créer un compte utilisateur", async () => {
      // Arrange
      const compteUtilisateur = CompteUtilisateur.creerCompteUtilisateur("compteUtilisateurId")
      // Act
      const compteUtilisateurResult = await prismaCompteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateur)
      // Assert
      expect(compteUtilisateurResult.id).toEqual("compteUtilisateurId")
    })
  })

  describe("recupererCompteUtilisateur", () => {
    it("Quand l'utilisateur existe, doit récupérer un compte utilisateur", async () => {
      // Arrange
      const compteUtilisateur = CompteUtilisateur.creerCompteUtilisateur("compteUtilisateurId")
      await prismaCompteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateur)
      // Act
      const compteUtilisateurResult = await prismaCompteUtilisateurRepository.recupererCompteUtilisateurParId("compteUtilisateurId")
      // Assert
      expect(compteUtilisateurResult.id).toEqual("compteUtilisateurId")
    })
    it("Quand l'utilisateur n'existe pas, doit récupérer un compte utilisateur", async () => {
      try {
        // Act
        await prismaCompteUtilisateurRepository.recupererCompteUtilisateurParId("compteUtilisateurId")
        throw new TestFailedError()
      } catch (error: unknown) {
        // Assert
        expect(error).toBeInstanceOf(LUtilisateurNExistePasError)
        expect((error as LUtilisateurNExistePasError).reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      }
    })
  })
})