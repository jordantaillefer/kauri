import { randomUUID } from "crypto"
import { expect } from "vitest"
import type { CaptorMatcher, MockProxy } from "vitest-mock-extended";
import { anyString, captor, mock } from "vitest-mock-extended"

import type { SportifEvenement } from "~/.server/sportif/domain/SportifEvenement"
import type { SportifRepository } from "~/.server/sportif/domain/ports/SportifRepository"
import { AjouterEvenementUseCase } from "~/.server/sportif/usecases/AjouterEvenementUseCase"

describe("AjouterEvenementUseCase", () => {
  let sportifRepository: MockProxy<SportifRepository>
  let ajouterEvenementUseCase: AjouterEvenementUseCase

  beforeEach(() => {
    sportifRepository = mock<SportifRepository>()
    ajouterEvenementUseCase = new AjouterEvenementUseCase({ sportifRepository })
  })

  it("doit sauvegarder l'événement", async () => {
    // Arrange
    const idSeance = randomUUID()
    const idUtilisateur = randomUUID()
    const tempsEvenement = "05:45"
    const ajouterEvenementCaptor: CaptorMatcher<SportifEvenement> = captor()
    // Act
    await ajouterEvenementUseCase.execute({
      idSeance,
      idUtilisateur,
      tempsEvenement
    })
    // Assert
    expect(sportifRepository.ajouterEvenement).toHaveBeenNthCalledWith(1, ajouterEvenementCaptor)
    const sportifEvenement = ajouterEvenementCaptor.value

    expect(sportifEvenement.id).toEqual(anyString())
    expect(sportifEvenement.idUtilisateur).toBe(idUtilisateur)
    expect(sportifEvenement.idSeance).toBe(idSeance)
    expect(sportifEvenement.tempsEvenement).toBe(tempsEvenement)
  })
})
