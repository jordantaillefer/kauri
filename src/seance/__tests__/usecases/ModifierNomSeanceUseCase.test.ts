import { mock } from "vitest-mock-extended";

import { SeanceRepository } from "../../domain/ports/SeanceRepository";
import { ModifierNomSeanceUseCase } from "../../usecases/ModifierNomSeanceUseCase";

describe("ModifierNomSeanceUseCase", () => {
  let modifierNomSeanceUseCase: ModifierNomSeanceUseCase
  let seanceRepository: SeanceRepository

  beforeEach(() => {
    seanceRepository = mock<SeanceRepository>()
    modifierNomSeanceUseCase = new ModifierNomSeanceUseCase({ seanceRepository })
  })

  it("doit modifier le nom de la séance", async () => {
    // Arrange
    const idSeance = "idSeance"
    const nouveauNomSeance = "Nouveau nom séance"
    // Act
    await modifierNomSeanceUseCase.execute({ idSeance, nouveauNomSeance })
    // Assert
    expect(seanceRepository.modifierNomSeance).toHaveBeenNthCalledWith(1, "idSeance", "Nouveau nom séance")
  })
})
