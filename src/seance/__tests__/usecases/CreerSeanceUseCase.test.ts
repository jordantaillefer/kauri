import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { Seance } from "../../domain/Seance"
import { CreerSeanceRepository, CreerSeanceUseCase } from "../../usecases/CreerSeanceUseCase"

describe("CreerSeanceUseCase", () => {
  let creerSeanceRepository: MockProxy<CreerSeanceRepository>
  let creerSeanceUseCase: CreerSeanceUseCase

  beforeEach(() => {
    creerSeanceRepository = mock<CreerSeanceRepository>()
    creerSeanceUseCase = new CreerSeanceUseCase({ creerSeanceRepository })
  })
  it("doit créer le creerSeance pour un utilisateur", async () => {
    // Arrange
    const creerSeanceCaptor: CaptorMatcher<Seance> = captor()
    // Act
    await creerSeanceUseCase.execute("idUtilisateur", "nomSeance")
    // Assert
    expect(creerSeanceRepository.creerSeance).toHaveBeenNthCalledWith(1, creerSeanceCaptor)
    expect(creerSeanceCaptor.value.id).toBeDefined()
    expect(creerSeanceCaptor.value.nomSeance).toEqual("nomSeance")
    expect(creerSeanceCaptor.value.idUtilisateur).toEqual("idUtilisateur")
  })
})