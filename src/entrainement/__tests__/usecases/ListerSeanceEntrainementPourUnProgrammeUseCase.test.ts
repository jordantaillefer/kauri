import { describe, expect, it } from "vitest"
import { mock } from "vitest-mock-extended"

import { SeanceEntrainement } from "../../domain/SeanceEntrainement"
import { SeanceEntrainementRepository } from "../../domain/ports/SeanceEntrainementRepository"
import {
  ListerSeanceEntrainementPourUnProgrammeUseCase
} from "../../usecases/ListerSeanceEntrainementPourUnProgrammeUseCase"

describe("ListerSeanceEntrainementPourUnProgrammeUseCase", () => {
  it("doit lister les seances d'entrainement pour un programme", async () => {
    // Arrange
    const idProgramme = "528cfcd6-8eb5-4ac0-8c17-1ec53cec2e0b"
    const seanceEntrainementRepository = mock<SeanceEntrainementRepository>()
    seanceEntrainementRepository.recupererToutParIdProgramme.mockResolvedValue([
      SeanceEntrainement.creerSeanceEntrainement({
        id: "2695a597-6fd2-4edc-ac9c-f1af5d8c6cc8"
      }),
      SeanceEntrainement.creerSeanceEntrainement({
        id: "7107d04d-9647-4ce2-b791-05544c7d79bc"
      })
    ])
    
    const listerSeanceEntrainementPourUnProgrammeUseCase = new ListerSeanceEntrainementPourUnProgrammeUseCase({
      seanceEntrainementRepository
    })

    // Act
    const listeSeanceEntrainement = await listerSeanceEntrainementPourUnProgrammeUseCase.execute(idProgramme)
    // Assert
    expect(seanceEntrainementRepository.recupererToutParIdProgramme).toHaveBeenNthCalledWith(1, idProgramme)
    expect(listeSeanceEntrainement).toHaveLength(2)
    expect(listeSeanceEntrainement.at(0)?.id).toEqual("2695a597-6fd2-4edc-ac9c-f1af5d8c6cc8")
    expect(listeSeanceEntrainement.at(1)?.id).toEqual("7107d04d-9647-4ce2-b791-05544c7d79bc")
  })
})
