import { afterEach, describe, expect, test } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import {
  CompteUtilisateurRepository
} from "../../infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { CompteUtilisateur } from "../../infrastructure/domain/CompteUtilisateur"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"

describe("CreerCompteUtilisateurUseCase", () => {
  let compteUtilisateurRepository: MockProxy<CompteUtilisateurRepository>
  let creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase

  beforeEach(() => {
    compteUtilisateurRepository = mock<CompteUtilisateurRepository>()
    creerCompteUtilisateurUseCase = new CreerCompteUtilisateurUseCase(compteUtilisateurRepository)
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