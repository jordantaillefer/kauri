import { beforeAll, describe, expect } from "vitest"

import { CompteUtilisateurBuilder } from "../../../testUtils/builders/CompteUtilisateurBuilder"
import { CompteUtilisateurController } from "../controllers/CompteUtilisateurController"
import { CompteUtilisateurRepository } from "../adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { container } from "api"

describe("CompteUtilisateurController", () => {
  let compteUtilisateurRepository: CompteUtilisateurRepository
  let compteUtilisateurController: CompteUtilisateurController
  beforeAll(() => {
    compteUtilisateurRepository = container.resolve("compteUtilisateurRepository")
    compteUtilisateurController = container.resolve("compteUtilisateurController")
  })

  describe("#recupererCompteUtilisateur", () => {
    it("S'il existe, doit récupérer le compte utilisateur", async () => {
      // Arrange
      const compteUtilisateur = new CompteUtilisateurBuilder().withId("id").build()
      await compteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateur)
      // Act
      const compteUtilisateurResult = await compteUtilisateurController.recupererCompteUtilisateur("id")
      // Assert
      expect(compteUtilisateurResult).toBeDefined()
      expect(compteUtilisateurResult?.id).toEqual("id")
    })
  })

  describe("#creerCompteUtilisateur", () => {
    it("doit créer le compte utilisateur", async () => {
      // Act
      await compteUtilisateurController.creerCompteUtilisateur("id")
      // Assert
      const compteUtilisateurResult = await compteUtilisateurController.recupererCompteUtilisateur("id")
      expect(compteUtilisateurResult).toBeDefined()
      expect(compteUtilisateurResult?.id).toEqual("id")
    })
  })
})