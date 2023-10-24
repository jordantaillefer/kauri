import { describe, expect, it } from "vitest"
import type { CaptorMatcher, MockProxy } from "vitest-mock-extended";
import { captor, mock } from "vitest-mock-extended"

import type { Seance } from "../../domain/Seance"
import type { InitialiserSeanceRepository} from "../../usecases/InitialiserSeanceUseCase";
import { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"

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