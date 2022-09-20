import { afterEach, describe, expect, test } from "vitest"
import {
  CompteUtilisateurRepository
} from "../../infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"
import { mock, MockProxy } from "vitest-mock-extended"
import { CompteUtilisateur } from "../../infrastructure/domain/CompteUtilisateur"

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
    compteUtilisateurRepository.creerCompteUtilisateur.mockResolvedValue(CompteUtilisateur.creerCompteUtilisateur(userId))
    // Act
    const user = await creerCompteUtilisateurUseCase.execute(userId)
    // Assert
    expect(compteUtilisateurRepository.creerCompteUtilisateur).toHaveBeenNthCalledWith(1, userId)
    expect(user.id).toEqual("userId")
  })
})