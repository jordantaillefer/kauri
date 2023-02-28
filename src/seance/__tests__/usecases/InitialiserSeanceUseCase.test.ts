import { describe, expect, it } from "vitest"
import { captor, CaptorMatcher, mock, MockProxy } from "vitest-mock-extended"

import { Seance } from "../../domain/Seance"
import { InitialiserSeanceRepository, InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"

describe("InitialiserSeanceUseCase", () => {
  let seanceRepository: MockProxy<InitialiserSeanceRepository>
  let initialiserSeanceUseCase: InitialiserSeanceUseCase

  beforeEach(() => {
    seanceRepository = mock<InitialiserSeanceRepository>()
    initialiserSeanceUseCase = new InitialiserSeanceUseCase({ seanceRepository })
  })
  it("doit créer la séance", async () => {
    // Arrange
    const initialiserSeanceCaptor: CaptorMatcher<Seance> = captor()
    // Act
    const nouvelleSeance = await initialiserSeanceUseCase.execute("idUtilisateur")
    // Assert
    expect(seanceRepository.creerSeance).toHaveBeenNthCalledWith(1, initialiserSeanceCaptor)
    expect(initialiserSeanceCaptor.value.id).toBeDefined()
    expect(initialiserSeanceCaptor.value.nomSeance).toEqual("Nouvelle séance")
    expect(initialiserSeanceCaptor.value.idUtilisateur).toEqual("idUtilisateur")
    expect(nouvelleSeance.id).toBeDefined()
    expect(nouvelleSeance.nomSeance).toEqual("Nouvelle séance")
    expect(nouvelleSeance.idUtilisateur).toEqual("idUtilisateur")
  })
})