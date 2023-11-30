import { afterEach, describe, expect, test } from "vitest"
import type { MockProxy } from "vitest-mock-extended";
import { mock } from "vitest-mock-extended"

import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import type { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"
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
    const idUtilisateur = "idUtilisateur"
    const nom = "nom"
    const prenom = "prenom"
    const compteUtilisateur = CompteUtilisateur.creerCompteUtilisateur({ id: idUtilisateur, prenom, nom })
    compteUtilisateurRepository.creerCompteUtilisateur.mockResolvedValue(compteUtilisateur)
    // Act
    const user = await creerCompteUtilisateurUseCase.execute({ idUtilisateur, nom, prenom })
    // Assert
    expect(compteUtilisateurRepository.creerCompteUtilisateur).toHaveBeenNthCalledWith(1, compteUtilisateur)
    expect(user.id).toEqual("idUtilisateur")
    expect(user.nom).toEqual("nom")
    expect(user.prenom).toEqual("prenom")
  })
})
