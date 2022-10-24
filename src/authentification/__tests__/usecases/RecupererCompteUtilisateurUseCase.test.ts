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
    const idUtilisateur = "idUtilisateur"
    compteUtilisateurRepository.recupererCompteUtilisateurParId.mockResolvedValue(CompteUtilisateur.creerCompteUtilisateur({ id: idUtilisateur }))
    // Act
    const user = await recupererCompteUtilisateurUseCase.execute(idUtilisateur)
    // Assert
    expect(compteUtilisateurRepository.recupererCompteUtilisateurParId).toHaveBeenNthCalledWith(1, idUtilisateur)
    expect(user.id).toEqual("idUtilisateur")
  })
})