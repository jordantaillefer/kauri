import { ReasonPhrases } from "http-status-codes"
import { beforeAll, describe, expect } from "vitest"

import { CompteUtilisateurBuilder } from "../../../../testUtils/builders/CompteUtilisateurBuilder"
import { CompteUtilisateur } from "../../../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../../../domain/ports/CompteUtilisateurRepository"
import { CompteUtilisateurController } from "../../../infrastructure/controllers/CompteUtilisateurController"
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
      const response = await compteUtilisateurController.recupererCompteUtilisateur("id")
      // Assert
      expect(response.reasonPhrase).toEqual(ReasonPhrases.OK)
      expect(response.data).toBeDefined()
      const compteUtilisateurResult: CompteUtilisateur = response.data as CompteUtilisateur

      expect(compteUtilisateurResult.getId()).toEqual("id")
    })
    it("S'il n'existe pas, doit retourner une erreur", async () => {
      // Act
      const response = await compteUtilisateurController.recupererCompteUtilisateur("id")
      // Assert
      expect(response.reasonPhrase).toEqual(ReasonPhrases.NOT_FOUND)
      expect(response.data).toBeDefined()
      const message: string = response.data as string

      expect(message).toEqual("L'utilisateur n'existe pas")
    })
  })

  describe("#creerCompteUtilisateur", () => {
    it("doit créer le compte utilisateur", async () => {
      // Act
      const response = await compteUtilisateurController.creerCompteUtilisateur({ payload : { id: "id" }})
      // Assert
      const compteUtilisateurResult = await compteUtilisateurRepository.recupererCompteUtilisateurParId("id")
      expect(compteUtilisateurResult).toBeDefined()
      expect(compteUtilisateurResult?.getId()).toEqual("id")

      expect(response.reasonPhrase).toEqual(ReasonPhrases.CREATED)
    })
    it("Quand le compte utilisateur existe déjà, doit renvoyer une Bad Request", async () => {
      // Act
      await compteUtilisateurController.creerCompteUtilisateur({ payload : { id: "id" }})
      const response = await compteUtilisateurController.creerCompteUtilisateur({ payload : { id: "id" }})
      // Assert
      const compteUtilisateurResult = await compteUtilisateurRepository.recupererCompteUtilisateurParId("id")
      expect(compteUtilisateurResult).toBeDefined()
      expect(compteUtilisateurResult?.getId()).toEqual("id")

      expect(response.reasonPhrase).toEqual(ReasonPhrases.BAD_REQUEST)
    })
  })

  describe("#authenticate", () => {

  })
})