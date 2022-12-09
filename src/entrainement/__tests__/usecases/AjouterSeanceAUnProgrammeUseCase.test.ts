import { describe, it } from "vitest"
import { captor, CaptorMatcher, mock } from "vitest-mock-extended"

import { SeanceEntrainement } from "../../domain/SeanceEntrainement"
import { ProgrammeRepository } from "../../domain/ports/ProgrammeRepository"
import { SeanceEntrainementRepository } from "../../domain/ports/SeanceEntrainementRepository"
import {
  AjouterSeanceAUnProgrammeUseCase
} from "../../usecases/AjouterSeanceAUnProgrammeUseCase"

describe("AjouterSeanceAUnProgrammeUseCase", () => {
  describe("Cas OK", () => {
    it("doit ajouter une nouvelle seance d'entrainement au programme", async () => {
      // Arrange
      const seanceEntrainementCaptor: CaptorMatcher<SeanceEntrainement> = captor()
      const seanceEntrainementRepository = mock<SeanceEntrainementRepository>()
      const programmeRepository = mock<ProgrammeRepository>()
      const ajouterSeanceAUnProgrammeUseCase = new AjouterSeanceAUnProgrammeUseCase({
        programmeRepository,
        seanceEntrainementRepository
      })
      const idUtilisateur = "idUtilisateur"
      const idProgramme = "idProgramme"

      // Act
      await ajouterSeanceAUnProgrammeUseCase.execute(
        idUtilisateur,
        idProgramme
      )
      // Assert
      expect(programmeRepository.recupererParIdPourLUtilisateur)
      expect(seanceEntrainementRepository.creerSeanceEntrainement).toHaveBeenNthCalledWith(1, idProgramme, seanceEntrainementCaptor)
      expect(seanceEntrainementCaptor.value.id).toBeDefined()
      expect(seanceEntrainementCaptor.value.dateSeance).toBeDefined()
    })
  })
})