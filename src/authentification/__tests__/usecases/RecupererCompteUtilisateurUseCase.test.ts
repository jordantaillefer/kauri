import { describe, expect } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"
import { RecupererCompteUtilisateurUseCase } from "../../usecases/RecupererCompteUtilisateurUseCase"

describe("RecupererCompteUtilisateurUseCase", () => {
  let compteUtilisateurRepository: MockProxy<CompteUtilisateurRepository>
  let recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase

  beforeEach(() => {
    compteUtilisateurRepository = mock<CompteUtilisateurRepository>()
    recupererCompteUtilisateurUseCase = new RecupererCompteUtilisateurUseCase({ compteUtilisateurRepository })
  })
  it("doit récupérer le compte utilisateur associé à l'id", async () => {
    // Arrange
    const userId = "userId"
    compteUtilisateurRepository.recupererCompteUtilisateurParId.mockResolvedValue(CompteUtilisateur.creerCompteUtilisateur(userId))
    // Act
    const user = await recupererCompteUtilisateurUseCase.execute(userId)
    // Assert
    expect(compteUtilisateurRepository.recupererCompteUtilisateurParId).toHaveBeenNthCalledWith(1, userId)
    expect(user.id).toEqual("userId")
  })
})