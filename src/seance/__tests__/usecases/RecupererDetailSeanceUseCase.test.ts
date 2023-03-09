import { describe, expect, it } from "vitest"
import { RecupererDetailSeanceUseCase } from "../../usecases/RecupererDetailSeanceUseCase"

describe("RecupererDetailSeanceUseCase", () => {
  beforeEach(() => {
    recupererDetailSeanceUseCase = new RecupererDetailSeanceUseCase()
  })

  it("doit récuperer le détail d'une séance pour un utilisateur", () => {
    // Arrange

    // Act
    const detailSeance = await recupererDetailSeanceUseCase({
      idUtilisateur,
      idSeance
    })
    // Assert
    expect(detailSeance.nomSeance)
  })
})