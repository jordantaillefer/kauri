import { describe, expect } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"
import {
  CompteUtilisateurRepository
} from "../../infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { RecupererCompteUtilisateurUseCase } from "../../usecases/RecupererCompteUtilisateurUseCase"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"

describe("RecupererCompteUtilisateurUseCase", () => {
  let compteUtilisateurRepository: MockProxy<CompteUtilisateurRepository>
  let recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase

  beforeEach(() => {
    compteUtilisateurRepository = mock<CompteUtilisateurRepository>()
    recupererCompteUtilisateurUseCase = new RecupererCompteUtilisateurUseCase(compteUtilisateurRepository)
  })
  it("doit récupérer le compte utilisateur associé à l'id", async () => {
    // Arrange
    const userId = "userId"
    compteUtilisateurRepository.recupererCompteUtilisateur.mockResolvedValue(CompteUtilisateur.creerCompteUtilisateur(userId))
    // Act
    const user = await recupererCompteUtilisateurUseCase.execute(userId)
    // Assert
    expect(compteUtilisateurRepository.recupererCompteUtilisateur).toHaveBeenNthCalledWith(1, userId)
    expect(user.id).toEqual("userId")
  })
})