import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { Seance } from "../../domain/Seance"
import { InitialiserSeanceRepository, InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"

describe("InitialiserSeanceUseCase", () => {
  let initialiserSeanceRepository: MockProxy<InitialiserSeanceRepository>
  let initialiserSeanceUseCase: InitialiserSeanceUseCase

  beforeEach(() => {
    initialiserSeanceRepository = mock<InitialiserSeanceRepository>()
    initialiserSeanceUseCase = new InitialiserSeanceUseCase({ initialiserSeanceRepository })
  })
  it("doit créer la séance", async () => {
    // Arrange
    const creerSeanceCaptor: CaptorMatcher<Seance> = captor()
    // Act
    await initialiserSeanceUseCase.execute("idUtilisateur")
    // Assert
    expect(initialiserSeanceRepository.creerSeance).toHaveBeenNthCalledWith(1, creerSeanceCaptor)
    expect(creerSeanceCaptor.value.id).toBeDefined()
    expect(creerSeanceCaptor.value.nomSeance).toEqual("Nouvelle séance")
    expect(creerSeanceCaptor.value.idUtilisateur).toEqual("idUtilisateur")
  })
})