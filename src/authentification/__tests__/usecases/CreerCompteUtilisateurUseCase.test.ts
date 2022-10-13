import { afterEach, describe, expect, test } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"

describe("CreerCompteUtilisateurUseCase", () => {
  let compteUtilisateurRepository: MockProxy<CompteUtilisateurRepository>
  let creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase

  beforeEach(() => {
    compteUtilisateurRepository = mock<CompteUtilisateurRepository>()
    creerCompteUtilisateurUseCase = new CreerCompteUtilisateurUseCase({ compteUtilisateurRepository })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  test("doit créer le compte utilisateur", async () => {
    // Arrange
    const userId = "userId"
    const compteUtilisateur = CompteUtilisateur.creerCompteUtilisateur(userId)
    compteUtilisateurRepository.creerCompteUtilisateur.mockResolvedValue(compteUtilisateur)
    // Act
    const user = await creerCompteUtilisateurUseCase.execute(userId)
    // Assert
    expect(compteUtilisateurRepository.creerCompteUtilisateur).toHaveBeenNthCalledWith(1, compteUtilisateur)
    expect(user.id).toEqual("userId")
  })
})