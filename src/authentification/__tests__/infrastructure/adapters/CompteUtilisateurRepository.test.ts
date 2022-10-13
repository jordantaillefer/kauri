import { describe, expect } from "vitest"
import {
  PrismaCompteUtilisateurRepository
} from "../../../infrastructure/adapters/compte_utilisateur_repository/PrismaCompteUtilisateurRepository"

describe("CreerCompteUtilisateur", () => {
  let prismaCompteUtilisateurRepository: PrismaCompteUtilisateurRepository
  beforeEach(() => {
    prismaCompteUtilisateurRepository = new PrismaCompteUtilisateurRepository()
  })

  it("Doit créer un compte utilisateur", async () => {
    // Arrange
    const compteUtilisateurId = "compteUtilisateurId"
    // Act
    const compteUtilisateur = await prismaCompteUtilisateurRepository.creerCompteUtilisateur(compteUtilisateurId)
    // Assert
    expect(compteUtilisateur.id).toEqual(compteUtilisateurId)
  })
})