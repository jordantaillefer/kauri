import { describe, expect } from "vitest"
import type { MockProxy } from "vitest-mock-extended";
import { mock } from "vitest-mock-extended"

import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import type { AuthentificationService } from "../../domain/ports/AuthentificationService"
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
    authentificatorService.seConnecter.mockResolvedValue(CompteUtilisateur.creerCompteUtilisateur({ id: "id" }))
    const request = mock<Request>()
    // Act
    const profil = await seConnecterUseCase.execute(request)
    // Assert
    expect(authentificatorService.seConnecter).toHaveBeenNthCalledWith(1, request)
    expect(profil.id).toEqual("id")
  })
})