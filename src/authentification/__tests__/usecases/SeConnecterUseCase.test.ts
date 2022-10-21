import { describe, expect } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { AuthentificationService } from "../../domains/ports/AuthentificationService"
import { SeConnecterUseCase } from "../../usecases/SeConnecterUseCase"

describe("SeConnecterUseCase", () => {
  let seConnecterUseCase: SeConnecterUseCase
  let authentificatorService: MockProxy<AuthentificationService>

  beforeEach(() => {
    authentificatorService = mock<AuthentificationService>()
    seConnecterUseCase = new SeConnecterUseCase({ authentificationService: authentificatorService })
  })

  it("doit connecter l'utilisateur", async () => {
    // Arrange
    authentificatorService.seConnecter.mockResolvedValue(CompteUtilisateur.creerCompteUtilisateur("id"))
    const request = mock<Request>()
    // Act
    const profile = await seConnecterUseCase.execute(request)
    // Assert
    expect(authentificatorService.seConnecter).toHaveBeenNthCalledWith(1, request)
    expect(profile.getId()).toEqual("id")
  })
})